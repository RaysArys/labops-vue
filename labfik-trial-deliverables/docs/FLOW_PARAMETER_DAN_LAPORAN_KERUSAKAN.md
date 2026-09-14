# Flow Parameter Kalibrasi dan Laporan Kerusakan

## Pembagian kewenangan

| Aktor | Tugas |
|---|---|
| Kepala Lab | Membuat dan mengubah standar minimum/maksimum per kategori aset; meninjau hasil; menentukan prioritas Work Order; mencetak dan menandai laporan telah dikirim ke Wakil Dekan |
| Laboran | Memasukkan nilai aktual pengukuran saat kalibrasi atau kondisi fisik saat Stock Opname |
| Sistem | Membandingkan nilai aktual dengan snapshot standar dan menentukan `lulus` atau `tidak_lulus` |
| Teknisi | Menangani Work Order dan mencatat hasil perbaikan |
| Wakil Dekan | Melihat laporan kerusakan yang telah ditandai dikirim dan mencetaknya kembali |

## Aturan parameter

- Minimum saja berarti nilai aktual harus lebih besar atau sama dengan minimum.
- Maksimum saja berarti nilai aktual harus lebih kecil atau sama dengan maksimum.
- Minimum dan maksimum berarti nilai aktual harus berada di dalam rentang, termasuk kedua batas.
- Setiap hasil menyimpan snapshot nama parameter, satuan, dan batas. Perubahan master berikutnya tidak mengubah riwayat lama.
- Parameter awal yang dipasang dari feedback UPN adalah `Memory idle / standby`, maksimum `20%`, untuk kategori `Server / PC`.
- Nilai standar temperatur serta read/write disk belum diisi karena angka resminya harus ditetapkan pihak Lab FIK.

## Alur kalibrasi

1. Kepala Lab membuka **Kalibrasi → Master parameter** dan menentukan standar kategori aset.
2. Laboran memilih jadwal, lalu mengisi nilai aktual pada **Catat hasil**.
3. Sistem menandai setiap item sebagai **Normal** atau **Tidak normal**.
4. Semua normal menghasilkan `lulus`; minimal satu tidak normal menghasilkan `tidak_lulus`.
5. Kepala Lab meninjau hasil. Penolakan teknis otomatis membuat Work Order.

## Alur laporan kerusakan

1. Kerusakan berasal dari Stock Opname, Kalibrasi, atau laporan manual Laboran.
2. Sistem membuat Work Order untuk Kepala Lab dan Teknisi.
3. Kepala Lab menentukan prioritas dan dapat mencetak laporan kerusakan.
4. Setelah laporan dikirim secara manual, Kepala Lab menekan **Tandai dikirim**.
5. Laporan baru muncul pada menu **Laporan Kerusakan** milik Wakil Dekan.
6. Wakil Dekan dapat melihat detail dan mencetak laporan, tetapi tidak dapat mengubah Work Order.
