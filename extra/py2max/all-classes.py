from py2max import Patcher
from py2max.maxclassdb import MAXCLASS_DEFAULTS
from py2max.common import Rect

p = Patcher('all.maxpat')
y=20
for k,v in MAXCLASS_DEFAULTS.items():
    com_rect = Rect(x=20.0, y=y, w=200.0, h=18.0)
    p.add_comment(text=k, patching_rect=com_rect)
    y += 20
    def_rect=v["patching_rect"]
    obj_rect = Rect(x=20.0,y=y,w=def_rect.w, h=def_rect.h)
    p.add(k, patching_rect=obj_rect)
    y += obj_rect.h + 10.0

p.save()