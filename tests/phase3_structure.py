"""Small, dependency-free structural check for the static LAMSA routes."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
ROUTES = ['index.html','services/index.html','realisations/index.html','a-propos/index.html','lab/index.html','devis/index.html']

class Scan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.mains=0
        self.h1=0
        self.navigation=0
        self.resources=[]
        self.ids=set()
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='main': self.mains+=1
        if tag=='h1': self.h1+=1
        if tag=='nav' and a.get('class','').find('topbar-nav')!=-1: self.navigation+=1
        if 'id' in a:
            assert a['id'] not in self.ids, f'duplicate id {a["id"]}'
            self.ids.add(a['id'])
        for key in ('href','src'):
            value=a.get(key,'')
            if value and not value.startswith(('#','http:','https:','mailto:','tel:','data:','javascript:')):
                self.resources.append(value)

def run():
    count=0
    for name in ROUTES:
        path=ROOT/name
        assert path.is_file(),name
        parser=Scan(); parser.feed(path.read_text(encoding='utf-8'))
        assert (parser.mains,parser.h1,parser.navigation)==(1,1,1),(name,parser.mains,parser.h1,parser.navigation)
        for resource in parser.resources:
            split=urlsplit(resource)
            if not split.path: continue
            target=(path.parent/split.path).resolve()
            assert target.is_relative_to(ROOT), (name,'escaped root',resource)
            assert target.is_file() or (target.is_dir() and (target/'index.html').is_file()),(name,'missing',resource)
            if split.fragment:
                dest=target if target.is_file() else target/'index.html'
                scan=Scan();scan.feed(dest.read_text(encoding='utf-8'))
                assert split.fragment in scan.ids,(name,'unresolved anchor',resource)
            count+=1
        print(f'{name}: structure + {len(parser.resources)} ressources internes OK')
    print(f'{len(ROUTES)} routes, {count} ressources internes valides')

if __name__=='__main__':
    run()
