# REFEREE.md for c11-rs1-twist-modulus-reciprocity

Independent adversarial referee (lens: general), 2026-11-19. This replaces the author's second pass as the referee file; the author's text is kept unchanged as Appendix B. Runs: local, `scripts/memcap.sh 8`, mpmath 30 digits, under 200 MB, under 1 minute; scripts in Appendix A. No server job.

**Outcome: holds, with corrections E1 to E6.** The verdict "obstruction; device closed at the decisive test" survives, on the T-NR twin and the window translate. The E_a row does not survive as written (E1). One step of Lemma 5 is false as written and is repaired (E2). One ARGUED statement used as evidence in the R4 row is false at the moduli tested (E3). No statement about zeros is made by the lane; none is supported by this file. Nothing in the lane assumes RH in a PROVED step; one ARGUED step uses a series whose convergence is a zero-free hypothesis (E4). Nothing restates verified height.

## 1. PROVED steps, re-derived

| Step | Re-derivation | Result |
|---|---|---|
| Lemma 0 | each term of a non-negative sum is at most the sum; abs(FA - 1) < 1 gives FA != 0 | holds |
| S2 expansion | algebra | holds |
| Lemma 1 | L(1, chi) = (pi/2p) sum chi(a) cot(pi a/p) for odd chi; odd orthogonality ((p-1)/2)(1[x=y] - 1[x=-y]); cot odd; s(h, p) = (1/4p) sum cot(pi a/p) cot(pi a h/p) | holds. Known (Walum 1982 for h = 1; Louboutin for general h); the lane labels it CLASSICAL, correctly |
| Theorem 2 | (c/(c-1)) M(a, b; c) = pi^2 s(a bbar, c) = pi^2 s(a, b; c) (m -> m bbar), cyclically; Rademacher's law | holds for distinct odd primes. It is a one-line corollary of two classical statements and should not be listed as an addition of the lane beyond the ledger reading |
| Consequence (signs, roles) | substitution a = l1, b = l2, c = p | holds; diagonal term pi^2 (p-1)/(12 l1 l2) = zeta(2)(p-1)/(2 l1 l2) is right |
| Lemma 4 (a) | orthogonality over all chi mod p: A_chi' = (p-1)^-1 sum_chi F(chi)^-1 sum_l chi'(l) conj(chi(l)) = 1/F(chi') | holds |
| Lemma 4 (b) | the chi_1 term equals 1 | holds; in fact sup_a J = 1 - #{chi : F(s, chi) = 0} |
| Lemma 3, identity | Lambda(s, chi) = eps Lambda(1 - s, chibar) gives L(1/2 - a + it, chi) = eps g conj(L(1/2 + a + it, chi)), g = gamma-ratio, depends on parity only | identity holds; g is complex for t != 0 (common phase in a parity class), positive at t = 0. The conclusion drawn from it does not hold: E1 |
| Lemma 5, nine-term identity | X(s, chi) = L(s, chi)(u_0 + u_1 chi(q) + u_2 chi(q)^2) with u = (1, c q^{1/2-s}, q^{1-2s}); expand the square. Valid at every s, not only s = 1 | holds |
| Lemma 5, step S4 "Theorem 2 with a = l1 q^i, b = l2 q^j" | Theorem 2 is proved for primes only | false as written; repaired in E2 |
| Zeros of the twin | 2 cosh((s - 1/2) log q) = -c | holds |

## 2. Numeric reruns with different cases

- Rademacher's law: 400 random pairwise coprime triples with entries up to 400 (composite included), exact rationals: 0 mismatches.
- Theorem 2, characters built per prime-power component, new triples (3, 7, 41), (13, 19, 23), (5, 43, 47), (3, 5, 53): differences 4.5e-29, 1.5e-29, 2.7e-29, 3.4e-29.
- Lemma 4 (a): p = 11, s = 0.55 + 21.3i: residual 2.9e-58; p = 17, s = 0.8 + 40i: 1.2e-60. (b) with the T-NR twin (q, c) = (5, 2.1), p = 11, at its zero s_0 = 0.695674 + 1.951981i: abs(X(s_0, chi_0)) = 8.5e-32, and X(s_0, chi) also vanishes for the non-principal chi with chi(5) = 1.
- Lemma 3 at t != 0 (the lane checked t = 0 only): p = 11, a = 0.3, t = 7.7 and p = 19, a = 0.15, t = 23.1: the ratio is the same for all characters of a parity class to 7e-30 and 2e-28; its value is complex (2.18195 + 0.01277i), as the formula says.
- Lemma 5, new case (p, q, c) = (37, 7, -2.3), all h: max difference 2.4e-28; twin zeros at Re s = 1/2 +- 0.2781.

## 3. Errors and corrections

**E1 (control table, E_a row; Lemma 3 conclusion). The E_a "pass" is not a pass of the candidate (C).** Candidate (C) for the target F = E_a has twists E_a(s, chi) = L(s + a, chi) L(s - a, chi) and reads abs(E_a(s, chi))^2 = abs(g)^2 abs(L(1/2 + a + it, chi))^4 on Re s = 1/2: a twisted fourth moment. It is not "the device for zeta on Re s = 1/2 + a up to the factor g". Measured: abs(E_a(1/2 + it, chi))^2 / abs(L(1/2 + a + it, chi))^2 over the odd chi mod 11 (a = 0.3, t = 7.7) = 0.806, 6.48, 4.72, 5.13, 33.2, not constant. Lemma 3 treats a different device (the form linear in conj(eps_chi) E_a(s, chi), the c10 statement C1), which is not the candidate of section 1. For (C) the E_a row should read as the lane's own interpolation-twin row does: S0 to S3 hold, S4 is a degree-four twisted moment with no twist-modulus identity derived here. Consequence: "E_a with real a passes on its central line" must be removed from the verdict, the map row and the R3 evidence, or restated as a statement about the linear device. The verdict does not depend on it.

**E2 (Lemma 5, S4; Theorem 2 for composite members).** With a = l1 q^i composite the prime form of Lemma 1 for the modulus a is false. Measured, sum over odd chi mod c of chi(h) abs(L(1, chi))^2 against (phi(c)/c) pi^2 s(h, c): (c, h) = (15, 2): 2.10552 vs 2.04703; (21, 5): -0.26856 vs -0.44760; (9, 2): 1.09662 vs 0.97478; (45, 7): 2.80735 vs 1.94955. The correct form (derived: restrict the cotangent sum to (m, c) = 1 by Moebius inversion) is

sum_{chi odd mod c} chi(h) abs(L(1, chi))^2 = pi^2 (phi(c)/c) sum_{d | c} (mu(d)/d) s(h, c/d),

which matches all five cases to 12 digits. Repair of Lemma 5: at the level of Dedekind sums the step is proved without it. The nine terms are s(h q^{i-j}, p) with the prime modulus p (Lemma 1 as proved), and Rademacher's law holds for every pairwise coprime triple (checked above on composite triples). In moment form the dual moduli l1 q^i carry the divisor sum above. The same divisor sum is needed for zeta itself as soon as l is composite (squarefree Moebius support), so the twin and the target stand on the same footing: whatever form of S4 holds for zeta with all twists coprime to p holds for the twin by the nine-term identity, which is exact at every s. This is the argument that carries the verdict; it is stronger than the text of Lemma 5 and does not need the central formulas to be opened, only that S4 for zeta is stated for general twists coprime to p. If the central reciprocity on file were only for prime twists, S4 would fail for zeta as well (squarefree l1 l2bar), not separate the two.

**E3 (section 4, range A < 1; R4 evidence). "For A < 1 the candidate forces sigma > 1" is false at the moduli tested.** Exact weighted least squares over free a_l, l <= X < p - 1, at sigma < 1:

| p | X | A | s | min sum_chi abs(F A - 1)^2 | sup_a J | abscissa 1/2 + 1/(2A) |
|---|---|---|---|---|---|---|
| 13 | 11 | 0.935 | 0.9 + 3i | 0.0137 | 0.986 | 1.035 |
| 31 | 20 | 0.872 | 0.9 + 5i | 0.440 | 0.560 | 1.073 |
| 101 | 64 | 0.901 | 0.9 + 5i | 0.941 | 0.059 | 1.055 |
| 61 | 30 | 0.827 | 0.9 + 5i | 1.237 | -0.237 | 1.104 |
| 101 | 40 | 0.799 | 0.9 + 5i | 1.898 | -0.898 | 1.126 |
| 61 | 30 | 0.827 | 0.75 + 5i | 3.789 | -2.789 | 1.104 |
| 101 | 64 | 0.901 | 0.7 + 30i | 5.897 | -4.897 | 1.055 |

J > 0 occurs left of 1 with A < 1 in three rows. The statement can at most be asymptotic in p with unspecified constants, and it is not proved in that form either. This does not reopen the device: at fixed p and s, J_p(s; a) > 0 for some a is a finite computation at one point (a numerical verification that finitely many L-values are non-zero), and no uniform statement follows. But the R4 row and the sentence "where the reciprocity gives a shorter dual (A < 1) the candidate cannot hold left of 1" must be reworded: ARGUED asymptotic heuristic; contradicted at p <= 101 for A near 0.9.

**E4 (section 4, hidden hypothesis).** beta_r = sum_{n = r mod p} mu(n) n^-s is used at Re s < 1. Convergence of these series for all classes at Re s = sigma is equivalent to a zero-free half-plane for every L(s, chi) mod p (and zeta) to the right of sigma. The class vector must be defined as the finite Fourier transform of 1/F(s, chi); then "beta_r = mu(r) r^-s + tail" has no meaning without that hypothesis. The step is labelled ARGUED, but the label "expected size" understates it: the expansion presupposes a quasi-GRH statement.

**E5 (section 3).** "S1, S2, S4 hold verbatim at every sigma (shift pair)" is not established here for S4: Theorem 2 is at s = 1, odd characters, primes. At other s the statement is relative to sources not opened. The count "functional equation of the target read in 0 conditions" is correct for S0 to S2 and for S4 in the s = 1 model (where the principal character and zeta do not occur at all, so the model cannot conclude anything about zeta); at the centre it is a reading of the structure of formulas not opened.

**E6 (wording).** (i) "Lemma 4 ... no margin" is correct, but the row should state sup_a J = 1 - #{vanishing chi}. (ii) Addition 1 ("ledger map is not A -> A", Theorem 2) is a corollary of Walum/Louboutin plus Rademacher; the lane's own caveat "novelty not checked" should stand in the summary line, not only in section 2. (iii) DH and interpolation-twin rows are ARGUED only; abs(DH(s, chi))^2 summed over chi mod p contains cross terms L(s, chi psi) conj(L(s, chi psibar)), which are not second moments of one family; the claim "S4 holds to the modulus 5p" is not derived. (iv) Central statements (Conrey, Young, Bettin: the A < 1/4 range, the zeta(1/2)^2 term, analyticity of the remainder) remain RECALLED; none was opened by this referee either.

## 4. Controls run by this referee

- T-NR: nine-term identity (new case), Lemma 4 (b) at a twin zero inside the strip (Re s_0 = 0.6957): J <= 0 for every a, while S0 to S4 are those of zeta by E2. Pass of S0 to S4 confirmed in the Dedekind-sum form. S5 false. This is a control pass in the sense of the lane.
- Window translate: substitution; confirmed (no computation needed).
- E_a, real a: not a pass of candidate (C); see E1.
- DEL, THIN, U, sign twist: first failure at S4 by loss of periodicity; confirmed by inspection of Lemma 1 (the class sum to a cotangent requires coefficients constant on classes). Not computed.
- DH, interpolation twin: not confirmed (argued in the lane; not derived here).
- Backward heat, Beurling, phase-rotated transfer operator, theta^w: not formulable; not a failure for a structural reason in the sense of R3.

## 5. Requirement flags (set by this referee)

| Flag | Value | Reason |
|---|---|---|
| R1 | false | multiplicativity enters only through the choice of weights (S3); Lemma 4 removes it for X >= p - 1; no conclusion is derived |
| R2 | false | no bound at any s left of 1; Lemma 0 is pointwise |
| R3 | false | T-NR and the window translate pass S0 to S4; four controls are not formulable |
| R4 | false | S5 not obtained; for X >= p - 1 the candidate is its conclusion |

## 6. Surviving claim

Stage A only. For the device J_p(s; a) = 1 - sum_{chi mod p} abs(F(s, chi) A_chi(s) - 1)^2: (i) Lemma 0 and the zero-one law hold (for X >= p - 1 and free weights sup_a J = 1 - #{chi : F(s, chi) = 0}); (ii) at s = 1 over odd characters, for distinct odd primes, the twisted second moment obeys the three-term identity of Theorem 2 (classical inputs: cotangent formula, Rademacher), so the twist variable becomes the modulus; for composite moduli the moment form needs the divisor sum of E2; (iii) the T-NR twin's twisted second moments are a nine-term combination of zeta's at every s, so every step S0 to S4 that holds for zeta with general twists holds for the twin, whose candidate bound S5 is false at its off-line zeros; the window translate passes by substitution. The device is closed on these two controls. Not established: the E_a pass for candidate (C), any statement at the centre (relative to Conrey, Young, Bettin, unopened), the A < 1 abscissa claim (false at p <= 101, A about 0.9), the DH and interpolation-twin rows.

## Appendix A. Referee scripts

Run as `scripts/memcap.sh 8 .venv-arb/bin/python -u <file>` (sympy needed for the first).

```python
# r.py
import mpmath as mp
from fractions import Fraction as Fr
from math import gcd
mp.mp.dps = 30
print("planned memory < 100 MB")
def s3(a,b,c):
    t=0
    for m in range(1,c):
        x=m*a%c; y=m*b%c
        if x and y: t+=(2*x-c)*(2*y-c)
    return Fr(t,4*c*c)
# 1. Rademacher law, different range: larger, random-ish composite triples
import random; random.seed(7); n=bad=0
while n<400:
    a,b,c=[random.randint(2,400) for _ in range(3)]
    if gcd(a,b)==gcd(a,c)==gcd(b,c)==1:
        n+=1; bad+= (s3(a,b,c)+s3(b,c,a)+s3(c,a,b)!=Fr(a*a+b*b+c*c,12*a*b*c)-Fr(1,4))
print("1. three-term law, 400 random coprime triples <=400: mismatches",bad)
# general characters mod m via brute force: enumerate group characters of (Z/m)^* by generators (use discrete-log on cyclic factors)
def chars_mod(m):
    # returns list of dicts n->value for all chars mod m, by building from prime-power components (odd prime powers and 2,4 only)
    from sympy import factorint, primitive_root, totient
    fac=factorint(m); comps=[]
    for q,e in fac.items():
        qe=q**e; g=primitive_root(qe); ph=int(totient(qe)); ind={}; x=1
        for j in range(ph): ind[x]=j; x=x*g%qe
        comps.append((qe,ph,ind))
    import itertools
    out=[]
    for rs in itertools.product(*[range(ph) for _,ph,_ in comps]):
        d={}
        for nn in range(1,m):
            if gcd(nn,m)==1:
                v=mp.mpf(0)
                for (qe,ph,ind),r in zip(comps,rs): v+=mp.mpf(2*r*ind[nn%qe])/ph
                d[nn]=mp.expjpi(v)
        out.append(d)
    return out
def L1(chi,m):  # odd chi: cot formula (valid for any odd chi mod m, primitive or not)
    return mp.pi/(2*m)*sum(v*mp.cot(mp.pi*a/m) for a,v in chi.items())
def M(a,b,c):
    tot=mp.mpc(0)
    for chi in chars_mod(c):
        if abs(chi[c-1]+1)<1e-20:
            tot+=abs(L1(chi,c))**2*chi[a%c]*mp.conj(chi[b%c])
    return tot
# 2. Theorem 2, new prime triples
for (a,b,c) in [(3,7,41),(13,19,23),(5,43,47),(3,5,53)]:
    lhs=sum(z/(z-mp.mpf(1))*M(x,y,z) for x,y,z in [(a,b,c),(b,c,a),(c,a,b)])
    rhs=mp.pi**2*(mp.mpf(a*a+b*b+c*c)/(12*a*b*c)-mp.mpf(1)/4)
    print("2. Thm2",(a,b,c),mp.nstr(lhs.real,12),mp.nstr(rhs,12),"diff",mp.nstr(abs(lhs-rhs),3))
# 3. composite modulus: is the PRIME-form of Thm 2 true with composite members? and the Moebius-divisor form of Lemma 1
from sympy import divisors, mobius, totient
for (c,h) in [(15,2),(21,5),(9,2),(35,3),(45,7)]:
    lhs=M(h,1,c)
    naive=mp.pi**2*int(totient(c))/c*mp.mpf(s3(h,1,c).numerator)/s3(h,1,c).denominator
    mob=mp.pi**2*int(totient(c))/c*sum(int(mobius(d))*mp.mpf(1)/d*(mp.mpf(s3(h,1,c//d).numerator)/s3(h,1,c//d).denominator) for d in divisors(c) if c//d>1)
    print("3. composite Lemma1 c,h",c,h,"M",mp.nstr(lhs.real,12),"naive phi/c*s(h,c)",mp.nstr(naive,12),"Moebius form",mp.nstr(mob,12))
```

```python
# r2.py
import mpmath as mp
mp.mp.dps = 30
print("planned memory < 200 MB")
def proot(p):
    for g in range(2,p):
        x,o=g,1
        while x!=1: x=x*g%p; o+=1
        if o==p-1: return g
def setup(p):
    g=proot(p); ind={}; x=1
    for j in range(p-1): ind[x]=j; x=x*g%p
    return ind
def chi(p,ind,r,n): return mp.expjpi(mp.mpf(2*r*ind[n%p])/(p-1))
def Lall(p,ind,s):
    hz=[None]+[mp.zeta(s,mp.mpf(a)/p) for a in range(1,p)]
    return [sum(chi(p,ind,r,a)*hz[a] for a in range(1,p))/mp.mpf(p)**s for r in range(p-1)]  # r=0: zeta(s)(1-p^-s)
# A. Lemma 4, new cases; (b) with T-NR twin zero
for p,s in [(11,mp.mpc('0.55','21.3')),(17,mp.mpc('0.8','40.0'))]:
    ind=setup(p); Lv=Lall(p,ind,s)
    al={l:sum(mp.conj(chi(p,ind,r,l))/Lv[r] for r in range(p-1))/(p-1)*mp.mpf(l)**s for l in range(1,p)}
    tot=sum(abs(Lv[r]*sum(al[l]*chi(p,ind,r,l)*mp.mpf(l)**(-s) for l in range(1,p))-1)**2 for r in range(p-1))
    print("A. Lemma4(a) p",p,"s",s,"sum",mp.nstr(tot,3),"principal check",mp.nstr(abs(Lv[0]-mp.zeta(s)*(1-mp.mpf(p)**(-s))),3))
# (b): T-NR twin q=5,c=2.1: zero at s0=1/2+acosh(1.05)/log5 + i*pi/log 5 (cosh = -c/2)
q=5; c=mp.mpf('2.1'); s0=mp.mpf(1)/2+(mp.acosh(c/2)+1j*mp.pi)/mp.log(q)
p=11; ind=setup(p); Lv=Lall(p,ind,s0)
X=[Lv[r]*(1+c*mp.sqrt(q)*chi(p,ind,r,q)*mp.mpf(q)**(-s0)+q*chi(p,ind,r,q)**2*mp.mpf(q)**(-2*s0)) for r in range(p-1)]
print("A. Lemma4(b) twin s0",mp.nstr(s0,10),"|X(s0,chi_0)|",mp.nstr(abs(X[0]),3),"min |X(s0,chi)| chi!=chi0",mp.nstr(min(abs(v) for v in X[1:]),5))
# least squares sup J over a (l<=p-1): weighted LS exact => J = 1 - #zeros
# B. Lemma 3 at t != 0
for p,a,t in [(11,mp.mpf('0.3'),mp.mpf('7.7')),(19,mp.mpf('0.15'),mp.mpf('23.1'))]:
    ind=setup(p)
    Lm=Lall(p,ind,mp.mpf(1)/2-a+1j*t); Lp=Lall(p,ind,mp.mpf(1)/2+a+1j*t); L0=Lall(p,ind,mp.mpf(1)/2+1j*t)
    for par in (0,1):
        v=[(Lm[r]/mp.conj(Lp[r]))/(L0[r]/mp.conj(L0[r])) for r in range(1,p-1) if r%2==par]
        print("B. p",p,"a",a,"t",t,"parity",par,"g ratio first",mp.nstr(v[0],10),"spread",mp.nstr(max(abs(x-v[0]) for x in v),3))
# C. E_a in candidate (C): |E_a(1/2+it,chi)|^2 vs |L(1/2+a+it,chi)|^2 : ratio not constant in chi (fourth vs second moment)
p=11; ind=setup(p); a=mp.mpf('0.3'); t=mp.mpf('7.7')
Lm=Lall(p,ind,mp.mpf(1)/2-a+1j*t); Lp=Lall(p,ind,mp.mpf(1)/2+a+1j*t)
print("C. |E_a(1/2+it,chi)|^2/|L(1/2+a+it,chi)|^2, odd chi:",[mp.nstr(abs(Lm[r]*Lp[r])**2/abs(Lp[r])**2,6) for r in range(1,p-1,2)])
# D. T-NR nine-term, new case (p,q,c)=(37,7,-2.3), odd chars, s=1 via cot
p,q,cc=37,7,mp.mpf('-2.3'); ind=setup(p)
def sded(h,k):
    return sum((mp.mpf(m)/k-mp.mpf(1)/2)*((mp.mpf(m*h%k)/k-mp.mpf(1)/2) if m*h%k else 0) for m in range(1,k))
L1=[mp.pi/(2*p)*sum(chi(p,ind,r,m)*mp.cot(mp.pi*m/p) for m in range(1,p)) if r%2 else None for r in range(p-1)]
u=[mp.mpf(1),cc/mp.sqrt(q),mp.mpf(1)/q]; qi=pow(q,-1,p); w=0
for h in range(1,p):
    lhs=sum(chi(p,ind,r,h)*abs(L1[r]*(u[0]+u[1]*chi(p,ind,r,q)+u[2]*chi(p,ind,r,q)**2))**2 for r in range(1,p-1,2))
    rhs=sum(u[i]*u[j]*mp.pi**2*(p-1)/p*sded(h*pow(q,i,p)*pow(qi,j,p)%p,p) for i in range(3) for j in range(3))
    w=max(w,abs(lhs-rhs))
print("D. T-NR nine-term (37,7,-2.3) max diff",mp.nstr(w,3),"zeros Re s=1/2+-",mp.nstr(mp.acosh(abs(cc)/2)/mp.log(q),6))
# E. range A<1: weighted least squares, max_a J at sigma<1 with X<p-1
import mpmath
for p,Xl,s in [(13,11,mp.mpc('0.9','3')),(31,20,mp.mpc('0.9','5')),(61,30,mp.mpc('0.9','5')),(61,30,mp.mpc('0.75','5')),(101,40,mp.mpc('0.9','5')),(101,64,mp.mpc('0.9','5')),(101,64,mp.mpc('0.7','30'))]:
    ind=setup(p); Lv=Lall(p,ind,s)
    Mx=mp.matrix(p-1,Xl)
    for r in range(p-1):
        for l in range(1,Xl+1): Mx[r,l-1]=Lv[r]*chi(p,ind,r,l)*mp.mpf(l)**(-s)
    b=mp.matrix([1]*(p-1))
    G=Mx.H*Mx; rhs=Mx.H*b; sol=mp.lu_solve(G,rhs); res=mp.norm(Mx*sol-b)**2
    A=mp.log(Xl)/mp.log(p)
    print("E. p",p,"X",Xl,"A=%.3f"%A,"s",s,"min sum",mp.nstr(res,6),"sup J",mp.nstr(1-res,6),"claimed abscissa 1/2+1/(2A)=%.3f"%(0.5+0.5/float(A)),"min|L|",mp.nstr(min(abs(v) for v in Lv),4))
```

## Appendix B. Author second pass (unchanged text of the earlier REFEREE.md; not a referee report)

### REFEREE.md for c11-rs1-twist-modulus-reciprocity

Status: **no independent referee ran.** This session had no tool for starting a second agent. What follows is a second pass by the author with different formulas and code. It does not count as a referee report; the lane's line in `campaign/lanes.jsonl` has `refereeHolds: null`, `referees: 0`. The lane claims no requirement flag and no statement about zeros, so nothing is counted on the strength of this file.

#### Second pass (author)

| Item | Method of the first pass | Second pass | Outcome |
|---|---|---|---|
| Lemma 1 | derivation from the cotangent expansion; check with digamma values against sawtooth Dedekind sums | the check is independent of the cotangent step (digamma on one side, sawtooth on the other) | agrees, 3.6e-29, p in {7, 11, 13, 29}, all h |
| Rademacher three-term law | recalled | exact rationals, 1515 triples, c up to 499 | 0 mismatches |
| Theorem 2 | Lemma 1 + three-term law | `ref_check.py`: both sides from L(1, chi) by the cotangent formula, no Dedekind sums, six prime triples | agrees to 6e-29 |
| Lemma 3 | functional equation | numeric ratio at p = 7, 13, a = 0.2, 0.35, both parities | real, positive, constant on parity classes |
| Lemma 4 | Fourier inversion | numeric instance p = 7, 13 | residual 1e-58 |
| Lemma 5 | algebra | nine-term identity, five (p, q, c) cases, two with zeros inside the strip | agrees, 5e-28; not identically zero |

Corrections made during the second pass:
1. Section 4 first carried exponent counts (X^3, X^{5/2}) that mixed the s = 1 normalisation with the central one. Removed. Present text: the s = 1 model has no length barrier below A = 1 (weights 1/l); at the centre the trivial bound on the dual gives A < 1/4, relative to Conrey's normalisation as recalled.
2. Lemma 3: the factor g differs between the parity classes; stated.

#### Items an independent referee should test

1. Open Bettin (2016) and confirm: (a) the exact formula holds for general coprime h, k and with shifts; (b) it applies to the nine twists h q^j of Lemma 5; (c) whether a three-term form with two twists (l1, l2) exists at the centre, or only the two-term form with a single twist h (the table at the centre uses only the two-term form).
2. Lemma 5 at the centre: the T-NR pass is PROVED only at s = 1 over odd characters, where the target zeta is absent. Check that no step of the central formula uses a property that fails for twists by powers of q.
3. E_a row: the pass is on E_a's central line, where the device for E_a equals the device for zeta at Re s = 1/2 + a. A referee may hold that this is a relabelling and not a control pass; the lane's verdict does not depend on it (T-NR passes).
4. Section 4, range A < 1: the distance estimate is argued. Test it numerically at one modulus (least squares over a_l, l <= X < p - 1) if the statement is to be used.
5. The DH row and the interpolation-twin row are argued only.
6. EIS-w is read as the Eisenstein L-function with complex parameter; the map defines it on the modular surface.
