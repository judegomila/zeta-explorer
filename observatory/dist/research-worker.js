import { normalizeResearchConfig } from './research-state.js';
import { computeShear, computeModal, computeEnergy, computeGram, computeTheta, computeRatio } from './research-math.js';
import { computePrimeModes, computePulse, computeHeatTrajectories } from './research-dynamics.js';

const computations={shear:computeShear,modal:computeModal,energy:computeEnergy,gram:computeGram,theta:computeTheta,modes:computePrimeModes,ratio:computeRatio,pulse:computePulse,heat:computeHeatTrajectories};

// Expensive numerical evaluations stay off the UI thread. The panel coalesces
// requests and owns the response serial, so superseded plots never replace a
// newly selected experiment. Numerical modules retain only bounded caches.
self.onmessage=event=>{
 const {id,state}=event.data||{};
 try{
  const config=normalizeResearchConfig(state),compute=computations[config.researchMode];
  if(!compute)throw new Error('Select a research experiment.');
  const started=performance.now(),result=compute(config);
  self.postMessage({id,result:{...result,elapsedMs:performance.now()-started}});
 }catch(error){self.postMessage({id,error:error?.message||'The numerical experiment could not be computed.'});}
};
