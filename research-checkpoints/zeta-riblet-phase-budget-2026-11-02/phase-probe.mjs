// Floating-point diagnostics for a synthetic entire function; not a certificate.
export function runPhaseProbe(){

function simpson(f,a,b,tol=1e-11,depth=24){
 const m=(a+b)/2,fa=f(a),fm=f(m),fb=f(b),S=(b-a)*(fa+4*fm+fb)/6;
 function rec(a,b,fa,fm,fb,S,tol,depth){
 const m=(a+b)/2,l=(a+m)/2,r=(m+b)/2,fl=f(l),fr=f(r);
 const L=(m-a)*(fa+4*fl+fm)/6,R=(b-m)*(fm+4*fr+fb)/6,e=L+R-S;
 if(![fl,fr,L,R,e].every(Number.isFinite)) throw Error('nonfinite quadrature');
 if(Math.abs(e)<=15*tol)return L+R+e/15;
 if(depth===0)throw Error('quadrature depth exhausted');
 return rec(a,m,fa,fl,fm,L,tol/2,depth-1)+rec(m,b,fm,fr,fb,R,tol/2,depth-1);
 }return rec(a,b,fa,fm,fb,S,tol,depth);
}
function reTanh(a,v){const e=Math.exp(-2*a);return (1-e*e)/(1+e*e+2*e*Math.cos(2*v));}
const b=.2,gamma=10,r0=.05;
function regular(x,y,c){
 return c*reTanh(c*x,c*(gamma+y))+
 (x+b)/((x+b)**2+y*y)+
 (x-b)/((x-b)**2+(2*gamma+y)**2)+
 (x+b)/((x+b)**2+(2*gamma+y)**2);
}
function budget(c,q,tol=1e-11){
 const M=c/Math.tanh(c*b/2)+2/(3*b)+2/(2*gamma-r0),eps=q/M,x=b-eps;
 const rstar=Math.sqrt(eps/M-eps*eps),ustar=Math.atan(rstar/eps);
 if(!(eps<b/2&&rstar<r0))throw Error("local domain");
 // Integrate the proved negative part on the certified central interval.
 const integrand=u=>1-eps*regular(x,eps*Math.tan(u),c)/Math.cos(u)**2;
 const mass=simpson(integrand,-ustar,ustar,tol);
 if(!Number.isFinite(mass)) throw Error('nonfinite mass');
 const lower=2*(Math.acos(Math.sqrt(q))-Math.sqrt(q*(1-q)));
 if(mass+5e-10<lower)throw Error('computed central mass below analytic lower bound');
 const A=y=>-eps/(eps*eps+y*y)+regular(x,y,c);
 if(!(A(0)<0))throw Error('central pocket missing');
 function root(sign){let lo=0,hi=r0;while(A(sign*hi)<=0&&hi<1)hi*=2;if(A(sign*hi)<=0)throw Error('root not bracketed');for(let j=0;j<80;j++){const m=(lo+hi)/2;if(A(sign*m)<0)lo=m;else hi=m;}return sign*(lo+hi)/2;}
 const yl=root(-1),yr=root(1);
 const full=simpson(integrand,Math.atan(yl/eps),Math.atan(yr/eps),tol);
 return {c,q,M,epsilon:eps,certified_halfwidth:rstar,computed_central_mass:mass,analytic_lower_bound:lower,computed_full_pocket_mass:full,pocket_width:yr-yl};
}
const rows=[];
for(const c of [1,10,100,1000])for(const q of [.1,.01,.0001])rows.push(budget(c,q));
let maxReplayError=0;for(const row of rows){const v=budget(row.c,row.q,1e-13);maxReplayError=Math.max(maxReplayError,Math.abs(v.computed_full_pocket_mass-row.computed_full_pocket_mass));}
const scan_x=[.05,.1,.15,.25,.4],c=100,xmin=Math.min(...scan_x),C=2*Math.max(...scan_x.filter(x=>x<b).map(x=>1/(b-x)));
const scanLower=c*Math.tanh(c*xmin)-C;
return {rows,maxReplayError,finite_scan_counterexample:{b,gamma,c,scan_x,uniform_all_t_lower_bound:scanLower,bound_expression:"100*tanh(5)-40 > 59",off_line_zeros:"±0.2 ± 10i; all cosh zeros remain on x=0"}};

}

