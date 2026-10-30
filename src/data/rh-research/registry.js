import { createResearchRegistry } from './module-contract.js';

/**
 * RH research-module registry.
 *
 * It is intentionally empty until curated theorem text and verification
 * artifacts land.  Empty registry data is not routed or presented as a result.
 */

export const RH_RESEARCH_MODULES = createResearchRegistry([]);

export function getResearchModule(idOrRoute) {
  return RH_RESEARCH_MODULES.find(
    (module) => module.id === idOrRoute || module.route === idOrRoute,
  ) || null;
}

export default RH_RESEARCH_MODULES;
