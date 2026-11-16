# REFEREE: zf-higher-rows/RESULT.md (2026-11-16)

Verdict of referee: **holds = false** (one PROVED step is false as stated; two PROVED labels are too strong).
The core finite-field theorem survives. The obstruction survives only as a MODEL statement.

## Confirmed (re-derived and re-run)

* Thm 1(a): g(chi)g(rho) = J(chi,rho)g(chi rho), mu(pi) = -1. Correct for r >= 3.
* Thm 1(c): chi rho = chi^(1+s) for r = 2s, gcd(2s,1+s) = gcd(2,1+s); odd r coprime orders. nu(r) = 3 iff r = 6. Correct.
* Thm 1(d): exponent congruences re-derived by hand; minimal e is 1+r/2 (4|r), r+1 (r odd); parity obstruction for r = 2 mod 4. Correct.
* Thm 1(e): Galois-weight argument correct (it excludes only other Gauss-sum families in <chi,rho>, as the note says).
* Thm 2 involution nu(nu(r)) = r: correct.
* Independent numeric test, different case from the author's: residue fields F_{p^2} (the author tested only F_p),
  17 pairs (r,p) with r in {3,4,5,6,7,8,10,12,16,24}, h in F_{p^2} not in F_p. (a),(c),(d) hold to <= 7.5e-15.
  `ledger_check.py` reruns and passes (1.67e-14).
* Thm 4(i) (mediant), filter constants A(e0), G1 arithmetic (crossing at lambda = 1), 1-4/(5r) values, r_eff = 3.996376: arithmetic correct.
* DH control: adequate. The note proves no zero-free statement; the Euler product enters at mu(pi) = -1 and Hecke multiplicativity. No RH assumption, no verified-height restatement found.

## Errors and gaps

1. **Theorem 4(ii) is false as stated [labelled PROVED].** The claim: for rows (u_1..u_j) with character
   prod chi^(r_i)(u_i), trivialising rows number <= prod H_i^(1/r_i) up to logs, so gain <= H^(1/min r_i).
   Counterexample: r_1 = r_2 = 4 with characters chi(u_1) and chi-bar(u_2) (both of order 4). Trivial iff u_1 u_2^3 is a
   4th power; this contains the diagonal u_1 = u_2. Count is about (H_1 H_2)^(1/4) min(H_1,H_2)^(1/2), i.e. H for
   H_1 = H_2 = H, against the claimed H^(1/2). Brute force over Z (H = 100, 200, 400, 800): 116, 232, 470, 956
   (ratio to H: 1.16 to 1.20); same-orientation count 30, 54, 92, 156 (consistent with H^(1/2) log H).
   The proof step "solve the valuation congruence prime by prime" needs sum a_i/r_i >= 1 for every minimal solution,
   which fails whenever two components have orders with a common factor and opposite orientation
   (also r = 4 with r = 12: chi_12^3(u_1) chi_12^(-1)(u_2), solution (1,3), sum = 1/2).
   Consequence: a conjugate-paired product family has the diagonal density of an order-2 row in H = H_1 H_2.
   "Mixtures are never better than their lowest pure order" is therefore not proved for product families.
   Whether such a family carries a usable signal in the 7/8 architecture is not analysed anywhere in the note.
2. **Theorem 4 conclusion is over-labelled.** (i) is an inequality about combining given per-family bounds; (iii) is
   one sentence. "Hence the abscissa of a mixture is >= the minimum over its pure orders" is a statement inside
   Framework A amplifier counting, not about the Framework B sigma0 system. It should be MODEL.
3. **Theorem 2 corollary "TRO6-natural and the cubic R2 object are the same 6-fold Kubota object" is not a proved
   equivalence.** What is proved: both involve order-6 Gauss sums. The cubic lever's dual is the 6-fold Kubota series
   at general index h^4; the sextic exceptional term is a first moment on the coset e0 t^6 a^6 (and TRO6-natural, per
   the brief, concerns sextic theta coefficients, i.e. residues, correlated with cubic rows). No implication in either
   direction between the two problems is given. For r != 6 the "exceptional side" description is itself the 6 -> r
   transplant (MODEL). Label should be structural observation, not PROVED.
4. **Theorem 1(d) omits a representation.** e = 1 with t(h) = rho(h) holds for every r (verified numerically in the
   F_{p^2} run), not only r = 2 mod 4. The note assigns a = e in the twist-free form for 4|r and odd r, and a = 2 in
   the twisted form for r = 6, without comparing the two forms at each r. Using the earlier verdict note's twisting
   rule (degree nu - 1), a = min(e, nu(r) - 1): 4 (r=3), 3 (r=4), 6 (r=5), 2 (r=6), 5 (r=8), 7 (r=12), so the table
   is unchanged. But r = 10 would be 4, not "no functional equation known; a = 2 floor" (conservative, harmless, but
   inconsistent with the stated rule).
5. **"Why the quartic tied [EXACT]" is partly tautological.** r_eff := 1/(2(1 - theta)) for any abscissa theta, so
   "all three have effective order 4" restates "all three equal 7/8". Only the first two items follow from one
   formula (sigma0 on L1); the cubic Framework A item uses a different definition (r/lambda*).
6. **Verdict line is unqualified.** "No row order and no mixture gives an abscissa below B_XS" rests on: the 6 -> r
   transplant (MODEL), the a-rule under the mu_2n-in-K hypothesis (PROVED-rel), and recalled literature for
   non-existence of a = 2 reflections. In the note's own table, r = 3, 4, 5 at a = 2 give 0.743, 0.810, 0.849, all
   below B_XS. The obstruction for r <= 5 is exactly the value of a, which is not a theorem here.
7. Table versus log: r = 4 and r = 12 Framework A values in the table (8/9, 0.96104) come from `finegrid.log`;
   `models.log` gives 569/640 and 173/180 on the coarse grid. Not an error, but the citation "scripts models.py" is incomplete.

## Is the obstruction real? One way around

Not closed by the note:
* conjugate-paired product rows (item 1), whose diagonal density is that of order 2;
* an intermediate dual exponent 2 < a < e for r in {3,4,5} obtained in mean square over h rather than from the
  individual functional equation (the model threshold in a between "below B_XS" and "trivial" is not computed);
* r = 4 over Q(i) and r = 5 over Q(zeta_5), where the note's own weakest step 1 says the functional-equation
  hypothesis fails and the a-rule is not established.

## Surviving claim

PROVED: Theorem 1(a),(c),(d),(e) at primes and squarefree moduli; nu is an involution with nu(r) = 3 iff r = 6;
Theorem 4(i); filter constants; G1. MEASURED: identities to 1.7e-14 (F_p) and 7.5e-15 (F_{p^2}).
MODEL: sigma0(r), the table, G2, G3, the mixture statement, and "no order goes below 0.874886647".
Not established: Theorem 4(ii) in stated generality; the TRO6 = cubic-R2 identification as an equivalence.
