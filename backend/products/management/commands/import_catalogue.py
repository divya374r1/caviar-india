from django.core.management.base import BaseCommand
from products.models import Product


PRODUCTS = [
    {
        "id": "ars-italica-oscietra",
        "slug": "ars-italica-oscietra-royal",
        "name": "Ars Italica Oscietra Royal",
        "price": "12500",
        "category": "Caviar",
        "description": "Sturgeon species: Acipenser Gueldenstaedtii. Medium-to-large eggs, as described in the official catalogue.",
        "featured": True,
    },
    {
        "id": "calvisius-beluga",
        "slug": "calvisius-beluga-caviar",
        "name": "Calvisius Beluga Caviar",
        "price": "15500",
        "category": "Caviar",
        "description": "Beluga caviar extracted from the Huso Huso sturgeon.",
        "featured": True,
    },
    {
        "id": "calvisius-tradition",
        "slug": "calvisius-tradition-royal",
        "name": "Calvisius Tradition Royal",
        "price": "10500",
        "category": "Caviar",
        "description": "White Sturgeon Caviar. Species: Acipenser transmontanus.",
        "featured": True,
    },
    {
        "id": "malossol",
        "slug": "caviar-malossol",
        "name": "Caviar Malossol",
        "price": "11500",
        "category": "Caviar",
        "description": "Malossol refers to the method of preserving caviar with salt, not a sturgeon breed.",
    },
    {
        "id": "golden-almas",
        "slug": "golden-almas-caviar",
        "name": "Golden Almas Caviar",
        "price": "14080",
        "category": "Caviar",
    },
    {
        "id": "imperial",
        "slug": "imperial-caviar",
        "name": "Imperial Caviar",
        "price": "14500",
        "category": "Caviar",
        "featured": True,
    },
    {
        "id": "imperial-gold",
        "slug": "imperial-gold-caviar",
        "name": "Imperial Gold Caviar",
        "price": "16500",
        "category": "Caviar",
    },
    {
        "id": "imperial-oscietra",
        "slug": "imperial-oscietra-caviar",
        "name": "Imperial Oscietra Caviar",
        "price": "12500",
        "category": "Caviar",
        "description": "Higher-graded Oscietra caviar harvested from Siberian sturgeon.",
    },
    {
        "id": "kaluga",
        "slug": "kaluga-caviar",
        "name": "Kaluga Caviar",
        "price": "12500",
        "category": "Caviar",
        "description": "Also known as Huso Dauricus in the official product description.",
    },
    {
        "id": "mother-of-pearl-plate",
        "slug": "mother-of-pearl-caviar-plate",
        "name": "Mother of Pearl Caviar Plate, 5.5 inch",
        "price": "3256",
        "category": "Accessories",
    },
    {
        "id": "mother-of-pearl-spoon",
        "slug": "mother-of-pearl-spoon",
        "name": "One Mother of Pearl Spoon, 4 Inch",
        "price": "1056",
        "category": "Accessories",
    },
    {
        "id": "organic-caviar",
        "slug": "organic-caviar-60g",
        "name": "Organic Caviar, 60g",
        "price": "9592",
        "category": "Caviar",
        "description": "The catalogue displays this listing with a 30% discount. The current offer needs confirmation.",
    },
    {
        "id": "ossetra-prestige",
        "slug": "ossetra-prestige-caviar",
        "name": "Ossetra Prestige Caviar (30gms)",
        "price": "8500",
        "category": "Caviar",
    },
    {
        "id": "prunier",
        "slug": "prunier-caviar",
        "name": "Prunier Caviar (30gms)",
        "price": "9500",
        "category": "Caviar",
    },
    {
        "id": "royal-beluga",
        "slug": "royal-beluga-caviar",
        "name": "Royal Beluga Caviar, Huso Huso",
        "price": "34000",
        "category": "Caviar",
        "featured": True,
    },
    {
        "id": "royal-sevruga",
        "slug": "royal-sevruga-caviar",
        "name": "Royal Sevruga Caviar",
        "price": "9500",
        "category": "Caviar",
        "description": "The official catalogue describes Sevruga as having smaller roe than other caviars.",
    },
    {
        "id": "silver-server",
        "slug": "silver-plated-caviar-server",
        "name": "Silver Plated Caviar Server",
        "price": "17160",
        "category": "Accessories",
    },
    {
        "id": "connoisseur-set",
        "slug": "connoisseur-caviar-taster-set",
        "name": "The Connoisseur Caviar Taster Set, 3 Pots",
        "price": "16016",
        "category": "Tasting Sets",
    },
    {
        "id": "imperial-taster-set",
        "slug": "imperial-caviar-taster-set",
        "name": "The Imperial Caviar Taster Set",
        "price": "11000",
        "category": "Tasting Sets",
    },
    {
        "id": "sensational-trio",
        "slug": "sensational-caviar-trio",
        "name": "The Sensational Caviar Trio Taster Set, 3 x 10g",
        "price": "21120",
        "category": "Tasting Sets",
    },
    {
        "id": "specialist-set",
        "slug": "specialist-caviar-taster-set",
        "name": "The Specialist Caviar Taster Set, 3 x 10g",
        "price": "9200",
        "category": "Tasting Sets",
    },
]


class Command(BaseCommand):
    help = "Import the Caviar India product catalogue"

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0

        for data in PRODUCTS:
            product, created = Product.objects.update_or_create(
                id=data["id"],
                defaults={
                    **data,
                    "price_needs_verification": True,
                },
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Catalogue import successful! "
                f"Created: {created_count}, "
                f"Updated: {updated_count}, "
                f"Total: {Product.objects.count()}"
            )
        )