/**
 * Well-known consumer brands grouped by starting letter, used purely for the
 * decorative A-Z "favorite brands" bubble animation on the Search page.
 * This is illustrative/demo content, not an endorsement or affiliation claim,
 * and is unrelated to the platform-adapter system in /adapters.
 *
 * Each brand carries a `domain` used to fetch its logo mark (see
 * components/LogoBubble.tsx) purely to visually identify the company by
 * name — if a logo fails to load, a colored initial badge is shown instead.
 */
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export interface LetterBrand {
  name: string;
  domain: string;
}

export const BRAND_LETTERS: Record<string, LetterBrand[]> = {
  A: [
    { name: "Apple", domain: "apple.com" },
    { name: "Amazon", domain: "amazon.com" },
    { name: "Adidas", domain: "adidas.com" },
    { name: "Audi", domain: "audi.com" },
    { name: "Airbnb", domain: "airbnb.com" },
  ],
  B: [
    { name: "BMW", domain: "bmw.com" },
    { name: "Bose", domain: "bose.com" },
    { name: "Braun", domain: "braun.com" },
    { name: "Burberry", domain: "burberry.com" },
    { name: "Booking.com", domain: "booking.com" },
  ],
  C: [
    { name: "Chanel", domain: "chanel.com" },
    { name: "Canon", domain: "canon.com" },
    { name: "Chevrolet", domain: "chevrolet.com" },
    { name: "Coca-Cola", domain: "coca-cola.com" },
    { name: "Costco", domain: "costco.com" },
  ],
  D: [
    { name: "Dell", domain: "dell.com" },
    { name: "Disney", domain: "disney.com" },
    { name: "Dior", domain: "dior.com" },
    { name: "Dyson", domain: "dyson.com" },
    { name: "DHL", domain: "dhl.com" },
  ],
  E: [
    { name: "eBay", domain: "ebay.com" },
    { name: "Etsy", domain: "etsy.com" },
    { name: "Epson", domain: "epson.com" },
    { name: "Estée Lauder", domain: "esteelauder.com" },
    { name: "Expedia", domain: "expedia.com" },
  ],
  F: [
    { name: "Ford", domain: "ford.com" },
    { name: "Fiverr", domain: "fiverr.com" },
    { name: "Fitbit", domain: "fitbit.com" },
    { name: "Fendi", domain: "fendi.com" },
    { name: "FedEx", domain: "fedex.com" },
  ],
  G: [
    { name: "Google", domain: "google.com" },
    { name: "Gucci", domain: "gucci.com" },
    { name: "GoPro", domain: "gopro.com" },
    { name: "Gap", domain: "gap.com" },
    { name: "GoDaddy", domain: "godaddy.com" },
  ],
  H: [
    { name: "Honda", domain: "honda.com" },
    { name: "HP", domain: "hp.com" },
    { name: "H&M", domain: "hm.com" },
    { name: "Hermès", domain: "hermes.com" },
    { name: "Hyundai", domain: "hyundai.com" },
  ],
  I: [
    { name: "IKEA", domain: "ikea.com" },
    { name: "Instagram", domain: "instagram.com" },
    { name: "Intel", domain: "intel.com" },
    { name: "iRobot", domain: "irobot.com" },
    { name: "IBM", domain: "ibm.com" },
  ],
  J: [
    { name: "Jeep", domain: "jeep.com" },
    { name: "JBL", domain: "jbl.com" },
    { name: "Jordan", domain: "nike.com" },
    { name: "Johnson & Johnson", domain: "jnj.com" },
  ],
  K: [
    { name: "KFC", domain: "kfc.com" },
    { name: "Kia", domain: "kia.com" },
    { name: "Kenwood", domain: "kenwoodworld.com" },
    { name: "KLM", domain: "klm.com" },
  ],
  L: [
    { name: "LinkedIn", domain: "linkedin.com" },
    { name: "LG", domain: "lg.com" },
    { name: "Lexus", domain: "lexus.com" },
    { name: "Louis Vuitton", domain: "louisvuitton.com" },
    { name: "Lufthansa", domain: "lufthansa.com" },
  ],
  M: [
    { name: "Microsoft", domain: "microsoft.com" },
    { name: "Mercedes-Benz", domain: "mercedes-benz.com" },
    { name: "McDonald's", domain: "mcdonalds.com" },
    { name: "Monster", domain: "monster.com" },
    { name: "Mastercard", domain: "mastercard.com" },
  ],
  N: [
    { name: "Nike", domain: "nike.com" },
    { name: "Netflix", domain: "netflix.com" },
    { name: "Nikon", domain: "nikon.com" },
    { name: "Nissan", domain: "nissan.com" },
    { name: "Nokia", domain: "nokia.com" },
  ],
  O: [
    { name: "Oracle", domain: "oracle.com" },
    { name: "Oakley", domain: "oakley.com" },
    { name: "OnePlus", domain: "oneplus.com" },
    { name: "Omega", domain: "omegawatches.com" },
    { name: "Opel", domain: "opel.com" },
  ],
  P: [
    { name: "PayPal", domain: "paypal.com" },
    { name: "Puma", domain: "puma.com" },
    { name: "Prada", domain: "prada.com" },
    { name: "Philips", domain: "philips.com" },
    { name: "Pepsi", domain: "pepsi.com" },
  ],
  Q: [
    { name: "Qualcomm", domain: "qualcomm.com" },
    { name: "QuickBooks", domain: "quickbooks.intuit.com" },
    { name: "Quiksilver", domain: "quiksilver.com" },
  ],
  R: [
    { name: "Rolex", domain: "rolex.com" },
    { name: "Reebok", domain: "reebok.com" },
    { name: "Razer", domain: "razer.com" },
    { name: "Ray-Ban", domain: "ray-ban.com" },
    { name: "Renault", domain: "renault.com" },
  ],
  S: [
    { name: "Samsung", domain: "samsung.com" },
    { name: "Sony", domain: "sony.com" },
    { name: "Spotify", domain: "spotify.com" },
    { name: "Subaru", domain: "subaru.com" },
    { name: "Starbucks", domain: "starbucks.com" },
  ],
  T: [
    { name: "Tesla", domain: "tesla.com" },
    { name: "Toyota", domain: "toyota.com" },
    { name: "Target", domain: "target.com" },
    { name: "TikTok", domain: "tiktok.com" },
    { name: "Twitter/X", domain: "x.com" },
  ],
  U: [
    { name: "Uber", domain: "uber.com" },
    { name: "Under Armour", domain: "underarmour.com" },
    { name: "UPS", domain: "ups.com" },
    { name: "Unilever", domain: "unilever.com" },
  ],
  V: [
    { name: "Volvo", domain: "volvo.com" },
    { name: "Versace", domain: "versace.com" },
    { name: "Visa", domain: "visa.com" },
    { name: "Vans", domain: "vans.com" },
    { name: "Vodafone", domain: "vodafone.com" },
  ],
  W: [
    { name: "Walmart", domain: "walmart.com" },
    { name: "Whirlpool", domain: "whirlpool.com" },
    { name: "Wayfair", domain: "wayfair.com" },
    { name: "Wrangler", domain: "wrangler.com" },
    { name: "WhatsApp", domain: "whatsapp.com" },
  ],
  X: [
    { name: "Xbox", domain: "xbox.com" },
    { name: "Xerox", domain: "xerox.com" },
    { name: "Xiaomi", domain: "mi.com" },
  ],
  Y: [
    { name: "Yamaha", domain: "yamaha.com" },
    { name: "Yeti", domain: "yeti.com" },
    { name: "Yahoo", domain: "yahoo.com" },
    { name: "YouTube", domain: "youtube.com" },
  ],
  Z: [
    { name: "Zara", domain: "zara.com" },
    { name: "Zoom", domain: "zoom.us" },
    { name: "Zillow", domain: "zillow.com" },
    { name: "Zendesk", domain: "zendesk.com" },
  ],
};
