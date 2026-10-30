import { createResearchRegistry } from './module-contract.js';
import { ARITHMETIC_FOUNDATION } from './arithmetic-foundation.js';
import { FINITE_SUZUKI_CERTIFICATE } from './finite-suzuki-certificate.js';
import { HISTORICAL_ROUTES } from './historical-routes.js';
import { PRIME_MEMORY } from './prime-memory.js';
import { SIGNED_COMPLEMENT } from './signed-complement.js';
import { SUZUKI_RECURRENCE } from './suzuki-recurrence.js';
import { WHOLE_EVEN_CERTIFICATE } from './whole-even-certificate.js';

/**
 * RH research-module registry.
 *
 * Registry order is the reading order used by the app index.
 */

export const RH_RESEARCH_MODULES = createResearchRegistry([
  ARITHMETIC_FOUNDATION,
  SUZUKI_RECURRENCE,
  PRIME_MEMORY,
  FINITE_SUZUKI_CERTIFICATE,
  WHOLE_EVEN_CERTIFICATE,
  HISTORICAL_ROUTES,
  SIGNED_COMPLEMENT,
]);

export function getResearchModule(idOrRoute) {
  return RH_RESEARCH_MODULES.find(
    (module) => module.id === idOrRoute || module.route === idOrRoute,
  ) || null;
}

export default RH_RESEARCH_MODULES;
