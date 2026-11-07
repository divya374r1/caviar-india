from django.contrib import admin
from .models import ContactEnquiry


@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "phone",
        "subject",
        "email_sent",
        "created_at",
    )

    list_filter = ("email_sent", "created_at")

    search_fields = (
        "name",
        "email",
        "phone",
        "subject",
        "message",
    )

    readonly_fields = ("created_at", "email_sent")

    ordering = ("-created_at",)