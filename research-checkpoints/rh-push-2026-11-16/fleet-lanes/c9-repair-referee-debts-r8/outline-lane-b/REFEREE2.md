# Outline lane B debts (campaign/OBSTRUCTION_RECORD_OUTLINE.md section 2, last column), order 7, 10, 2, 4

2026-11-18, lane `c9-repair-referee-debts-r8`. Time allowed one of the four. No file outside this directory was
edited for this item. External requests used a generic client and carried no project details.

| debt | line of the outline | outcome |
|---|---|---|
| 7 | THIN: open the primary source for the ray-class short-interval statement (Hoheisel exponent in ray classes) | **not discharged; holds narrowed as before.** Primary text located and not openable (details below). THIN stays "proved-relative to Coleman 1990, Theorem 2.1, as quoted in two later papers" |
| 10 | a two-referee statement of MV-CAP in the form used | not reached |
| 2 | a single two-referee lemma "finite Pick orders are Euler-blind" | not reached |
| 4 | second referee on F1 (flow-blindness, `b-escape-law`) | not reached |

## Debt 7

Primary source: M. D. Coleman, "The distribution of points at which binary quadratic forms are prime", Proc. London
Math. Soc. (3) 61 (1990), 433-456, DOI 10.1112/plms/s3-61.3.433 (Crossref record read: title, journal and pages
agree with the citation used in `push/c5-thin-walk-replay/REFEREE2.md`).
- The DOI landing page and the publisher's PDF return HTTP 403 to a generic client. Unpaywall reports no open copy
  (`is_oa: false`).
- arXiv search (three queries: Hoheisel + Chebotarev; short intervals + Hecke characters + primes; Chebotarev +
  short intervals in the title) returns as the only relevant open text the secondary paper already used
  (arXiv:2008.09677, Khale, O'Kuhn, Panidapu, Sun, Zhang), which quotes Coleman's theorem and does not reprove it.
- One guessed address for an open copy of a different primary source (Balog-Ono, Chebotarev density theorem in
  short intervals) returned an unrelated file; it was not used.

What the THIN construction needs, restated so that a later lane can discharge it from any one primary text: for the
imaginary quadratic field K and every modulus f, some fixed theta < 1 and constants depending on f such that the
number of prime ideals of each ray class mod f with norm in (x, x + h] is asymptotic to h/(h_f log x) for
x^theta <= h <= x. The value of theta enters the control only through the error exponent of the counting function of
the thin set, eta = 1 - theta (Coleman's 19/24 corresponds to the 5/24 quoted for the continuation of the Euler factor of
THIN to Re x > b - 5/24); any theta < 1 gives a control with some eta > 0. Any
Hoheisel-type theorem for Hecke L-functions of a fixed conductor gives this (zero-density estimate of the form
N(sigma, T, chi) << T^(A(1 - sigma)) log^B T together with a zero-free region of Littlewood type); Coleman's theorem is
one such statement with theta = 19/24 + eps. No such statement was read in a primary text in this campaign.

Status line for the outline, unchanged: "THIN construction: proved-relative (short-interval statements quoted,
primary text not opened)". Owed: one primary text, read by a person or a lane with library access.

Caution on the restatement above: the relation eta = 1 - theta is this referee's reading of
`push/c5-thin-walk-replay/REFEREE2.md` (Lemma 1* needs H_K(theta) for some theta < 1 with constants depending on the
modulus); the lane's Lemma 1* was not re-derived here.

## Debts 10, 2, 4

Not started. They remain as listed in the outline. For debt 2 the present evidence is numerical (Davenport-Heilbronn
passes Pick positivity at orders 2 to 148 on nested nodes; `tmp/research-2026-11-16/euler/RESULT.md`), so a
two-referee lemma needs a statement first (for which node sets and orders), not only a second reading.
