
from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    max_num = 0

    readonly_fields = (
        "product",
        "product_name",
        "unit_price",
        "quantity",
        "line_total",
    )

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "full_name",
        "email",
        "phone",
        "total_amount",
        "status",
        "payment_status",
        "created_at",
    )

    list_filter = (
        "status",
        "payment_status",
        "created_at",
    )

    search_fields = (
        "id",
        "full_name",
        "email",
        "phone",
        "razorpay_order_id",
        "razorpay_payment_id",
    )

    readonly_fields = (
        "customer",
        "subtotal",
        "total_amount",
        "razorpay_order_id",
        "razorpay_payment_id",
        "razorpay_signature",
        "created_at",
        "updated_at",
    )

    fields = (
        "customer",
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
        "razorpay_order_id",
        "razorpay_payment_id",
        "razorpay_signature",
        "created_at",
        "updated_at",
    )

    inlines = [OrderItemInline]

    date_hierarchy = "created_at"
    list_per_page = 25
    ordering = ("-created_at",)
