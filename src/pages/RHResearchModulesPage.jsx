import React from 'react';
import ResearchModuleIndex from '../components/rh-research/ResearchModuleIndex.jsx';
import { RH_RESEARCH_MODULES } from '../data/rh-research/registry.js';

export default function RHResearchModulesPage() {
  return <ResearchModuleIndex modules={RH_RESEARCH_MODULES} />;
}
