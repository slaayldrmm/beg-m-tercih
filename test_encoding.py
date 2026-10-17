import pdfplumber

def test_char_fix():
    with pdfplumber.open("dataraw/minmax_lisansdt04032024.pdf") as pdf:
        table = pdf.pages[0].extract_tables()[0]
        for row in table[1:5]:
            print("Raw:", row[1], row[2])

test_char_fix()
