# Independent review

Foundations lane independently reviewed GREEN_ARITHMETIC_BRIDGE.md and confirmed:

- exact derivative-profile kernel and factor h²−v²;
- scalar ODE, Green sign and multiplier normalization;
- PD boundary multiplier via the positive strip Poisson kernel;
- Epstein third-shift derivative coefficient1/512 and v² first-derivative term;
- finite-head cutoff inversion, monotonicity and positive reserve normalization;
- scalar mass ratio as a necessary, not sufficient, relative test;
- Gaussian counterexample to inferring relative PD domination from a small mass or pointwise bound;
- interval Simpson implementation and complete tail bounds for C_(1/2)(0).

Reviewer requested explicit endpoint-serialization inflation. The code now adds1e−30 before storing C and q; this is far above40-digit conversion uncertainty and far below the displayed conservative margins. The rerun preserves the stated numerical bounds.

Status: reviewed scoped bridge/obstruction and total-mass certificate. No global relative inequality(4), all-height low-order positivity, arbitrary-node PD claim or RH proof is established.
