/**
 * Well-known consumer brands grouped by starting letter, used purely for the
 * decorative A-Z "favorite brands" bubble animation on the Search page.
 * This is illustrative/demo content, not an endorsement or affiliation claim,
 * and is unrelated to the platform-adapter system in /adapters.
 */
export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export const BRAND_LETTERS: Record<string, string[]> = {
  A: ["Apple", "Amazon", "Adidas", "Audi"],
  B: ["BMW", "Bose", "Braun", "Burberry"],
  C: ["Chanel", "Canon", "Chevrolet", "Coca-Cola"],
  D: ["Dell", "Disney", "Dior", "Dyson"],
  E: ["eBay", "Etsy", "Epson", "Estée Lauder"],
  F: ["Ford", "Fiverr", "Fitbit", "Fendi"],
  G: ["Google", "Gucci", "GoPro", "Gap"],
  H: ["Honda", "HP", "H&M", "Hermès"],
  I: ["IKEA", "Instagram", "Intel", "iRobot"],
  J: ["Jeep", "JBL", "Jordan", "Johnson & Johnson"],
  K: ["KFC", "Kia", "Kindle", "Kenwood"],
  L: ["LinkedIn", "LG", "Lexus", "Louis Vuitton"],
  M: ["Microsoft", "Mercedes-Benz", "McDonald's", "Monster"],
  N: ["Nike", "Netflix", "Nikon", "Nissan"],
  O: ["Oracle", "Oakley", "OnePlus", "Omega"],
  P: ["PayPal", "Puma", "Prada", "Philips"],
  Q: ["Qualcomm", "QuickBooks", "Quiksilver"],
  R: ["Rolex", "Reebok", "Razer", "Ray-Ban"],
  S: ["Samsung", "Sony", "Spotify", "Subaru"],
  T: ["Tesla", "Toyota", "Target", "TikTok"],
  U: ["Uber", "Under Armour", "UPS", "Unilever"],
  V: ["Volvo", "Versace", "Visa", "Vans"],
  W: ["Walmart", "Whirlpool", "Wayfair", "Wrangler"],
  X: ["Xbox", "Xerox", "Xiaomi"],
  Y: ["Yamaha", "Yeti", "Yahoo"],
  Z: ["Zara", "Zoom", "Zillow"],
};
