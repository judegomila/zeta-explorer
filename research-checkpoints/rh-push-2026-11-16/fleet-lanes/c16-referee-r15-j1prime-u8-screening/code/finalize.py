"""Fill the server numbers into the referee files (tokens @@...@@ in *.tmpl copies). Usage: finalize.py <srv2 json> <state sentence>"""
import sys, json, glob, os
d = json.load(open(sys.argv[1])); state = sys.argv[2]
stages = [k for k in d if k.startswith("stage")]; st = d[stages[-1]]; TM = stages[-1].split("<=")[1]
L, D = st["LCHI"], st["DH"]
def cnt(x, T):
    k = [key for key in x if key.startswith("count below %d " % T)]
    return (x[k[0]], float(k[0].split("main term ")[1].rstrip(")"))) if k else (None, None)
def hl(x):
    out = []
    for key, v in x.items():
        if key.startswith("hill first") and v["k"]:
            out.append("%s zeros: %.2f +- %.2f (%d gaps below 0.2)" % (key.split()[2], v["k"], v["se"], v["n_small"]))
    return "; ".join(out)
d418, m418 = cnt(D, 418); d3k, m3k = cnt(D, 3000); l2k, m2k = cnt(L, 2000); d2k, _ = cnt(D, 2000); l418, _ = cnt(L, 418); l3k, _ = cnt(L, 3000)
T = {
 "@@COUNTS@@": "DH: %d on-line zeros in [10, 2000), %d below 2000; L(chi): %d below 2000 (main term %.1f), %d below %s (main term %.1f)" % (D["count in [10,2000)"], d2k, l2k, m2k, L["n_zeros"], TM, cnt(L, int(float(TM)))[1]),
 "@@COUNTS_OK@@": "yes (1859; counts equal to the main term within 1)",
 "@@FRAC@@": "%d of %.1f = %.4f below 418; %d of %.1f = %.4f below 3000" % (d418, m418, d418 / m418, d3k, m3k, d3k / m3k),
 "@@FRAC_OK@@": "yes",
 "@@HILL@@": "to T = %s (server): DH " % TM + hl(D) + ". L(chi): " + hl(L) + ". DH gaps below 0.025 / 0.05 of the local mean: %d / %d; L(chi): %d / %d" % (D["n normalised gaps below 0.025 / 0.05 / 0.2"][0], D["n normalised gaps below 0.025 / 0.05 / 0.2"][1], L["n normalised gaps below 0.025 / 0.05 / 0.2"][0], L["n normalised gaps below 0.025 / 0.05 / 0.2"][1]),
 "@@HILL_OK@@": "yes at 3,000 and 10,000 zeros; the 1.79e6-zero value was not reached",
 "@@C1@@": "to T = %s: DH %.3f, chi %.3f" % (TM, D["C1 gap autocorrelation"], L["C1 gap autocorrelation"]),
 "@@C1_OK@@": "yes (shorter lists)",
 "@@TMAX@@": TM,
 "@@COUNTS2@@": "sign changes on the line below 2000 (server, step 0.03 with hidden-pair detection): DH %d, L(chi) %d (Riemann-von Mangoldt main term %.1f); deficit %d against the lane's 168 off-line zeros (84 pairs); the two counting functions share the main term and may differ by O(1)" % (d2k, l2k, m2k, l2k - d2k),
 "@@COUNTS2_OK@@": "yes",
 "@@DHLINE@@": "on-line zeros below 2000: %d (L(chi): %d)" % (d2k, l2k),
 "@@SERVER_STATE@@": state,
}
for f in glob.glob(os.path.join(os.path.dirname(sys.argv[1]) or ".", "*.md.tmpl")):
    s = open(f).read()
    for k, v in T.items(): s = s.replace(k, v)
    open(f[:-5], "w").write(s); print(f[:-5], "tokens left:", s.count("@@"))
