/**
 * Liquid-drop model of collective surface oscillations of a heavy nucleus,
 * with uranium-238 as the reference case.
 *
 * This is a textbook collective model (Bohr & Mottelson, vol. II, ch. 6A),
 * not a many-body calculation. The surface is
 *
 *   R(theta,t) = R0 · k · [1 + beta2·Y20(theta) + Σ_λ a_λ(t)·Y_λ0(theta)],
 *
 * λ = 2..6, axially symmetric, with k fixing the volume. Each multipole is a
 * harmonic oscillator, H_λ = ½ B_λ ȧ² + ½ C_λ a², with
 *
 *   C_λ = (λ−1)(λ+2)·Es/(4π) − (5/(2π))·(λ−1)/(2λ+1)·Ec     (surface − Coulomb)
 *   B_λ = (3/(4πλ))·A·m·R0²                                   (irrotational flow)
 *
 * Es = a_s A^(2/3) is the surface energy and Ec = a_c Z²/A^(1/3) the Coulomb
 * energy of the sphere. The quadrupole softens to C₂ = 0 at fissility
 * x = Ec/(2Es) = 1, the liquid-drop fission threshold.
 *
 * The coupling between modes is an ILLUSTRATIVE term, not a measured one: a
 * static deformation beta2 mixes multipoles of equal parity that differ by
 * two units, K_{λ,λ±2} = kappa·beta2·sqrt(|C_λ C_λ±2|). kappa is a free model
 * parameter. The damping width Gamma is likewise a display parameter.
 *
 * Known limits, stated so the picture is not over-read: irrotational masses
 * are several times too small, so liquid-drop energies overshoot observed
 * vibrational band heads; shell structure, pairing, triaxial shapes and
 * rotation are absent; unstable growth is linear theory only and says nothing
 * quantitative about fission lifetimes.
 */
export const DROP=Object.freeze({
  aS:17.81,           // MeV, surface coefficient (least-squares Bethe–Weizsäcker set)
  aC:.711,            // MeV, Coulomb coefficient of the same set
  e2:1.439964,        // MeV fm
  amu:931.494,        // MeV
  hbarc:197.327,      // MeV fm
  hbar:6.582120e-22,  // MeV s
});
/** Radius constant implied by aC = (3/5) e²/r0, so radius and Coulomb term agree. */
export const R0_FM=.6*DROP.e2/DROP.aC;
export const MODES=Object.freeze([2,3,4,5,6]);
export const U238=Object.freeze({Z:92,N:146,A:238});

const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const num=(x,fallback)=>typeof x==='number'&&Number.isFinite(x)?x:fallback;

export function nucleusConfig(input={}){
  return {
    Z:Math.round(clamp(num(input.Z,U238.Z),60,130)),
    N:Math.round(clamp(num(input.N,U238.N),80,200)),
    beta2:clamp(num(input.beta2,.286),0,.6),
    coupling:clamp(num(input.coupling,.5),0,3),
    width:clamp(num(input.width,.05),0,1),
    pluck:MODES.includes(input.pluck)?input.pluck:2,
  };
}

/** Sphere energies (MeV), radius (fm) and fissility. */
export function dropEnergies(Z,A){
  const Es=DROP.aS*A**(2/3),Ec=DROP.aC*Z*Z/A**(1/3);
  return {Es,Ec,R0:R0_FM*A**(1/3),fissility:Ec/(2*Es),z2a:Z*Z/A,criticalZ2A:2*DROP.aS/DROP.aC};
}

/** Stiffness of multipole λ in MeV, split into its two competing terms. */
export function stiffness(lambda,Z,A){
  const {Es,Ec}=dropEnergies(Z,A);
  const surface=(lambda-1)*(lambda+2)*Es/(4*Math.PI);
  const coulomb=-(5/(2*Math.PI))*(lambda-1)/(2*lambda+1)*Ec;
  return {surface,coulomb,C:surface+coulomb};
}

