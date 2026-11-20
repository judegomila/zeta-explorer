# Proposed patches to files outside the edit scope of this lane (not applied)

This lane may edit `engine/` and `campaign/` only. The owed text repairs that live in lane files and in the map are listed
here for the next lane allowed to edit `push/`.

1. `push/c19-u4-joint-prime-phase-quadratic-dp-zeros/RESULT.md`, lines 10, 41, 120, 149, 201, 214: replace "E_a, DEL and the
   Liouville twist pass every step" (and its variants) by "E_a and DEL pass every step; the Liouville twist passes only for
   P <= 12 and fails the cross-sign step at p q^2 (first atom n = 12, -1.5230)"; line 120: "among sign chains exactly
   eps = +1 passes at every P".
2. `push/c19-rs-real-zero-completion-band-server/RESULT.md`: verdict item 1, replace "Lemma P (PROVED): T_sigma >= 0 on every
   band" by "Lemma P': T_sigma >= -eps(m, u, t_w) on the mode space V_m; eps <= 3.3e-10 in every cell run"; tolerance
   max(0, -lambda_min(E(u))) + eps; Lemma P (iii) with "- eps"; delete "k_sigma is positive definite on R" for the
   constructed sigma (list in `push/c20-referee-theorem-d-headline-and-r19/REFEREE2-c19-rs-real-zero-completion-band-server.md`,
   lines 55 to 62).
3. `push/c19-d10-xd-determinant-pole-term-lemma-q/RESULT.md` line 69: "X(d), d even: N is positive semidefinite for every
   symmetric set of d zeros."; section 3.5: "NL(d), d even". Map row D10: the same two words.
4. `push/OBSTRUCTION_MAP.md` row O1: add the pointer "current text: `campaign/STATEMENT_O.md` (version 5.1 = version 5 accepted
   with corrections C2, C4, the source field of lines 1, 5, 7 and the MV-CAP statement of line 10)".
5. `push/c20-repair-owed-record-r19-statement-o-v5/RESULT.md`: header "one float check of five quoted numbers" -> "one float
   check of the quoted facts listed in section 3" (C5); section 2.6: "`lanesRefereed` 163 rested on the lane-commissioned
   report at the time" (C3).
6. `push/c20-statement-o-line4-heat-zero-enclosures-server/RESULT.md` line 85: "(recalled, not opened)" -> "(opened by the
   round-21 record lane: Theorem 5.1, hypotheses and bound (5.6) as quoted in `campaign/SOURCES_R21.md`)".
7. `push/c20-euler-shape-rigidity-infinite-modified-primes/RESULT.md` lines 197, 373: Bohr's inequality "as recalled" ->
   "statement opened (Maurizi-Queffelec, arXiv:0805.0825v1, display (1.6)); proof relative to the Bohr lift (1.5)".
