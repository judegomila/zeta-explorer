import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DynamicsSimulation,DYNAMICS_TIMESTEP,DYNAMICS_MAX_STEPS,flowVector,newtonDistance,
  polynomialHeat,polynomialFromRoots,polynomialEvaluate,polynomialRoots,cubicHeat,finiteZeroVelocity,
} from '../dist/dynamics.js';
import {evaluatePolar} from '../dist/math.js';

const close=(a,b,tolerance=1e-10,message='values agree')=>assert.ok(Math.abs(a-b)<=tolerance,`${message}: ${a} versus ${b}`);
const magnitude=z=>Math.hypot(z.re,z.im);
const domain={sigmaMin:-2,sigmaMax:2,tMin:-2,tMax:2};
const settings={domain,gridWidth:12,gridHeight:12,particles:6,dynamicsSeed:239};
function linear(sigma,t){
  const r2=sigma*sigma+t*t;
  return {valid:true,logAbs:r2===0?-Infinity:.5*Math.log(r2),arg:Math.atan2(t,sigma),
    q:r2?{re:sigma/r2,im:-t/r2}:{re:NaN,im:NaN},derivativeLogAbs:0};
}
const tinyExponential=(sigma,t)=>({valid:true,logAbs:sigma-10000,arg:Math.atan2(Math.sin(t),Math.cos(t)),
  q:{re:1,im:0},derivativeLogAbs:sigma-10000,re:0,im:0,rawRepresentable:false});
const constant=()=>({valid:true,logAbs:0,arg:.4,q:{re:0,im:0},derivativeLogAbs:-Infinity});
const particleState=snapshot=>snapshot.particles.map(({id,sigma,t,vx,vy,trapped,escaped,trail})=>({id,sigma,t,vx,vy,trapped,escaped,trail}));

test('analytic logarithmic and phase flows have the Cauchy–Riemann signs and remain orthogonal',()=>{
  const record=linear(3,4),radial=flowVector(record,{alpha:1,beta:0}),phase=flowVector(record,{alpha:0,beta:1});
  close(radial.x,-3/25);close(radial.y,-4/25);
  close(phase.x,-4/25);close(phase.y,3/25);
  close(radial.x*phase.x+radial.y*phase.y,0);
  assert.ok(3*phase.y-4*phase.x>0,'positive phase circulation is counterclockwise');
  const mixed=flowVector(record,{alpha:.7,beta:-.2});
  close(mixed.x,.7*radial.x-.2*phase.x);close(mixed.y,.7*radial.y-.2*phase.y);
  const capped=flowVector(linear(.0001,0),{maxSpeed:2});
  close(Math.hypot(capped.x,capped.y),2);assert.equal(capped.clipped,true);
  assert.equal(flowVector({valid:false,q:{re:1,im:1}}).valid,false);
});

test('phase tracers circle a simple zero while relaxation approaches and captures it',()=>{
  const phase=new DynamicsSimulation({...settings,dynamicsMode:'phase',dynamicsBeta:1},{sampler:linear});
  phase.particles=[{id:0,sigma:1,t:0,vx:0,vy:0,trapped:false,escaped:false,trail:[[1,0]]}];
  const orbit=phase.step(50).particles[0];
  close(Math.hypot(orbit.sigma,orbit.t),1,1e-7,'RK4 preserves radius on this resolved phase orbit');
  assert.ok(orbit.t>0);assert.equal(orbit.trapped,false);
  const relaxation=new DynamicsSimulation({...settings,dynamicsMode:'relax',dynamicsAlpha:1},{sampler:linear});
  relaxation.particles=[{id:0,sigma:.12,t:0,vx:0,vy:0,trapped:false,escaped:false,trail:[[.12,0]]}];
  const final=relaxation.step(12).particles[0];
  assert.equal(final.trapped,true);close(final.sigma,0,1e-12);close(final.t,0,1e-12);
});

