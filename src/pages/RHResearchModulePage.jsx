import React from 'react';
import { Navigate } from 'react-router-dom';
import ResearchModulePage from '../components/rh-research/ResearchModulePage.jsx';
import { getResearchModule } from '../data/rh-research/registry.js';

export default function RHResearchModulePage({ moduleId }) {
  const module = getResearchModule(moduleId);
  if (!module) return <Navigate to="/rh-research-modules" replace />;
  return <ResearchModulePage module={module} indexRoute="/rh-research-modules" />;
}
