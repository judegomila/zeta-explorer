"""Replay every certificate used by the second-preservation checkpoint.

All moment coefficients are freshly recomputed. The same in-process
models are shared by the two compact anchor certificates. No diagnostic
or cached numerical file is accepted as an input to a proof gate.
"""
from pathlib import Path
import json
import platform
import time

if not __debug__:
    raise SystemExit('Do not disable proof assertions with Python -O.')

import flint
import sympy
import mpmath
from flint import ctx
import theta_higher_transfer_20261111 as higher
import theta_transfer_compensation_20261111 as compensation
import theta_second_source_algebra_20261111 as algebra
import theta_second_source_tail_20261111 as source_tail
import theta_second_source_obstruction_20261111 as obstruction
import theta_second_single_crossing_20261111 as crossing
import theta_second_origin_20261111 as second_origin
import theta_second_source_origin_compact_20261111 as first_origin_compact
import theta_second_source_origin_20261111 as first_origin_tail
import theta_preservation_origin_20261110 as previous_origin

ROOT=Path(__file__).resolve().parent


def save(name,value):
    (ROOT/name).write_text(json.dumps(value,indent=2,sort_keys=True)+'\n')


def main():
    start=time.monotonic()
    records={}
    def gate(name,fn,filename):
        before=time.monotonic()
        value=fn()
        if value.get('status')!='passed':
            raise AssertionError((name,value.get('status')))
        save(filename,value)
        records[name]={'status':'passed','seconds':round(time.monotonic()-before,3)}
        print(f'{name}: passed',flush=True)
        return value

    h=gate('higher_transfer',higher.run_checks,'theta_higher_transfer_replay_20261111.json')
    p=gate('single_crossing_compensation',compensation.run_checks,'theta_transfer_compensation_replay_20261111.json')
    a=gate('source_algebra',algebra.run,'theta_second_source_algebra_replay_20261111.json')
    t=gate('source_infinite_tail',source_tail.run,'theta_second_source_tail_replay_20261111.json')
    ctx.prec=320
    o=gate('source_obstruction',obstruction.certify,'theta_second_source_obstruction_replay_20261111.json')
    ctx.prec=512
    def run_crossing():
        return {'status':'passed','exact_checks':crossing.audit(),
                'monotonicity':crossing.source_monotonicity(),
                'positive_core':crossing.positive_core(),
                'scope':'Each source changes sign exactly once on t>0, combined with the separately replayed t>=4 tail.'}
    c=gate('source_single_crossing',run_crossing,'theta_second_single_crossing_replay_20261111.json')
    dep=gate('fixed_PR52_sixth_derivative_constants',previous_origin.certify,'theta_prior_origin_constants_replay_20261111.json')

    before=time.monotonic()
    origin_summary,models=second_origin.certify_compact(return_models=True)
    second={'status':'passed','compact':origin_summary,'tail':second_origin.exact_tail_checks(),
            'conclusion':"J_2''(0)>0 for all a,c>0, including coincident anchors.",
            'scope':'Second canonical theta origin slope; global preservation also uses the spatial comparison proofs.'}
    save('theta_second_origin_replay_20261111.json',second)
    records['second_origin_all_anchors']={'status':'passed','seconds':round(time.monotonic()-before,3)}
    print('second_origin_all_anchors: passed',flush=True)
    f=gate('first_source_origin_compact',
           lambda:first_origin_compact.certify(models=models,origin_summary=origin_summary),
           'theta_second_source_origin_compact_replay_20261111.json')
    ft=gate('first_source_origin_infinite_anchor_tail',first_origin_tail.certify,
            'theta_second_source_origin_replay_20261111.json')

    total_exact=(h['checks']+p['checks']+a['check_count']+t['check_count']
                 +o['exact_checks']+c['exact_checks']+second['tail']['exact_checks']
                 +f['identities_checked']+ft['exact_check_count'])
    new_cells=(o['cells']+c['monotonicity']['cells']+c['positive_core']['cells']
               +origin_summary['cells']+f['cells']+ft['global_twelfth_derivative']['cells'])
    result={'status':'passed','python':platform.python_version(),
            'versions':{'sympy':sympy.__version__,'python_flint':flint.__version__,
                        'mpmath':mpmath.__version__},
            'new_exact_checks':total_exact,'new_interval_cells':new_cells,
            'replayed_fixed_dependency_cells':dep['sixth_derivative_cells'],
            'fresh_moment_integrals':origin_summary['recomputed_moment_count'],
            'gates':records,'elapsed_seconds':round(time.monotonic()-start,3),
            'conclusion':'All stated algebra and interval gates passed. The companion analytic proofs combine them into second preservation and strict five-node real Pick positivity.',
            'limitations':'No formal proof-assistant verification, external peer review, sixth-order or arbitrary-order positivity, or RH proof is claimed.'}
    save('checks_replay.json',result)
    print(json.dumps(result,indent=2,sort_keys=True))


if __name__=='__main__':
    main()
