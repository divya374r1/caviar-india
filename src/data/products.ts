
export type ProductCategory = "Caviar" | "Tasting Sets" | "Accessories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  description?: string;
  image?: string;
  featured?: boolean;
  priceNeedsVerification: boolean;
}

export const products: Product[] = [
  {
    id: "ars-italica-oscietra",
    slug: "ars-italica-oscietra-royal",
    name: "Ars Italica Oscietra Royal",
    price: 12500,
    category: "Caviar",
    description: "Sturgeon species: Acipenser Gueldenstaedtii. Medium-to-large eggs, as described in the official catalogue.",
    featured: true,
    priceNeedsVerification: true,
  },
  {
    id: "calvisius-beluga",
    slug: "calvisius-beluga-caviar",
    name: "Calvisius Beluga Caviar",
    price: 15500,
    category: "Caviar",
    description: "Beluga caviar extracted from the Huso Huso sturgeon.",
    featured: true,
    priceNeedsVerification: true,
  },
  {
    id: "calvisius-tradition",
    slug: "calvisius-tradition-royal",
    name: "Calvisius Tradition Royal",
    price: 10500,
    category: "Caviar",
    description: "White Sturgeon Caviar. Species: Acipenser transmontanus.",
    featured: true,
    priceNeedsVerification: true,
  },
  {
    id: "malossol",
    slug: "caviar-malossol",
    name: "Caviar Malossol",
    price: 11500,
    category: "Caviar",
    description: "Malossol refers to the method of preserving caviar with salt, not a sturgeon breed.",
    priceNeedsVerification: true,
  },
  {
    id: "golden-almas",
    slug: "golden-almas-caviar",
    name: "Golden Almas Caviar",
    price: 14080,
    category: "Caviar",
    priceNeedsVerification: true,
  },
  {
    id: "imperial",
    slug: "imperial-caviar",
    name: "Imperial Caviar",
    price: 14500,
    category: "Caviar",
    featured: true,
    priceNeedsVerification: true,
  },
  {
    id: "imperial-gold",
    slug: "imperial-gold-caviar",
    name: "Imperial Gold Caviar",
    price: 16500,
    category: "Caviar",
    priceNeedsVerification: true,
  },
  {
    id: "imperial-oscietra",
    slug: "imperial-oscietra-caviar",
    name: "Imperial Oscietra Caviar",
    price: 12500,
    category: "Caviar",
    description: "Higher-graded Oscietra caviar harvested from Siberian sturgeon.",
    priceNeedsVerification: true,
  },
  {
    id: "kaluga",
    slug: "kaluga-caviar",
    name: "Kaluga Caviar",
    price: 12500,
    category: "Caviar",
    description: "Also known as Huso Dauricus in the official product description.",
    priceNeedsVerification: true,
  },
  {
    id: "mother-of-pearl-plate",
    slug: "mother-of-pearl-caviar-plate",
    name: "Mother of Pearl Caviar Plate, 5.5 inch",
    price: 3256,
    category: "Accessories",
    priceNeedsVerification: true,
  },
  {
    id: "mother-of-pearl-spoon",
    slug: "mother-of-pearl-spoon",
    name: "One Mother of Pearl Spoon, 4 Inch",
    price: 1056,
    category: "Accessories",
    priceNeedsVerification: true,
  },
  {
    id: "organic-caviar",
    slug: "organic-caviar-60g",
    name: "Organic Caviar, 60g",
    price: 9592,
    category: "Caviar",
    description: "The catalogue displays this listing with a 30% discount. The current offer needs confirmation.",
    priceNeedsVerification: true,
  },
  {
    id: "ossetra-prestige",
    slug: "ossetra-prestige-caviar",
    name: "Ossetra Prestige Caviar (30gms)",
    price: 8500,
    category: "Caviar",
    priceNeedsVerification: true,
  },
  {
    id: "prunier",
    slug: "prunier-caviar",
    name: "Prunier Caviar (30gms)",
    price: 9500,
    category: "Caviar",
    priceNeedsVerification: true,
  },
  {
    id: "royal-beluga",
    slug: "royal-beluga-caviar",
    name: "Royal Beluga Caviar, Huso Huso",
    price: 34000,
    category: "Caviar",
    featured: true,
    priceNeedsVerification: true,
  },
  {
    id: "royal-sevruga",
    slug: "royal-sevruga-caviar",
    name: "Royal Sevruga Caviar",
    price: 9500,
    category: "Caviar",
    description: "The official catalogue describes Sevruga as having smaller roe than other caviars.",
    priceNeedsVerification: true,
  },
  {
    id: "silver-server",
    slug: "silver-plated-caviar-server",
    name: "Silver Plated Caviar Server",
    price: 17160,
    category: "Accessories",
    priceNeedsVerification: true,
  },
  {
    id: "connoisseur-set",
    slug: "connoisseur-caviar-taster-set",
    name: "The Connoisseur Caviar Taster Set, 3 Pots",
    price: 16016,
    category: "Tasting Sets",
    priceNeedsVerification: true,
  },
  {
    id: "imperial-taster-set",
    slug: "imperial-caviar-taster-set",
    name: "The Imperial Caviar Taster Set",
    price: 11000,
    category: "Tasting Sets",
    priceNeedsVerification: true,
  },
  {
    id: "sensational-trio",
    slug: "sensational-caviar-trio",
    name: "The Sensational Caviar Trio Taster Set, 3 x 10g",
    price: 21120,
    category: "Tasting Sets",
    priceNeedsVerification: true,
  },
  {
    id: "specialist-set",
    slug: "specialist-caviar-taster-set",
    name: "The Specialist Caviar Taster Set, 3 x 10g",
    price: 9200,
    category: "Tasting Sets",
    priceNeedsVerification: true,
  },
];

// Catalogue review: Royal Sevruga appears twice on the source website.
// Confirm whether it is a separate variant before adding another product.
export const catalogueReviewNotes = [
  "The source catalogue contains 22 listings.",
  "Royal Sevruga appears twice with the same displayed name and price.",
  "This dataset contains 21 uniquely named products pending verification.",
  "All listed prices require confirmation before production launch.",
];
