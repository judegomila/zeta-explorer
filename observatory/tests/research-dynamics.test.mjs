import test from 'node:test';
import assert from 'node:assert/strict';
import {secondDerivative,heatJet,heatXi,derivative,complex} from '../dist/math.js';
import {computeHeatTrajectories,computePrimeModes,computePulse,quarticHeatJet,heatZeroVelocity} from '../dist/research-dynamics.js';

const close=(a,b,tolerance=1e-10,message='values agree')=>assert.ok(Math.abs(a-b)<=tolerance,`${message}: ${a} versus ${b}`);
const complexClose=(a,b,tolerance,message='complex values agree')=>assert.ok(Math.hypot(a.re-b.re,a.im-b.im)<=tolerance,`${message}: ${JSON.stringify(a)} versus ${JSON.stringify(b)}`);

test('analytic second derivative agrees with independent high-precision xi and theta references',()=>{
  // mpmath 1.3, 65 decimal digits: diff(s(s−1)π^(−s/2)Γ(s/2)ζ(s)/2,s,2).
  // Heat references integrate 32u² exp(τu²)Φ(u)cosh(2(s−½)u), unshifted,
  // on [0,.25,.5,1,1.5], using the independently summed theta kernel.
  const references=[
    [.5,0,'xi',0,.02297194431514543753524987649763217026459,0],
    [.2,14,'xi',0,-.00173553186038034938885669897545009544,.00035301617002053842478494764557065035],
    [.8,57,'xi',0,1.7252093458962601721809159345162582e-16,7.05505458267034513375994344255947e-17],
    [.2,72,'xi',0,1.97381895559418014571751076909324e-21,1.92372725634946184462699813205521e-22],
    [-1.5,18,'xi',0,.0002211719656955805108547700924644193,-.000032926319838114622274103590430546],
    [.2,14,'heat',.1,-.0017233734313481395728116382908222272,.0003527219054328114739401045689182474],
    [.8,57,'heat',-.2,1.76487444643638525626006203546765e-16,6.63578143213931934827079129476238e-17],
    [.7,30,'heat',.3,6.61344948961401377891871265451314e-8,1.09666200081721840280471832865258e-8]
  ];
  for(const [sigma,t,kind,tau,re,im] of references){
    const reference={re,im},tolerance=3e-12*Math.hypot(re,im);
    complexClose(secondDerivative(sigma,t,kind,tau),reference,tolerance,`${kind} Fss(${sigma},${t},${tau})`);
    complexClose(heatJet(sigma,t,kind==='xi'?0:tau).secondDerivative,reference,tolerance,'shared jet Fss');
  }
  assert.ok(Number.isNaN(secondDerivative(.5,20,'zeta').re),'unsupported kind is not silently evaluated as xi');
  assert.ok(Number.isNaN(secondDerivative(.5,121,'xi').re),'theta derivative declares its own bounded domain');
});

test('theta jet preserves reflection/conjugation and the heat PDE with analytic derivatives',()=>{
  const sigma=.23,t=31,tau=-.12,p=heatJet(sigma,t,tau),reflected=heatJet(1-sigma,-t,tau),conjugate=heatJet(sigma,-t,tau);
  const scale=Math.max(complex.abs(p.value),complex.abs(p.derivative),complex.abs(p.secondDerivative));
  complexClose(p.value,reflected.value,scale*1e-13);
  complexClose(p.derivative,complex.scale(reflected.derivative,-1),scale*1e-13);
  complexClose(p.secondDerivative,reflected.secondDerivative,scale*1e-13);
  complexClose(p.secondDerivative,complex.conj(conjugate.secondDerivative),scale*1e-13);
  const h=1e-4,plus=heatXi(sigma,t,tau+h),minus=heatXi(sigma,t,tau-h);
  complexClose(complex.scale(complex.sub(plus,minus),1/(2*h)),complex.scale(p.secondDerivative,.25),scale*3e-8,'∂τF=Fss/4');
  complexClose(p.derivative,derivative(sigma,t,'heat',tau),scale*1e-13);
});

