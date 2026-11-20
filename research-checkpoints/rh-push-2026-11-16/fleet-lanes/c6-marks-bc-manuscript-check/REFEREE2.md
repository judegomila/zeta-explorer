# REFEREE2 (second, independent): Lemma H, Corollary H1, Lemma S, Theorem B1' of `c6-marks-bc-manuscript-check`

2026-11-18. Written by lane `c7-repair-engine-map-r6`. The first referee's report (REFEREE.md) was not used; the
lane's transcription and `hp_check.py` were read only after the derivation below was finished. Source read as text:
`~/lean-deps/qrh-verify/paper.txt` ("MS"; unrefereed manuscript), lines 368-402 (Prop. 2.1, (2.1)-(2.5)), 516-521
(alpha, primary generators), 3098-3360 ((7.6), (7.10)-(7.17), Lemma 7.1 and its proof with table (7.16)),
4305-4336 ((10.1), (10.2)). One local run through `scripts/memcap.sh 8`:
`push/c7-repair-engine-map-r6/ref2_hp.py`, log `ref2_hp.log` (stdlib, under 1 s, under 50 MB). No ssh.
Everything below is a statement about the normaliser of a probe in an estimate system. Nothing here is a statement
about zeros of zeta. RH open.

## Verdict

**Lemma H and Corollary H1: hold.** The local formula, both factorisations, the convergence abscissae 1/2 and 3/7,
the local non-vanishing, the location 7/12 <= Re s < 2/3 of infinitely many zeros of H_eta, and the failure of MS
(2.2) for every sigma_0 < 7/12 and every finite S were re-derived from the MS text. Relative to: MS Lemma 7.1
(table (7.16) as printed; not re-derived from (7.10) and the Gauss-sum evaluation (7.8)) and classical facts about
Hecke L-functions of infinite-order characters. Two wording points (W1, W2), neither changes a conclusion.

**Lemma S: holds**, with one constant to repair in the proof (W3) and one boundary case in the parenthesis of (iii)
(W4).

**Theorem B1': the chain as labelled holds.** (1a), (2a), (2b) re-derived. (1b) is PROVED-rel inputs that have no
source at the vertex, as the lane says; it was checked here only for consistency with the lane's own table line 11.
(2c) is open, as stated.

The two round-7 lanes that rest on Lemma H (`c7-uncompensated-high-side-normaliser`, `c7-probe-format-h-cap`) may
use: "for the sextic probe of MS, H_eta = zeta_F^S(2)^-1 L^S(6s-3, psi_eta) E_eta on Re s > 1/2; (2.2) can hold only
for sigma_0 >= 7/12, and holds for every sigma_0 > 2/3 after enlarging S". They should not use "(2.2) holds at
sigma_0 = 2/3" (W2).

## 1. Lemma H against the MS text

MS (7.6): V = Q^(-6z), R = a_p^2 Q^(4-6x-6z), W_loc = rho Q^(-w), a_p = (alpha(p) or its conjugate)^3 eta(p)^3
(the bar is a superscript line in the text file; either reading gives abs(a_p) = 1 and a_p^2 = (alpha^(+-1) eta)^6
at p). MS (7.11), principal row u = 1 (j = 0, rho = 1, p not dividing u):

    P*_p = (1/(1-R)) [ (R(1 - 1/Q) - eta(p)(Q-1) Q^(-x-w) V)/(1-V) + J_0 ],   J_0 = -eta(p) Q^(-x) + W_loc R,
    P_p  = 1/(1-V) + W_loc/(1-W_loc) + P*_p,          H_p = P_p (1-V)(1-W)/(1-D)   (7.12),  D = eta(p) Q^(-x).

Checked against table (7.16), not only against (7.11): the rows that occur for j = 0 are (0,2r+2; k=0; m >= r+1),
(0,2r+2; k=1; m = r+1), (1,2r; k=0; m = r), (1,2r; k=1; m >= r+1); their sum over r and m is the bracket above
(the j = 5 boundary row and the j = 1..4 rows do not occur for u = 1). `ref2_hp.py` sums these rows as truncated
double series with exact rationals at 60 random points and compares with the closed form: maximal difference
2.0e-20 at truncation 40 (remainder at most (1/3)^40).

At (w, z) = (1, 1/6): V = W = q = 1/Q, eta(p)(Q-1)Q^(-x-1) V = D q (1-q). By hand:

    P*_p = [R - D q - D + q R]/(1-R) = (1+q)(R - D)/(1-R),
    P_p  = (1+q)/(1-q) + (1+q)(R-D)/(1-R) = (1+q)(1 - D(1-q) - R q)/((1-q)(1-R)),
    H_p  = (1 - q^2)(1 - D(1-q) - R q)/((1-R)(1-D)),            R = a_p^2 Q^(3-6s).

