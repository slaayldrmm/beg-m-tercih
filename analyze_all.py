import pdfplumber
import os
import re

RAW_DIR = "dataraw"

def analyze_file(fname):
    fpath = os.path.join(RAW_DIR, fname)
    with pdfplumber.open(fpath) as pdf:
        total_pages = len(pdf.pages)
        title = ""
        for p in pdf.pages[:2]:
            t = p.extract_text()
            if t:
                lines = [l.strip() for l in t.split("\n") if l.strip()]
                if lines:
                    title = " | ".join(lines[:2])
                    break
        
        # Check first page table columns
        cols = []
        sample_rows = []
        for p in pdf.pages[:2]:
            tables = p.extract_tables()
            if tables and len(tables[0]) > 1:
                # determine header
                header = tables[0][0]
                if any("SYM" in str(c) or "Program" in str(c) or "Kurum" in str(c) for c in (tables[0][1] if len(tables[0])>1 else [])):
                    header = tables[0][1]
                    sample_rows = tables[0][2:5]
                else:
                    sample_rows = tables[0][1:4]
                cols = [str(c).replace("\n", " ").strip() for c in header if c is not None]
                break
        
        return {
            "fname": fname,
            "pages": total_pages,
            "title": title[:100],
            "cols": cols,
            "sample_first_row": sample_rows[0] if sample_rows else []
        }

print("=== DOSYA ANALİZİ ===")
for f in sorted(os.listdir(RAW_DIR)):
    if f.endswith(".pdf"):
        res = analyze_file(f)
        print(f"\nDosya: {res['fname']}")
        print(f"Sayfa Sayısı: {res['pages']}")
        print(f"Başlık / İlk Satır: {res['title']}")
        print(f"Sütunlar ({len(res['cols'])}): {res['cols']}")
        print(f"Örnek Satır: {res['sample_first_row']}")
