import json, zeros
res = []
for sg, t in [(0.65, 50.0), (0.8, 50.0)]:
    r = zeros.find(sg, t, na=100, nb=900); res.append(r)
    print(sg, t, "W_boundary", r["W_boundary"], "W_cells", r["W_cells"], "sumSignJ", r["sumSignJ"], "n", r["nzeros"],
          "fails", sum(z.get("x") is None for z in r["zeros"]), "outside", sum(z.get("x") is not None and not z["inK"] for z in r["zeros"]),
          "|cellw|>1", sum(abs(z["cellw"]) > 1 for z in r["zeros"]), flush=True)
json.dump(res, open("zeros_fine.json", "w"))
