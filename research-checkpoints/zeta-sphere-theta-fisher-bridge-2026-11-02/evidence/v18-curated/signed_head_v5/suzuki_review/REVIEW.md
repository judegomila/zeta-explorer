# Independent Suzuki block review (in progress)

The independently authored replay_cholesky.py reads the serialized A,G matrices, uses exact-decimal interval centers, and enlarges each entry by 1.00001e-10. Both 100x100 interval Cholesky tests pass. The replay alone verifies the finite matrix inequalities, NOT the operator error budget.

Code inspection of certify_block.py: the real symmetric Schur condition rho I +/- A - G/(rho-d) - E I is appropriate if d bounds ||QHQ||, G approximates PHQHP, and E covers all approximation errors. The residual identity G=V*V-(PV)*(PV) is the right one for stepwise approximation V to HP.

Endpoint monotonicity concern resolved: before the lower primitive argument activates, its upper argument lies in (0,h), h<.007, where q2/q1<=2r exp(2.6r)<.015 and q>0. Once both arguments are positive, q(hi)-q(lo)<0 because q is strictly decreasing. Thus the first activation peak is on a grid boundary, not an unhandled interior extremum. The n=2 activation lies at the last fine-grid boundary by the exact R choice.

Awaiting the complete analytic translation and floating-roundoff budget before marking the full operator contraction reviewed.

Full BLOCK_CERTIFICATE.md inspected. Primitive formula and omega-derivative budgets check. The binary64 accumulation allowances are sufficient under the explicit standard-arithmetic assumptions; this is not a formal hardware verification. One minor sign premise requested for clarification: the exact translation-modulus equality uses q<0 throughout [R-h,R], so enclose q(R-h)<0 rather than only q(R)<0. An independent exploratory value is about -0.91788, leaving ample room; this number itself is not the proof. Final operator review awaits that explicit enclosure.

## Final status: PASS (stated numerical arithmetic assumptions)

The missing trailing-sign premise is now explicitly checked in certify_block.py by q(R-h)+1e-8<0. The rerun records q(R-h)=-0.9178817183729309, and both interval Cholesky tests again PASS. Read the final proof and revised code. The analytic primitive, signed high-block translation bound, aligned endpoint enclosures, residual-Gram construction, conservative floating-point allowances, and omega-parameter continuation are consistent. The independently authored replay validates both finite matrix inequalities with a slightly larger entry radius.

Accordingly the scoped theorem is accepted: at omega=2/5 and R=4,000,000 log2/3,999,999 the finite compression norm is <=.9999; for |omega-2/5|<=1e-8 it is <=.99991. Smaller interval compressions inherit the bound. This proves finite-interval bounded inverses I±H, not a determinant-class statement, global canonical system, RH, or positivity of the unrelated C_a kernel.

This review assumes standard correctly rounded basic binary64 operations and the stated interval implementation, as expressly documented. It is an independent mathematical/code audit and interval replay, not formal proof-assistant or hardware verification.
