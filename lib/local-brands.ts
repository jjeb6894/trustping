import type { CountryBrandData } from "@/types";

// Statically imported (same reasoning as lib/adapters.ts) so this works on
// the Cloudflare Workers runtime, which has no filesystem access at request
// time. Add a new country by dropping a JSON file here and registering it
// below — no other code changes required.
import mt from "@/data/local-brands/mt.json";
import nl from "@/data/local-brands/nl.json";
import de from "@/data/local-brands/de.json";
import gb from "@/data/local-brands/gb.json";
import us from "@/data/local-brands/us.json";
import fr from "@/data/local-brands/fr.json";
import es from "@/data/local-brands/es.json";
import it from "@/data/local-brands/it.json";
import ie from "@/data/local-brands/ie.json";
import be from "@/data/local-brands/be.json";
import pt from "@/data/local-brands/pt.json";
import pl from "@/data/local-brands/pl.json";
import se from "@/data/local-brands/se.json";
import no from "@/data/local-brands/no.json";
import dk from "@/data/local-brands/dk.json";
import fi from "@/data/local-brands/fi.json";
import at from "@/data/local-brands/at.json";
import ch from "@/data/local-brands/ch.json";
import ca from "@/data/local-brands/ca.json";
import au from "@/data/local-brands/au.json";
import inData from "@/data/local-brands/in.json";
import br from "@/data/local-brands/br.json";
import mx from "@/data/local-brands/mx.json";
import jp from "@/data/local-brands/jp.json";
import za from "@/data/local-brands/za.json";
import ae from "@/data/local-brands/ae.json";
import gr from "@/data/local-brands/gr.json";
import ro from "@/data/local-brands/ro.json";
import cz from "@/data/local-brands/cz.json";
import tr from "@/data/local-brands/tr.json";
import nz from "@/data/local-brands/nz.json";
import fallback from "@/data/local-brands/default.json";

export const COUNTRY_BRAND_DATA: Record<string, CountryBrandData> = {
  MT: mt,
  NL: nl,
  DE: de,
  GB: gb,
  US: us,
  FR: fr,
  ES: es,
  IT: it,
  IE: ie,
  BE: be,
  PT: pt,
  PL: pl,
  SE: se,
  NO: no,
  DK: dk,
  FI: fi,
  AT: at,
  CH: ch,
  CA: ca,
  AU: au,
  IN: inData,
  BR: br,
  MX: mx,
  JP: jp,
  ZA: za,
  AE: ae,
  GR: gr,
  RO: ro,
  CZ: cz,
  TR: tr,
  NZ: nz,
} as Record<string, CountryBrandData>;

export const DEFAULT_COUNTRY_BRAND_DATA = fallback as CountryBrandData;

/** Looks up the local brand config for a country, falling back to a global default. */
export function getCountryBrandData(countryCode: string): CountryBrandData {
  return COUNTRY_BRAND_DATA[countryCode.toUpperCase()] ?? DEFAULT_COUNTRY_BRAND_DATA;
}