test('symmetric quartic heat leaves the critical line without losing winding or a positive central value',()=>{
  const start=computeHeatTrajectories({researchHeatModel:'quartic',researchHeatEnd:-.25,researchFrame:0});
  const final=computeHeatTrajectories({researchHeatModel:'quartic',researchHeatEnd:-.25,researchFrame:240});
  assert.equal(start.diagnostics.roots.length,4);assert.equal(final.diagnostics.roots.length,4);
  assert.deepEqual(start.diagnostics.roots.map(r=>r.t).sort((a,b)=>a-b),[-1,-.5,.5,1]);
  for(const r of start.diagnostics.roots)close(r.sigma,.5);
  for(const r of final.diagnostics.roots){
    close(Math.abs(r.sigma-.5),.25,1e-14);close(Math.abs(r.t),Math.sqrt(5)/4,1e-14);
    assert.ok(r.residual<1e-14);assert.ok(r.M>0);assert.ok(r.Dprime<0,'forward τ contracts D here; reverse clock expands it');
  }
  assert.equal(final.diagnostics.collisions.length,2,'two simultaneous symmetric double roots');
  close(final.diagnostics.collisions[0].tau,-(10-Math.sqrt(46))/24,1e-15);
  const collision=computeHeatTrajectories({researchHeatModel:'quartic',researchHeatEnd:-(10-Math.sqrt(46))/24,researchFrame:240});
  for(const r of collision.diagnostics.roots){assert.equal(r.status,'multiple-or-ill-conditioned');assert.equal(r.M,null);assert.equal(r.Dprime,null);assert.ok(Number.isNaN(r.velocity.re));}
  const contour=final.diagnostics.sampledContour;
  assert.deepEqual(contour.center,{sigma:.5,t:.5});close(contour.initialWinding,1);close(contour.winding,2);
  assert.ok(contour.roucheMargin<0,'the second zero entered this local disk before departure');
  assert.equal(contour.certified,false);assert.equal(final.diagnostics.certified,false);
  for(const tau of [-.5,-5/12,-.25,0,.5])assert.ok(quarticHeatJet(.5,0,tau).value.re>=23/12-1e-14);
});

test('quartic zero velocity and distance derivative agree with independently differenced exact branches',()=>{
  const tau=-.25,h=1e-5;
  const at=u=>computeHeatTrajectories({researchHeatModel:'quartic',researchHeatEnd:u,researchFrame:240}).diagnostics.roots[0];
  const before=at(tau-h),root=at(tau),after=at(tau+h),jet=quarticHeatJet(root.sigma,root.t,tau),velocity=heatZeroVelocity(jet);
  complexClose(velocity,{re:(after.sigma-before.sigma)/(2*h),im:(after.t-before.t)/(2*h)},2e-8);
  close((after.D-before.D)/(2*h),root.Dprime,2e-8);close(root.Dprime,-root.M/2,1e-15);
  const s=.7,t=.9,p=quarticHeatJet(s,t,tau),qplus=quarticHeatJet(s,t,tau+h),qminus=quarticHeatJet(s,t,tau-h);
  complexClose(complex.scale(complex.sub(qplus.value,qminus.value),1/(2*h)),complex.scale(p.secondDerivative,.25),1e-8);
});

test('actual theta roots move with the heat function and restore exact frame prefixes',()=>{
  const config={researchHeatModel:'theta',researchHeatCount:2,researchT:14,researchHeatEnd:-.2};
  const final=computeHeatTrajectories({...config,researchFrame:240});
  const middle=computeHeatTrajectories({...config,researchFrame:120});
  const replay=computeHeatTrajectories({...config,researchFrame:240,researchShowContours:false,researchShowVectors:false});
  assert.deepEqual(final.diagnostics.roots,replay.diagnostics.roots,'overlay changes preserve exact numerical state');
  close(middle.diagnostics.tau,-.1);assert.equal(final.diagnostics.unresolved.length,0);
  assert.ok(final.diagnostics.roots[0].t>14.18,'heat deformation moves the first zero');
  assert.deepEqual(middle.plots[0].series[0].points,final.plots[0].series[0].points.slice(0,121),'time scrubbing restores a cached prefix');
  for(const r of final.diagnostics.roots){
    const refined=heatJet(r.sigma,r.t,final.diagnostics.tau,{steps:768});
    assert.ok(complex.abs(refined.value)/complex.abs(refined.derivative)<1e-8,'independently refined positional residual');
    assert.ok(r.refinedResidual<1e-8);assert.ok(r.condition>1e-4);
    assert.ok(r.sigma>=-2&&r.sigma<=3&&r.t>=0&&r.t<=60);
  }
  const h=1e-4,minus=computeHeatTrajectories({...config,researchHeatCount:1,researchHeatEnd:-.2-h,researchFrame:240}).diagnostics.roots[0];
  const plus=computeHeatTrajectories({...config,researchHeatCount:1,researchHeatEnd:-.2+h,researchFrame:240}).diagnostics.roots[0];
  close((plus.t-minus.t)/(2*h),final.diagnostics.roots[0].velocity.im,3e-6,'tracked motion agrees with analytic velocity');
});

