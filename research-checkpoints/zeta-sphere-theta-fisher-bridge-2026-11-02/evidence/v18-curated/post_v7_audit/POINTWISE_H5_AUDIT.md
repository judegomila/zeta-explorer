# Pointwise H5 obstruction: independent audit

2 November2026,21:14UTC. PASS. This is outside immutable v7.

Read campaign-authored h4_attack_v1/certify_pointwise_h5_obstruction.py and independently replayed copy h5_replay.py. Exact output matches the author's intervals, including negative odd3x3 determinant approximately-1.1946774304288649e16.

The code encloses the full theta-tail correction through ordinary z-derivative order10, with finite n<=6 plus a geometric n>=7 bound. The ratio estimate (8/7)^24 exp(-15z)<1/2 remains valid forz>=3. Dividing out2z-3 via the differentiated product recurrence, then differentiating log(1+r), is exact. First-term log derivatives use the correct Stirling expansion of sum m^(k-1)t^m. The exponential Bell coefficient recurrence yields the normalized fiber moments mu_n=(-1)^n d_v^(2n)[psi(h-v)psi(h+v)/psi(h)^2] at h0. The odd3x3 Hankel determinant with moments mu1..mu5 is computed correctly, and its upper interval endpoint is strictly negative.

Thus the original Bell-fiber matrix at h=0 fails positivity at H5. By continuity this persists near zero. The bridge measure itself vanishes at h=0, and integration over all h may repair this local negativity. Therefore this is NOT an integrated H5 negative witness, NOT a violation of the newly proved H3 determinant, and NOT a counterexample to RH. It rules out the strategy of proving every original fiber matrix positive at every h and then merely integrating. A successful all-order proof must exploit integration/cancellation or a different positive representation.

The script's inherited top docstring says pointwiseH4, while its actual K10 odd3x3 computation is H5; this is a cosmetic label to correct in the author's next freeze, not a mathematical discrepancy.
