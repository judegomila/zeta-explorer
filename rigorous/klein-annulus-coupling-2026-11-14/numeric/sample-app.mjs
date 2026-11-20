// Reproduce finite bridge experiments using the exact deployed numerical modules.
// Usage: node sample-app.mjs /absolute/path/to/zeta-view > app-samples.json
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
if (!process.argv[2]) throw new Error('Usage: node sample-app.mjs /absolute/path/to/zeta-view > app-samples.json');
const root=resolve(process.argv[2]);
const {bridgeGram,boundaryEnergy,hermitianSpectrum}=await import(pathToFileURL(root+'/dist/research-math.js'));
const {evaluatePolar}=await import(pathToFileURL(root+'/dist/math.js'));
const {quotientInverse,quotientPoint}=await import(pathToFileURL(root+'/dist/quotient.js'));

const gramCases=[
 ['xi-first-local',{researchSource:'xi',researchT:14.134725141734693,researchA:.25,researchNodeImag:.15,researchNodes:'-1,-.3,.3,1'}],
 ['xi-first-wide',{researchSource:'xi',researchT:14.134725141734693,researchA:.5,researchNodeImag:.3,researchNodes:'-3,-1,1,3'}],
 ['xi-height30',{researchSource:'xi',researchT:30,researchA:.5,researchNodeImag:.3,researchNodes:'-3,-1,1,3'}],
 ['xi-height60',{researchSource:'xi',researchT:60,researchA:.5,researchNodeImag:.3,researchNodes:'-3,-1,1,3'}],
 ['heat-plus',{researchSource:'heat',researchTau:.1,researchT:14.134725141734693,researchA:.5,researchNodeImag:.3,researchNodes:'-3,-1,1,3'}],
 ['heat-minus',{researchSource:'heat',researchTau:-.1,researchT:14.134725141734693,researchA:.5,researchNodeImag:.3,researchNodes:'-3,-1,1,3'}],
 ['quadratic-off-axis',{researchSource:'quadratic',researchEpsilon:-.25,researchT:0,researchA:.25,researchNodeImag:.15,researchNodes:'-1,-.3,.3,1'}],
 ['quadratic-real-axis',{researchSource:'quadratic',researchEpsilon:.25,researchT:0,researchA:.25,researchNodeImag:.15,researchNodes:'-1,-.3,.3,1'}],
 ['xi-log-pick',{researchSource:'xi',researchKernel:'logPick',researchNodes:'.15,.35,.7,1.2'}],
];
const gram=gramCases.map(([name,state])=>{
 const q=bridgeGram(state),p=state.researchKernel==='logPick'?null:bridgeGram({...state,researchKernel:'pick'});
 return {name,state,valid:q.valid,reason:q.reason,matrix:q.matrix,pick:p?.matrix,spectrum:q.valid?hermitianSpectrum(q.matrix):null};
});
const energyCases=[
 ['xi-first',{researchSource:'xi',researchT:14.134725141734693,researchA:.5,researchShift:.15}],
 ['xi-height30',{researchSource:'xi',researchT:30,researchA:1,researchShift:.15}],
 ['xi-height60',{researchSource:'xi',researchT:60,researchA:1,researchShift:.15}],
 ['heat-plus',{researchSource:'heat',researchTau:.1,researchT:14.134725141734693,researchA:.5,researchShift:.15}],
 ['quadratic-negative',{researchSource:'quadratic',researchEpsilon:-.25,researchT:.3,researchShift:.15}],
];
const energy=energyCases.map(([name,state])=>{
 const e=boundaryEnergy(state),coarse=boundaryEnergy(state,12),{density,cumulative,...metrics}=e;
 return {name,state,...metrics,relativeBalance:(e.even-e.odd)/(e.even+e.odd),oddEvenRatio:e.odd/e.even,quadratureDifference:e.difference-coarse.difference};
});
const boundaryParity=[];
for(const [T,r]of[[0,1],[14.134725141734693,1],[14.134725141734693,4],[14.134725141734693,6],[30,2],[60,1]]){
 const a=.5,p=evaluatePolar(.5+a,T-r,'xi',0,true),q=evaluatePolar(.5+a,T+r,'xi',0,true);
 const Dminus=p.q.re*Math.exp(2*p.logAbs)/a,Dplus=q.q.re*Math.exp(2*q.logAbs)/a;
 const C=(p.re*q.im-p.im*q.re)/(2*a*r);
 boundaryParity.push({T,r,a,crossCorrelation:C/Math.sqrt(Dminus*Dplus),
   parityCoupling:Math.abs(Dminus-Dplus)/Math.sqrt((Dminus+Dplus)**2-4*C*C)});
}
// Direct quotient chart pullback: reflected point is represented in the band.
let maxLogModulusError=0,maxPhaseConjugacyError=0,maxSpectralError=0;
for(const geometry of ['klein','annulus'])for(const r of [1.15,1.6,2,3])for(const lens of [1,24])for(const [sigma,t]of[[.3,12.4],[.7,18],[-.1,29],[1.1,58]]){
 const f=evaluatePolar(sigma,t,'xi',0,true);
 for(const uv of quotientInverse(sigma,t,{geometry,r,scale:lens})){
  const p=quotientPoint(uv.u,uv.v,{r,scale:lens}),g=evaluatePolar(p.sigma,p.t,'xi',0,true);
  maxSpectralError=Math.max(maxSpectralError,Math.abs(p.sigma-(sigma<.5?1-sigma:sigma)),Math.abs(p.t-t));
  maxLogModulusError=Math.max(maxLogModulusError,Math.abs(f.logAbs-g.logAbs));
  const delta=f.arg-(uv.conjugated?-g.arg:g.arg);
  maxPhaseConjugacyError=Math.max(maxPhaseConjugacyError,Math.abs(Math.atan2(Math.sin(delta),Math.cos(delta))));
 }
}
console.log(JSON.stringify({scope:'Finite floating-point experiments; no interval or infinite-tail certificate.',gram,energy,boundaryParity,quotientPullback:{maxSpectralError,maxLogModulusError,maxPhaseConjugacyError}},null,2));