test('a raw-underflowing nonzero field is neither detected nor captured as a zero',()=>{
  const record=tinyExponential(.5,.3);
  close(newtonDistance(record),1);assert.equal(newtonDistance({valid:true,logAbs:-10000,q:{re:0,im:0}}),Infinity);
  assert.equal(newtonDistance({valid:false,logAbs:-Infinity,derivativeLogAbs:0}),Infinity);
  const simulation=new DynamicsSimulation({...settings,dynamicsMode:'relax',dynamicsAlpha:.4},{sampler:tinyExponential});
  assert.equal(simulation.snapshot().zeros.length,0);
  assert.equal(simulation.step(24).diagnostics.trapped,0);
  assert.ok(simulation.snapshot().particles.every(p=>Number.isFinite(p.sigma)&&Number.isFinite(p.t)));
  // A short Newton correction alone is insufficient: exp(1000s) has a small
  // correction everywhere but no zero to converge to, even before underflow.
  const steep=(sigma,t)=>({valid:true,logAbs:1000*sigma-10000,arg:Math.atan2(Math.sin(1000*t),Math.cos(1000*t)),
    q:{re:1000,im:0},derivativeLogAbs:1000*sigma-10000+Math.log(1000)});
  const deceptive=new DynamicsSimulation({...settings,dynamicsMode:'relax',particles:3,
    domain:{sigmaMin:-.1,sigmaMax:.1,tMin:-.1,tMax:.1}},{sampler:steep});
  close(newtonDistance(steep(0,0)),.001);assert.equal(deceptive.step(24).diagnostics.trapped,0);
  assert.equal(deceptive.snapshot().zeros.length,0);
});

test('seeded stochastic replay is exact across batching, reset and bounded reflection',()=>{
  const config={...settings,dynamicsMode:'walk',dynamicsAlpha:.2,dynamicsBeta:.4,dynamicsDiffusion:.4};
  const first=new DynamicsSimulation(config,{sampler:linear}),second=new DynamicsSimulation(config,{sampler:linear});
  first.step(40);second.step(13);second.step(27);
  assert.deepEqual(particleState(first.snapshot()),particleState(second.snapshot()));
  close(first.snapshot().time,40*DYNAMICS_TIMESTEP,0);
  second.reset(config);second.step(40);
  assert.deepEqual(particleState(first.snapshot()),particleState(second.snapshot()));
  const changed=new DynamicsSimulation({...config,dynamicsSeed:240},{sampler:linear});changed.step(40);
  assert.notDeepEqual(particleState(first.snapshot()),particleState(changed.snapshot()));
  for(const p of first.snapshot().particles){assert.ok(p.sigma>=-2&&p.sigma<=2&&p.t>=-2&&p.t<=2);assert.ok(p.trail.length<=100);}
  const limited=new DynamicsSimulation({...settings,dynamicsMode:'phase',particles:1,dynamicsBeta:0},{sampler:constant});
  limited.step(DYNAMICS_MAX_STEPS+1);assert.equal(limited.snapshot().step,DYNAMICS_MAX_STEPS);
  assert.equal(limited.step(100).step,DYNAMICS_MAX_STEPS);
});

test('shifted interference follows the additive complex formula and its derivative',()=>{
  const shift=.3,amplitude=.7,phi=.61,sigma=.2,t=.4;
  const simulation=new DynamicsSimulation({...settings,dynamicsMode:'cancel',dynamicsShift:shift,dynamicsAmplitude:amplitude,dynamicsPhase:phi},{sampler:linear});
  const c={re:amplitude*Math.cos(phi),im:amplitude*Math.sin(phi)},v={re:sigma-shift,im:t};
  const value={re:sigma+shift-(c.re*v.re-c.im*v.im),im:t-(c.re*v.im+c.im*v.re)};
  const derivative={re:1-c.re,im:-c.im},norm=value.re**2+value.im**2;
  const q={re:(derivative.re*value.re+derivative.im*value.im)/norm,im:(derivative.im*value.re-derivative.re*value.im)/norm};
  const sample=simulation.sample(sigma,t);
  close(sample.logAbs,Math.log(magnitude(value)));close(sample.arg,Math.atan2(value.im,value.re));
  close(sample.q.re,q.re);close(sample.q.im,q.im);
  const noSecond=new DynamicsSimulation({...settings,dynamicsMode:'cancel',dynamicsShift:shift,dynamicsAmplitude:0},{sampler:linear});
  assert.deepEqual(noSecond.sample(sigma,t),linear(sigma+shift,t));
  assert.equal(simulation.snapshot().source,'deformed-evaluated-field');
});

