import pdfplumber
import os

RAW_DIR = os.path.join(os.path.dirname(__file__), "dataraw")

for fname in sorted(os.listdir(RAW_DIR)):
    fpath = os.path.join(RAW_DIR, fname)
    with pdfplumber.open(fpath) as pdf:
        first_page = pdf.pages[0]
        text = first_page.extract_text()
        first_few_lines = text.split("\n")[:8] if text else []
        tables = first_page.extract_tables()
        print(f"=== {fname} ===")
        print(f"Pages: {len(pdf.pages)}")
        print("First lines:")
        for line in first_few_lines:
            print("  ", line)
        if tables:
            print("Table cols count:", len(tables[0][0]) if tables[0] else 0)
            print("Table row 0:", tables[0][0])
            if len(tables[0]) > 1:
                print("Table row 1:", tables[0][1])
            if len(tables[0]) > 2:
                print("Table row 2:", tables[0][2])
        print()