/** Irrotational mass parameter times c², in MeV fm². */
export function massC2(lambda,A){
  const R0=R0_FM*A**(1/3);
  return 3/(4*Math.PI*lambda)*A*DROP.amu*R0*R0;
}

/** Uncoupled energy ħω_λ in MeV; negative C gives a growth rate instead. */
export function modeEnergy(lambda,Z,A){
  const {C}=stiffness(lambda,Z,A),w2=DROP.hbarc**2*C/massC2(lambda,A);
  return {squared:w2,energy:Math.sqrt(Math.abs(w2)),stable:w2>0};
}

/** Cyclic Jacobi diagonalisation of a small real symmetric matrix. */
export function symmetricEigen(input){
  const n=input.length,a=input.map(row=>[...row]),v=a.map((_,i)=>a.map((__,j)=>i===j?1:0));
  for(let sweep=0;sweep<60;sweep++){
    let off=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)off+=a[i][j]**2;
    if(off<1e-26)break;
    for(let p=0;p<n;p++)for(let q=p+1;q<n;q++){
      if(Math.abs(a[p][q])<1e-300)continue;
      const theta=(a[q][q]-a[p][p])/(2*a[p][q]);
      const t=Math.sign(theta||1)/(Math.abs(theta)+Math.sqrt(theta*theta+1)),c=1/Math.sqrt(t*t+1),s=t*c;
      for(let k=0;k<n;k++){const x=a[k][p],y=a[k][q];a[k][p]=c*x-s*y;a[k][q]=s*x+c*y;}
      for(let k=0;k<n;k++){const x=a[p][k],y=a[q][k];a[p][k]=c*x-s*y;a[q][k]=s*x+c*y;}
      for(let k=0;k<n;k++){const x=v[k][p],y=v[k][q];v[k][p]=c*x-s*y;v[k][q]=s*x+c*y;}
    }
  }
  const order=a.map((_,i)=>i).sort((i,j)=>a[i][i]-a[j][j]);
  return {values:order.map(i=>a[i][i]),vectors:order.map(i=>v.map(row=>row[i]))};
}

/**
 * Coupled normal modes. Returns, per multipole, the uncoupled terms, and per
 * normal mode k the squared energy (MeV²), its energy or growth rate (MeV), and
 * its unit vector in mass-weighted coordinates.
 */
export function coupledModes(input){
  const c=nucleusConfig(input),A=c.Z+c.N,n=MODES.length;
  const parts=MODES.map(lambda=>({lambda,...stiffness(lambda,c.Z,A),massC2:massC2(lambda,A),...modeEnergy(lambda,c.Z,A)}));
  const K=parts.map((p,i)=>parts.map((q,j)=>i===j?p.C:Math.abs(p.lambda-q.lambda)===2?c.coupling*c.beta2*Math.sqrt(Math.abs(p.C*q.C)):0));
  const D=K.map((row,i)=>row.map((k,j)=>DROP.hbarc**2*k/Math.sqrt(parts[i].massC2*parts[j].massC2)));
  const eigen=symmetricEigen(D);
  const normal=eigen.values.map((squared,k)=>({squared,energy:Math.sqrt(Math.abs(squared)),stable:squared>0,vector:eigen.vectors[k]}));
  return {config:c,A,n,parts,K,D,normal,stable:normal.every(m=>m.stable),...dropEnergies(c.Z,A)};
}

/**
 * Amplitudes a_λ at time t (in ħ/MeV) after plucking multipole `pluck` with
 * amplitude a0 from rest. Stable modes ring as cos(E t)·exp(−Γt/2); unstable
 * ones grow as cosh(g t)·exp(−Γt/2). Linear theory: valid for small a only.
 */
