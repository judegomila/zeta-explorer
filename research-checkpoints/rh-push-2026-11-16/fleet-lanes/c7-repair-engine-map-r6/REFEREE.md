# REFEREE (general lens): c7-repair-engine-map-r6

2026-11-18. Adversarial pass on `RESULT.md` and on `push/c6-marks-bc-manuscript-check/REFEREE2.md`, which this lane
wrote. Sources read as text: manuscript `~/lean-deps/qrh-verify/paper.txt` lines 366-404, 512-523, 3098-3125,
3180-3362, 4300-4340; map rows P50, P51, G27-G30, Z15, Z15c, Z23-Z26; `engine/IDEA_GRAPH.json`, `CANDIDATES.json`,
`outcomes.json`, `nodes/nodes-17.json`; diffs against `before/` and `engine_before/`. One local run through
`scripts/memcap.sh 8` (scratch script kept outside the repo at /tmp/ref_c7r6/chk.py, stdlib, under 5 s; only this file was written here). No ssh. No statement about zeros of
zeta is made in the result or here. RH open.

## Verdict

**Holds as a partial result (repair lane), with five corrections.** Every step labelled as confirmed in section 1
was re-derived here from the manuscript text and stands. The bookkeeping counts were recounted from the files and
agree. E1 and E2 need a follow-up edit; none changes the headline. Flags: R1, R2, R3, R4 all false (agree).

## Re-derivations (all confirmed)

- Local factor. From (7.11), (7.12) at u = 1 (j = 0, rho = 1), V = W = q = 1/Q, D = eta(p) Q^(-s),
  R = a_p^2 Q^(3-6s): bracket = R - Dq - D + qR = (1+q)(R-D); P_p = (1+q)(1 - D(1-q) - Rq)/((1-q)(1-R));
  H_p = (1-q^2)(1 - D(1-q) - Rq)/((1-R)(1-D)). Same as the lane.
- Table (7.16), j = 0 rows, summed with exact geometric sums at a general point (V != W, 400 random rational
  points, different seed and different method from `ref2_hp.py`): equal to (7.11) exactly; (7.17) reproduced
  exactly; specialisation equals the closed form exactly (output: True True True).
- E-form and E'-form: both identities checked by hand. Exponents 2 - 6 sigma and 2 - 7 sigma give 1/2 and 3/7.
- Local non-vanishing: Q^(-1/2)(1 - 1/Q) + 1/Q = 0.625 at Q = 4, decreasing in Q; smallest unramified norm in
  Q(omega) is 4. Confirmed.
