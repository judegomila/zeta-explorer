import test from 'node:test';
import assert from 'node:assert/strict';
import {homogeneousSphere,pairSphereFromPolar} from '../dist/projective.js';
import {normalizeSpinor,hopfMap,su2Rotation,spinorFromProjective,spinorFrame} from '../dist/spinor.js';

const C=(re=0,im=0)=>({re,im});
const near=(a,b,t=2e-13)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
const nearC=(a,b)=>{near(a.re,b.re);near(a.im,b.im);};
const nearV=(a,b)=>{near(a.x,b.x);near(a.y,b.y);near(a.z,b.z);};
const dot=(a,b)=>a.x*b.x+a.y*b.y+a.z*b.z;
const cross=(a,b)=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});

test('spinor uses the exact CP1 Hopf map through huge values and log underflow',()=>{
  const huge=homogeneousSphere(C(1e308),C(0,1e308));
  nearV(normalizeSpinor(huge).bloch,{x:0,y:1,z:0});
  const pair=pairSphereFromPolar({valid:true,logAbs:-1400,arg:.6},{valid:true,logAbs:-1400,arg:1.2});
  nearV(hopfMap(pair).bloch,pair.sphere);
  assert.equal(normalizeSpinor([C(),C()]).valid,false);
  nearV(normalizeSpinor([C(1),C()]).bloch,{x:0,y:0,z:1});
  nearV(normalizeSpinor([C(),C(1)]).bloch,{x:0,y:0,z:-1});
});

test('common phase moves Hopf fiber while leaving Bloch base fixed',()=>{
  const pair=homogeneousSphere(C(2,-1),C(.3,1.1)),phase=.73;
  const p=spinorFromProjective(pair,{phase});
  nearV(p.bloch,pair.sphere);nearC(p.overlap,C(Math.cos(phase),Math.sin(phase)));
  nearC(p.rotationOverlap,C(1));
});

test('SU2 physical rotations have the correct Pauli and Rodrigues orientations',()=>{
  const north=homogeneousSphere(C(1),C());
  nearV(spinorFromProjective(north,{axis:'x',angle:Math.PI/2}).bloch,{x:0,y:-1,z:0});
  nearV(spinorFromProjective(north,{axis:'y',angle:Math.PI/2}).bloch,{x:1,y:0,z:0});
  const pair=homogeneousSphere(C(.4,-.1),C(-.2,.8)),axis={x:1,y:2,z:3},angle=.91;
  const r=su2Rotation(axis,angle),n=r.axis,v=pair.sphere,c=Math.cos(angle),s=Math.sin(angle),k=cross(n,v),d=dot(n,v);
  const expected={x:c*v.x+s*k.x+(1-c)*d*n.x,y:c*v.y+s*k.y+(1-c)*d*n.y,z:c*v.z+s*k.z+(1-c)*d*n.z};
  nearV(spinorFromProjective(pair,{axis,angle}).bloch,expected);
});

test('2pi returns the Bloch point but flips the spinor, and 4pi returns both',()=>{
  const pair=homogeneousSphere(C(2,1),C(-1,.5));
  for(const axis of ['x','y','z',{x:1,y:-2,z:4}]){
    const half=spinorFromProjective(pair,{axis,angle:2*Math.PI}),full=spinorFromProjective(pair,{axis,angle:4*Math.PI});
    nearV(half.bloch,pair.sphere);nearV(full.bloch,pair.sphere);
    nearC(half.overlap,C(-1));nearC(full.overlap,C(1));
    for(let i=0;i<2;i++){
      nearC(half.amplitudes[i],C(-pair.homogeneous[i].re,-pair.homogeneous[i].im));
      nearC(full.amplitudes[i],pair.homogeneous[i]);
    }
  }
});

test('spin frame is orthonormal and oriented with Bloch normal',()=>{
  const pair=homogeneousSphere(C(.7,.2),C(-.4,.5));
  const {e1,e2,n}=spinorFrame(pair);
  for(const v of [e1,e2,n])near(dot(v,v),1);
  near(dot(e1,e2),0);near(dot(e1,n),0);near(dot(e2,n),0);nearV(cross(e1,e2),n);
  assert.equal(spinorFromProjective(pair,{axis:{x:0,y:0,z:0}}).valid,false);
  assert.equal(spinorFromProjective(pair,{phase:NaN}).valid,false);
});