This is the lane's formula. Consistency with MS: at x_r = 7/8 the leading terms of H_p - 1 are D q of size
Q^(-15/8) and R of size Q^(-9/4); MS states O(Q^(-363/200)) in region (7.15) with closest term Q^(1-x_r-w_r-6z_r),
which at the corner (7/8, 19/20, 33/200) is Q^(-363/200). Agreement.

Factorisations (exact rational identities, 500 random points, log):

    (1 - D(1-q) - Rq)/(1-D) = 1 - q(R - D)/(1-D)                                   [E-form]
    (1 - D(1-q) - Rq)/((1-R)(1-D)) = ((1-Rq)/(1-R)) (1 + Dq(1-R)/((1-D)(1-Rq)))    [E'-form]

Products over p outside S: prod (1 - q^2) = zeta_F^S(2)^-1; prod (1-R)^-1 = L^S(6s-3, psi_eta) with
psi_eta(p) = a_p^2; prod (1 - Rq) = 1/L^S(6s-2, psi_eta). E_eta: terms qR of size Q^(2-6 sigma) and qD of size
Q^(-1-sigma), absolutely convergent iff sigma > 1/2. E'_eta: terms Dq, DqR of sizes Q^(-1-sigma), Q^(2-7 sigma),
absolutely convergent iff sigma > 3/7. Local non-vanishing on Re s >= 1/2: abs(D)(1-q) + abs(R) q <=
Q^(-1/2)(1-1/Q) + 1/Q <= 0.625 for Q >= 4 (the prime of norm 3 is ramified and lies in S); grid minimum of
abs(1 - D(1-q) - Rq) over Q in {4,...,25}, 1/2 <= sigma <= 1 and all phases is 0.3750 (log). Each product converges
absolutely with non-zero factors, so E_eta != 0 on Re s > 1/2 and E'_eta != 0 on Re s >= 1/2. Confirmed.

The character. MS line 516: alpha(a) = a/abs(a); line 521: generators are primary (congruent 1 mod 3), so alpha is
a function of the ideal for ideals prime to 3, a Hecke character of Q(omega) of infinity type of frequency 1.
alpha^6 is unramified (the six units are killed). psi_eta = (alpha^(+-1) eta)^6 is of infinite order because eta has
finite order. Hence L(w, psi_eta) is entire, has infinitely many zeros in 0 < Re w < 1 (zero-counting formula),
none on Re w = 1, and none on Re w = 0 (functional equation to conj psi; the gamma factor Gamma(w + 3) has neither
zeros nor poles there). CLASSICAL; not opened in a source.

## 2. Corollary H1

(a) Holomorphy on Re s >= 1/2 and polynomial growth on Re s >= 1/2 + eps: from the E'-form (1/L^S(6s-2, psi) is
holomorphic on Re(6s-2) >= 1) and the E-form. Confirmed.
(b) Zeros in Re s > 1/2 are exactly s = (3 + rho')/6 with L(rho', psi_eta) = 0, 0 < Re rho' < 1, with the same
multiplicity; deleted factors (1 - psi(p) Q^(-w)), p in S, do not vanish for Re w > 0. So 1/2 < Re s < 2/3. The
zero set of L(w, psi) is invariant under rho' -> 1 - conj(rho') (functional equation to conj psi, then
conjugation), so the s-zeros are symmetric about Re s = 7/12 and infinitely many have Re s >= 7/12. Confirmed.
(c) On Re s = 1/2: zeros come from the deleted factors only, O_S(T) of them. Confirmed (a factor is present only
when psi is unramified at p in S).
(d) (2.2) implies abs(H_eta) >= 1/2 on Re s > sigma_0; H_eta has a zero with Re s >= 7/12 for every finite S; by
the identity theorem the H_eta of (2.3) is this function. So (2.2) is false for sigma_0 < 7/12. Confirmed.

W1 (wording). "Conductor dividing that of eta^6" should read "conductor dividing that of eta^6 times a power of the
prime above 3 allowed by the primary convention"; alpha^6 itself has conductor 1. Not used.

