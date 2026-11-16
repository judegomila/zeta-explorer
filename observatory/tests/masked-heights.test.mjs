import test from 'node:test';
import assert from 'node:assert/strict';
import { continueMaskedHeights } from '../dist/geometry.js';
import { sampleField } from '../dist/sampler.js';

const grid=(nx,ny,fn)=>{
  const heights=new Float64Array((nx+1)*(ny+1)),valid=new Uint8Array((nx+1)*(ny+1));
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){const [h,ok]=fn(i%nx,j,i,j);heights[j*(nx+1)+i]=h;valid[j*(nx+1)+i]=ok?1:0;}
  return {heights,valid};
};

test('evaluated heights are returned unchanged',()=>{
  const {heights,valid}=grid(12,10,(i,j)=>[Math.sin(i)+j,!(i<3&&j>3&&j<7)]);
  const out=continueMaskedHeights(heights,valid,12,10,'torus');
  valid.forEach((ok,k)=>{if(ok)assert.equal(out[k],heights[k]);});
});

test('a masked patch on a constant relief is filled level, not cratered',()=>{
  const {heights,valid}=grid(16,16,(i,j)=>{const ok=Math.hypot(i-8,j-8)>3;return [ok?.4:0,ok];});
  const out=continueMaskedHeights(heights,valid,16,16,'torus');
  for(const h of out)assert.ok(Math.abs(h-.4)<1e-12);
});

test('filled heights stay within the range of the evaluated rim',()=>{
  const {heights,valid}=grid(24,20,(i,j)=>{const ok=Math.hypot(i-12,j-10)>4;return [ok?i/24:0,ok];});
  const out=continueMaskedHeights(heights,valid,24,20,'sphere');
  valid.forEach((ok,k)=>{if(!ok)assert.ok(out[k]>.2&&out[k]<.8,`fill ${out[k]}`);});
});

test('a patch straddling both torus seams is filled identically on duplicates',()=>{
  const nx=16,ny=12;
  const {heights,valid}=grid(nx,ny,(i,j)=>{
    const jj=j%ny,di=Math.min(i,nx-i),dj=Math.min(jj,ny-jj),ok=Math.hypot(di,dj)>2.5;
    return [ok?1+.1*Math.cos(i)+.1*Math.sin(jj):0,ok];
  });
  const out=continueMaskedHeights(heights,valid,nx,ny,'torus');
  for(let j=0;j<=ny;j++)assert.equal(out[j*(nx+1)],out[j*(nx+1)+nx]);
  for(let i=0;i<=nx;i++)assert.equal(out[i],out[ny*(nx+1)+i]);
  assert.ok(out[0]>.7&&out[0]<1.3);
});

test('a masked sphere pole row receives one common height',()=>{
  const {heights,valid}=grid(16,10,(i,j)=>[j>1?.3+.05*Math.cos(i):0,j>1]);
  const out=continueMaskedHeights(heights,valid,16,10,'sphere');
  for(let i=1;i<=16;i++)assert.equal(out[i],out[0]);
});

test('plane fields and fully masked fields are left flat',()=>{
  const {heights,valid}=grid(8,8,(i,j)=>[i>2?1:0,i>2]);
  assert.deepEqual(continueMaskedHeights(heights,valid,8,8,'plane'),heights);
  const none=continueMaskedHeights(new Float64Array(81).fill(NaN),new Uint8Array(81),8,8,'torus');
  for(const h of none)assert.equal(h,0);
});

test('the torus field keeps its infinity samples masked while the cap is continuous',()=>{
  const data=sampleField({geometry:'torus',function:'zeta',tau:0,torusR:1.6,chartScale:24,resolution:'draft',colorMode:'phase',bridgeA:.25});
  const masked=data.valid.reduce((n,ok)=>n+(ok?0:1),0);
  assert.ok(masked>0,'the neighbourhood of s=infinity is still unevaluated');
  const heights=Float64Array.from(data.valid,(ok,i)=>ok?Math.min(2.5,Math.log1p(Math.exp(data.logAbs[i]))/Math.LN2):0);
  const out=continueMaskedHeights(heights,data.valid,data.nx,data.ny,'torus');
  let worst=0;
  for(let j=0;j<=data.ny;j++)for(let i=0;i<data.nx;i++){
    const a=j*(data.nx+1)+i,b=a+1;
    if(data.valid[a]!==data.valid[b])worst=Math.max(worst,Math.abs(out[a]-out[b]));
  }
  // Before the fix every rim edge on the raised side dropped the full 2.5.
  assert.ok(worst<1.5,`rim step ${worst}`);
});

test('quotient geometries are not continued across their seams',()=>{
  const {heights,valid}=grid(8,8,(i,j)=>[i>2?1:0,i>2]);
  for(const geometry of ['klein','annulus'])assert.deepEqual(continueMaskedHeights(heights,valid,8,8,geometry),heights);
});