test('relative phase sweep changes the interference field and zeros and replays exact phase and trajectories',()=>{
  const config={...settings,dynamicsMode:'cancel',dynamicsShift:.3,dynamicsAmplitude:.7,dynamicsPhase:.61,dynamicsPhaseRate:.4};
  const staticField=new DynamicsSimulation({...config,dynamicsPhaseRate:0},{sampler:linear});
  const beforeStatic=staticField.snapshot(),afterStatic=staticField.step(30);
  assert.deepEqual(afterStatic.field.phase,beforeStatic.field.phase);
  assert.deepEqual(afterStatic.field.logAbs,beforeStatic.field.logAbs);
  assert.deepEqual(afterStatic.zeros,beforeStatic.zeros);
  const moving=new DynamicsSimulation(config,{sampler:linear}),initial=moving.snapshot(),sample=moving.sample(.2,.4);
  const evolved=moving.step(30),current=moving.sample(.2,.4);
  assert.notDeepEqual(evolved.field.phase,initial.field.phase);
  assert.ok(Math.abs(current.logAbs-sample.logAbs)>1e-3,'additive interference changes modulus as well as phase');
  assert.ok(initial.zeros.length&&evolved.zeros.length);
  assert.ok(Math.hypot(initial.zeros[0].sigma-evolved.zeros[0].sigma,initial.zeros[0].t-evolved.zeros[0].t)>.01);
  close(evolved.diagnostics.effectivePhase,config.dynamicsPhase+config.dynamicsPhaseRate*30*DYNAMICS_TIMESTEP,1e-14);
  const replayed=new DynamicsSimulation(config,{sampler:linear});replayed.step(7);replayed.step(23);
  assert.deepEqual(replayed.snapshot().particles,evolved.particles);
  assert.deepEqual(replayed.snapshot().field,evolved.field);assert.deepEqual(replayed.snapshot().zeros,evolved.zeros);
  assert.equal(replayed.snapshot().diagnostics.effectivePhase,evolved.diagnostics.effectivePhase);
});

function massEnergy(field){
  const dx=(field.domain.sigmaMax-field.domain.sigmaMin)/(field.width-1),dy=(field.domain.tMax-field.domain.tMin)/(field.height-1);
  let re=0,im=0,energy=0;
  for(let i=0;i<field.re.length;i++){re+=field.re[i];im+=field.im[i];energy+=field.re[i]**2+field.im[i]**2;}
  return {re:re*dx*dy,im:im*dx*dy,energy:energy*dx*dy};
}
test('reflecting bounded heat conserves complex mass, dissipates energy and reuses its initial samples',()=>{
  let calls=0;
  const simulation=new DynamicsSimulation({...settings,dynamicsMode:'heat',dynamicsBoundary:'reflect',dynamicsDiffusion:.4,
    dynamicsPerturbation:.7,domain:{sigmaMin:0,sigmaMax:1,tMin:0,tMax:1},particles:1},{sampler:()=>{calls++;return constant();}});
  const initial=massEnergy(simulation.snapshot().field),before=calls;
  let previous=initial.energy;
  for(let i=0;i<6;i++){
    const snapshot=simulation.step(4),observed=massEnergy(snapshot.field);
    close(observed.re,initial.re,2e-12);close(observed.im,initial.im,2e-12);
    assert.ok(observed.energy<=previous+1e-12,'stable explicit heat decreases complex L2 energy');previous=observed.energy;
    close(snapshot.diagnostics.massRe,observed.re);close(snapshot.diagnostics.massIm,observed.im);
    close(snapshot.diagnostics.energy,observed.energy);
    assert.ok(snapshot.diagnostics.substeps>1,'stiff grid is explicitly substepped');
    assert.ok([...snapshot.field.re,...snapshot.field.im].every(Number.isFinite));
  }
  assert.ok(previous<initial.energy-1e-5);assert.equal(calls,before,'bounded diffusion does not reevaluate ξ while evolving');
});

test('pinned bounded heat retains each complex boundary value and zero diffusivity freezes the field',()=>{
  const config={...settings,dynamicsMode:'heat',dynamicsBoundary:'pin',dynamicsDiffusion:.3,dynamicsPerturbation:.7,particles:1};
  const simulation=new DynamicsSimulation(config,{sampler:linear}),before=simulation.snapshot().field;
  const after=simulation.step(12).field;
  for(let y=0;y<before.height;y++)for(let x=0;x<before.width;x++){
    if(x&&y&&x<before.width-1&&y<before.height-1)continue;
    const i=y*before.width+x;assert.equal(after.re[i],before.re[i]);assert.equal(after.im[i],before.im[i]);
  }
  const frozen=new DynamicsSimulation({...config,dynamicsDiffusion:0},{sampler:linear}),initial=frozen.snapshot().field;
  const final=frozen.step(12).field;assert.deepEqual(final.re,initial.re);assert.deepEqual(final.im,initial.im);
});

