# Reader brief (stack-combinator sub-task)

Base dir: tmp/research-2026-11-16/
Context: a campaign of ~80 research lanes on the Riemann hypothesis. Each lane dir has RESULT.md and often REFEREE.md
(an adversarial referee report; where the referee refuted or downgraded a step, the referee's status wins).
I am building one table of every PROVED or MEASURED *mechanism* (an identity, inequality, positivity statement,
structural property, no-go theorem) and how each fares against four controls. You read an assigned group of
directories completely (RESULT.md and REFEREE.md, in full, not skimmed) and return table rows. Read-only: do not
run numerics, do not edit anything except your one output file.

The four controls (objects for which RH-type conclusions are FALSE, so any hypothesis they satisfy cannot alone prove RH):
- DH: Davenport-Heilbronn function (same functional equation, no Euler product, off-line zeros).
- HEAT: backward heat family (kernel e^{tau u^2/16} kappa with tau<0; i.e. H_t with t<0 slightly; has non-real zeros if Lambda>=0 binding).
- TWIST: sign-twisted primes Lambda(n) -> eps_n Lambda(n), |eps_n|<=1 (keeps size/positivity-of-|.|/support of Lambda, destroys multiplicativity; where eps_n>=0 is allowed vs signed matters, note which).
- EA: E_a(s) = zeta(s+a) zeta(s-a), 0<a<1/2 (Euler product, Lambda-coefficients >= 0, FE s<->1-s, but coefficients of size n^a, poles at 1+-a, zeros at Re = 1/2 +- a).

For each mechanism emit one row with these fields:
- id: <lane-slug>/<short label e.g. ThmF>
- statement: one or two precise sentences (formulas in plain ASCII), enough to reuse without reopening the file
- status: PROVED / CLASSICAL / MEASURED / REFUTED-BY-REFEREE / CONJECTURE (after the referee)
- constrains: what object it constrains (zero-side form, prime side, Hankel block, density exponent, etc.) and whether it gives any zero-location info
- uses: which inputs it uses (functional equation only / Lambda>=0 / multiplicativity (Euler product as product) / Hecke / verified height / size normalisation / none)
- DH, HEAT, TWIST, EA: for each one of: PASS (the control satisfies the statement, so it cannot separate zeta from the control), FAIL (the control violates it), N/A (statement not formulable for the control), or ? (not determined). Append "(stated)" if the lane or referee explicitly says/measures it, "(inferred)" if you deduce it from the "uses" field; give a half-line reason for inferred ones. Be conservative: use ? rather than guess.
- note: referee caveats, key numbers, file path of the script if a numerical test exists.

Include no-go theorems too (e.g. "any argument using only X holds for control Y") as rows with type NO-GO. Skip pure bookkeeping, restatements of earlier lanes, and exponent-optimisation numerics unless they are a mechanism. Aim for the 3-8 most reusable rows per lane; fewer for thin lanes. Also, at the end, add a short list "COMBINATION LEADS": any place where a lane says two mechanisms might combine, or names the exact missing lemma that would turn its structure into a zero-location statement (quote the lemma precisely, with file and section).

Write the rows as markdown to the output file named in your task, then hand back a 10-line summary (number of rows, the 5 rows you judge most important for building a conjunction that all four controls violate, and the combination leads).
