# 🏠 S-Home - Akıllı Ev Yönetim ve Veritabanı Paneli



**S-Home**, modern web teknolojileri kullanılarak tasarlanmış, "Cyberpunk" ve "Glassmorphism" estetiğine sahip, tamamen responsive (mobil uyumlu) bir akıllı ev yönetim paneli simülasyonudur.

Bu proje sadece bir arayüz tasarımı değil; aynı zamanda **Veritabanı Yönetimi (CRUD)**, **Güvenlik Simülasyonu** ve **Dinamik Profil Yönetimi** gibi işlevsel senaryoları JavaScript ile simüle eden kapsamlı bir Frontend projesidir.

---

## 🚀 Canlı Önizleme / Demo

https://smart-home-security-veri-taban.vercel.app/

🔐 **Giriş Şifresi:** `1234`


## 🛠️ Kullanılan Teknolojiler

Bu proje herhangi bir harici kütüphane kurulumu gerektirmez (Node.js vb. gerekmez), doğrudan tarayıcıda çalışır.

* ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) **HTML5:** Semantik yapı.
* ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS:** Hızlı ve modern stillendirme (CDN üzerinden).
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) **Vanilla JavaScript:** Tüm mantık, simülasyonlar ve DOM manipülasyonu.
* **Chart.js:** Enerji tüketimi grafikleri için.
* **Phosphor Icons:** Modern ikon seti.

---

## ✨ Özellikler

### 1. 📊 Gelişmiş Dashboard
* Anlık saat ve tarih göstergesi.
* Sıcaklık, güvenlik durumu ve enerji tüketimi özet kartları.
* **Chart.js** ile görselleştirilmiş haftalık enerji tüketim grafiği.
* Canlı kamera önizleme kartı (Zoom efektli).

### 2. 🗄️ Veritabanı Yönetim Paneli (CRUD Simülasyonu)
Projenin en güçlü özelliklerinden biridir. SQL mantığı JavaScript dizileri (Arrays) ile simüle edilmiştir.
* **Tablolar:** Kullanıcılar, Mülkler, Cihazlar ve Loglar arasında geçiş yapabilme.
* **Create (Ekle):** Form üzerinden tabloya yeni veri ekleme.
* **Read (Oku):** Verileri dinamik tabloda listeleme.
* **Update (Güncelle):** Mevcut satırları düzenleme modu.
* **Delete (Sil):** Satırları tablodan silme.
* *Canlı İstatistikler:* Veri eklendikçe veya silindikçe yukarıdaki sayaçlar anlık güncellenir.

### 3. 🔒 Güvenlik ve Kameralar
* **Sistem Kontrolü:** Tek tuşla sistemi "Kur" veya "Devre Dışı Bırak".
* **Kamera İzleme:** Salon, Mutfak, Bahçe ve Giriş için özelleştirilmiş kamera görünümleri.
* **Multi-View Modal:** Bir odaya tıklandığında açılan detaylı pencerede, o odanın farklı açılardan (PTZ simülasyonu) görüntüleri.

### 4. 📱 Tam Mobil Uyumluluk (Responsive)
* Masaüstünde sabit duran Sidebar, mobilde **Hamburger Menü** ile açılır/kapanır.
* Grid yapısı ekran boyutuna göre (1, 2, 3 veya 4 sütun) otomatik şekillenir.
* Mobilde `100dvh` kullanımı ile tam ekran deneyimi.

### 5. 👤 Dinamik Profil
* Kullanıcı adı, soyadı veya rolü değiştirildiğinde, **Sol Menü (Sidebar)** dahil tüm uygulamada isim anında güncellenir.
* Kişiselleştirilebilir ayarlar (Tema, Bildirimler vb.).

---

## 📂 Dosya Yapısı

Proje, kolay taşınabilirlik için **Tek Dosya (Single File)** yapısında veya modüler yapıda kullanılabilir. Şu anki sürüm tüm kodları tek dosyada barındırır.

```text
S-Home-Project/
│
├── index.html          # Tüm HTML, CSS ve JS kodlarını içerir.
├── README.md           # Proje dokümantasyonu.
└── screenshots/        # (Opsiyonel) Ekran görüntüleri klasörü.
