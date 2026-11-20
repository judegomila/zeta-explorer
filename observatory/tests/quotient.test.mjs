import test from 'node:test';
import assert from 'node:assert/strict';
import {torusPoint,torusCriticalPoint} from '../dist/elliptic.js';
import {quotientInvolution,quotientCoordinates,quotientPoint,quotientInverse,quotientLandmarks} from '../dist/quotient.js';
import {embedded,surfacePoint,inversePoint,liftPoint,criticalCurves,criticalCurvePoint,sampleAxes} from '../dist/geometry.js';
import {computeCriticalSamples,computeLandmarkValues} from '../dist/critical-samples.js';
import {sampleField} from '../dist/sampler.js';
import {evaluatePolar} from '../dist/math.js';
import {domainFor} from '../dist/domain.js';
import {fieldKey,FIELD_CACHE_VERSION} from '../dist/field-cache.js';
import {CanvasZetaScene} from '../dist/canvas-renderer.js';
import {ZetaScene} from '../dist/renderer.js';
import * as THREE from '../dist/vendor/three.module.js';

const near=(a,b,tol=2e-10)=>assert.ok(Math.abs(a-b)<=tol*(1+Math.abs(b)),`${a} differs from ${b}`);
const nearC=(a,b,tol)=>{near(a.re,b.re,tol);near(a.im,b.im,tol);};
const conj=z=>({re:z.re,im:-z.im});
const mul=(a,b)=>({re:a.re*b.re-a.im*b.im,im:a.re*b.im+a.im*b.re});
const div=(a,b)=>({re:(a.re*b.re+a.im*b.im)/(b.re*b.re+b.im*b.im),im:(a.im*b.re-a.re*b.im)/(b.re*b.re+b.im*b.im)});
const wrappedDistance=(a,b)=>Math.min(Math.abs(a-b),1-Math.abs(a-b));
const state={geometry:'klein',projective:true,function:'xi',tau:0,extent:'extended',resolution:'draft',torusR:1.6,chartScale:24,
  colorMode:'phase',heightMode:'flat',height:0,bridgeA:.25,ladder:false,packets:false,vortices:false};

test('cover involutions agree with their algebraic w and eta formulas and have the correct fixed loci',()=>{
  for(const geometry of ['klein','annulus'])for(const r of [1.1,1.6,2,4]){
    for(const [u,v]of[[.13,.16],[.72,.36],[.38,.89],[.04,.6],[.5,.25],[0,.75]]){
      const source=torusPoint(u,v,{r}),uv=quotientInvolution(u,v,geometry),p=torusPoint(uv.u,uv.v,{r});
      nearC(p.w,div({re:1,im:0},conj(source.w)));
      const eta=div(conj(source.eta),mul(conj(source.w),conj(source.w))),sign=geometry==='klein'?-1:1;
      nearC(p.eta,{re:sign*eta.re,im:sign*eta.im});
      near(p.sigma,1-source.sigma);near(p.t,source.t);
      const twice=quotientInvolution(uv.u,uv.v,geometry);near(wrappedDistance(twice.u,u),0);near(wrappedDistance(twice.v,v),0);
      if(geometry==='klein')near(wrappedDistance(uv.v,v),.5);
    }
    if(geometry==='annulus')for(const v of [.25,.75])for(const u of [0,.13,.5,.77]){
      const p=quotientInvolution(u,v,geometry);near(p.u,u);near(p.v,v);
    }
  }
});

test('both orbit representatives fold consistently, including Klein corners and opposite edges',()=>{
  for(const geometry of ['klein','annulus'])for(const [u,v]of[[0,0],[.13,.12],[.71,.82],[.22,.49],[.19,.25],[.31,.75]]){
    const a=quotientCoordinates(u,v,geometry),companion=quotientInvolution(u,v,geometry),b=quotientCoordinates(companion.u,companion.v,geometry);
    near(wrappedDistance(a.u,b.u),0);near(a.v,b.v);
    assert.ok(a.v>=0&&a.v<=1);assert.ok(a.coverV>=.25&&a.coverV<=.75);
    if(v!==.25&&v!==.75)assert.notEqual(a.conjugated,b.conjugated);
  }
  const a=quotientCoordinates(0,.25,'klein'),b=quotientCoordinates(.5,.75,'klein');
  assert.equal(a.u,b.u);assert.equal(a.v,b.v);
  const annulus=quotientCoordinates(.5,.75,'annulus');assert.equal(annulus.v,1);
});

