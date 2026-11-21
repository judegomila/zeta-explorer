# VERDICT: catalan-ladder

Status: the two integral identities are correct; the interpretation placed on them ("period-dimension obstruction 2 vs 5",
"pi-column motivically forced") is not established and is contradicted in its strong form.

Confirmed (60-digit quadrature, residuals 3e-60 and 2e-61, plus hand derivation):
- int int (2x-1)(2y-1)/(1-xy) = 5 zeta(2) - 8
- int int (2x-1)(2y-1)/(1+x^2y^2) = G - pi + 2 ln2 + pi^2/12

Not supported:
1. The comparison is uncontrolled. The Catalan kernel uses x^2y^2 with a polynomial in x, a parity mismatch. The same mismatch in the
   zeta world gives 7pi^2/24 - 4 ln2. The matched chi4 device gives 24 - 12G - 4pi (span <1,G,pi>). Degree 0 gives G alone.
   The count "5" is a property of the chosen integrand.
2. The pi column is not forced on linear forms. Zudilin's 2003 recurrence produces rational u_n, v_n with u_n G - v_n -> 0
   (replayed exactly to n=39). Those forms live in <1,G>. They fail because decay 2.41 < denominator 8.77 per n, not because of pi.
3. "Dimension 5" is an upper bound on a span; linear independence of 1, G, pi, pi^2, ln2 is not known.
4. The page's "inflating beta just past alpha" has no computation behind it.
5. The build tripwires for the two identities compare literals to literals.

Weaker true statement: two elementary integral evaluations, and the standard observation that known linear forms in 1 and G
have denominators outgrowing decay. No consequence for RH or the de Bruijn-Newman constant (the page says so).

Literature: Beukers 1979; Zudilin EJC 10 (2003) R14 and arXiv math/0210423; Rivoal-Zudilin 2003; Calegari-Dimitrov-Tang arXiv:2408.15403.
Arbitrariness 5. Importance 1.
Files: replay.py, replay.out, NOTES.md in this folder.