test('coefficient heat satisfies the backward PDE and semigroup for a nontrivial polynomial',()=>{
  const coefficients=polynomialFromRoots([-2.1,-.7,.3,1.4,2.8]),tau=.19,epsilon=1e-5;
  const evolved=polynomialHeat(coefficients,tau),a=polynomialHeat(coefficients,tau-epsilon),b=polynomialHeat(coefficients,tau+epsilon);
  const twice=polynomialHeat(polynomialHeat(coefficients,.07),.12);
  for(let k=0;k<evolved.length;k++){
    close(twice[k],evolved[k],1e-12,'heat has the semigroup law');
    close((b[k]-a[k])/(2*epsilon),-(k+2)*(k+1)*(evolved[k+2]||0),2e-8,'partial tau P equals minus P second derivative');
  }
  for(const z of polynomialRoots(evolved)){
    const p=polynomialEvaluate(evolved,z);assert.ok(magnitude(p.value)<1e-8);assert.ok(z.residual<1e-10);
  }
});

test('analytic cubic passes through the exact triple collision with correct real and imaginary branches',()=>{
  for(const b of [.7,1,1.4]){
    const collision=b*b/6;
    for(const tau of [0,collision,collision+.2]){
      const cubic=cubicHeat(tau,b);close(cubic.collisionTime,collision,0);
      assert.deepEqual(cubic.coefficients,polynomialHeat([0,b*b,0,1],tau));
      for(const root of cubic.roots)close(magnitude(cubic.value(root)),0,2e-15);
      if(tau===collision)assert.ok(cubic.roots.every(z=>magnitude(z)<2e-8));
      else if(tau===0)assert.equal(cubic.roots.filter(z=>Math.abs(z.im)>0).length,2);
      else assert.ok(cubic.roots.every(z=>z.im===0));
    }
  }
});

test('finite trapping drift has reversed heat time and balances unforced pair interactions',()=>{
  const realRoots=[-2,.4,3],coefficients=polynomialFromRoots(realRoots);
  const roots=realRoots.map(z=>({sigma:.5,t:z/2}));
  const velocities=finiteZeroVelocity(roots,{kappa:0,perturbation:0,forcing:0});
  close(velocities.reduce((sum,v)=>sum+v.x,0),0);close(velocities.reduce((sum,v)=>sum+v.y,0),0);
  roots.forEach((root,i)=>{
    const p=polynomialEvaluate(coefficients,realRoots[i]);
    close(velocities[i].x,0);close(velocities[i].y,-.5*p.secondDerivative.re/p.derivative.re);
  });
  const displaced=roots.map((p,i)=>({...p,sigma:p.sigma+.1*(i+1)}));
  const free=finiteZeroVelocity(displaced,{kappa:0}),pinned=finiteZeroVelocity(displaced,{kappa:3});
  for(let i=0;i<roots.length;i++){close(pinned[i].x-free[i].x,-3*(displaced[i].sigma-.5));close(pinned[i].y,free[i].y);}
});

test('snapshots distinguish evaluated fields from finite models and collision roots follow their polynomial',()=>{
  for(const mode of ['phase','relax','walk','cancel','heat','trap','collision']){
    const model=['heat','trap','collision'].includes(mode);
    const simulation=new DynamicsSimulation({...settings,dynamicsMode:mode,particles:1},{sampler:linear});
    assert.equal(simulation.snapshot().model,model,mode);
    assert.equal(simulation.snapshot().meta.kind,simulation.snapshot().source);
    assert.ok(simulation.snapshot().meta.note.length>0);
  }
  const collision=new DynamicsSimulation({...settings,dynamicsMode:'collision'});
  assert.equal(collision.snapshot().diagnostics.offAxisZeros,0);
  const snapshot=collision.step(212),coefficients=cubicHeat(snapshot.diagnostics.tau).coefficients;
  assert.equal(snapshot.diagnostics.offAxisZeros,2);assert.ok(snapshot.model);
  for(const p of snapshot.particles){
    const z={re:2*(p.t-14.134725141734693),im:-2*(p.sigma-.5)};
    close(magnitude(polynomialEvaluate(coefficients,z).value),0,2e-12);
  }
  const actual=new DynamicsSimulation({...settings,dynamicsMode:'phase',domain:undefined,particles:1});
  assert.deepEqual(actual.sample(.6,14.2),evaluatePolar(.6,14.2,'xi',0,true));
  assert.equal(actual.snapshot().source,'evaluated-xi');
});
