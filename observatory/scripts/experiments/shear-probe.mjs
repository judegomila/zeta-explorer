import fs from 'node:fs/promises';
import {heatJet,evaluatePolar,ZERO_HEIGHTS,complex} from '../../dist/math.js';
import {shearRecord,finiteBridge,boundaryEnergy} from '../../dist/research-math.js';
import {RESEARCH_DEFAULTS,createResearchPresets,normalizeResearchConfig} from '../../dist/research-state.js';
import {encodeViewURL,decodeViewURL} from '../../dist/view-url.js';

const {abs,div,mul,conj}=complex;
const tau=-.2,shifts=[.02,.05,.25],offsets=[-.15,-.05,0,.05,.15];
const config={researchSource:'heat',researchTau:tau};
const productReal=(a,b)=>a.re*b.re+a.im*b.im;
function newton(sigma,t,tau,steps=768){
 const iterations=[];
 for(let i=0;i<20;i++){
  const jet=heatJet(sigma,t,tau,{steps}),delta=div(jet.value,jet.derivative);
  if(!Number.isFinite(delta.re)||!Number.isFinite(delta.im))throw Error('Unresolved Newton correction');
  iterations.push({sigma,t,correction:abs(delta)});sigma-=delta.re;t-=delta.im;
  if(abs(delta)<2e-13)break;
 }
 const jet=heatJet(sigma,t,tau,{steps}),delta=div(jet.value,jet.derivative);
 return {sigma,t,residual:abs(jet.value),positionalResidual:abs(delta),jet,iterations};
}
// Complex Newton iteration is unconstrained: sigma is never projected to 1/2.
let point=newton(.507,ZERO_HEIGHTS[0],0,768);const track=[{tau:0,sigma:point.sigma,t:point.t,residual:point.positionalResidual}];
for(let k=1;k<=24;k++){point=newton(point.sigma,point.t,tau*k/24,768);track.push({tau:tau*k/24,sigma:point.sigma,t:point.t,residual:point.positionalResidual});}
const root384=newton(.507,point.t,tau,384),root768=newton(.507,point.t,tau,768),t0=root768.t;
const derivativeScale=abs(root768.jet.derivative)**2;
function record(x,y=0){
 const sigma=.5+x,t=t0+y,jet=heatJet(sigma,t,tau,{steps:768}),q=div(jet.derivative,jet.value),ui=shearRecord(sigma,t,config),W=productReal(jet.derivative,jet.value);
 const bridge=shifts.map(a=>{const plus=heatJet(sigma+a,t,tau,{steps:768}),minus=heatJet(sigma-a,t,tau,{steps:768}),plus2=abs(plus.value)**2,minus2=abs(minus.value)**2,B=(plus2-minus2)/(plus2+minus2);const uiB=finiteBridge(evaluatePolar(sigma+a,t,'heat',tau),evaluatePolar(sigma-a,t,'heat',tau));return {a,B,Bover2a:B/(2*a),uiBover2a:uiB/(2*a),linearZeroApproximation:x/(x*x+y*y+a*a),relativeErrorVsLogShear:x!==0&&Number.isFinite(q.re)?(B/(2*a)-q.re)/q.re:null};});
 return {x,y,sigma,t,value:jet.value,derivative:jet.derivative,W,WoverX:x===0?null:W/x,normalizedW:W/derivativeScale,logShear:x===0&&y===0?null:q.re,logShearStatus:x===0&&y===0?'Undefined at the located simple zero; the numerical symmetry value is not a finite extension.':'regular',numericalLogShear:q.re,uiW:ui.W,uiLogShear:ui.logShear,bridge};
}
const horizontal=offsets.map(x=>record(x));
const horizontalCurve=Array.from({length:401},(_,i)=>{const x=-.3+.6*i/400,r=record(x);if(Math.abs(x)<.005)r.logShear=null;return r;});
const nearbyHeights=[-1,-.5,-.25,0,.25,.5,1].map(y=>{
 const jet=heatJet(.5,t0+y,tau,{steps:768}),Q=abs(jet.derivative)**2+productReal(jet.secondDerivative,jet.value);
 const h=1e-3,left=record(-h,y),right=record(h,y);
 return {y,t:t0+y,W:productReal(jet.derivative,jet.value),continuousWoverX:Q,firstModalL1:2*Q,firstModalNormalizedByRootDerivative:2*Q/derivativeScale,finiteDifferenceWoverX:(right.W-left.W)/(2*h),sideChecks:[record(-.05,y),record(.05,y)]};
});
const energy=[0,.05,.15].map(h=>{
 const e=boundaryEnergy({...config,researchMode:'energy',researchA:.5,researchShift:h,researchT:t0},24),coarse=boundaryEnergy({...config,researchMode:'energy',researchA:.5,researchShift:h,researchT:t0},12);
 const {cumulative,density,...summary}=e;
 return {...summary,order:24,comparisonOrder:12,orderChange:e.difference-coarse.difference,actualWoverX:e.direct*e.normalizer,firstModalIfOnAxis:h===0?2*e.direct*e.normalizer:null};
});
const defaults={...RESEARCH_DEFAULTS,dynamicsMode:'off',projective:false,fiberMode:'off',geometry:'plane',function:'xi',playing:false,autoRotate:false,packets:false};
const presets=createResearchPresets(defaults),options={defaults,presets,validate:state=>({...state,...normalizeResearchConfig(state),playing:false})};
function link(name,patch,probe){
 const state={...presets[name].settings,...patch};if(name==='bridgeShear')probe={sigma:state.researchSigma,t:state.researchT};const url=encodeViewURL('https://zeta-view.vercel.app/',{state,probe},{...options,name}),decoded=decodeViewURL(url,options);
 if(!decoded.valid)throw Error(decoded.error);
 for(const key of Object.keys(RESEARCH_DEFAULTS))if(decoded.session.state[key]!==normalizeResearchConfig(state)[key])throw Error(`Roundtrip changed ${key}`);
 return {name,overrides:JSON.parse(new URL(url).searchParams.get('state')||'{}'),probe:decoded.session.probe||null,url};
}
const probe={sigma:.5,t:t0},rightProbe={sigma:.55,t:t0};
const links={
 quartetFinal:link('heatZeros',{researchHeatModel:'quartic',researchHeatEnd:-.25,researchFrame:240}),
 actualFirstFinal:link('heatZeros',{researchHeatModel:'theta',researchHeatCount:1,researchT:ZERO_HEIGHTS[0],researchHeatEnd:tau,researchFrame:240,researchContourRadius:.2},probe),
 shearRawRight:link('bridgeShear',{researchSource:'heat',researchTau:tau,researchT:t0,researchSigma:.55,researchSpan:.5,researchA:.02,researchLayer:'shear'},rightProbe),
 shearLogRight:link('bridgeShear',{researchSource:'heat',researchTau:tau,researchT:t0,researchSigma:.55,researchSpan:.5,researchA:.02,researchLayer:'logShear'},rightProbe),
 shearLogWideBridge:link('bridgeShear',{researchSource:'heat',researchTau:tau,researchT:t0,researchSigma:.55,researchSpan:.5,researchA:.25,researchLayer:'logShear'},rightProbe),
 energyOnAxis:link('bridgeEnergy',{researchSource:'heat',researchTau:tau,researchT:t0,researchA:.5,researchShift:0},probe),
 energyRight:link('bridgeEnergy',{researchSource:'heat',researchTau:tau,researchT:t0,researchA:.5,researchShift:.05},{sigma:.55,t:t0})
};
const checks={maxRelativeUIWDiscrepancy:Math.max(...horizontal.filter(r=>r.x).map(r=>Math.abs((r.uiW-r.W)/r.W))),maxRelativeUILogShearDiscrepancy:Math.max(...horizontal.filter(r=>r.x).map(r=>Math.abs((r.uiLogShear-r.logShear)/r.logShear))),allSampledOffAxisShearOutward:horizontal.every(r=>r.x===0||r.x*r.W>0),allNearbyModalCoefficientsPositive:nearbyHeights.every(r=>r.continuousWoverX>0),maxEnergyIdentityResidual:Math.max(...energy.map(e=>Math.abs(e.residual))),maxEnergyOrderChange:Math.max(...energy.map(e=>Math.abs(e.orderChange))),linkRoundtrips:'All research controls restored exactly through encodeViewURL/decodeViewURL.'};
const result={generatedAt:new Date().toISOString(),source:'Existing zeta-view heatJet / evaluatePolar / research boundaryEnergy; raw analytic normalization Fτ(s)=8Hτ(−2i(s−1/2)).',tau,startingZero:ZERO_HEIGHTS[0],root384,root768,rootGridDiscrepancy:Math.hypot(root384.sigma-root768.sigma,root384.t-root768.t),heightChange:t0-ZERO_HEIGHTS[0],rootDerivativeSquared:derivativeScale,track,horizontal,horizontalCurve,nearbyHeights,energy,checks,links,interpretation:['Numerical results are not interval certificates.','At the exact simple zero F′/F is undefined. A symmetry-forced numerical real part of zero does not remove that pole.','Finite B_a is defined at the center when both shifted endpoint values are nonzero; reflection gives B_a=0 there.','Q(t)=|F′|²+Re(F″ F̄) on the critical line is the continuous transverse W/x coefficient. This report calls 2Q the first modal coefficient, consistent with the local quadratic convention.','Positive sampled Q and outward W around this zero do not establish global shear positivity or prevent every later collision.','Energy differences and tail probes are finite quadrature diagnostics; negative tau does not inherit a PSD guarantee from the UI.']};
await fs.writeFile(process.argv[2]||new URL('../../dist/experiments/zero-confinement-shear.json',import.meta.url),JSON.stringify(result,(_,v)=>typeof v==='number'&&!Number.isFinite(v)?null:v,2));
console.log(JSON.stringify({root:{sigma:root768.sigma,t:root768.t,residual:root768.positionalResidual,gridDiscrepancy:result.rootGridDiscrepancy,heightChange:result.heightChange,derivativeSquared:derivativeScale},horizontal:horizontal.map(r=>({x:r.x,W:r.W,logShear:r.logShear,bridge:r.bridge.map(b=>({a:b.a,Bover2a:b.Bover2a,relativeError:b.relativeErrorVsLogShear}))})),nearbyHeights:nearbyHeights.map(({y,firstModalNormalizedByRootDerivative,continuousWoverX,finiteDifferenceWoverX})=>({y,firstModalNormalizedByRootDerivative,continuousWoverX,finiteDifferenceWoverX})),energy,links},null,2));
