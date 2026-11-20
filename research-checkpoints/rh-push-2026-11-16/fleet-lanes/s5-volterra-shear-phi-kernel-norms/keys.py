# kernel lists shared by the four combinations
HEATS = ['heat-0.5', 'heat-0.2', 'heat-0.1', 'heat-0.05', 'heat0.05', 'heat0.1', 'heat0.2', 'heat0.5']
MAIN = ['zeta', 'chi-4', 'chi5', 'chi-3', 'chi-7', 'chi8',
        'E_b=0.125', 'E_b=0.25', 'NR(1000003,2.2)', 'NR(1000003,1.9)', 'NR(3,2.2)', 'NR(3,1.9)',
        'DH'] + HEATS + ['heat-2.0', 'liouville', 'gauge0.3',
        'zeta_lead', 'lead(4,1)', 'lead(5,0)', 'lead(5,1)', 'DH_lead', 'zeta_repo']
ROLE = {'zeta': 'target', 'chi-4': 'comparison', 'chi5': 'comparison', 'chi-3': 'comparison', 'chi-7': 'comparison',
        'chi8': 'comparison'}