test('Klein immersion obeys exact reversed seam gluing while its normal reverses',()=>{
  for(const u of [0,.03,.13,.25,.5,.75,.88,1]){
    const top=embedded(u,1,'klein'),bottom=embedded(.5-u,0,'klein');
    top.position.forEach((x,k)=>near(x,bottom.position[k],1e-13));
    top.normal.forEach((x,k)=>near(x,-bottom.normal[k],1e-13));
    for(const v of [0,.23,.5,.9,1]){
      const periodic=embedded(u+1,v,'klein'),p=embedded(u,v,'klein');
      p.position.forEach((x,k)=>near(x,periodic.position[k],1e-13));near(Math.hypot(...p.normal),1);
    }
  }
  // These images cross in R³ but remain distinct intrinsic points.
  const a=embedded(.25,0,'klein'),b=embedded(.75,0,'klein');
  a.position.forEach((x,k)=>near(x,b.position[k]));
  assert.notEqual(quotientCoordinates(.25,.25).u,quotientCoordinates(.75,.25).u);
  for(const u of [0,.25,.5,.75])assert.ok(Math.hypot(...embedded(u,0,'annulus').position.map((x,k)=>x-embedded(u,1,'annulus').position[k]))>5);
});

test('quotient samples use the exact half-torus pullback and chain-rule Jacobian',()=>{
  for(const r of [1.2,2,3])for(const scale of [1,24])for(const [u,v]of[[.14,.18],[.34,.66],[.78,.86],[.0002,.004]]){
    const p=quotientPoint(u,v,{r,scale}),cover=torusPoint(u,.25+v/2,{r,scale});
    near(p.sigma,cover.sigma);near(p.t,cover.t);nearC(p.dsdu,cover.dsdu);
    nearC(p.dsdv,{re:cover.dsdv.re/2,im:cover.dsdv.im/2});
    const h=1e-7,plus=quotientPoint(u,v+h,{r,scale}),minus=quotientPoint(u,v-h,{r,scale});
    near(p.dsdv.re,(plus.sigma-minus.sigma)/(2*h),2e-6);near(p.dsdv.im,(plus.t-minus.t)/(2*h),2e-6);
  }
  for(const q of [.001,.1,.25,.5,.9,.999])for(const oval of [0,1]){
    const cover=torusCriticalPoint(q,oval),p=quotientPoint(cover.u,oval);
    assert.equal(p.sigma,.5);near(p.t,cover.t);
  }
});

test('quotient inverse retains reflection provenance and merges only the identified critical lifts',()=>{
  for(const geometry of ['klein','annulus'])for(const chartScale of [1,24,72]){
    const s={...state,geometry,chartScale};
    for(const [sigma,t]of[[.5,0],[.5,14.1347251417],[.5,-1999.8],[.6,17],[.4,-17],[-128,2000],[129,-2000],[0,0],[1,0]]){
      const roots=inversePoint(sigma,t,s);assert.equal(roots.length,sigma===.5&&geometry==='klein'?1:2);
      for(const uv of roots){
        const p=surfacePoint(uv.u,uv.v,s);assert.ok(p.valid);
        near(p.sigma,sigma<.5?1-sigma:sigma,2e-8);near(p.t,t,2e-9);
        assert.equal(uv.sourceSigma,sigma);assert.equal(uv.sourceT,t);
        if(sigma!==.5)assert.equal(uv.conjugated,sigma<.5);
      }
    }
  }
  // A finite off-line point must not be snapped onto the critical curve.
  for(const geometry of ['klein','annulus']){
    const roots=quotientInverse(.50001,1999.8,{geometry});assert.equal(roots.length,2);
    assert.ok(roots.every(p=>p.v>0&&p.v<1));
  }
});

