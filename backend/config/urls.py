from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),

    # Product APIs
    path("api/", include("products.urls")),

    # Order APIs
    path("api/orders/", include("orders.urls")),

    # Customer authentication APIs
    path("api/auth/", include("customers.urls")),

    # Customer contact APIs
    path("api/customers/", include("customers.urls")),
]