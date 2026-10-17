"""
PDF structure inspection script.
Reads the first few pages of each PDF and prints tables/text to understand structure.
"""
import pdfplumber
import os

RAW_DIR = os.path.join(os.path.dirname(__file__), "dataraw")

files = sorted(os.listdir(RAW_DIR))
print(f"Found {len(files)} files in /dataraw:\n")

for fname in files:
    fpath = os.path.join(RAW_DIR, fname)
    print("=" * 70)
    print(f"FILE: {fname}  ({os.path.getsize(fpath)//1024} KB)")
    print("=" * 70)
    try:
        with pdfplumber.open(fpath) as pdf:
            print(f"  Total pages: {len(pdf.pages)}")
            # Inspect first 2 pages
            for i, page in enumerate(pdf.pages[:3]):
                print(f"\n  --- Page {i+1} ---")
                # Try to get tables
                tables = page.extract_tables()
                if tables:
                    print(f"  Tables found: {len(tables)}")
                    for t_idx, table in enumerate(tables[:1]):
                        print(f"  Table {t_idx+1} shape: {len(table)} rows x {len(table[0]) if table else 0} cols")
                        print(f"  Header row: {table[0]}")
                        if len(table) > 1:
                            print(f"  Row 1: {table[1]}")
                        if len(table) > 2:
                            print(f"  Row 2: {table[2]}")
                        if len(table) > 3:
                            print(f"  Row 3: {table[3]}")
                else:
                    # Fallback: raw text
                    text = page.extract_text()
                    if text:
                        lines = text.split('\n')[:15]
                        print(f"  No tables found. First {len(lines)} text lines:")
                        for line in lines:
                            print(f"    {line}")
                    else:
                        print("  No text extracted.")
    except Exception as e:
        print(f"  ERROR: {e}")
    print()
