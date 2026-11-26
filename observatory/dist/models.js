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
  ladderSpaceMode:'both',ladderSpan:20,ladderThermoObs:'logZ',
  nucleusZ:92,nucleusN:146,nucleusBeta2:.286,nucleusCoupling:.5,nucleusWidth:.05,
  nucleusPluck:2,nucleusSpeed:1,
});
export const MODELS_ENUMS=Object.freeze({
  modelsMode:['off','ladder','nucleus'],
  ladderWeight:['mangoldt','unit'],
  ladderSpaceMode:['both','direct','dual','difference'],
  ladderThermoObs:['logZ','meanEll','entropy','armGap'],
  nucleusPluck:[2,3,4,5,6],
});
/** [min, max, step]. A step of 1 marks an integer control. */
export const MODELS_LIMITS=Object.freeze({
  ladderCentre:[0,1.5,.005],ladderOffset:[0,1,.005],ladderHeight:[0,90,.01],
  ladderPrimes:[1,168,1],ladderRungs:[1,12,1],ladderBeta:[0,4,.01],ladderPressure:[0,2,.005],
  ladderWidth:[.1,1,.01],ladderSpeed:[0,4,.1],ladderSpan:[5,45,1],
  nucleusZ:[70,126,1],nucleusN:[100,190,1],nucleusBeta2:[0,.6,.002],nucleusCoupling:[0,3,.01],
  nucleusWidth:[0,1,.005],nucleusSpeed:[.1,4,.1],
});
export const MODELS_VIEW_NAMES=Object.freeze({ladder:'twinLadder',nucleus:'uranium238'});

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

export function createModelsPresets(defaults={}){
  const base={...defaults,...MODELS_DEFAULTS,geometry:'plane',projective:false,fiberMode:'off',dynamicsMode:'off',
    researchMode:'off',channelsMode:'off',infinityMode:'off',dualMode:'off',playing:false,autoRotate:false,packets:false};
  return {
    twinLadder:{settings:{...base,modelsMode:'ladder'},
      note:'Finite prime ladders on two arms with an adjustable damping centre, moving packets and the completed ξ bridge. A finite experiment, not ζ.'},
    uranium238:{settings:{...base,modelsMode:'nucleus'},
      note:'Liquid-drop model of coupled surface oscillations of uranium-238: which modes are stable, and where the quadrupole gives way. A textbook collective model, not a many-body calculation.'},
  };
}
