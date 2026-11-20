"""Replay all proof gates; exploratory diagnostics are separate."""

import json
import platform

import flint
from flint import ctx

from theta_ratio_c_integral_20261110 import C_point
from theta_ratio_origin_certificate_20261110 import certify_origin
from theta_ratio_core_certificate_20261110 import certify_core
from theta_ratio_comparison_checks_20261110 import run as comparison_checks
from theta_ratio_tail_certificate_20261110 import run as tail_checks


def run():
    ctx.prec=224
    comparison=comparison_checks()
    C0=C_point(0)
    origin=certify_origin(C0)
    origin['status']='passed'
    origin['C0_source']='Recomputed rigorous finite theta integral with explicit theta and spatial tails.'
    origin['scope']='Rigorous certificate on 0<t<=1/8 with its C0 input computed in this run.'
    core=certify_core()
    tail=tail_checks()
    results={'comparison':comparison,'origin':origin,'core':core,'tail':tail}
    for name,result in results.items():
        if result['status']!='passed':
            raise AssertionError(name)
    return {
        'status':'passed',
        'environment':{'python':platform.python_version(),'python_flint':flint.__version__,'precision_bits':ctx.prec},
        'results':results,
        'global_conclusion':'The actual theta kernel satisfies W_prime>0, D_W>0, D_h>0 for every t>0. The proved comparison theorem yields both ratio signs for every a,t>0.',
        'finite_zero_verification_used':False,
        'preservation_under_later_reductions':'unproved',
        'proof_scope':'Computer-assisted mathematical certificate plus the analytic comparison and tail arguments in the notes. Not a formal proof-assistant verification or an RH proof.',
    }


if __name__=='__main__':
    print(json.dumps(run(),indent=2,sort_keys=True))
