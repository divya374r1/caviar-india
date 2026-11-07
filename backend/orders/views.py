
from decimal import Decimal

import razorpay

from django.conf import settings
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from products.models import Product
from .models import Order, OrderItem
from .serializers import OrderSerializer


def get_razorpay_client():
    if not settings.RAZORPAY_KEY_ID or not settings.RAZORPAY_KEY_SECRET:
        return None

    return razorpay.Client(
        auth=(
            settings.RAZORPAY_KEY_ID,
            settings.RAZORPAY_KEY_SECRET,
        )
    )


class OrderListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(customer=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        data = request.data
        items = data.get("items", [])

        if not isinstance(items, list) or not items:
            return Response(
                {"error": "Your cart is empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        required_fields = [
            "full_name", "email", "phone",
            "address", "city", "state", "postal_code",
        ]

        for field in required_fields:
            if not isinstance(data.get(field), str) or not data[field].strip():
                return Response(
                    {"error": f"{field} is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Combine duplicate product IDs before checking quantities.
        quantities = {}

        for item in items:
            if not isinstance(item, dict):
                return Response(
                    {"error": "Invalid cart item."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            product_id = item.get("product_id")
            quantity = item.get("quantity")

            if (
                not product_id
                or isinstance(quantity, bool)
                or not isinstance(quantity, int)
                or quantity <= 0
            ):
                return Response(
                    {"error": "Invalid product or quantity."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            quantities[product_id] = quantities.get(product_id, 0) + quantity

        # Lock products in a consistent order during checkout.
        products = list(
            Product.objects.select_for_update()
            .filter(id__in=quantities.keys())
            .order_by("id")
        )

        product_map = {product.id: product for product in products}

        if len(product_map) != len(quantities):
            return Response(
                {"error": "One or more products could not be found."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subtotal = Decimal("0.00")
        order_items = []

        for product_id, quantity in quantities.items():
            product = product_map[product_id]

            if not product.is_available:
                return Response(
                    {"error": f"{product.name} is unavailable."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if product.price_needs_verification:
                return Response(
                    {
                        "error": (
                            f"Price confirmation is required for "
                            f"{product.name}. Please contact the store."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if product.stock_quantity < quantity:
                return Response(
                    {
                        "error": (
                            f"Insufficient stock for {product.name}. "
                            f"Available quantity: {product.stock_quantity}."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            line_total = product.price * quantity
            subtotal += line_total

            order_items.append({
                "product": product,
                "product_name": product.name,
                "unit_price": product.price,
                "quantity": quantity,
                "line_total": line_total,
            })

        order = Order.objects.create(
            customer=request.user,
            full_name=data["full_name"].strip(),
            email=data["email"].strip(),
            phone=data["phone"].strip(),
            address=data["address"].strip(),
            city=data["city"].strip(),
            state=data["state"].strip(),
            postal_code=data["postal_code"].strip(),
            subtotal=subtotal,
            total_amount=subtotal,
        )

        OrderItem.objects.bulk_create([
            OrderItem(order=order, **item)
            for item in order_items
        ])

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED,
        )


class CreateRazorpayOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(
            Order,
            pk=order_id,
            customer=request.user,
        )

        if order.payment_status == "paid":
            return Response(
                {"error": "This order has already been paid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if order.total_amount <= 0:
            return Response(
                {"error": "Invalid order amount."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = get_razorpay_client()

        if client is None:
            return Response(
                {"error": "Razorpay credentials are not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            # Reuse an existing Razorpay order when available.
            if order.razorpay_order_id:
                return Response({
                    "key_id": settings.RAZORPAY_KEY_ID,
                    "razorpay_order_id": order.razorpay_order_id,
                    "amount": int(order.total_amount * 100),
                    "currency": "INR",
                    "order_id": order.pk,
                })

            payment_order = client.order.create({
                "amount": int(order.total_amount * 100),
                "currency": "INR",
                "receipt": f"caviar_order_{order.pk}",
            })

            order.razorpay_order_id = payment_order["id"]
            order.save(
                update_fields=["razorpay_order_id", "updated_at"]
            )

            return Response({
                "key_id": settings.RAZORPAY_KEY_ID,
                "razorpay_order_id": payment_order["id"],
                "amount": payment_order["amount"],
                "currency": payment_order["currency"],
                "order_id": order.pk,
            })

        except Exception:
            return Response(
                {"error": "Unable to create the payment order."},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class VerifyRazorpayPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        order = get_object_or_404(
            Order,
            pk=order_id,
            customer=request.user,
        )

        payment_id = request.data.get("razorpay_payment_id")
        razorpay_order_id = request.data.get("razorpay_order_id")
        signature = request.data.get("razorpay_signature")

        if not all([payment_id, razorpay_order_id, signature]):
            return Response(
                {"error": "Payment verification details are incomplete."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if razorpay_order_id != order.razorpay_order_id:
            return Response(
                {"error": "Payment order does not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = get_razorpay_client()

        if client is None:
            return Response(
                {"error": "Razorpay credentials are not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            # Verify the checkout signature.
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            })

            # Independently retrieve the payment from Razorpay.
            payment = client.payment.fetch(payment_id)

            expected_amount = int(order.total_amount * 100)

            if (
                payment.get("order_id") != order.razorpay_order_id
                or payment.get("amount") != expected_amount
                or payment.get("currency") != "INR"
            ):
                return Response(
                    {"error": "Payment details do not match this order."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if payment.get("status") != "captured":
                return Response(
                    {
                        "error": (
                            "Payment has not been captured yet. "
                            "The order remains pending."
                        )
                    },
                    status=status.HTTP_409_CONFLICT,
                )

            # Lock the order to prevent duplicate confirmation.
            with transaction.atomic():
                locked_order = Order.objects.select_for_update().get(
                    pk=order_id,
                    customer=request.user,
                )

                if locked_order.payment_status == "paid":
                    if locked_order.razorpay_payment_id == payment_id:
                        return Response({
                            "message": "Payment was already verified.",
                            "order_id": locked_order.pk,
                            "payment_status": "paid",
                        })

                    return Response(
                        {"error": "This order has already been paid."},
                        status=status.HTTP_409_CONFLICT,
                    )

                # Lock all associated products before changing stock.
                order_items = list(
                    locked_order.items.select_related("product").all()
                )

                product_ids = [
                    item.product_id for item in order_items
                ]

                locked_products = Product.objects.select_for_update().filter(
                    id__in=product_ids
                ).order_by("id")

                product_map = {
                    product.id: product
                    for product in locked_products
                }

                stock_is_sufficient = all(
                    item.product_id in product_map
                    and product_map[item.product_id].is_available
                    and product_map[item.product_id].stock_quantity >= item.quantity
                    for item in order_items
                )

                # Razorpay has confirmed capture, so record payment
                # even if stock needs manual resolution.
                locked_order.razorpay_payment_id = payment_id
                locked_order.razorpay_signature = signature
                locked_order.payment_status = "paid"

                if stock_is_sufficient:
                    for item in order_items:
                        product = product_map[item.product_id]
                        product.stock_quantity -= item.quantity
                        product.save(
                            update_fields=[
                                "stock_quantity",
                                "updated_at",
                            ]
                        )

                    locked_order.status = "confirmed"
                else:
                    # Do not oversell. Admin must resolve fulfilment
                    # or arrange a refund.
                    locked_order.status = "pending"

                locked_order.save(update_fields=[
                    "razorpay_payment_id",
                    "razorpay_signature",
                    "payment_status",
                    "status",
                    "updated_at",
                ])

            if stock_is_sufficient:
                return Response({
                    "message": "Payment verified and order confirmed.",
                    "order_id": locked_order.pk,
                    "payment_status": "paid",
                    "order_status": "confirmed",
                })

            return Response({
                "message": (
                    "Payment was captured, but inventory needs "
                    "manual resolution. Please contact the store."
                ),
                "order_id": locked_order.pk,
                "payment_status": "paid",
                "order_status": "pending",
                "manual_resolution_required": True,
            })

        except razorpay.errors.SignatureVerificationError:
            return Response(
                {"error": "Payment signature verification failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception:
            return Response(
                {"error": "Unable to verify payment. Please contact support."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
