# Preserved diagnostic status

All calculations use owned complete-theta interval code. No negative target conclusion follows from these inconclusive enclosures.

- `tail_old_cross_data_8000.json`: ordinary midpoint initial old/cross preparation.
- `next_tail_target_flow_4000.json` and `next_tail_target_flow_16000.json`: both parity target-gain intervals contain zero. Independent8000-preparation/16000-flow replay also inconclusive. All old-path metric checks passed. These files are retained as input-dependency diagnostics.
- `tail_cross_m8_8000.json`: earlier isolated cross-only preparation, not an input to the final successful checker.
- `next_tail_target_flow_refined_4000.json`: uses corrected old/cross inputs; even8 gain positive, odd9 inconclusive because its certified midpoint-flow error exceeds the gain.
- `next_tail_target_flow_refined_16000.json`: final refined run; both gain differences positive, subject to its separate complete review and freeze. It proves differences only, not absolute target positivity.

The first source invocation had a Python prefix-extraction SyntaxError before any numerical computation. It was fixed by loading the intended owned midpoint helper directly; no output certificate resulted from that invocation.
