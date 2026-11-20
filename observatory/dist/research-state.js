/** Reproducible controls for the bridge research workbench. */
export const RESEARCH_DEFAULTS=Object.freeze({
 researchMode:'off',researchSource:'xi',researchLayer:'shear',researchSigma:.65,researchT:14.134725141734693,researchSpan:3.2,researchA:.25,researchTau:0,researchEpsilon:-.25,researchModalY:0,researchShift:.15,
 researchNodes:'-1,-0.3,0.3,1',researchKernel:'bridge',researchNodeImag:.15,researchFrozen:1,
 researchBlock:30,researchFrequency:4,researchThetaCutoff:4,
 researchPrimeCount:12,researchPrimePower:2,researchPrimeSolo:0,researchPrimeMute:0,
 researchPath:'vertical',researchRadius:.35,researchGhost:false,researchDelta:.1,
 researchAlpha:1,researchPulseWidth:1,researchPulseSeparation:2,researchPulseShape:'pair',researchPulseCutoff:0,
 researchHeatEnd:-.2,researchHeatCount:3,researchHeatModel:'theta',researchContourRadius:.35,
 researchFrame:0,researchRate:12,researchShowContours:true,researchShowVectors:true
});
export const RESEARCH_ENUMS=Object.freeze({researchMode:['off','shear','modal','energy','gram','theta','modes','ratio','pulse','heat'],researchSource:['xi','heat','quadratic'],researchLayer:['shear','logShear','phase'],researchKernel:['bridge','pick','logPick'],researchPath:['vertical','circle','bridgeSweep'],researchPulseShape:['box','pair','gaussian'],researchHeatModel:['theta','quartic']});
export const RESEARCH_LIMITS=Object.freeze({researchSigma:[-.5,1.5,.01],researchT:[0,60,.01],researchSpan:[.5,12,.1],researchA:[.02,1,.01],researchTau:[-.3,.5,.01],researchEpsilon:[-.8,.8,.01],researchModalY:[-1.5,1.5,.01],researchShift:[0,.5,.01],researchNodeImag:[0,.5,.01],researchFrozen:[0,7,1],researchBlock:[1,120,1],researchFrequency:[0,20,.05],researchThetaCutoff:[1,12,1],researchPrimeCount:[4,32,1],researchPrimePower:[1,4,1],researchPrimeSolo:[0,32,1],researchPrimeMute:[0,32,1],researchRadius:[.05,1,.01],researchDelta:[0,.5,.005],researchAlpha:[0,5,.05],researchPulseWidth:[.25,4,.05],researchPulseSeparation:[0,6,.1],researchPulseCutoff:[-8,8,.1],researchHeatEnd:[-.3,.5,.01],researchHeatCount:[1,6,1],researchContourRadius:[.05,1,.01],researchFrame:[0,240,1],researchRate:[1,12,1]});
const integers=new Set(['researchFrozen','researchBlock','researchThetaCutoff','researchPrimeCount','researchPrimePower','researchPrimeSolo','researchPrimeMute','researchHeatCount','researchFrame','researchRate']);
export function normalizeResearchConfig(input={}){
 const out={...RESEARCH_DEFAULTS};
 for(const key of Object.keys(out)){const v=input[key];if(RESEARCH_ENUMS[key]){if(RESEARCH_ENUMS[key].includes(v))out[key]=v;}else if(RESEARCH_LIMITS[key]&&typeof v==='number'&&Number.isFinite(v)){out[key]=Math.max(RESEARCH_LIMITS[key][0],Math.min(RESEARCH_LIMITS[key][1],integers.has(key)?Math.round(v):v));}else if(typeof out[key]==='boolean'&&typeof v==='boolean')out[key]=v;}
 if(typeof input.researchNodes==='string'){const xs=input.researchNodes.split(',').map(x=>x.trim()).filter(Boolean).map(Number).filter(x=>Number.isFinite(x)&&Math.abs(x)<=8).slice(0,8);if(xs.length>=2)out.researchNodes=xs.join(',');}
 if(out.researchMode==='energy'&&out.researchSource!=='quadratic')out.researchA=Math.max(.5,out.researchA);
 const count=out.researchNodes.split(',').length;out.researchFrozen=Math.min(out.researchFrozen,count-1);out.researchPrimeSolo=Math.min(out.researchPrimeSolo,out.researchPrimeCount);out.researchPrimeMute=Math.min(out.researchPrimeMute,out.researchPrimeCount);
 return out;
}
export const RESEARCH_VIEW_NAMES=Object.freeze({shear:'bridgeShear',modal:'modalSigns',energy:'bridgeEnergy',gram:'gramSchur',theta:'thetaCancellation',modes:'primeModes',ratio:'ratioPoles',pulse:'bridgePulse',heat:'heatZeros'});
export const RESEARCH_TITLES=Object.freeze({shear:'Bridge shear',modal:'Modal sign switching',energy:'Even & odd energy',gram:'Gram & Schur',theta:'Theta & arithmetic cancellation',modes:'Prime-mode mixer',ratio:'Ratio & pole trajectories',pulse:'Pulse through the bridge',heat:'Actual heat-zero motion'});

/** Named starting points share the same allowlisted state as saved sessions. */
export function createResearchPresets(defaults={}){
 const base={...defaults,...RESEARCH_DEFAULTS,dynamicsMode:'off',projective:false,fiberMode:'off',geometry:'plane',function:'xi',playing:false,autoRotate:false,packets:false};
 const entries={
  shear:{settings:{researchLayer:'shear'},note:'Compare signed bridge shear, logarithmic shear, phase current and the finite-shift bridge on the actual completed function.'},
  modal:{settings:{researchSource:'quadratic',researchT:0},note:'The exact local model Fε(w) = w² + 2ε, with its moving sign boundary and first modal witness.'},
  energy:{settings:{researchA:.5,researchShift:.15},note:'Resolve bridge shear into even and odd boundary energies, and inspect the numerical identity residual.'},
  gram:{settings:{},note:'Move finite bridge or Pick nodes, inspect eigenvalues, and freeze a block through its Schur complement.'},
  theta:{settings:{},note:'See individual arithmetic blocks change sign while comparing truncated and full theta-kernel contributions.'},
  modes:{settings:{},note:'Mix signed prime and prime-power oscillators, with reproducible time, solo and mute controls.'},
  ratio:{settings:{},note:'Trace the analytic shifted ratio and distinguish actual evaluations from a chosen synthetic zero quartet.'},
  pulse:{settings:{},note:'Send a box, pulse pair or Gaussian through a finite periodic bridge multiplier and compare norm and tail energy.'},
  heat:{settings:{},note:'Follow actual theta-family zeros with complex Newton continuation, or examine an exact quartic collision calibration.'}
 };
 return Object.fromEntries(Object.entries(entries).map(([mode,entry])=>[RESEARCH_VIEW_NAMES[mode],{settings:{...base,researchMode:mode,...entry.settings},note:entry.note}]));
}
