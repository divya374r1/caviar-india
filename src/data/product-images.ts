
const productImages: Record<string, string> = {
  "ars-italica-oscietra-royal": "/images/products/ars-italica-oscietra.png",

  "calvisius-beluga-caviar": "/images/products/calvisius-beluga.png",

  "calvisius-tradition-royal": "/images/products/calvisius-tradition.png",

  "caviar-malossol": "/images/products/caviar-malossol.png",

  "golden-almas-caviar": "/images/products/golden-almas.png",

  "imperial-caviar": "/images/products/imperial-caviar.png",

  "imperial-gold-caviar": "/images/products/imperial-gold.png",

  "imperial-oscietra-caviar": "/images/products/imperial-oscietra.png",

  "kaluga-caviar": "/images/products/kaluga-caviar.png",

  "mother-of-pearl-caviar-plate": "/images/products/mother-of-pearl-plate.png",

  "mother-of-pearl-spoon": "/images/products/mother-of-pearl-spoon.png",

  "organic-caviar-60g": "/images/products/organic-caviar.png",

  "ossetra-prestige-caviar": "/images/products/ossetra-prestige.png",

  "prunier-caviar": "/images/products/prunier-caviar.png",

  "royal-beluga-caviar": "/images/products/royal-beluga.png",

  "royal-sevruga-caviar": "/images/products/royal-sevruga.png",

  "silver-plated-caviar-server": "/images/products/silver-caviar-server.png",

  "connoisseur-caviar-taster-set": "/images/products/connoisseur-taster-set.png",

  "imperial-caviar-taster-set": "/images/products/imperial-taster-set.png",

  "sensational-caviar-trio": "/images/products/sensational-trio-set.png",

  "specialist-caviar-taster-set": "/images/products/specialist-taster-set.png",
};

export function getProductImage(slug: string): string | undefined {
  return productImages[slug];
}
