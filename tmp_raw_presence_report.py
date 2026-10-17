import os
import re
import pdfplumber
from collections import defaultdict

raw_dir = os.path.join('.', 'data', 'raw')
prov_names = [
    'ADANA','ADIYAMAN','AFYONKARAHİSAR','AĞRI','AMASYA','ANKARA','ANTALYA','ARTVİN','AYDIN','BALIKESİR','BİLECİK','BİNGÖL','BİTLİS','BOLU','BURDUR','BURSA','ÇANAKKALE','ÇANKIRI','ÇORUM','DENİZLİ','DİYARBAKIR','EDİRNE','ELAZIĞ','ERZİNCAN','ERZURUM','ESKİŞEHİR','GAZİANTEP','GİRESUN','GÜMÜŞHANE','HAKKARİ','HATAY','ISPARTA','MERSİN','İSTANBUL','İZMİR','KARS','KASTAMONU','KAYSERİ','KIRKLARELİ','KIRŞEHİR','KOCAELİ','KONYA','KÜTAHYA','MALATYA','MANİSA','KAHRAMANMARAŞ','MARDİN','MUĞLA','MUŞ','NEVŞEHİR','NİĞDE','ORDU','RİZE','SAKARYA','SAMSUN','SİİRT','SİNOP','SİVAS','TEKİRDAĞ','TOKAT','TRABZON','TUNCELİ','ŞANLIURFA','UŞAK','VAN','YOZGAT','ZONGULDAK','AKSARAY','BAYBURT','KARAMAN','KIRIKKALE','BATMAN','ŞIRNAK','BARTIN','ARDAHAN','IĞDIR','YALOVA','KARABÜK','KİLİS','OSMANİYE','DÜZCE'
]

def clean(x):
    if x is None:
        return ''
    x = str(x).replace('\n', ' ').replace('\r', ' ')
    return re.sub(r'\s+', ' ', x).strip()


def norm(s):
    s = clean(s).upper()
    s = s.replace('İ', 'I').replace('ı', 'i').replace('Ğ', 'G').replace('ğ', 'g')
    s = s.replace('Ü', 'U').replace('ü', 'u').replace('Ş', 'S').replace('ş', 's')
    s = s.replace('Ö', 'O').replace('ö', 'o').replace('Ç', 'C').replace('ç', 'c')
    return s

res = defaultdict(set)
for fn in sorted(os.listdir(raw_dir)):
    if not fn.startswith('tablo3_'):
        continue
    path = os.path.join(raw_dir, fn)
    with pdfplumber.open(path) as pdf:
        for pi, page in enumerate(pdf.pages, 1):
            for table in page.extract_tables() or []:
                for row in table:
                    if not row or len(row) < 7:
                        continue
                    code = clean(row[0])
                    if not (code.isdigit() and len(code) == 9):
                        continue
                    kurum = clean(row[2]) if len(row) > 2 else ''
                    il = clean(row[4]) if len(row) > 4 else ''
                    if not kurum or not il:
                        continue
                    for p in prov_names:
                        if norm(p) == norm(il) or (' ' + norm(p) + ' ') in (' ' + norm(il) + ' '):
                            res[p].add(f'{fn} s.{pi}')
                            break

var_provinces = [p for p in prov_names if res[p]]
yok_provinces = [p for p in prov_names if not res[p]]
print(f'VAR_COUNT={len(var_provinces)}')
print(f'YOK_COUNT={len(yok_provinces)}')
print('VAR=' + '; '.join(var_provinces))
print('YOK=' + ('; '.join(yok_provinces) if yok_provinces else 'YOK'))
for p in prov_names:
    pages = sorted(res[p])
    if pages:
        print(f'{p}: ' + '; '.join(pages[:5]) + ('; ...' if len(pages) > 5 else ''))
