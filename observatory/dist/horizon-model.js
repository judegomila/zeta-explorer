/**
 * Horizon model: the Schwarzschild quantities and the scattering functions
 * that the comparison with the two-rail system uses.
 *
 * Two different objects appear and must not be confused.
 *  1. Physics of a Schwarzschild horizon (no ζ in it): radius, Hawking
 *     temperature, the local temperature seen by a static observer, the
 *     entropy, the least-damped quasi-normal mode, the Buchdahl bound.
 *  2. Scattering functions on the zeta side: the gamma factor
 *       S_even(E) = Γ_R(½ + iE) / Γ_R(½ − iE),   Γ_R(s) = π^(−s/2) Γ(s/2),
 *     which is the multiplier of the dilation (boost) generator on even
 *     functions, and the two-rail ratio
 *       S_a(E) = ξ(½ + a + iE) / ξ(½ + a − iE) = e^(2iφ_a(E)),
 *     whose poles are at g − i(a ∓ b) for a zero pair ½ ± b + ig.
 *
 * The horizon supplies only the first function. The second is put in by
 * hand. Nothing here is a statement about black holes derived from ζ, or
 * about ζ derived from black holes.
 */
import { logGamma, evaluatePolar } from './math.js';
import { smoothZeroCount } from './nucleus-model.js';

export const SI=Object.freeze({
  G:6.67430e-11,          // m³ kg⁻¹ s⁻²  (CODATA 2018)
  c:299792458,            // m s⁻¹        (exact)
  hbar:1.054571817e-34,   // J s          (exact, from h)
  kB:1.380649e-23,        // J K⁻¹        (exact)
  solarMass:1.98841e30,   // kg           (IAU nominal GM☉ / G)
  year:3.15576e7,         // s            (Julian year)
  MeV:1.602176634e-13,    // J
  fm:1e-15,               // m
});
const TAU=2*Math.PI,LOGPI=Math.log(Math.PI);
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const num=(x,fallback)=>typeof x==='number'&&Number.isFinite(x)?x:fallback;

export function horizonConfig(input={}){
  return {
    logMass:clamp(num(input.logMass,0),-1,10),          // log10(M / M☉)
    a:clamp(num(input.a,.5),.01,3),
    radius:clamp(num(input.radius,3),1.13,6),           // stellar radius R / r_s
    logDistance:clamp(num(input.logDistance,1.5),-1,20) // log10(ℓ / fm), proper distance from the horizon
  };
}

// ---- Schwarzschild quantities (physics; no ζ) -------------------------------
/** r_s = 2GM/c² in metres. */
export const schwarzschildRadius=kg=>2*SI.G*kg/(SI.c*SI.c);
/** T_H = ħc³/(8πGMk_B) in kelvin, as seen far from the hole. */
export const hawkingTemperature=kg=>SI.hbar*SI.c**3/(8*Math.PI*SI.G*kg*SI.kB);
/** Tolman relation: T(r) = T_H / √(1 − r_s/r) for a static observer at radius r. */
export const tolmanTemperature=(kg,rOverRs)=>hawkingTemperature(kg)/Math.sqrt(1-1/rOverRs);
/**
 * Near-horizon form: T_loc = ħc/(2πk_B ℓ) at proper distance ℓ (metres) from
 * the horizon. It does not depend on the mass.
 */
export const localTemperature=metres=>SI.hbar*SI.c/(TAU*SI.kB*metres);
/** Proper acceleration c²/ℓ of the static observer at proper distance ℓ. */
export const localAcceleration=metres=>SI.c*SI.c/metres;
/** Bekenstein–Hawking entropy 4πGM²/ħc in units of k_B. */
export const horizonEntropy=kg=>4*Math.PI*SI.G*kg*kg/(SI.hbar*SI.c);
/** 5120πG²M³/ħc⁴: black-body photon estimate without greybody factors, in seconds. */
export const evaporationTime=kg=>5120*Math.PI*SI.G**2*kg**3/(SI.hbar*SI.c**4);
/** Proper time from horizon to r = 0 along a radial geodesic falling from rest at the horizon limit: πGM/c³. */
export const infallTime=kg=>Math.PI*SI.G*kg/SI.c**3;
/** Least-damped l = 2 gravitational quasi-normal mode, Mω = 0.37367 − 0.08896 i (Leaver 1985). */
export const QNM_L2=Object.freeze({re:.37367,im:-.08896});
export function quasiNormalMode(kg){
  const unit=SI.c**3/(SI.G*kg);                          // 1/M in s⁻¹
  return {frequency:QNM_L2.re*unit/TAU,dampingTime:1/(-QNM_L2.im*unit),quality:QNM_L2.re/(-2*QNM_L2.im)};
}
/** Highly damped tower: 8πMω_n → ln 3 − 2πi(n + ½) (Motl 2003), in units of 1/M. */
export const asymptoticMode=n=>({re:Math.log(3)/(8*Math.PI),im:-(n+.5)/4});

