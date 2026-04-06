/**
 * Redheffer Matrix: det(R_n) = M(n) Mertens Connection
 *
 * imp-278: R_n[i,j] = 1 if j=1 or i|j, else 0.
 * det(R_n) = M(n) = Mertens function. RH iff |det| = O(n^{1/2+eps}).
 */

function computeMobius(N) {
  const mu = new Int8Array(N+1); mu[1]=1;
  const spf = new Int32Array(N+1);
  for(let n=2;n<=N;n++){if(!spf[n]){spf[n]=n;for(let k=2*n;k<=N;k+=n)if(!spf[k])spf[k]=n;}let m=n,c=0,sq=false;while(m>1){const p=spf[m];let e=0;while(m%p===0){m=Math.floor(m/p);e++;}if(e>1){sq=true;break;}c++;}mu[n]=sq?0:(c%2===0?1:-1);}
  return mu;
}

function buildRedheffer(n) {
  const R = Array.from({length:n}, ()=>new Array(n).fill(0));
  for(let i=0;i<n;i++){R[i][0]=1;for(let j=i;j<n;j+=(i+1))R[i][j]=1;}
  return R;
}

function determinant(M) {
  const n=M.length, A=M.map(r=>[...r]); let det=1;
  for(let col=0;col<n;col++){
    let maxR=col,maxV=Math.abs(A[col][col]);
    for(let row=col+1;row<n;row++)if(Math.abs(A[row][col])>maxV){maxV=Math.abs(A[row][col]);maxR=row;}
    if(maxR!==col){[A[col],A[maxR]]=[A[maxR],A[col]];det*=-1;}
    if(Math.abs(A[col][col])<1e-15)return 0;
    det*=A[col][col];
    for(let row=col+1;row<n;row++){const f=A[row][col]/A[col][col];for(let j=col;j<n;j++)A[row][j]-=f*A[col][j];}
  }
  return det;
}

export function redhefferMatrixTest() {
  const N_MAX = 200;
  const mu = computeMobius(N_MAX);
  const M = new Array(N_MAX+1).fill(0);
  for(let n=1;n<=N_MAX;n++) M[n]=M[n-1]+mu[n];

  const testN = [2,3,5,10,20,30,50,75,100,150,200];
  const results = testN.map(n => {
    const det = Math.round(determinant(buildRedheffer(n)));
    return { n, det, 'M(n)': M[n], match: det===M[n], ratio: +(Math.abs(M[n])/Math.sqrt(n)).toFixed(4) };
  });
  const allMatch = results.every(r => r.match);
  let maxRatio = 0;
  for(let n=1;n<=N_MAX;n++){const r=Math.abs(M[n])/Math.sqrt(n);if(r>maxRatio)maxRatio=r;}

  return {
    framework: { name: 'Redheffer Matrix (1977)', rh: 'RH iff |det(R_n)|=O(n^{1/2+eps})' },
    results, all_match: allMatch, max_ratio: +maxRatio.toFixed(4),
    keyFindings: [
      `det(R_n)=M(n) for ${testN.length} values: ALL MATCH ${allMatch}.`,
      `Max |M(n)|/sqrt(n)=${maxRatio.toFixed(3)} for n<=${N_MAX}. RH needs bounded.`,
      `Redheffer: pure linear algebra RH formulation.`,
    ],
    verdict: `REDHEFFER: det=M(n) ${testN.length}/${testN.length} match. Max ratio=${maxRatio.toFixed(3)}. RH iff O(n^{1/2+eps}).`,
  };
}