test('completed xi and heat fields conjugate between cover lifts, with an odd imaginary component',()=>{
  for(const geometry of ['klein','annulus'])for(const [kind,tau]of[['xi',0],['heat',.2],['heat',-.2]]){
    for(const [sigma,t]of[[.8,12.4],[2.3,-9],[.51,17.1]]){
      const [uv]=quotientInverse(sigma,t,{geometry}),a=torusPoint(uv.sourceU,uv.sourceV);
      const companion=quotientInvolution(uv.sourceU,uv.sourceV,geometry),b=torusPoint(companion.u,companion.v);
      const f=evaluatePolar(a.sigma,a.t,kind,tau),g=evaluatePolar(b.sigma,b.t,kind,tau);
      assert.ok(f.valid&&g.valid);near(f.logAbs,g.logAbs,2e-8);
      near(Math.sin(f.arg),-Math.sin(g.arg),2e-8);near(Math.cos(f.arg),Math.cos(g.arg),2e-8);
    }
  }
});

test('critical topology and puncture masking agree: one Klein circle and two annulus boundaries',()=>{
  for(const geometry of ['klein','annulus']){
    const s={...state,geometry},n=geometry==='klein'?1:2,curves=criticalCurves(s,{segments:32}),lm=quotientLandmarks(geometry);
    assert.equal(curves.length,n);assert.equal(lm.punctures.length,n);assert.equal(lm.antiBridge.length,n);assert.equal(lm.branches.length,2);
    for(const curve of curves){
      assert.ok(curve.closed);assert.ok(curve.points[0].puncture);assert.ok(curve.points.at(-1).puncture);
      for(const p of curve.points)assert.equal(p.sigma,.5);
      near(criticalCurvePoint(.5,curve.index,s).t,0);
    }
    const markers=computeLandmarkValues(s,domainFor(s));
    for(const p of markers.filter(x=>x.kind==='puncture')){assert.equal(p.computed,false);assert.equal(p.polar,null);assert.ok(p.puncture);}
    for(const p of markers.filter(x=>x.kind==='anti')){assert.ok(p.computed);assert.ok(p.polar.logAbs>-Infinity);near(p.sigma,.5);near(p.t,0);}
    for(const p of markers.filter(x=>x.kind==='chart')){assert.ok(p.computed);assert.equal(p.puncture,false);}
    const traces=computeCriticalSamples(s,domainFor(s),sampleAxes(s));assert.equal(traces.length,n);
    for(const trace of traces){
      assert.equal(trace[0].computed,false);assert.equal(trace.at(-1).computed,false);
      for(const t of [-1999.8,-1000,1000,1999.8])assert.ok(trace.some(p=>p.computed&&Math.abs(p.t-t)<1e-4));
    }
  }
});

test('new cache namespaces preserve prior field keys and reject raw-zeta quotient fields',()=>{
  const previous=JSON.stringify([FIELD_CACHE_VERSION,'torus','xi',null,'extended','draft',[24,1.6],false,false,false,null,['projective-atlas-v1',1.6]]);
  assert.equal(fieldKey({...state,geometry:'torus'}),previous);
  for(const geometry of ['klein','annulus']){
    const s={...state,geometry},key=fieldKey(s);assert.ok(key.includes('real-quotient-v1'));
    assert.notEqual(key,fieldKey({...s,torusR:2}));assert.notEqual(key,fieldKey({...s,chartScale:1}));
    assert.notEqual(key,fieldKey({...s,geometry:geometry==='klein'?'annulus':'klein'}));
    assert.throws(()=>sampleField({...s,function:'zeta'}),/completed xi or heat/);
    assert.throws(()=>fieldKey({...s,function:'zeta'}),/completed xi or heat/);
  }
});

test('both renderers put reflected annulus probes on the representative imaginary relief',()=>{
  for(const geometry of ['annulus','torus'])for(const sigma of [.3,.7]){
    const s={...state,geometry,heightMode:'imag',height:1},t=12.4,polar=evaluatePolar(sigma,t,'xi',0);
    const sample={sigma,t,polar,lifts:liftPoint(sigma,t,s)};assert.equal(sample.lifts.length,2);
    for(const Renderer of [CanvasZetaScene,ZetaScene]){
      const renderer=Object.create(Renderer.prototype);
      Object.assign(renderer,{state:s,renderer:{},data:{domain:domainFor(s)},logReference:polar.logAbs,
        probeGroup:new THREE.Group(),visibleTriangle:()=>true});
      renderer.drawProbe(sample);
      const points=Renderer===CanvasZetaScene?renderer.probes.map(p=>p.point):renderer.probeGroup.children.map(p=>p.position.toArray());
      assert.equal(points.length,sample.lifts.length);
      sample.lifts.forEach((lift,i)=>{
        const represented=surfacePoint(lift.u,lift.v,s),local=evaluatePolar(represented.sigma,represented.t,'xi',0);
        const h=renderer.heightPolar(local.logAbs,local.arg),offset=Renderer===CanvasZetaScene?.08:.065;
        if(geometry==='annulus'&&sigma<.5){
          assert.equal(lift.conjugated,true);assert.ok(Math.abs(h)>.01,'the test exercises nonzero imaginary relief');
          near(h,-renderer.heightPolar(polar.logAbs,polar.arg));
        }
        points[i].forEach((x,k)=>near(x,lift.position[k]+lift.normal[k]*(h+offset)));
      });
    }
  }
});

