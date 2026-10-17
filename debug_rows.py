import os, pdfplumber
pdf_path = os.path.join('data','raw','tablo3_sb4d02052025.pdf')
with pdfplumber.open(pdf_path) as pdf:
    for pi in [1,2,3,4,5,6,7,8,9,10,15,17,18,19,20,31,41,43,44,45,46,47,54,83,104,159,178,182,194,199,207,228,230,232,234,239,241,249,253,255,257,258,266,267]:
        p = pdf.pages[pi-1]
        tables = p.extract_tables()
        print('PAGE', pi, 'tables', len(tables))
        if not tables:
            continue
        for ti, table in enumerate(tables[:2]):
            print('TABLE', ti, 'ROWS', len(table))
            for r in table[:5]:
                print(r)
        print('---')
