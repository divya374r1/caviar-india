from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    RefreshTokenView,
    CustomerProfileView,
    ContactEnquiryView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("refresh/", RefreshTokenView.as_view(), name="token_refresh"),
    path("me/", CustomerProfileView.as_view(), name="customer_profile"),
    path("contact/", ContactEnquiryView.as_view(), name="contact-enquiry"),
]