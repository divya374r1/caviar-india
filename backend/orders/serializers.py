
from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "product_name",
            "unit_price",
            "quantity",
            "line_total",
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "postal_code",
            "subtotal",
            "total_amount",
            "status",
            "payment_status",
            "items",
            "created_at",
        ]
