# pick-hankel: second referee pass on the first reviewer's verdict (2026-11-20)

Scripts and logs of this pass: `referee/` (ref_mp.py, ref_hank.py, ref_nodes.py, ref_*.log).
All runs under `scripts/memcap.sh 8`, python-flint, at most 4 processes. CPU total about 1190 s (20 CPU-minutes).

## 1. What I re-ran (own code, different route from the first reviewer)

| Run | Method | Result |
|---|---|---|
| ref_mp.py (mpmath, 30 digits) | Davenport-Heilbronn function written with the two Dirichlet L-functions mod 5 (not the Hurwitz form); numerical 2nd and 4th derivative of log xi_DH at 1/2 | off-line zero 0.8085171825 + 85.6993484854 i recovered; mu_0 = 0.09806957695333636694, mu_1 = 0.00174850493920385439 (same digits as the reviewer); xi_DH(0.8) = xi_DH(0.2) |
| ref_hank.py, K = 80, 9000 bits | Taylor coefficients of xi_DH itself (not of its logarithm), power sums by Newton's identities, pivot = ratio of leading-minor determinants (arb_mat.det) | H0: one negative pivot, at 75, value -4.0568531e-569; H1: one, at 75, -2.3051111e-572; no undecided sign |
| ref_hank.py, K = 116, 16000 bits | same | H0 negative at [75, 110] (-4.0568531e-569, -1.3328164e-889); H1 at [75, 109] (-2.3051111e-572, -3.5749717e-886); all other signs 1..116 certified positive. Pivots agree with the reviewer's to the 8 digits printed |
| ref_nodes.py near, 154 nodes, 9000 bits | DH Pick matrix, random log-uniform nodes in [0.01, 0.5], random order, right-looking elimination in balls | negative pivots [149, 150] |
| ref_nodes.py rand, 162 nodes | random log-uniform in [0.01, 100] | [153, 154] |
| ref_nodes.py mix, 162 nodes | alternating: one node in [0.01, 0.5], one in [10, 60] | [155, 156] |
| ref_nodes.py cheb, 162 and 230 nodes | Chebyshev points of [10, 60], shuffled | none through 162; with 230 nodes: [163, 164, 230] |
| ref_nodes.py int, 170 nodes | x = 1, 2, ..., 170 | none through 170 (positive definite, all pivots certified) |

Not re-run by me: the K-node certificate (k_node_certificate.py / cert2.py, about 5 minutes per K) and the Lean
compile. I read the Lean statements (no sorry / admit / axiom / native_decide by grep).

## 2. Is the first verdict's "confirmed-weaker-statement" deserved?

Yes, with the following qualifications.

1. Part (3) (DH Hankel pivots 75, 110 / 75, 109): the reviewer's hank.py is the same formula as the lane's
   anchor_hankel.py retyped (log series, hand LDL). My route differs in the series object, the moment computation
   and the pivot computation, and gives identical pivots. This part is independently confirmed.
2. Part (1) (K <= 12, and the reviewer's extension to 13, 14): the reviewer ran a copy of the lane's certificate
   script with two repairs. That is a replay of one code path, not an independent verification. K = 13 and 14
   exist only as one run by the reviewer with no second reader. The honest wording is: K <= 12 certified by the
   lane with one internal referee; the same script also passes 13 and 14 in one replay. I did not find an error,
   and I did not re-derive lemmas T and W.
3. Node dependence is stronger than the first verdict says. On the same interval [10, 60] the reviewer's
   van der Corput family fails first at 158; Chebyshev points fail first at 163; integer nodes 1..170 do not fail
   at all. The second pair (218/219) also moves (third negative pivot at 230 for the Chebyshev set). So the public
   sentence "the first failing Pick order is N* = min(2 K0 - 1, 2 K1)" and "the failure orders 149, 150, 218, 219"
   are statements about the jet matrix at the centre (and, measured, about node sets inside about [0.01, 4]); for a
   general real node set the first failing order is a function of the set. In all 9 families run by the two
   referee passes the first failure is >= 149; that 149 is the minimum over all node sets is not proved.
4. First verdict, error item 4 ("negative pivots = number of off-line quartets is Grommer-Chebotarev") is
   overstated. The Chebotarev count as quoted in Baric-Stampach is for a function with finitely many (m) non-real
   pairs and uses the Hankel matrix with weight lambda^-2, i.e. H1 only. DH has infinitely many off-line zeros, so
   the theorem gives no per-order count, and H0 (weight lambda^-1) is the Stieltjes-side matrix not covered by that
   statement. The lane's "equality not established" stands for the finite-order question it asks.

## 3. Literature (5 searches, 2 abstract fetches; abstracts only)

- Grommer 1914 / Chebotarev, as Theorem in Baric-Stampach arXiv:1708.07729: confirmed by search (secondary source).
- S. Sra, "On some positivity properties of the Riemann Xi function", arXiv:2611.02944 (2 Nov 2026): exists; abstract
  states PF_k for k* = 1,810,540,931,075 from the verified height 3e12, and a converse. Confirms the reviewer's citation.
- Missed by the first reviewer: Bickel, Pascoe, Sargent, "Zero-free regions near a line", arXiv:2108.04807: truncated
  Hankel positivity conditions from Taylor coefficients at real points of genus-one entire functions, applied to
  zeta as a family of relaxations of RH; finite truncations only push possible off-line zeros away. This is the
  closest prior work to the "finite order of the Hankel pair sees only low zeros" reading of part (3).
- Also relevant: local matrix-monotonicity = positivity of the Hankel matrix of Taylor coefficients (Dobsch,
  Donoghue; Pascoe and Tully-Doyle for the free version). Hinkkanen / Lagarias on Re xi'/xi > 0.
- Not found: a K-node Pick statement for xi'/xi from verified height; the DH orders 75/109/110. Li coefficients for
  the DH function exist in the literature (extended Selberg class papers, 2016) but I found no Hankel-order data.
- The search is short. It cannot exclude that these numbers appear under other names.

## 4. Scores

- Arbitrariness 4 (unchanged). Canonical: the splitting 2 H0 (+) 2 H1 (classical) and the DH pivot indices 75,
  110 / 75, 109, which are invariants of the moment sequence of the standard DH function at its centre. Not
  canonical: "12" (the certificate's stopping point; the heuristic reach of verified height is of the order of the
  number of verified zeros, and a different kernel reaches 1.8e12 in the literature) and "149/150/218/219" as Pick
  orders (node-set dependent: 149 to 163 or absent through 170 in the runs above).
- Importance 2 (unchanged; lower end). Part (1) is a weak corollary of Platt-Trudgian, part (2) is classical,
  part (3) is certified data on one function. Nothing constrains zeros of zeta or the de Bruijn-Newman constant.

## 5. One-line statement

The first verdict's line says "positive for up to 14 nodes" (should be positive semidefinite, 12 refereed
internally, 13-14 from one replay) and "later for nodes further out" (measured on examples; an earlier failure for
some node set is not excluded). Corrected line is in the structured verdict.