export function amplitudesAt(modes,t,a0=.12){
  const {parts,normal,config}=modes,n=parts.length;
  const index=Math.max(0,MODES.indexOf(config.pluck));
  const q0=parts.map((p,i)=>i===index?a0*Math.sqrt(p.massC2):0);
  const decay=Math.exp(-config.width*t/2),q=new Array(n).fill(0);
  for(const mode of normal){
    let projection=0;for(let i=0;i<n;i++)projection+=mode.vector[i]*q0[i];
    const phase=mode.energy*t;
    const factor=(mode.stable?Math.cos(phase):Math.cosh(Math.min(phase,40)))*decay*projection;
    for(let i=0;i<n;i++)q[i]+=mode.vector[i]*factor;
  }
  return q.map((value,i)=>value/Math.sqrt(parts[i].massC2));
}

/** Legendre polynomial P_l(x) by upward recurrence. */
export function legendre(l,x){
  if(l===0)return 1;let a=1,b=x;
  for(let k=2;k<=l;k++){const c=((2*k-1)*x*b-(k-1)*a)/k;a=b;b=c;}
  return b;
}
/** Axial spherical harmonic Y_l0(theta). */
export const y0=(l,cosTheta)=>Math.sqrt((2*l+1)/(4*Math.PI))*legendre(l,cosTheta);

/**
 * Radius profile r(theta)/R0 on [0, π], volume-normalised to the sphere.
 * Radii are floored at a small positive value so a runaway linear amplitude
 * still draws.
 */
export function shapeProfile(beta2,amplitudes,samples=96){
  const r=new Float64Array(samples+1);let volume=0;
  for(let i=0;i<=samples;i++){
    const theta=Math.PI*i/samples,x=Math.cos(theta);
    let value=1+beta2*y0(2,x);
    for(let k=0;k<MODES.length;k++)value+=(amplitudes[k]||0)*y0(MODES[k],x);
    r[i]=Math.max(.05,value);
    const weight=i===0||i===samples?.5:1;
    volume+=weight*r[i]**3*Math.sin(theta)*Math.PI/samples;
  }
  const scale=(2/volume)**(1/3);          // ∫ r³ sinθ dθ = 2 for the unit sphere
  for(let i=0;i<=samples;i++)r[i]*=scale;
  return r;
}

/** Rigid-rotor energies E_J = E(2+)·J(J+1)/6 for a measured 2+ energy. */
export const rotorEnergy=(J,e2)=>e2*J*(J+1)/6;

// ---- Level-spacing statistics -------------------------------------------------

export function erf(x){
  const s=Math.sign(x),z=Math.abs(x),t=1/(1+.3275911*z);
  return s*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z));
}
/** Cumulative nearest-neighbour spacing laws at unit mean spacing. */
export const SPACING_LAWS=Object.freeze({
  poisson:s=>1-Math.exp(-s),
  goe:s=>1-Math.exp(-Math.PI*s*s/4),                                              // Wigner surmise
  gue:s=>erf(2*s/Math.sqrt(Math.PI))-(4*s/Math.PI)*Math.exp(-4*s*s/Math.PI),      // Wigner surmise
});

/** Spacings of an ascending list, scaled to unit mean (constant level density). */
export function uniformSpacings(levels){
  const gaps=[];for(let i=1;i<levels.length;i++)gaps.push(levels[i]-levels[i-1]);
  const mean=gaps.reduce((a,b)=>a+b,0)/gaps.length;
  return gaps.map(g=>g/mean);
}
/** Smooth zero-counting function of ζ, used to unfold zero heights. */
export const smoothZeroCount=T=>T/(2*Math.PI)*Math.log(T/(2*Math.PI*Math.E))+7/8;
/** Unfolded spacings of ascending zero heights. */
export function zeroSpacings(heights){
  const out=[];for(let i=1;i<heights.length;i++)out.push(smoothZeroCount(heights[i])-smoothZeroCount(heights[i-1]));
  return out;
}
/** Kolmogorov–Smirnov distance between a sample and a cumulative law. */
export function ksDistance(sample,law){
  const s=[...sample].sort((a,b)=>a-b),n=s.length;let d=0;
  for(let i=0;i<n;i++){const f=law(s[i]);d=Math.max(d,Math.abs(f-i/n),Math.abs(f-(i+1)/n));}
  return d;
}
