
from django.db import models


class Product(models.Model):
    CATEGORY_CHOICES = [
        ("Caviar", "Caviar"),
        ("Tasting Sets", "Tasting Sets"),
        ("Accessories", "Accessories"),
    ]

    id = models.CharField(primary_key=True, max_length=100)
    slug = models.SlugField(max_length=200, unique=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    image = models.ImageField(
        upload_to="products/",
        blank=True,
        null=True,
    )
    featured = models.BooleanField(default=False)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    price_needs_verification = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name
