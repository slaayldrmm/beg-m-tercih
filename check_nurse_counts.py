import pdfplumber
import os

files = {
    "2024/5": ("dataraw/tablo3_ssd21022024.pdf", "dataraw/minmax_lisansdt04032024.pdf"),
    "2025/4": ("dataraw/tablo3_sb4d02052025.pdf", "dataraw/minmaxlisans_sb4d14052025.pdf"),
    "2025/5": ("dataraw/tablo3_sbpd29092025.pdf", "dataraw/minmax_lisanssb5d14052025.pdf"),
}

for period, (t3_file, mm_file) in files.items():
    print(f"\n--- DÖNEM: {period} ---")
    
    # Check minmax
    with pdfplumber.open(mm_file) as pdf:
        nurse_rows = 0
        total_rows = 0
        min_p = 999.0
        max_p = 0.0
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                for row in table:
                    if not row or len(row) < 7:
                        continue
                    code = str(row[0]).strip()
                    if not code.isdigit():
                        continue
                    total_rows += 1
                    # unvan column is index 2
                    unvan = str(row[2]).strip().upper()
                    if "HEM" in unvan:
                        nurse_rows += 1
                        try:
                            p_str = str(row[-2]).replace(",", ".").strip()
                            p = float(p_str)
                            if p < min_p: min_p = p
                            if p > max_p: max_p = p
                        except:
                            pass
        print(f"MinMax Toplam Kadro Satırı: {total_rows}")
        print(f"MinMax 'Hemşire' Satırı: {nurse_rows}")
        print(f"MinMax Hemşire Puan Aralığı: {min_p} - {max_p}")
