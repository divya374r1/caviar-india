
from django.urls import path

from .views import (
    OrderListCreateView,
    CreateRazorpayOrderView,
    VerifyRazorpayPaymentView,
)

urlpatterns = [
    path("", OrderListCreateView.as_view(), name="orders"),

    path(
        "<int:order_id>/payment/create/",
        CreateRazorpayOrderView.as_view(),
        name="create-payment",
    ),

    path(
        "<int:order_id>/payment/verify/",
        VerifyRazorpayPaymentView.as_view(),
        name="verify-payment",
    ),
]