test('root selection at the upper research bound stays in its numerical chart',()=>{
  const r=computeHeatTrajectories({researchHeatModel:'theta',researchT:60,researchHeatCount:6,researchHeatEnd:.5,researchFrame:240});
  assert.equal(r.diagnostics.roots.length,6);assert.equal(r.diagnostics.unresolved.length,0);
  assert.ok(r.diagnostics.roots.every(z=>z.t<=60&&z.t>=0&&z.refinedResidual<1e-8));
});

test('finite pulse transform has an exact alpha-zero identity for every input shape',()=>{
  for(const researchPulseShape of ['box','pair','gaussian']){
    const r=computePulse({researchPulseShape,researchAlpha:0,researchPulseWidth:1.35,researchPulseSeparation:2.4});
    assert.ok(r.diagnostics.identityError<2e-13);assert.equal(r.diagnostics.unresolved,0);
    close(r.diagnostics.outputNorm,r.diagnostics.inputNorm,3e-13);assert.ok(r.diagnostics.imaginaryMax<2e-13);
    assert.equal(r.diagnostics.samples,256);assert.equal(r.diagnostics.period,16);
  }
});

test('finite boundary all-pass multiplier preserves norm while changing pulse shape and tail',()=>{
  const input={researchPulseShape:'pair',researchPulseWidth:1,researchPulseSeparation:2,researchAlpha:1};
  for(const researchSource of ['xi','heat','quadratic']){
    const r=computePulse({...input,researchSource,researchTau:.2,researchEpsilon:0});
    close(r.diagnostics.outputNorm,r.diagnostics.inputNorm,5e-12);
    assert.ok(r.diagnostics.identityError>.1);assert.ok(r.diagnostics.imaginaryMax<1e-12);assert.equal(r.diagnostics.unresolved,0);
    if(researchSource==='quadratic')assert.equal(r.diagnostics.removable,1,'double-zero DC limit is analytically resolved');
  }
  const left=computePulse({...input,researchPulseCutoff:-2}),right=computePulse({...input,researchPulseCutoff:2});
  assert.ok(left.diagnostics.tailNorm>=right.diagnostics.tailNorm);
  assert.ok(right.diagnostics.tailFraction>=0&&right.diagnostics.tailFraction<=1);
});

test('prime-power mixer keeps signed amplitudes, indexes solo/mute, and replays its oscillator time',()=>{
  const config={researchPrimeCount:4,researchPrimePower:2,researchT:0,researchFrame:0};
  const initial=computePrimeModes(config),bars=initial.plots.find(p=>p.kind==='bars');
  for(let i=0;i<4;i++){const p=[2,3,5,7][i];close(bars.values[i],Math.log(p)*(p**(-.5)+p**(-1)),1e-14);}
  const solo=computePrimeModes({...config,researchPrimeSolo:2,researchFrame:80}),soloBars=solo.plots.find(p=>p.kind==='bars');
  assert.deepEqual(solo.diagnostics.enabled,[3]);close(solo.diagnostics.time,10);close(solo.diagnostics.gamma,0,1e-14,'Play keeps spectral height fixed');
  assert.deepEqual(soloBars.values.filter((_,i)=>i!==1),[0,0,0]);
  close(soloBars.values[1],Math.log(3)*(3**(-.5)*Math.cos(10*Math.log(3))+3**(-1)*Math.cos(20*Math.log(3))),1e-14);
  const fixed=computePrimeModes({...config,researchT:3,researchFrame:0}),moving=computePrimeModes({...config,researchT:3,researchFrame:80});
  assert.deepEqual(fixed.diagnostics.amplitudes,moving.diagnostics.amplitudes,'carrier coefficients remain fixed as display time advances');
  assert.notDeepEqual(fixed.diagnostics.instantaneous,moving.diagnostics.instantaneous,'time advances the carrier phases');
  const silent=computePrimeModes({...config,researchPrimeSolo:2,researchPrimeMute:2,researchFrame:80});
  assert.ok(silent.plots.find(p=>p.kind==='heatmap').values.every(v=>v===0));
  const signed=computePrimeModes({...config,researchPrimePower:1,researchT:Math.PI/Math.log(2)});
  assert.ok(signed.plots.find(p=>p.kind==='bars').values[0]<0,'a negative coefficient is not converted to an energy');
  assert.deepEqual(computePrimeModes({...config,researchPrimeSolo:2,researchFrame:80}),solo);
});
