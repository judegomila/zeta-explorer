import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeViewURL,decodeViewURL} from '../dist/view-url.js';
import {DYNAMICS_DEFAULTS,DYNAMICS_LIMITS,DYNAMICS_TIMESTEP,DynamicsSimulation,normalizeDynamicsConfig} from '../dist/dynamics.js';

const defaults={...DYNAMICS_DEFAULTS,geometry:'plane',function:'xi',projective:false,fiberMode:'off',playing:false,tau:0};
const names={phase:'dynamics',relax:'relaxation',walk:'randomWalk',cancel:'phaseCancel',heat:'boundedHeat',trap:'zeroTrap',collision:'heatCollision'};
const patches={phase:{dynamicsAlpha:0,dynamicsBeta:1},relax:{dynamicsAlpha:.8,dynamicsBeta:0},walk:{dynamicsAlpha:.15,dynamicsBeta:.45,dynamicsDiffusion:.035}};
const presets=Object.fromEntries(Object.entries(names).map(([mode,name])=>[name,{settings:{...defaults,dynamicsMode:mode,...patches[mode]}}]));
const validate=state=>({...state,...normalizeDynamicsConfig(state),playing:false});
const options={defaults,presets,validate};
const origin='https://zeta-view.vercel.app/';
const domain={sigmaMin:-2,sigmaMax:2,tMin:-2,tMax:2};
const sampler=(sigma,t)=>({valid:true,logAbs:.2*sigma,arg:.2*t,q:{re:.2,im:0},derivativeLogAbs:.2*sigma+Math.log(.2)});
function replay(state){
  const simulation=new DynamicsSimulation({...state,domain,gridWidth:12,gridHeight:12,particles:4},{sampler});
  simulation.step(state.dynamicsStep);return simulation.snapshot();
}

test('all dynamics named routes restore their mode with no serialized running clock',()=>{
  for(const [mode,name] of Object.entries(names)){
    const state=presets[name].settings;
    const href=encodeViewURL(origin,{state},{...options,name});
    assert.equal(href,origin+'?view='+name);
    const decoded=decodeViewURL(href,options);
    assert.equal(decoded.valid,true);assert.equal(decoded.session.state.dynamicsMode,mode);
    assert.equal(decoded.session.state.dynamicsStep,0);assert.equal(decoded.session.state.playing,false);
    assert.equal(Object.hasOwn(decoded.session.state,'dynamicsRunning'),false);
  }
});

test('exact dynamics parameters and fixed time survive a URL roundtrip and reproduce the stochastic snapshot',()=>{
  const state={...presets.randomWalk.settings,dynamicsStep:137,dynamicsSeed:4294967295,
    dynamicsAlpha:.2371234567890123,dynamicsBeta:-.4132456789012345,dynamicsDiffusion:.0712345678901234,
    dynamicsPhase:1.2345678901234567,dynamicsPhaseRate:.3712345678901234,dynamicsAmplitude:1.123456789012345,
    dynamicsShift:.3212345678901234,dynamicsPerturbation:.6123456789012345,dynamicsKappa:3.123456789012345,
    dynamicsForcing:.01,dynamicsBoundary:'pin',dynamicsPolynomial:'quartet',dynamicsRate:37,
    dynamicsShowPhase:false,dynamicsShowVelocity:false,dynamicsShowTrails:true,dynamicsShowZeros:false,
    playing:true,dynamicsRunning:true,createdAt:'not part of a simulation',particles:[{sigma:999,t:999}]};
  const href=encodeViewURL(origin,{state,running:true},{...options,name:'randomWalk'});
  const decoded=decodeViewURL(href,options);assert.equal(decoded.valid,true);
  for(const key of Object.keys(DYNAMICS_DEFAULTS))assert.equal(decoded.session.state[key],state[key],key);
  assert.equal(decoded.session.state.playing,false);
  for(const transient of ['dynamicsRunning','createdAt','particles'])assert.equal(Object.hasOwn(decoded.session.state,transient),false);
  const before=replay(state),after=replay(decoded.session.state);
  assert.equal(after.step,137);assert.equal(after.time,137*DYNAMICS_TIMESTEP);
  assert.deepEqual(after.particles,before.particles);assert.deepEqual(after.field,before.field);
  assert.deepEqual(after.diagnostics,before.diagnostics);
  assert.equal(encodeViewURL(href,decoded.session,{...options,name:decoded.name}),href);
});

test('inferred mechanics names follow the selected dynamics mode after substantial slider changes',()=>{
  const walk={...presets.dynamics.settings,dynamicsMode:'walk'};
  const decoded=decodeViewURL(encodeViewURL(origin,{state:walk},options),options);
  assert.equal(decoded.name,'randomWalk');assert.equal(decoded.session.state.dynamicsMode,'walk');
  assert.equal(decoded.session.state.dynamicsAlpha,0);assert.equal(decoded.session.state.dynamicsBeta,1);
});

test('legacy mechanics sessions retain deterministic time while malformed limits stay bounded',()=>{
  const legacyState={...presets.phaseCancel.settings,dynamicsStep:31,dynamicsSeed:93,dynamicsPhase:.41,
    dynamicsPhaseRate:.4,dynamicsForcing:.01,playing:true};
  const href=origin+'#'+new URLSearchParams({view:JSON.stringify({state:legacyState,running:true,createdAt:'old session'})});
  const decoded=decodeViewURL(href,options);
  assert.equal(decoded.valid,true);assert.equal(decoded.source,'legacy');assert.equal(decoded.session.state.playing,false);
  assert.deepEqual(replay(decoded.session.state).particles,replay(legacyState).particles);
  const overrides={dynamicsStep:1e100,dynamicsSeed:-20,dynamicsDiffusion:100,dynamicsAlpha:100,dynamicsForcing:.034,
    dynamicsShowPhase:'false',dynamicsRunning:true};
  const bad=decodeViewURL(origin+'?'+new URLSearchParams({view:'randomWalk',state:JSON.stringify(overrides)}),options);
  assert.equal(bad.valid,true);assert.equal(bad.session.state.dynamicsStep,DYNAMICS_LIMITS.dynamicsStep[1]);
  assert.equal(bad.session.state.dynamicsSeed,0);assert.equal(bad.session.state.dynamicsDiffusion,DYNAMICS_LIMITS.dynamicsDiffusion[1]);
  assert.equal(bad.session.state.dynamicsAlpha,DYNAMICS_LIMITS.dynamicsAlpha[1]);assert.ok([0,.01,.05].includes(bad.session.state.dynamicsForcing));
  assert.equal(bad.session.state.dynamicsShowPhase,true,'wrong-type booleans cannot change the preset');
  assert.equal(Object.hasOwn(bad.session.state,'dynamicsRunning'),false);
});
