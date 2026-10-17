# KPSS Sağlık Bakanlığı Yerleştirme Veri Sözlüğü (Data Dictionary)

Bu dizin, ÖSYM tarafından yayımlanan resmi tercih kılavuzları ve yerleştirme sonuçları belgelerinden üretilen normalize edilmiş veri setlerini içerir.

## Dosya Yapısı

- `placements.json`: İncelenen tüm dönemlere ait tüm sağlık personeli pozisyonlarının normalize edilmiş ana veri tablosu.
- `nurse_lisans.json`: Yalnızca "Hemşire (Lisans)" unvanına sahip, yerleştirme puanı oluşmuş kayıtların filtrelenmiş listesi.
- `provinces_summary.json`: İller bazında dönemlik toplam kontenjan, taban/tavan puan ve kontenjan türü dağılımlarını içeren optimize edilmiş özet veri.
- `validation_report.md` & `validation_report.json`: Kaynak PDF belgeleri ile karşılaştırmalı doğrulama raporu.

---

## Veri Şeması (`placements.json` ve `nurse_lisans.json`)

| Alan Adı | Tip | Açıklama | Örnek |
| :--- | :--- | :--- | :--- |
| `yil` | Integer | Atamanın yapıldığı yıl | `2025` |
| `donem` | String | ÖSYM atama dönem kodu | `"2025/5"` |
| `osym_kodu` | String | ÖSYM Tercih/Program Kodu (Benzersiz anahtar) | `"305010101"` |
| `sb_kodu` | String | Sağlık Bakanlığı Kurum/Birim Kodu | `"97821"` |
| `kadro_unvan` | String | Normalize edilmiş standart kadro unvanı | `"HEMŞİRE"` |
| `ogrenim_duzeyi` | String | Öğrenim seviyesi (Lisans) | `"Lisans"` |
| `il` | String | 81 il standardında il adı | `"ADANA"` |
| `kurum_adi` | String | Atama yapılan hastane, ilçe müdürlüğü veya sağlık merkezi | `"ADANA ALADAĞ TOPLUM SAĞLIĞI MERKEZİ"` |
| `teskilat` | String | Teşkilat yapısı (Taşra / Merkez) | `"TAŞRA"` |
| `kontenjan` | Integer | Açılan toplam kontenjan sayısı | `1` |
| `yerlesen` | Integer | Yerleşen aday sayısı | `1` |
| `bos_kalan` | Integer | Boş kalan kontenjan sayısı | `0` |
| `en_kucuk_puan` | Float | Yerleşen son adayın puanı (İl/Kurum Taban Puanı) | `82.00028` |
| `en_buyuk_puan` | Float | Yerleşen ilk adayın puanı (Tavan Puan) | `82.00028` |
| `kontenjan_turu` | String | Kontenjanın niteliği (Genel, Deprem Bölgesi, Aile Hekimliği vb.) | `"Aile Hekimliği (663 KHK 45/A)"` |
| `nitelik_kodlari` | Array[String]| Kılavuzda aranan özel şart/mezuniyet kodları | `["4605"]` |
| `aciklama` | String | Tercih kılavuzundaki özel atama açıklamaları | `""` |
| `kaynak_kilavuz` | String | Resmi tercih kılavuzunun adı | `"KPSS-2025/5 Tercih Kılavuzu (Tablo 3)"` |
| `kaynak_sonuc` | String | Resmi yerleştirme sonucu belgesinin adı | `"KPSS-2025/5 Yerleştirme Sonuçları (Lisans)"` |

---

## Normalizasyon Kuralları
1. **Unvan Eşleme:** ÖSYM font kodlamalarındaki bozukluklar ve farklı yazımlar (`HEMRE`, `HEMSIRE`) `config/profession_filter.json` üzerinden tek standart ada dönüştürülür.
2. **Öğrenim Seviyesi İzolasyonu:** Lisans mezuniyet şartı olan `4605` nitelik kodu ve lisans kılavuzları kullanılarak Ortaöğretim (lise) hemşirelik satırlarının karışması engellenmiştir.
3. **İl Haritası:** Şehir adları Türkiye'nin 81 resmi il adına göre standartlaştırılmıştır.
4. **Kontenjan Ayrımı:** Aynı il içindeki Genel hastane kontenjanları ile 663 KHK 45/A Aile Hekimliği birimleri, TSM'ler veya Deprem bölgesi kontenjanları ayrı kayıtlar olarak tutulur.
