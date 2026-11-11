"""Replay the preservation proof and the general-class counterexample."""
import json
import platform

import flint
import sympy

from theta_preservation_comparison_20261110 import run as comparison
from theta_preservation_wronskian_certificate_20261110 import run as wronskians
from theta_preservation_origin_20261110 import certify as origin
from theta_preservation_counterexample_20261110 import run as counterexample
from theta_preservation_actual_20261110 import run as asymptotic


def run():
    if not __debug__:
        raise RuntimeError('Run without Python optimization: proof assertions must remain active.')
    results={
        'comparison_and_tail':comparison(),
        'spatial_wronskians':wronskians(),
        'all_anchor_origin':origin(),
        'general_class_counterexample':counterexample(),
        'large_anchor_asymptotic':asymptotic(),
    }
    for name,result in results.items():
        if result['status']!='passed':
            raise AssertionError(name)
    return {
        'status':'passed',
        'environment':{'python':platform.python_version(),'python_flint':flint.__version__,
                       'sympy':sympy.__version__},
        'results':results,
        'actual_theta_first_reduction_full_class':'proved by these certificates and the analytic notes',
        'intrinsic_real_Pick_order':4,
        'finite_zero_verification_used':False,
        'general_class_preservation':'disproved by an explicit auxiliary pair at anchor 10',
        'arbitrary_depth_actual_theta_preservation':'unproved',
        'scope':'Computer-assisted mathematical arguments with fixed PR51 inputs; not a formal proof-assistant verification, external peer review, novelty claim, or RH proof.',
    }


if __name__=='__main__':
    print(json.dumps(run(),indent=2,sort_keys=True))
