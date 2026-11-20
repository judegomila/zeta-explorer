/**
 * Complete zero count to a finite height, by the classical comparison.
 *
 * Strip count (argument principle, Backlund form). For T not an ordinate,
 *   N(T) = 1 + theta(T)/pi + S(T),   S(T) = (1/pi) arg zeta(1/2 + iT),
 * with the argument continued from 2 along 2 -> 2+iT -> 1/2+iT. N(T) counts
 * EVERY zero with 0 < Im s < T in the critical strip, on the line or not.
 *
 * Line count. Sign changes of the real Hardy function Z(t) on (0,T) give a
 * lower bound for zeros ON the critical line.
 *
 * If the two agree, every zero below T is on the line and simple.
 *
 * Scope: double-precision floating point with adaptive steps, not interval
 * arithmetic. It is a reproducible numerical verification to height T, not
 * a certificate, and says nothing above T.
 */
import { logGamma, zeta, hardyZ } from './math.js';

const LOGPI=Math.log(Math.PI);
export const thetaRS=t=>logGamma(.25,t/2).im-t*LOGPI/2;

/** Continuous variation of arg zeta along a straight segment. */
function variation(from,to,{initialSteps=64,maxDepth=40}={}){
  const at=x=>{const z=zeta(from[0]+(to[0]-from[0])*x,from[1]+(to[1]-from[1])*x);return Math.atan2(z.im,z.re);};
  const wrap=d=>d-2*Math.PI*Math.round(d/(2*Math.PI));
  let total=0,resolved=true;
  const walk=(x0,a0,x1,a1,depth)=>{
    const d=wrap(a1-a0);
    // Accept a step only when the phase moves by well under a half turn.
    if(Math.abs(d)<.5||depth>=maxDepth){if(Math.abs(d)>=.5)resolved=false;total+=d;return;}
    const xm=(x0+x1)/2,am=at(xm);walk(x0,a0,xm,am,depth+1);walk(xm,am,x1,a1,depth+1);
  };
  let x0=0,a0=at(0);
  for(let i=1;i<=initialSteps;i++){const x1=i/initialSteps,a1=at(x1);walk(x0,a0,x1,a1,0);x0=x1;a0=a1;}
  return {total,resolved};
}

/** Every zero with 0 < Im s < T in the critical strip. */
export function stripZeroCount(T){
  if(!(T>1&&T<=2000))throw new RangeError('Height must satisfy 1 < T <= 2000.');
  const steps=Math.max(64,Math.ceil(4*T));
  const up=variation([2,0],[2,T],{initialSteps:steps}),across=variation([2,T],[.5,T],{initialSteps:256});
  // arg zeta(2) = 0, so the continued argument is the summed variation.
  const S=(up.total+across.total)/Math.PI,raw=1+thetaRS(T)/Math.PI+S,count=Math.round(raw);
  return {T,count,raw,S,residual:Math.abs(raw-count),resolved:up.resolved&&across.resolved&&Math.abs(raw-count)<.05};
}

/** Sign changes of Hardy Z on (0,T): zeros found on the critical line. */
export function lineZeroCount(T,{step=.02}={}){
  if(!(T>1&&T<=2000))throw new RangeError('Height must satisfy 1 < T <= 2000.');
  const n=Math.ceil(T/step);let count=0,last=hardyZ(step/2),exactZero=false;
  for(let i=1;i<=n;i++){
    const t=Math.min(T,step/2+i*step*(T-step/2)/(n*step)),z=hardyZ(t);
    if(z===0||!Number.isFinite(z)){exactZero=true;continue;}
    if(z*last<0)count++;
    last=z;
  }
  return {T,count,step,resolved:!exactZero};
}

/** The comparison. `complete` is true only when both counts are resolved and equal. */
export function completeZeroCount(T,options={}){
  const strip=stripZeroCount(T),line=lineZeroCount(T,options);
  const resolved=strip.resolved&&line.resolved;
  return {T,strip:strip.count,line:line.count,S:strip.S,residual:strip.residual,resolved,
    complete:resolved&&strip.count===line.count,
    scope:'floating-point verification to height T; not interval-certified'};
}
