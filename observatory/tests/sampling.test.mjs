import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {evaluatePolar,zeta,xi,ZERO_HEIGHTS} from '../dist/math.js';
import {surfacePoint} from '../dist/geometry.js';

// Exercise the actual browser worker, not a separately recreated sampler.
const messages=[];
globalThis.self={postMessage(message){messages.push(message);}};
await import('../dist/sample-worker.js');
const handle=self.onmessage;
let requestId=0;
const defaults={geometry:'sphere',resolution:'standard',function:'zeta',tau:0,extent:'extended',
  chartScale:24,torusR:1.6,bridgeA:.25,colorMode:'phase',ladder:false,packets:false,vortices:false,
  sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38};

function sample(options){
  messages.length=0;
  handle({data:{id:++requestId,state:{...defaults,...options}}});
  const error=messages.find(m=>m.type==='error');assert.equal(error,undefined,error?.stack);
  const complete=messages.find(m=>m.type==='complete');assert.ok(complete,'worker completed');
  return complete.data;
}
function triangleArea(pos,a,b,c){
  const ux=pos[3*b]-pos[3*a],uy=pos[3*b+1]-pos[3*a+1],uz=pos[3*b+2]-pos[3*a+2];
  const vx=pos[3*c]-pos[3*a],vy=pos[3*c+1]-pos[3*a+1],vz=pos[3*c+2]-pos[3*a+2];
  return .5*Math.hypot(uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx);
}
function areaCoverage(data){
  let total=0,covered=0,representedTriangles=0;
  const one=(a,b,c)=>{const area=triangleArea(data.basePositions,a,b,c);total+=area;
    if(data.valid[a]&&data.valid[b]&&data.valid[c]){covered+=area;representedTriangles++;}};
  for(let j=0;j<data.ny;j++)for(let i=0;i<data.nx;i++){
    const a=j*(data.nx+1)+i,b=a+1,c=a+data.nx+1,d=c+1;one(a,c,b);one(b,c,d);
  }
  return {total,covered,fraction:covered/total,representedTriangles};
}
function checkArrays(data,state){
  let valid=0,logOnly=0,tail=0,exactZeros=0;
  for(let j=0;j<=data.ny;j++)for(let i=0;i<=data.nx;i++){
    const k=j*(data.nx+1)+i,u=data.uvs[2*k],v=data.uvs[2*k+1];
    assert.equal(u,data.uAxis[i]);assert.equal(v,data.vAxis[j]);
    if(!data.valid[k]){assert.ok(Number.isNaN(data.logAbs[k]));continue;}
    valid++;if(Math.abs(data.coords[2*k+1])>120)tail++;
    assert.ok(Number.isFinite(data.arg[k]));
    assert.ok(Number.isFinite(data.logAbs[k])||data.logAbs[k]===-Infinity);
    if(data.logAbs[k]===-Infinity)exactZeros++;
    if(!data.rawRepresentable[k]){
      logOnly++;
      assert.ok(data.logAbs[k]<Math.log(Number.MIN_VALUE)||data.logAbs[k]>Math.log(Number.MAX_VALUE));
    }else assert.ok(Number.isFinite(data.values[2*k])&&Number.isFinite(data.values[2*k+1]));
    // Sampling remains tied to the exact surface chart, including its lens.
    if(k%97===0){const p=surfacePoint(u,v,state);assert.equal(data.coords[2*k],p.sigma);assert.equal(data.coords[2*k+1],p.t);}
  }
  assert.equal(valid,data.validCount);assert.equal(logOnly,data.logOnlyCount);
  // Both parameter seams agree in coordinates, scalar validity, and field.
  const seam=(a,b)=>{
    for(let k=0;k<3;k++)assert.equal(data.basePositions[3*a+k],data.basePositions[3*b+k]);
    assert.equal(data.valid[a],data.valid[b]);
    if(data.valid[a]){assert.equal(data.logAbs[a],data.logAbs[b]);assert.equal(data.arg[a],data.arg[b]);}
  };
  for(let j=0;j<=data.ny;j++)seam(j*(data.nx+1),j*(data.nx+1)+data.nx);
  if(state.geometry==='torus')for(let i=0;i<=data.nx;i++)seam(i,data.ny*(data.nx+1)+i);
  return {valid,logOnly,tail,exactZeros};
}

