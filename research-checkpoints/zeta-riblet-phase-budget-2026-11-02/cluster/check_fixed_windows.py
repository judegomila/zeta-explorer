"""Complete-theta endpoint tests on every four-unit cell of [32,64]."""
import json
from math import factorial

from certify_actual_window import I
from certify_centroid_shear import count
from check_theta_centroid import theta_moments


def evaluate_jet(coefficients, delta):
    jet = []
    for row in coefficients:
        value = row[-1]
        for coefficient in reversed(row[:-1]):
            value = value*delta+coefficient
        jet.append(value+I('-1e-55','1e-55'))
    return jet


def cell_test(left, cells):
    moments = theta_moments(left+2, 98)
    coeff = [[moments[j+k]/factorial(k) for k in range(97)] for j in range(3)]
    f_left, df_left, _ = evaluate_jet(coeff, I(-2))
    f_right, df_right, _ = evaluate_jet(coeff, I(2))
    endpoint_drop = df_left/f_left-df_right/f_right
    mass = I(0)
    minimum = None
    intervals = [(k, cells) for k in range(cells)]
    depth_used = cells
    while intervals:
        k, mesh = intervals.pop()
        delta = I(-2*mesh+4*k,-2*mesh+4*k+4)/mesh
        f, df, ddf = evaluate_jet(coeff, delta)
        low = (df.square()-f*ddf).lo
        if low <= 0:
            if mesh >= 4096:
                return dict(interval=[left,left+4], shear_certified=False,
                            endpoint_pass=False, unresolved_cell=[k,mesh])
            intervals.extend([(2*k,2*mesh),(2*k+1,2*mesh)])
            continue
        depth_used = max(depth_used,mesh)
        minimum = low if minimum is None else min(low,minimum)
        # Under the no-zero hypothesis this lower bound is valid on the entire
        # cell, including when the enclosure for f happens to contain zero.
        mass += (I(low)/I(f.absup()).square())*4/mesh
    return dict(interval=[left,left+4], shear_certified=True, finest_theta_mesh=depth_used,
                shear_lower=str(minimum), curvature_integral_lower=str(mass.lo),
                endpoint_drop_upper=str(endpoint_drop.hi),
                endpoint_pass=bool(mass.lo>endpoint_drop.hi))


def certify():
    rows = []
    for left in range(32,64,4):
        row = cell_test(left,128)
        for mesh in (4096,8192,16384,32768,65536):
            try:
                n = count(left,left+4,mesh)
                break
            except ValueError as exc:
                if str(exc) != "unresolved zero-free boundary" or mesh == 65536:
                    raise
        row['contour_cells_per_side'] = mesh
        row['strip_count'] = n
        # Nonreal copies come in pairs. A positive L makes any real roots simple.
        lower = max(n % 2, int(row['endpoint_pass']))
        if lower % 2 != n % 2:
            lower += 1
        if lower > n:
            raise ValueError("line lower bound exceeds strip count")
        row['line_copies_lower'] = lower
        rows.append(row)
    return dict(height_rule="all eight consecutive width-four cells of [32,64]",
                initial_theta_subcells_per_window=128, windows=rows)


if __name__ == '__main__':
    print(json.dumps(certify(),indent=2))