- a_p^2 = (alpha^(+-1) eta)^6 from (7.6); infinity type of frequency 6, gamma factor Gamma(w + 3), no trivial
  zeros in 0 <= Re w <= 1; zero set invariant under rho -> 1 - conj(rho). Zeros of H_eta in Re s > 1/2 are
  s = (3 + rho')/6, symmetric about 7/12, none with Re s >= 2/3. Confirmed (classical inputs, none new).
- MS consistency: 1 - 7/8 - 19/20 - 6(33/200) = -363/200. Confirmed.
- MS (10.1), (10.2): the manuscript uses (2.2) only at sigma_0 = 7/8 > 2/3; Lemma H does not contradict the
  manuscript. The result does not say otherwise.
- Counts: IDEA_GRAPH 1,612 nodes, 8,713 edges; generator meta rows 202, live 957, devices 58/6/4 (live 51/6/4),
  generated 41,507, scored 8,761, top 60 = 12 open / 48 floored / 0 closed; `lanes.jsonl` 58 non-empty lines; map
  515 lines, 166 id rows by regex, 7 lines replaced and none deleted relative to `before/`. Confirmed.

## Errors and corrections

**E1 (matters; map row Z24, REFEREE2 W2, STRATEGY ORDER-2 sentence, RESULT item 1).** The supremum in (2.2) is over
the half-plane Re s > sigma_0, which for every sigma_0 <= 2/3 contains Re s > 2/3. W2's own argument shows
sup over Re s > 2/3 of abs(H_eta) is infinite for every finite S. Written out: log L^S(w, psi) =
sum over split l of c_l l^(-w) + O(1), c_l = psi(p) + psi(pbar); sum abs(c_l)^2 / l^sigma = 2 log(1/(sigma-1)) + O(1)
because psi(p) conj(psi(pbar)) is the value of a Hecke character of frequency 12; abs(c_l) >= abs(c_l)^2 / 2; the
logs of rational primes are independent over Q, so Kronecker gives sup over t equal to sum abs(c_l) l^(-sigma),
which is unbounded as sigma -> 1+; E_eta and zeta_F^S(2)^-1 are bounded above and below there. Hence:

    (2.2) holds (for suitable S) if and only if sigma_0 > 2/3. It fails for EVERY sigma_0 <= 2/3 and every finite S,
    unconditionally, with no use of the zeros of L(w, psi_eta).

So (a) "(2.2) false for every sigma_0 < 7/12" is true but not sharp, and the zeros in [7/12, 2/3) are not what
refutes (2.2); (b) the clause in Z24 and W2 "for 7/12 <= sigma_0 < 2/3 it needs a zero-free region for
L(w, psi_eta)" reads as if (2.2) could hold there under a hypothesis: it cannot; (c) "(2.2) can hold only for
sigma_0 >= 7/12" in the text handed to the two round-7 lanes should read "only for sigma_0 > 2/3". The zeros are
what matters for the Lemma S variant (holomorphy of H_eta / L^S on Re s > B), where the binding abscissa lies in
[7/12, 2/3]; the two statements should be kept apart in Z24. A partial numeric illustration (not a proof;
psi = alpha^6, split primes up to 2e5): sum over l > 1000 of abs(c_l) l^(-sigma) = 0.058, 0.225, 0.326, 0.355 at
sigma = 1.2, 1.05, 1.01, 1.001, growing as the cutoff is raised.

**E2 (engine state; disclosed in section 2 but shipped).** The rerun of `merge_outcomes.py` changed
`c6-gl3-cover-epsilon-cocycle` and `c6-unreflected-marks-kd23` in `engine/outcomes.json` from verdict open to
closed while both carry refereeHolds = false (compared with `engine_before/outcomes.json`). The "54 closed" figure
includes them. Both list `map-open-1` as their only node, so they add to the rule that removes every candidate
containing `map-open-1`. The result records this as a pipeline finding and leaves it. A lane whose referee does not
hold is thereby counted as a closure; this conflicts with the map (Z23 "narrowed", kd23 row not entered). It should
be reverted or the merge rule fixed before the next generation round. Consequence for claim (2): "map-open-1
narrowed" and "open device node" are nominal; the node cannot appear in any candidate.

**E3 (engine, device state).** `map-open-9` has device state "closed" (binary) while its evidence text says the
density half was not run. The generator rejects any candidate containing a closed device, so untested density-type
combinations are rejected on the strength of a pointwise result plus a pointer to MV-CAP. The result's wording
"closed for pointwise outputs" is accurate; the stored state is wider than the wording.

**E4 (control sentence; RESULT section 5 and 6, map row Z24 control cell).** "Lemma H uses only complete
multiplicativity and abs(eta(p)) = 1, so it holds for THIN and unimodular twists" is correct only for the local
formula and the two factorisations (and the product form on Re s > 2/3). The global statements (continuation of
L(6s-3, psi), infinitely many zeros in 7/12 <= Re s < 2/3, symmetry about 7/12, Lemma S) use that (alpha eta)^6 is
a Hecke character; for a general unimodular completely multiplicative weight none of these is available. The
control cell should say "local identity only".

**E5 (independence and novelty of the second referee).** (i) REFEREE2 was written by the lane that also enters the
row and edits STRATEGY on the strength of it; it is a second derivation, not a referee separated from the map
edit. (ii) W2 and W4 coincide with E2(a) and E4 of the first referee (`REFEREE.md` lines 57-61, 70-71); they are
not new points, and the first referee's wording ("at 2/3 and below one needs the Lemma S variant") is the correct
one, see E1. (iii) `ref2_hp.py` is called an independent code path; it checks that four geometric row sums of
(7.16) add to (7.11), which the manuscript proof states in one line. It does not test Lemma 7.1. The stated
remainder "(1/3)^40" omits a constant factor (harmless). The result itself says Lemma 7.1 is not re-derived.

## Checks requested by the assignment

- Assumes RH or GRH: no. (1a) is conditional and labelled.
- Restates verified height: no.
- Known theorem presented as new: no; Hecke L-function facts are labelled classical. No source was opened for them.
- Zeta-only mechanism: none claimed; controls not applicable beyond E4.
- Not checked here: MS Lemma 7.1 from (7.10) and (7.8); Theorem B1' (1b); Lemma S (ii) => (i) in detail (W3's
  repair with Titchmarsh 3.9 Lemma alpha at radius 12 is of the right form if applied to the entire L-functions,
  not to H_eta, which is defined only on Re s > 3/7); full text of rows G27-G30, Z25, Z26 against their lanes.

## Surviving claim

Relative to MS Lemma 7.1 as printed: for the sextic probe, H_eta = zeta_F^S(2)^-1 L^S(6s-3, (alpha eta)^6) E_eta on
Re s > 1/2 with E_eta non-vanishing; H_eta has infinitely many zeros in 7/12 <= Re s < 2/3 and none to the right;
hypothesis (2.2) holds for suitable S exactly when sigma_0 > 2/3 and fails for every sigma_0 <= 2/3 (E1). Engine,
map and STRATEGY counts as stated, with the two over-closed outcome entries (E2) and the Z24 wording (E1, E4) to
repair.

## Requirement flags

R1 false, R2 false, R3 false, R4 false. No argument about zeros of zeta is made.
