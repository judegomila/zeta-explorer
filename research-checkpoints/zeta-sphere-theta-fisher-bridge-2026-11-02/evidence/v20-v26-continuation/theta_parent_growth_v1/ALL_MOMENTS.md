# Extension: every raised spatial moment, without raising jet degree

Status: exact extension of GROWTH.md, pending independent review. Same actual theta profile and parameters0<=a<=1/2,0<=lambda<=1.

Let p have degree<=n, f=p(-iD)g, P=||f||_2², and let r>=0 be an integer. Set w=n+r+1 and H=log(10w). Then
 integral_{|u|>=H}(1+|u|^{2r})|f|²du <=exp(-250w²)P,
 and consequently
 ||u^r f||_2 <=sqrt(H^{2r}+exp(-250w²))||f||_2 <(H^r+1)||f||_2.
In particular the mixed moment hierarchy's raised spatial weights are controlled explicitly in the same positive parent norm, without invoking higher derivatives of psi.

Proof modifications to GROWTH.md:
1. Retain its coefficient-level point bound |f(+/-h)|²<=||c||²exp(B(h)-2z), z=pi exp2h. Replacing n+1 by the larger w only enlarges all coefficient prefactor bounds. Thus at h=H, B(H)<=81w² as before.
2. Since H>1,
 log(1+h^{2r})<=log2+2r log h.
At H, this is at most1+2wH<=1+2w(w+2)<=7w². Therefore B(H)+log(1+H^{2r})<=88w²<z(H)/2.
3. For h>=H, the derivative of the added weight logarithm is <=2r/h<=2w. The derivative of the entire left exponent is at most4h+6w+10, which at H is <=10w+18<300w²<=z(H). The difference z-(4h+6w+10) increases thereafter. Hence for every h>=H,
 (1+h^{2r})|f(+/-h)|² <=||c||²exp(-3z/2)<=||c||²exp(-z).
4. With h=H+s, z>=300w²+600w²s. Integrating both tails gives at most
 ||c||²exp(-300w²)/(300w²).
The positive-parent coefficient coercivity from GROWTH.md is ||c||²<=16*9^{n+1}(n+1)²P. Since n+1<=w, the relative bound is at most
 (16/300)9^w exp(-300w²)P <=exp(-250w²)P.
No signed bridge positivity or spectral-measure assumption is used.

The cutoff depends on BOTH n and r. This is not a fixed-tail or finite-orbit uniform approximation, and does not undo the established high-jet modular cutoff obstruction. Comparing the resulting positive-parent quantities with the signed Schur residual is still the missing step.
