# REFEREE: g-passive-cascade/RESULT.md

Date: 2026-11-16. Adversarial referee pass. Verdict: **holds** (precise obstruction, no RH progress), with
four corrections of scope listed below. No PROVED step failed re-derivation. Nothing assumes RH. No cancellation
is claimed, so the coordinate-change test does not apply.

## Re-derivations (by hand)

- Thm 1(a,b,c): `coth x - 1 = 2/(e^{2x}-1)` gives `log p/(p^s-1) = Z_p - (log p)/2`; Mittag-Leffler form and
  `Re coth x = sinh(2 Re x)/(2|sinh x|^2)` confirmed; `prod 2 sinh(s log p/2) = N_Q^{s/2}/P_Q`. Confirmed.
  Local budget: image of `|z|=r` under `z/(1-z)` has real part `[-r/(1+r), r/(1-r)]`. Confirmed.
- Prop 2(a): `X` even and real on the real axis gives `R_a(w)R_a(-w)=1`, `|R_a(it)|=1`. (b): recomputed
  `|Q(w+a)|^2-|Q(w-a)|^2 = 8ax(x^2+y^2+a^2-delta^2)` with `u=w-i gamma=x+iy`. Confirmed. (c): `b_p`, the modulus
  interval, and the pole of `g_a` at `w=1/2-a` (zero of `s_2-1`) confirmed.
- Thm 3(i): three cases are exhaustive for nonconstant inner `beta`. Stirling `R_a(x) ~ (2 pi/x)^a` confirmed.
  Boundary pole cancellation on `Re w=0` confirmed (`rho -> 1-conj(rho)`, equal multiplicity). Ingham exponent
  `3(1-sigma)/(2-sigma) < 1` iff `sigma > 1/2`. Critical-line case: Li-Radziwill (IMRN 2015) is stated for
  progressions `an+b`, `a>0`, `b` real (at least 1/3 non-zeros) to my recollection as well; not re-read by me
  either. This remains a citation-dependent step.
- Thm 3(ii): elementary; confirmed. It is essentially the `m>=1` case of (i) plus `R_a(+inf)=0`.
- Thm 3(iii): `|g_a| ~ (2 pi/|t|)^a`; lower bound `N^{1+2a}`; Gallagher upper bound `N^{max(1,2-2 sigma_1)} log^c`;
  the power gap is strict because `sigma_1 > 1/2 - a`, so untracked log powers do not matter. Confirmed.
- Prop 4: one-line algebra; character stubs `(log p/2)coth((s log p - i arg chi(p))/2)` confirmed.
- Section 5 Proposition: confirmed.

## Independent numerics (mpmath, dps 30, script /tmp/ref-gpc/r.py; different cases from the author's)

| Check | Result |
|---|---|
| (1.1) at `s = 1.5+10i`, primes to 2e6 | diff 7.0e-5, tail scale 1.4e-3 |
| Mittag-Leffler for `p=7`, `s=0.4+1.7i` | 2e-31 |
| `R_a R_a(-w)`, `|R_a(it)|`, `a=0.2` | 1, 1 |
| max `|R_a|`, 300 random points `Re w in [0.5,3]`, `Im w<200` | 0.982 |
| product form (c) at `w=1.2+5.5i`, primes to 3e5 | 2.5e-5 |
| `Q*` at `t=1e9, 1e12, 1e15, 1e30` | 17, 37, 59, 263 (first two match; 1e9 margin is 0.018) |
| `xi_30` off-line zeros re-solved | `0.90837460+117.20871285i`, `0.90354129+113.31106068i`, `J=0` to 1e-28 |
| DH control at two other zeros `0.650830+114.163343i`, `0.574356+166.479306i` | `L1/L2 = -c2/c1` to 30 digits; Prop 4 identity error 3e-29; `|lambda|` 30 and 44 at distance 0.008; both branch log-derivatives have positive real part |
| DH branch stub form at `s=2.5+4i` | 7e-12 |

## Errors and scope corrections

1. **DH remark after Theorem 3 is unsupported.** "The same statements hold for the DH ratio" is not proved by
   the arguments given. The off-line case of (i) uses `N(sigma,H)=o(H)`, which is false for DH (it has `>> H`
   zeros in strips `1/2 < sigma_1 < Re s < sigma_2 < 1`). (iii) uses `|zeta(s_2)| >= zeta(2 sigma_2)/zeta(sigma_2)`
   for `sigma_2>1`, which has no DH analogue (DH has zeros in `Re s>1`). Whether DH has a vertical progression
   of zeros is not settled here. Label that sentence OPEN. Consequence: Theorem 3 is zeta-specific in its proof,
   though it is an obstruction and not a mechanism, so this does not create a false RH lever.
2. **"`|R_a|<1` on `Re w>0` iff `a >= Delta`"** (Section 3, cited as CLASSICAL/atlas): the "only if" needs the
   pole of `R_a` at `rho_c - a` not to be cancelled by a zero at `rho_c - 2a`. A ladder of zeros at one height
   with spacing `2a` (e.g. real parts `-3a,-a,a,3a`) would give a Schur factor with `a < Delta`. Not excluded
   unconditionally. Only the "if" direction is used (Prop 2(b)), so nothing downstream changes.
3. **Theorem 3(iii) scope.** It covers one elementary first-kind factor with interior node. Boundary-node
   (second-kind) factors and multi-delay sections are not covered; the author's own OPEN note says so, but verdict
   item 3 ("Redheffer, Darlington, Potapov apply only through zero- or Pick-indexed sections") is stronger than
   what is proved. It is proved for multiplicative periodic factors and for nodes `Re w_0 > max(0,1/2-a)`.
4. **Section 2 identification with eq48 (16)/(21)** is asserted "term by term" without the computation. The Pick
   form does match eq48's `Q_L` definition (eq48/RESULT.md line 51), and RH iff `L` PR is classical, so the
   equivalence stands through eq48's refereed chain; the splitting claim itself was not re-derived here or there.

## Surviving claim

Thm 1, Prop 2, Thm 3(i)-(ii), Thm 3(iii) for `Re w_0 > max(0,1/2-a)`, Prop 4 and the Section 5 finite-prime
statement hold as stated, with (i) on the critical line resting on Li-Radziwill for shifted progressions. The DH
sentence under Theorem 3 and the "iff" in Section 3 should be downgraded. No RH progress; lane closed.
