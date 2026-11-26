/**
 * App-level state for the two model workbenches: the finite twin ladder and
 * the liquid-drop nucleus. The application owns history and sharing; only the
 * allowlisted, clamped controls below cross into a shared view. Playback and
 * the animation clock are local to the panel and are never shared.
 */
export const MODELS_DEFAULTS=Object.freeze({
  modelsMode:'off',
  ladderCentre:.5,ladderOffset:.25,ladderHeight:14.134725,ladderPrimes:8,ladderRungs:2,
  ladderBeta:0,ladderPressure:0,ladderWidth:.35,ladderSpeed:1,ladderWeight:'mangoldt',
  nucleusZ:92,nucleusN:146,nucleusBeta2:.286,nucleusCoupling:.5,nucleusWidth:.05,
  nucleusPluck:2,nucleusSpeed:1,
  // Sections inside the workbenches, and the controls they add.
  ladderPanel:'ladder',railsA:.5,railsT0:10,railsSpan:40,railsTerms:2000,vacuumLadder:'perfect',
  nucleus:'U238',nucleusPanel:'drop',
  horizonMass:0,horizonRadius:3,horizonDistance:1.5,
});
export const MODELS_ENUMS=Object.freeze({
  modelsMode:['off','ladder','nucleus','horizon'],
  ladderPanel:['ladder','rails','temperature','vacuum'],
  vacuumLadder:['perfect','primes'],
  nucleus:['U238','Th232','U235','Pu240','Pu242','Pu244','Cm248','Cf252','Og294'],
  nucleusPanel:['drop','statistics','trend'],
  ladderWeight:['mangoldt','unit'],
  nucleusPluck:[2,3,4,5,6],
});
/** [min, max, step]. A step of 1 marks an integer control. */
export const MODELS_LIMITS=Object.freeze({
  ladderCentre:[0,1.5,.005],ladderOffset:[0,1,.005],ladderHeight:[0,90,.01],
  ladderPrimes:[1,40,1],ladderRungs:[1,12,1],ladderBeta:[0,2,.01],ladderPressure:[0,1,.005],
  ladderWidth:[.1,1,.01],ladderSpeed:[0,4,.1],
  nucleusZ:[70,126,1],nucleusN:[100,190,1],nucleusBeta2:[0,.6,.002],nucleusCoupling:[0,3,.01],
  nucleusWidth:[0,1,.005],nucleusSpeed:[.1,4,.1],
  railsA:[.01,3,.005],railsT0:[0,1900,1],railsSpan:[10,400,5],railsTerms:[2,20000,1],
  horizonMass:[-1,10,.05],horizonRadius:[1.13,6,.005],horizonDistance:[-1,20,.05],
});
export const MODELS_VIEW_NAMES=Object.freeze({ladder:'twinLadder',nucleus:'uranium238',horizon:'horizon'});

export function normalizeModelsConfig(input={}){
  const out={...MODELS_DEFAULTS};
  for(const key of Object.keys(out)){
    const value=input?.[key];
    if(MODELS_ENUMS[key]){if(MODELS_ENUMS[key].includes(value))out[key]=value;}
    else if(typeof value==='number'&&Number.isFinite(value)){
      const [lo,hi,step]=MODELS_LIMITS[key],clamped=Math.max(lo,Math.min(hi,value));
      out[key]=step===1?Math.round(clamped):clamped;
    }
  }
  return out;
}

/** Controls handed to the two model modules, under their own short names. */
export const ladderInput=s=>({centre:s.ladderCentre,offset:s.ladderOffset,primes:s.ladderPrimes,rungs:s.ladderRungs,
  beta:s.ladderBeta,pressure:s.ladderPressure,width:s.ladderWidth,weight:s.ladderWeight});
export const nucleusInput=s=>({Z:s.nucleusZ,N:s.nucleusN,beta2:s.nucleusBeta2,coupling:s.nucleusCoupling,
  width:s.nucleusWidth,pluck:s.nucleusPluck});
export const railsInput=s=>({a:s.railsA,t0:s.railsT0,span:s.railsSpan,terms:s.railsTerms});
export const horizonInput=s=>({logMass:s.horizonMass,a:s.railsA,radius:s.horizonRadius,logDistance:s.horizonDistance});
/** The section shown inside the active workbench. */
export const modelsSection=s=>s.modelsMode==='ladder'?s.ladderPanel:s.modelsMode==='nucleus'?s.nucleusPanel:s.modelsMode==='horizon'?'horizon':'off';

export function createModelsPresets(defaults={}){
  const base={...defaults,...MODELS_DEFAULTS,geometry:'plane',projective:false,fiberMode:'off',dynamicsMode:'off',
    researchMode:'off',channelsMode:'off',infinityMode:'off',dualMode:'off',playing:false,autoRotate:false,packets:false};
  return {
    twinLadder:{settings:{...base,modelsMode:'ladder'},
      note:'Finite prime ladders on two arms with an adjustable damping centre, moving packets and the completed ξ bridge. A finite experiment, not ζ.'},
    uranium238:{settings:{...base,modelsMode:'nucleus'},
      note:'Liquid-drop model of coupled surface oscillations of uranium-238: which modes are stable, and where the quadrupole gives way. A textbook collective model, not a many-body calculation.'},
    horizon:{settings:{...base,modelsMode:'horizon'},
      note:'Horizon model: Schwarzschild quantities beside the gamma-factor and two-rail scattering functions. An analogy with stated breaks; it establishes nothing about black holes or about the Riemann hypothesis.'},
  };
}