test('sampled quotient payloads retain actual UV picking, critical markers and unvalued punctures',()=>{
  for(const geometry of ['klein','annulus']){
    const s={...state,geometry,extent:'core',vortices:true},d=sampleField(s),n=geometry==='klein'?1:2;
    assert.equal(d.criticalSamples.length,n);assert.equal(d.landmarkValues.filter(x=>x.kind==='puncture').length,n);
    assert.ok(d.validCount>1000);assert.ok(d.zeroPoints.length>0);assert.ok(d.flowLines.length>0);
    for(let k=0;k<d.valid.length;k+=113){
      const p=surfacePoint(d.uvs[2*k],d.uvs[2*k+1],s);
      if(d.valid[k]){near(d.coords[2*k],p.sigma);near(d.coords[2*k+1],p.t);}
      d.basePositions.slice(3*k,3*k+3).forEach((x,j)=>near(x,p.position[j],1e-7));
    }
    const p0=0,p1=d.ny*(d.nx+1)+Array.from(d.uAxis).findIndex(x=>x===.5);
    for(const k of [p0,p1]){assert.equal(d.valid[k],0);assert.ok(Number.isNaN(d.logAbs[k]));assert.ok(Number.isNaN(d.arg[k]));}
    const heights=new Set(d.zeroPoints.map(p=>p.t));assert.equal(d.zeroPoints.length,heights.size*n);
    for(const Renderer of [CanvasZetaScene,ZetaScene]){
      const renderer=Object.create(Renderer.prototype);renderer.state={...s,height:2,heightMode:'log'};renderer.logReference=0;
      if(geometry==='klein')for(const mode of ['log','real','imag','abs']){renderer.state.heightMode=mode;assert.equal(renderer.heightPolar(2,.7),0);}
      else assert.ok(renderer.heightPolar(2,.7)>0);
    }
    const renderState={...s,heightMode:'log',height:.8,critical:true,seams:true,playing:true,contours:true,zeros:false,opacity:.98};
    const original=structuredClone(d),cpu=Object.create(CanvasZetaScene.prototype),statuses=[];
    Object.assign(cpu,{state:{},width:900,heightPixels:650,onStatus:x=>statuses.push(x)});
    cpu.setData(d,renderState);assert.ok(cpu.faces.length>0);assert.equal(cpu.criticalSamples(),d.criticalSamples);
    const faces=cpu.faces;cpu.setData(d,renderState);assert.equal(cpu.faces,faces);assert.equal(statuses.at(-1).preparedCacheHit,true);
    const gpu=Object.create(ZetaScene.prototype);
    Object.assign(gpu,{state:{},renderer:{},surfaceGroup:new THREE.Group(),overlayGroup:new THREE.Group(),guideGroup:new THREE.Group(),probeGroup:new THREE.Group(),controls:{},
      buildGuides(){},addZero(){},resetCamera(){},onStatus:x=>statuses.push(x)});
    gpu.setData(d,renderState);assert.ok(gpu.indices.length>0);assert.equal(gpu.criticalSamples(),d.criticalSamples);
    assert.ok([...gpu.raised].every(Number.isFinite));
    if(geometry==='klein')assert.deepEqual(gpu.raised,d.basePositions,'nonzero imported relief cannot tear the Klein seam');
    const mesh=gpu.surface.geometry;gpu.setData(d,renderState);assert.equal(gpu.surface.geometry,mesh);
    assert.deepEqual(d,original,'renderers leave the cached local-lift samples immutable');
  }
});