/** Buchdahl bound: a static isotropic fluid sphere has R > (9/8) r_s. */
export const BUCHDAHL=9/8;
/**
 * Central pressure over ρc² of a uniform-density sphere of radius R = x r_s:
 * (1 − q)/(3q − 1), q = √(1 − 1/x); a simple pole at x = 9/8.
 */
export function centralPressure(x){
  if(!(x>BUCHDAHL))return Infinity;
  const q=Math.sqrt(1-1/x);return (1-q)/(3*q-1);
}

export function horizonNumbers(input){
  const c=horizonConfig(input),kg=SI.solarMass*10**c.logMass,rs=schwarzschildRadius(kg),ell=SI.fm*10**c.logDistance;
  const tLoc=localTemperature(ell);
  return {config:c,kg,solarMasses:10**c.logMass,rs,hawking:hawkingTemperature(kg),local:tLoc,localMeV:tLoc*SI.kB/SI.MeV,
    distance:ell,distanceOverRs:ell/rs,acceleration:localAcceleration(ell),entropy:horizonEntropy(kg),
    evaporationYears:evaporationTime(kg)/SI.year,infall:infallTime(kg),qnm:quasiNormalMode(kg),
    stellarRadius:c.radius*rs,pressure:centralPressure(c.radius),buchdahlRadius:BUCHDAHL*rs};
}
/** Marks on the local-temperature scale (proper distance in fm, temperature in MeV). */
export const TEMPERATURE_MARKS=Object.freeze([
  {fm:256,MeV:.12,label:'a static ²³⁸U nucleus is crushed by its weight (estimate)'},
  {fm:31.4,MeV:1,label:'1 MeV'},
  {fm:1.75,MeV:17.9,label:'liquid–gas critical point of nuclear matter'},
  {fm:.20,MeV:156.5,label:'QCD crossover'},
]);

// ---- gamma factor (the part the horizon supplies) ---------------------------
/** θ(E) = arg Γ(¼ + iE/2) − (E/2) log π, so that S_even = e^(2iθ). */
export const gammaPhase=E=>logGamma(.25,E/2).im-E/2*LOGPI;
/** Time delay of the gamma factor alone, 2θ′(E) = Re ψ(¼ + iE/2) − log π. */
export function gammaDelay(E,h=1e-3){return (gammaPhase(E+h)-gammaPhase(E-h))/h;}
/** 2π × smooth density of zeros of ζ at height E, from N(T) = (T/2π) log(T/2πe) + 7/8. */
export const smoothDelay=E=>Math.log(Math.max(E,1e-9)/TAU);
/** Poles of S_even: E = i(2n + ½), n ≥ 0 (upper half-plane in this convention). */
export const gammaPole=n=>2*n+.5;

// ---- two-rail scattering function (put in by hand) --------------------------
/** Resonance poles of S_a for zeros on the line: E = g − ia, total width 2a. */
export const resonancePoles=(zeros,a)=>zeros.map(g=>({re:g,im:-a}));
/** Σ_n 2a/((t − g_n)² + a²) over ±g_n for the supplied zeros (a partial sum of τ_a). */
export function lorentzianDelay(zeros,a,t){
  let sum=0;for(const g of zeros)sum+=2*a/((t-g)**2+a*a)+2*a/((t+g)**2+a*a);
  return sum;
}
/** Leading-order transmission coefficient 1 − (t/2π)^(−2a) of the averaged S_a. */
export const transmission=(a,t)=>1-Math.pow(Math.max(t,TAU)/TAU,-2*a);
/**
 * Levels and reduced widths of the two-rail system in a window: zeros t_n of
 * A_a = Re ξ(½ + a + it) (phase crossing π/2 mod π) and w_n = 1/φ_a′(t_n).
 */
