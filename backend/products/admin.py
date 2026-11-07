
from django.contrib import admin
from .models import Product


@admin.action(description="Mark selected products as available")
def mark_available(modeladmin, request, queryset):
    queryset.update(is_available=True)


@admin.action(description="Mark selected products as unavailable")
def mark_unavailable(modeladmin, request, queryset):
    queryset.update(is_available=False)


@admin.action(description="Feature selected products")
def mark_featured(modeladmin, request, queryset):
    queryset.update(featured=True)


@admin.action(description="Remove featured status")
def remove_featured(modeladmin, request, queryset):
    queryset.update(featured=False)


@admin.action(description="Require price verification")
def require_price_verification(modeladmin, request, queryset):
    queryset.update(price_needs_verification=True)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "category",
        "price",
        "price_needs_verification",
        "stock_quantity",
        "is_available",
        "featured",
    )

    list_editable = (
        "price",
        "price_needs_verification",
        "stock_quantity",
        "is_available",
        "featured",
    )

    list_filter = (
        "category",
        "price_needs_verification",
        "is_available",
        "featured",
    )

    search_fields = (
        "name",
        "slug",
        "id",
        "description",
    )

    prepopulated_fields = {
        "slug": ("name",)
    }

    list_per_page = 25
    ordering = ("name",)

    actions = (
        mark_available,
        mark_unavailable,
        mark_featured,
        remove_featured,
        require_price_verification,
    )
