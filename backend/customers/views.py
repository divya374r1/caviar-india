import logging

from django.conf import settings
from django.core.mail import send_mail

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .models import ContactEnquiry
from .serializers import (
    RegisterSerializer,
    ContactEnquirySerializer,
)
from .profile_serializers import CustomerProfileSerializer


logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]


class RefreshTokenView(TokenRefreshView):
    permission_classes = [AllowAny]


class CustomerProfileView(generics.RetrieveAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ContactEnquiryView(generics.CreateAPIView):
    serializer_class = ContactEnquirySerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        enquiry = serializer.save()
        email_sent = False

        recipient = getattr(
            settings,
            "CONTACT_NOTIFICATION_EMAIL",
            ""
        )

        if recipient:
            try:
                send_mail(
                    subject=f"Caviar India enquiry: {enquiry.subject}",
                    message=(
                        f"New website enquiry\n\n"
                        f"Name: {enquiry.name}\n"
                        f"Email: {enquiry.email}\n"
                        f"Phone: {enquiry.phone or 'Not provided'}\n"
                        f"Subject: {enquiry.subject}\n\n"
                        f"Message:\n{enquiry.message}"
                    ),
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[recipient],
                    fail_silently=False,
                )

                email_sent = True
                enquiry.email_sent = True
                enquiry.save(update_fields=["email_sent"])

            except Exception:
                logger.exception(
                    "Contact enquiry email delivery failed."
                )

        response_data = ContactEnquirySerializer(enquiry).data

        return Response(
            {
                "message": (
                    "Your enquiry has been received."
                    if email_sent
                    else "Your enquiry has been saved. "
                         "Email notification is not configured yet."
                ),
                "email_sent": email_sent,
                "enquiry": response_data,
            },
            status=status.HTTP_201_CREATED,
        )