W2 (scope of the cap). For sigma_0 > 2/3: Re(6s-3) >= 1 + 6(sigma_0 - 2/3) on Re s > sigma_0, so
abs(L^S(6s-3, psi) - 1) and abs(E_eta - 1) tend to 0 as the cutoff P_0 grows, and (2.2) holds after enlarging S
(with S depending on sigma_0). At sigma_0 = 2/3 exactly (2.2) fails for every S: sup over Re w > 1 of
abs(L^S(w, psi) - 1) is not small (it is at least of the size of the tail of sum Q^(-Re w) aligned by a Kronecker
choice of height, which diverges as Re w -> 1). For 7/12 <= sigma_0 < 2/3 the lane's statement is right that (2.2)
needs at least a zero-free region Re w > 6 sigma_0 - 3 for L(w, psi_eta); non-vanishing alone does not give
abs(H - 1) <= 1/2 there. Reading for the round-7 lanes: "the format's unconditional conclusion stops at 2/3" means
the infimum of admissible sigma_0 is 2/3, not attained; with Lemma S in place of (2.2) the exact statement is
relation (R), not a conclusion at 2/3.

Not checked: MS Lemma 7.1 from (7.10) and the Gauss-sum table (7.8) (the lane's formula is exact relative to the
printed (7.11)/(7.16), which agree with each other for j = 0); the Lean replay does not cover this lemma as far as
this referee knows.

## 3. Lemma S

(i) => (ii). f_eta decays faster than any power as Z -> 0 (shift Re s = 2 to Re s = sigma -> infinity:
Z^sigma e^(sigma^2) is minimised at sigma = (1/2) log(1/Z); H_eta and 1/L^S are bounded on Re s >= 2). With (i) the
Mellin transform of f in the variable C(s) converges for Re s > B + eps and equals e^((s-5/6)^2) H_eta/L^S on
Re s = 2 by inversion; continuation follows. (2.2) is not used. Confirmed.
(ii) <=> (iii). From H1(b) for B >= 1/2. Confirmed.
(ii) => (i). The argument (local zero count O(log t), Landau-type lemma, pigeonhole for the sides, maximum
principle, Gaussian weight) is standard and correct in outline.

W3 (constant). "A disc of radius 2 about 2 + it ... on the half-radius disc" does not reach Re s = 1/2 + eps (the
half-radius disc ends at Re s = 1). Use Titchmarsh section 3.9 Lemma alpha with centre 2 + it and radius r = 12:
the conclusion holds on abs(s - s_0) <= r/4 = 3, which contains the rectangle, with M = O(log abs(t)) from the
convexity bound on Re s >= -10. The rest is unchanged.

W4 (boundary). In (iii), "(so no zero has Re rho >= max(B, 2/3))" should read "(so no zero has Re rho > B and
Re rho >= 2/3)": for B >= 2/3 a zero with Re rho = B is not excluded by (iii). Not used later (Theorem B1' (2b)
uses strict inequalities).

## 4. Theorem B1'

(1a) GRH(eta) => f_eta << Z^(lx/2 + eps): Lemma S (ii) at B = 1/2 with no zeros of L(s, eta) right of 1/2;
C(1/2) = 1/2 - 1 + lx/2 + h/6 = lx/2 at h = 3. Confirmed.
(2a) Confirmed (H1(d)).
(2b) With beta* > 1/2: (N) and (HI_g(beta*)) give f_eta << Z^(max(C(1/2)+eps, C(beta*)-sigma)) <= Z^(C(beta* - eps*)),
eps* = min(sigma, (beta* - 1/2)/2), and beta* - eps* >= (beta* + 1/2)/2 > 1/2, so Lemma S applies with
B = beta* - eps* for each eta (constants may depend on eta; sigma may not). If beta* > 2/3 the definition of the
supremum gives a zero of the family with Re rho > max(beta* - eps*, 2/3), where H_eta != 0: contradiction. (R)
follows. Confirmed, relative to (ID_g) and (HI_g), which have no source at the vertex.
(1b) Not re-derived. The inequality quoted (5h/6 - ly/2 - l/2 + g <= 0 at delta = 0, sigma_0 = 1/2) is the lane's
table line 11 at B = 1/2, delta = 0. Its inputs ((10.13) at the vertex, the exact representation (ID_g)) are
labelled NO SOURCE by the lane; this referee agrees with the label.
(2c) Open. No argument for or against was found here.

## 5. What a third referee should check

1. MS Lemma 7.1 for j = 0 from (7.10) and (7.8) directly (the four families and the Ramanujan-sum boundary values).
2. The conjugation convention in (7.6) against the PDF (bar positions are lost in the text file).
3. W2: a written proof that (2.2) holds for every sigma_0 > 2/3 with S = S(sigma_0), including the uniformity in eta
   that MS (10.2) needs ("uniform in the target unit phases").
