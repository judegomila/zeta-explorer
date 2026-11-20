from lag import *
for N in [50,100,200]:
    for c in [-0.05,-0.02,0.02,0.05]:
        o=orbit(N,'heat',c=c); print(N,c,'crit',o['ncrit'],'bad',o['nbad'],'fracneg %.5f'%o['fracNegTrue'])