const results=[];
for(const geometry of ['sphere','torus'])for(const kind of ['zeta','xi']){
  test(`${geometry} ${kind}: expanded worker fills missing area with genuine finite-chart samples`,()=>{
    const state={...defaults,geometry,function:kind};
    const core=sample({...state,extent:'core'}),extended=sample({...state,extent:'extended'});
    assert.equal(core.nx,extended.nx);assert.equal(core.ny,extended.ny);
    const c=areaCoverage(core),e=areaCoverage(extended),counts=checkArrays(extended,state);
    assert.ok(e.fraction>.95,`expanded covered area: ${e.fraction}`);
    assert.ok(e.fraction>c.fraction+.05,`area grew: ${c.fraction} -> ${e.fraction}`);
    assert.ok((e.covered-c.covered)/(c.total-c.covered)>.85,'filled most previously missing area');
    assert.ok(counts.tail>0,'actual samples beyond previous t=120 bound');
    assert.ok(extended.maxSampleT>1999&&extended.maxSampleT<=2000,'far finite tail evaluated nearly to the domain boundary');
    if(kind==='xi')assert.ok(counts.logOnly>0,'underflowing raw xi retained in log-polar form');
    // The mathematical punctures are present geometrically, never colored as F(infinity).
    if(geometry==='sphere'){
      for(let i=0;i<=extended.nx;i++)assert.equal(extended.valid[i],0);
    }else{
      for(const [u,v] of [[0,.25],[.5,.75]]){
        const i=[...extended.uAxis].indexOf(u),j=[...extended.vAxis].indexOf(v),k=j*(extended.nx+1)+i;
        assert.equal(extended.valid[k],0);assert.ok(Number.isNaN(extended.logAbs[k]));
      }
    }
    const row={geometry,function:kind,samples:extended.valid.length,
      coreValid:core.validCount,extendedValid:extended.validCount,
      coreAreaFraction:c.fraction,extendedAreaFraction:e.fraction,
      fractionOfMissingAreaFilled:(e.covered-c.covered)/(c.total-c.covered),
      maxSampleT:extended.maxSampleT,tailSamples:counts.tail,logOnlySamples:counts.logOnly,
      coreMilliseconds:Math.round(core.ms),extendedMilliseconds:Math.round(extended.ms)};
    results.push(row);console.log('SAMPLING_EVIDENCE '+JSON.stringify(row));
  });
}

test('plane first zero, pole mask, and unchanged raw values remain correct',()=>{
  const gamma=ZERO_HEIGHTS[0];
  const state={...defaults,geometry:'plane',resolution:'draft',extent:'core',sigmaMin:0,sigmaMax:1,tMin:gamma-1,tMax:gamma+1};
  const data=sample(state);assert.ok(data.validCount>1000);
  for(let k=0;k<data.valid.length;k+=73)if(data.valid[k]){
    const s=data.coords[2*k],t=data.coords[2*k+1],p=evaluatePolar(s,t,'zeta');
    assert.equal(data.values[2*k],p.re);assert.equal(data.values[2*k+1],p.im);
  }
  const z=zeta(.5,gamma);assert.ok(Math.hypot(z.re,z.im)<1e-11);
  const completed=xi(1,0);assert.equal(completed.re,.5);assert.equal(completed.im,0);
  const pole=evaluatePolar(1,0,'zeta');assert.equal(pole.valid,false);assert.equal(pole.status,'pole');
  const poleWindow=sample({...state,sigmaMin:0,sigmaMax:2,tMin:-1,tMax:1});
  const i=poleWindow.nx/2,j=poleWindow.ny/2,k=j*(poleWindow.nx+1)+i;
  assert.equal(poleWindow.coords[2*k],1);assert.equal(poleWindow.coords[2*k+1],0);
  assert.equal(poleWindow.valid[k],0);assert.ok(Number.isNaN(poleWindow.logAbs[k]));
  assert.ok(poleWindow.zeroPoints.some(p=>p.kind==='pole'&&p.sigma===1&&p.t===0));
});

test('worker retains independent far-tail fixtures through raw overflow and underflow',()=>{
  // These fixtures were generated independently with mpmath at 90 decimal digits.
  const reference=JSON.parse(readFileSync(new URL('./math-extended-reference.json',import.meta.url))).points;
  for(const sigma of [.5,-128])for(const kind of ['zeta','xi']){
    const expected=reference.find(p=>p.sigma===sigma&&p.t===2000)[kind];
    const data=sample({geometry:'plane',resolution:'draft',function:kind,extent:'extended',
      sigmaMin:sigma,sigmaMax:sigma+1,tMin:1998,tMax:2000});
    const k=data.ny*(data.nx+1); // Top-left vertex is the exact reference point.
    assert.equal(data.coords[2*k],sigma);assert.equal(data.coords[2*k+1],2000);
    assert.equal(data.valid[k],1);
    assert.ok(Math.abs(data.logAbs[k]-expected.logAbs)<2e-10,`${kind} log magnitude at ${sigma}+2000i`);
    assert.ok(Math.abs(Math.atan2(Math.sin(data.arg[k]-expected.arg),Math.cos(data.arg[k]-expected.arg)))<2e-10,
      `${kind} phase at ${sigma}+2000i`);
    if(kind==='xi'||sigma===-128)assert.equal(data.rawRepresentable[k],0);
  }
});
