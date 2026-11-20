#!/usr/bin/env node
// Reproduce the exact-quartic comparison and attach the app's sampled diagnostics.
// Usage: node this-file.mjs /path/to/zeta-view [/tmp/output-prefix]
import {writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const repo=resolve(process.argv[2]??process.cwd());
const prefix=process.argv[3]??'/tmp/zeta-quartic-comparison';
const {computeHeatTrajectories}=await import(pathToFileURL(resolve(repo,'dist/research-dynamics.js')).href);
const center={sigma:.5,t:.5},radius=.35,zRadius=.7;
const entryU=(Math.sqrt(443626)-617)/600,collisionU=(10-Math.sqrt(46))/24;
const rawReferenceMinimum=20979/10000;
const perturbationMaximum=u=>12*u*u+(617/25)*u;
const margin=u=>rawReferenceMinimum-perturbationMaximum(u);
const postEntryLower=(17/10-Math.sqrt(13/5))**2*(3/10+Math.sqrt(6/5))**2;
const specs=[
 {id:'tau_0',tau:0,exactRoots:'s = 1/2 ± i/2 and 1/2 ± i'},
 {id:'tau_minus_0_1',tau:-.1,exactRoots:'s = 1/2 ± i sqrt(30)/10 and 1/2 ± i sqrt(65)/10'},
 {id:'collision',tau:-collisionU,exactRoots:'s = 1/2 ± i 46^(1/4)/4; each root has multiplicity two'},
 {id:'tau_minus_0_15',tau:-.15,exactRoots:'s = 1/2 ± sqrt((sqrt(277)−16)/80) ± i sqrt((sqrt(277)+16)/80), all four sign choices'},
 {id:'tau_minus_0_25',tau:-.25,exactRoots:'s = 1/4 ± i sqrt(5)/4 and 3/4 ± i sqrt(5)/4'}
];
const frames=specs.map(spec=>{
 const u=-spec.tau,view=computeHeatTrajectories({researchHeatModel:'quartic',researchHeatEnd:spec.tau,researchContourRadius:radius,researchFrame:240}),roots=[];
 for(const r of view.diagnostics.roots){
  const same=spec.id==='collision'?roots.find(p=>Math.hypot(p.sigma-r.sigma,p.t-r.t)<1e-10):null;
  if(same){same.multiplicity++;continue;}
  const distance=Math.hypot(r.sigma-center.sigma,r.t-center.t);
  roots.push({sigma:r.sigma,t:r.t,multiplicity:1,distanceFromContourCenter:distance,inside:distance<radius,
   D:r.D,M:r.M,Dprime:r.Dprime,status:r.status,
   velocity:{re:Number.isFinite(r.velocity.re)?r.velocity.re:null,im:Number.isFinite(r.velocity.im)?r.velocity.im:null}});
 }
 return {...spec,u,roots,insideCount:roots.filter(r=>r.inside).reduce((n,r)=>n+r.multiplicity,0),
  offCriticalLine:roots.some(r=>Math.abs(r.sigma-.5)>1e-9),collision:spec.id==='collision',
  rawRoucheMargin:margin(u),maximumPerturbation:perturbationMaximum(u),sampledContour:view.diagnostics.sampledContour};
});

const proofs=[
 {id:'rouche_initial',title:'A sharp full-circle, whole-interval Rouché bound from τ=0',
  formulas:[
   'z = −2i(s−1/2), u = −τ. The circle |s−(1/2+i/2)|=7/20 becomes |z−1|=7/10.',
   'P₀(z)=(z−1)(z+1)(z−2)(z+2). Put h=z−1=(7/10)e^(iθ), c=cos θ.',
   '|P₀|²=(49/100)(449/100+(14/5)c)(149/100−(7/5)c)(949/100+(21/5)c).',
   'min_C |P₀| = 20979/10000 = 2.0979, at h=7/10 (z=17/10).',
   'Pᵤ−P₀=u(2+12u+24h+12h²).',
   'max_C |Pᵤ−P₀|=u(617/25+12u)=24.68u+12u² for u≥0.',
   'For 0≤u≤U, |Pᵤ−P₀|≤24.68U+12U² < 2.0979 ≤ |P₀| if U<u_entry.',
   'u_entry=(sqrt(443626)−617)/600 ≈ 0.0817542507988577.',
   'For U=2/25=.08, the unnormalized Rouché margin is at least 467/10000=.0467.'
  ],paragraphs:[
   'Each affine factor in the expression for |P₀|² is positive on −1≤c≤1. Its logarithm is concave, so the logarithm of the product is concave and the minimum occurs at c=±1. The endpoint moduli are 2.0979 and 3.5581; hence the smaller value is the exact full-circle minimum.',
   'For u≥0 all coefficients in 2+12u+24h+12h² are nonnegative. The triangle inequality gives the displayed upper bound, and equality holds at the positive real h=7/10. Thus this is the exact maximum, not a finite-sampling estimate.',
   'The perturbation bound is increasing in u. Rouché therefore applies simultaneously on the entire circle and for every parameter 0≤u≤U<u_entry. The disk contains exactly one zero counting multiplicity throughout that interval.',
   'The disk is invariant under s↦1−conj(s). Since the polynomial has the same reflection symmetry, exactly one zero counting multiplicity means that zero is simple and remains on Re s=1/2. This is a local finite-parameter guarantee for this polynomial.'
  ]},
 {id:'entry_before_collision',title:'Contour entry, collision, and departure are separate events',
  formulas:[
   'Pᵤ(17/10)=12u²+(617/25)u−20979/10000.',
   'τ_entry=−(sqrt(443626)−617)/600 ≈ −0.0817542507988577.',
   'The crossing point is s=1/2+(17/20)i, the top of the fixed circle.',
   'Δ(u)=96u²−80u+9; y±(u)=(5−12u±sqrt(Δ(u)))/2; z=±sqrt(y±).',
   'τ_collision=−(10−sqrt(46))/24 ≈ −0.13406958403644717.',
   'At collision: s=1/2 ± i 46^(1/4)/4, with multiplicity two at each point.'
  ],paragraphs:[
   'As u increases from zero to the first collision, the inner positive root increases from z=1 while the outer positive root decreases from z=2. The outer root first reaches the disk at z=17/10. This occurs strictly before the collision.',
   'For this particular circle, the first loss of a positive sampled Rouché margin coincides with the true contour crossing. The exact full-circle minimum of the reference and maximum perturbation both occur at z=17/10; this is included in the app’s 128-point sample at s-angle π/2. This coincidence is special to the present geometry and does not validate sampled margins in general.',
   'At τ_entry the polynomial vanishes on the contour, so the contour winding is undefined. Just before it in reverse heat time the count is one; just after it the count is two.',
   'At τ=−.1 the disk already contains two distinct critical-line roots, but no collision and no off-line roots have occurred. At τ_collision the disk contains one double root, still counted as two. For τ just below τ_collision the two roots in the disk move off the critical line symmetrically.',
   'Consequently a constant two-zero contour count through the collision does not imply either root stays on the critical line. The one-zero confinement hypothesis was lost earlier, when the other root entered.'
  ]},
 {id:'post_entry_two_zero',title:'A uniform two-zero contour guarantee across the collision',
  formulas:[
   'For 1/10≤u≤1/4, every positive-half-plane z root obeys |z−1|≤sqrt(13/5)−1.',
   'Every negative-half-plane z root obeys |z−1|≥1+sqrt(6/5).',
   'On |z−1|=7/10: |Pᵤ(z)|≥L=(17/10−sqrt(13/5))²(3/10+sqrt(6/5))² ≈ 0.0149252785747850 > 0.',
   'For u,v∈[1/10,1/4], max_C|Pᵤ−Pᵥ|=|u−v|[24.68+12(u+v)]≤30.68|u−v|.',
   'If |u−v|≤1/2500, the perturbation is at most .012272<L. Repeated interval Rouché comparisons preserve the count two.',
   'After collision put A=5−12u, B=12u²−10u+4, C=sqrt(B), z=a±ib, a²=C/2+A/4, b²=C/2−A/4.',
   'q(u)=|z−1|²=C−2a+1; q′=[6−(A/C)(2a−1)]/(2a)>0, since 0<A/C≤2 and 1<a<3/2.',
   'Thus max_postcollision |z−1|²=5/2−sqrt(5) at u=1/4, smaller than (sqrt(13/5)−1)².'
  ],paragraphs:[
   'Before collision, the explicit real roots are monotone, so the largest positive-root distance from z=1 on this interval is the outer root’s starting distance sqrt(13/5)−1. The nearest negative root starts at −sqrt(6/5).',
   'After collision, the formulas and derivative displayed above bound the positive pair through u=1/4. The negative roots have real part at most −sqrt(5)/2, so their distances from z=1 exceed 1+sqrt(6/5).',
   'Apply the reverse triangle inequality to each of the four monic factors of Pᵤ. The resulting product L is strictly positive on the full contour for all u in the interval, even at the interior double-root collision. Therefore the contour stays zero-free and its count stays two.',
   'Alternatively, the stated uniform perturbation estimate gives a direct chain of 375 Rouché intervals of length .0004 from u=.1 to .25. Every inequality is analytic; no grid between contour samples is assumed.',
   'This guarantees confinement within the disk of a two-zero cluster. It does not force either member onto the critical line.'
  ]},
 {id:'forward_reverse',title:'The displayed velocity keeps the forward-τ convention',
  formulas:[
   '∂τF=Fss/4; ρ′τ=−Fss/(4Fs); D=(Re ρ−1/2)²; D′τ=−M/2.',
   'After collision D(u)=[2sqrt(12u²−10u+4)−5+12u]/16.',
   'At τ=−1/4: D=1/16, M=7/6, D′τ=−7/12, while dD/du=+7/12.'
  ],paragraphs:[
   'The experiment travels from τ=0 to negative τ, so reverse-time playback expands the off-axis distance even though the displayed forward-time D′τ is negative. There is no sign inconsistency.',
   'At the exact double root, F_s=0 and the simple-root velocity formula is undefined. M and D′τ are explicitly unresolved there; a computed zero value would be misleading.',
   'The central value Fτ(1/2)=12(τ+5/12)²+23/12 remains positive. This and reflection symmetry do not prevent the demonstrated backward-time departure.'
  ]}
];

const report={schemaVersion:1,title:'Exact quartic: contour entry precedes collision',
 scope:'Exact polynomial calibration with algebraic full-circle inequalities. App contour statistics are retained separately as sampled diagnostics. No statement about off-line ξ zeros is made.',
 conventions:{time:'u=−τ increases during the requested backward-time comparison',polynomial:'Pᵤ(z)=z⁴+(12u−5)z²+12u²−10u+4',family:'Fτ(s)=P−τ(−2i(s−1/2))',PDE:'∂τF=Fss/4',center,radius,zCenter:{re:1,im:0},zRadius},
 constants:{entryU,entryTau:-entryU,entryExact:'−(sqrt(443626)−617)/600',collisionU,collisionTau:-collisionU,collisionExact:'−(10−sqrt(46))/24',eventSeparation:collisionU-entryU,
  roucheReferenceMinimum:rawReferenceMinimum,roucheReferenceMinimumExact:'20979/10000',roucheIntervalTau:[-.08,0],roucheIntervalMargin:.0467,roucheIntervalMarginExact:'467/10000',
  postEntryIntervalTau:[-.25,-.1],postEntryBoundaryLowerBound:postEntryLower,postEntryBoundaryLowerBoundExact:'(17/10−sqrt(13/5))²(3/10+sqrt(6/5))²',postEntryRoucheStep:.0004,postEntryRoucheStepMaximumPerturbation:.012272},
 events:[
  {id:'sampled_margin_loss',label:'Positive Rouché margin ends',tau:-entryU,u:entryU,exact:'−(sqrt(443626)−617)/600',description:'Here the exact minimum and maximum both lie on an included sample node, so the sampled-margin sign threshold agrees with the full-circle analytic threshold.'},
  {id:'contour_entry',label:'Second zero reaches the contour',tau:-entryU,u:entryU,exact:'−(sqrt(443626)−617)/600',description:'Crossing at s=1/2+17i/20; winding is undefined at contact and changes from one to two as τ decreases through the threshold.',root:{sigma:.5,t:.85},insideBefore:1,insideAfter:2},
  {id:'collision',label:'Two on-line zeros collide',tau:-collisionU,u:collisionU,exact:'−(10−sqrt(46))/24',description:'The positive-height pair coalesces inside the disk, with multiplicity two. A symmetric negative-height collision occurs outside it.'},
  {id:'off_axis_onset',label:'Off-line roots begin after collision',tau:-collisionU,u:collisionU,exact:'τ < −(10−sqrt(46))/24',description:'The roots are still on the critical line at the collision itself; they are strictly off-line for τ immediately below this threshold.',strict:true}
 ],frames,proofs,
 reproduction:{command:`node zeta-quartic-comparison.mjs /path/to/zeta-view /tmp/zeta-quartic-comparison`,runtimeModule:'dist/research-dynamics.js',sampleCount:128,numericApproximations:'IEEE-754 numbers; the exact radical and rational formulas and their inequalities carry the analytic conclusions.'}};

let text=`${report.title}\n${'='.repeat(report.title.length)}\n\n${report.scope}\n\n`;
text+=`Fixed circle: center s=1/2+i/2, radius 7/20=.35. In z coordinates: center 1, radius 7/10=.7.\n\n`;
text+=`Event order as τ decreases:\n1. Margin loss and contour crossing coincide at τ=${-entryU}.\n2. Collision occurs later at τ=${-collisionU}.\n3. Off-line roots exist strictly below the collision time.\nSeparation between entry and collision: ${collisionU-entryU}.\n\n`;
text+='Selected frames (zeros counted with multiplicity):\n';
for(const f of frames){text+=`\nτ=${f.tau}; count inside=${f.insideCount}; off-line=${f.offCriticalLine}; raw reference Rouché margin=${f.rawRoucheMargin}\n${f.exactRoots}\n`;
 for(const r of f.roots)text+=`  s=${r.sigma} ${r.t<0?'-':'+'} ${Math.abs(r.t)}i; multiplicity ${r.multiplicity}; distance to center ${r.distanceFromContourCenter}; ${r.inside?'inside':'outside'}; M=${r.M}; D′τ=${r.Dprime}\n`;
 text+=`  App sampled winding=${f.sampledContour.winding}, sampled normalized Rouché margin=${f.sampledContour.roucheMargin}, sampled current minimum=${f.sampledContour.minimumModulus}. These app fields remain marked uncertified.\n`;
}
for(const proof of proofs){text+=`\n\n${proof.title}\n${'-'.repeat(proof.title.length)}\n\n`;text+=proof.formulas.map(x=>`${x}\n`).join('');text+='\n'+proof.paragraphs.join('\n\n')+'\n';}
await writeFile(prefix+'.json',JSON.stringify(report,null,2)+'\n');
await writeFile(prefix+'.txt',text);
console.log(JSON.stringify({json:prefix+'.json',text:prefix+'.txt',entryTau:-entryU,collisionTau:-collisionU,frames:frames.map(f=>({tau:f.tau,insideCount:f.insideCount,offCriticalLine:f.offCriticalLine,rawRoucheMargin:f.rawRoucheMargin}))},null,2));