export function railLevels(a,t0,span,step=.02){
  const n=Math.max(8,Math.round(span/step)),levels=[];let prev=NaN,prevT=NaN;
  for(let i=0;i<=n;i++){
    const t=t0+span*i/n,p=evaluatePolar(.5+a,t,'xi');if(!p.valid)continue;
    const c=Math.cos(p.arg);
    if(Number.isFinite(prev)&&c*prev<0&&Math.abs(c-prev)<1.5){
      let lo=prevT,hi=t,flo=prev;
      for(let k=0;k<40;k++){const mid=(lo+hi)/2,f=Math.cos(evaluatePolar(.5+a,mid,'xi').arg);if(f*flo<=0)hi=mid;else{lo=mid;flo=f;}}
      const tn=(lo+hi)/2,q=evaluatePolar(.5+a,tn,'xi',0,true).q.re;
      levels.push({t:tn,width:1/q});
    }
    prev=c;prevT=t;
  }
  return levels;
}

// ---- counting laws -----------------------------------------------------------
/** Smooth number of zeros of ζ below height E. */
export const zeroCount=E=>E>TAU?smoothZeroCount(E):0;
/** d ln N / d ln E of the zero-counting law. */
export function zeroExponent(E){const N=smoothZeroCount(E);return E/TAU*Math.log(E/TAU)/N;}
/** log10 of the number of horizon states, S / ln 10, if exp(S) counts states (an assumption). */
export const horizonLogStates=kg=>horizonEntropy(kg)/Math.LN10;

/**
 * Candidate correspondences between the zeta side and a horizon, with the
 * verdict reached in the source paper. Every row is an analogy; "fails" rows
 * were tested against numbers and rejected.
 */
export const DICTIONARY=Object.freeze([
  {zeta:'σ = 1 (pole of ζ)',physical:'stretched horizon, through a string gas',test:'simple pole of the partition function; (β − 1)U → 1',verdict:'adopted',scope:'one pair of exponents; true of every Dirichlet series with a simple pole'},
  {zeta:'σ = 1',physical:'Buchdahl limit',test:'log(1/v) growth against a simple pole of P_c/ρc² at R = (9/8) r_s',verdict:'fails',scope:''},
  {zeta:'strip ½ < σ < 1',physical:'region with no static equilibrium',test:'width over pole position ½ against the Buchdahl gap 1/9',verdict:'fails',scope:'no interior counterpart'},
  {zeta:'σ = ½',physical:'self-dual point; transition',test:'exact only as half the limiting inverse temperature',verdict:'adopted',scope:'only as σ = ½ ↔ β_H/2'},
  {zeta:'zeros',physical:'cavitation; microstates',test:'C/S² → −1 against C = −2S; no ramp in |ζ|²',verdict:'fails',scope:''},
  {zeta:'Λ (de Bruijn–Newman)',physical:'critical point of a fluid',test:'exponent 3/2 against 0.326 (liquid–gas) and ½ (mean field)',verdict:'fails',scope:''},
  {zeta:'thickness a',physical:'damping over surface gravity',test:'gamma-factor poles at i(2n + ½); lowest value ½ shared with the quasi-normal tower',verdict:'adopted',scope:'only as “a in units of surface gravity”; a property of the gamma factor'},
  {zeta:'ν = ¼',physical:'membrane η/s = 1/4π',test:'ν is fixed by a convention',verdict:'no relation',scope:''},
  {zeta:'pair collision of zeros',physical:'collapse to r = 0',test:'exponent ½ against 2/3 (radius) and 2 (density)',verdict:'fails',scope:''},
  {zeta:'heavy limit (large height)',physical:'black absorber',test:'transmission 1 − (t/2π)^(−2a) against an exponential approach',verdict:'not adopted',scope:''},
]);
