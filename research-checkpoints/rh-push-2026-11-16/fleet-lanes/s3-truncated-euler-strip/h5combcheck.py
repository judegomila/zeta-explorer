import sys
from h5lib import *
D=sys.argv[1]
# (0,2e8] + (1e8,3e8] - (1e8,2e8] must equal (0,1e8] + (1e8,3e8]
a=load_multi([D+'h5_pc.bin',D+'h5_pb.bin','-'+D+'h5_pd.bin']); b=load_multi([D+'h5_pa.bin',D+'h5_pb.bin'])
print(int(a['C'].sum()),int(b['C'].sum()),float(np.abs(a['G'].astype(float)-b['G'].astype(float)).max()),a['X'],b['X'])
