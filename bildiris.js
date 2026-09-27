document.addEventListener("DOMContentLoaded", function () {

    const bildirisBtn = document.getElementById("bildiris");
    const bildirisPanel = document.getElementById("bildirisPanel");
    const bildirisSayi = document.getElementById("bildirisSayi");

    const BILDIRISLER_KEY = "selloraBildirisler";
    const STOK_KEY = "selloraStokSnapshot";


    // =====================================================
    // MÖVCUD BİLDİRİŞLƏRİ GÖTÜR
    // =====================================================

    function bildirisleriGetir() {
        return JSON.parse(
            localStorage.getItem(BILDIRISLER_KEY)
        ) || [];
    }


    // =====================================================
    // BİLDİRİŞLƏRİ YADDA SAXLA
    // =====================================================

    function bildirisleriYaddaSaxla(bildirisler) {
        localStorage.setItem(
            BILDIRISLER_KEY,
            JSON.stringify(bildirisler)
        );
    }


    // =====================================================
    // STOK SNAPSHOT GÖTÜR
    // =====================================================

    function stokSnapshotGetir() {
        return JSON.parse(
            localStorage.getItem(STOK_KEY)
        ) || {};
    }


    // =====================================================
    // STOK SNAPSHOT YADDA SAXLA
    // =====================================================

    function stokSnapshotSaxla(stoklar) {
        localStorage.setItem(
            STOK_KEY,
            JSON.stringify(stoklar)
        );
    }


    // =====================================================
    // MƏHSULA UNİKAL AÇAR VER
    // =====================================================

    function mehsulAcar(mehsul) {
        return String(
            mehsul.id ||
            mehsul.kod ||
            mehsul.mehsulKodu ||
            mehsul.ad ||
            mehsul.mehsulAdi ||
            mehsul.name ||
            "namelum"
        );
    }


    // =====================================================
    // MƏHSUL ADI
    // =====================================================

    function mehsulAdiGetir(mehsul) {
        return (
            mehsul.ad ||
            mehsul.mehsulAdi ||
            mehsul.name ||
            "Naməlum məhsul"
        );
    }


    // =====================================================
    // STOK SAYI
    // =====================================================

    function stokGetir(mehsul) {
        return Number(
            mehsul.say ??
            mehsul.miqdar ??
            mehsul.stok ??
            0
        );
    }


    // =====================================================
    // YENİ BİLDİRİŞ ƏLAVƏ ET
    // =====================================================

    function bildirisElaveEt(id, html) {
        const bildirisler = bildirisleriGetir();

        const varmi = bildirisler.some(function (bildiris) {
            return bildiris.id === id;
        });

        if (varmi) {
            return;
        }

        bildirisler.unshift({
            id: id,
            html: html,
            oxundu: false,
            tarix: Date.now()
        });

        bildirisleriYaddaSaxla(bildirisler);
    }


    // =====================================================
    // 1. MAĞAZA BİLDİRİŞİ (Xoş gəlmisiniz)
    // =====================================================

    function magazaBildirisiniYoxla() {
        const magazaAdi = localStorage.getItem("magazaAdi");

        if (!magazaAdi) {
            return;
        }

        const bildirisler = bildirisleriGetir();

        const magazaBildirisVar = bildirisler.some(function (bildiris) {
            return bildiris.id === "magaza-xos-geldiniz";
        });

        if (!magazaBildirisVar) {
            bildirisElaveEt(
                "magaza-xos-geldiniz",
                `
                <div class="bildiris-item" style="padding: 10px; border-bottom: 1px solid #eee;">
                    🎉 <strong>Xoş gəlmisiniz!</strong>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #555;">
                        <strong>${magazaAdi}</strong> mağazasına uğurla qoşuldunuz.
                    </p>
                </div>
                `
            );
        }
    }


    // =====================================================
    // 2. STOK BİLDİRİŞLƏRİ (5 və ya aşağı olanda)
    // =====================================================

    function stokBildirisleriniYoxla() {
        const mehsullar = JSON.parse(localStorage.getItem("mehsullar")) || [];
        const oncekiStoklar = stokSnapshotGetir();
        const yeniStoklar = {};

        mehsullar.forEach(function (mehsul) {
            const acar = mehsulAcar(mehsul);
            const ad = mehsulAdiGetir(mehsul);
            const stok = stokGetir(mehsul);

            yeniStoklar[acar] = stok;

            const oncekiStok = oncekiStoklar[acar];
            let stokAzalib = false;

            // Əgər ilk dəfə yoxlanılırsa və stok 5-dən aşağı/bərabərdirsə
            if (oncekiStok === undefined) {
                if (stok <= 5) {
                    stokAzalib = true;
                }
            }
            // Əvvəl 5-dən yuxarı olub, indi 5 və ya aşağı düşübsə VƏ YA stok dəyişibsə yenidən xəbərdar etmək üçün
            else if (oncekiStok > 5 && stok <= 5) {
                stokAzalib = true;
            } else if (oncekiStok <= 5 && stok !== oncekiStok) {
                // Əgər artıq az olan məhsulun stoku yenə azalıbsa (məsələn 4-dən 2-yə düşübsə)
                stokAzalib = true;
            }

            if (stokAzalib) {
                bildirisElaveEt(
                    "stok-azaldi-" + acar + "-" + stok,
                    `
                    <div class="bildiris-item" style="padding: 10px; border-bottom: 1px solid #eee;">
                        ⚠️ <strong>Stok azaldı!</strong>
                        <p style="margin: 5px 0 0 0; font-size: 13px; color: #555;">
                            <strong>${ad}</strong> məhsulundan artıq <strong>${stok} ədəd</strong> qaldı.
                        </p>
                    </div>
                    `
                );
            }
        });

        stokSnapshotSaxla(yeniStoklar);
    }


    // =====================================================
    // 3. BÜTÜN BİLDİRİŞLƏRİ YENİLƏ VƏ SAYI GÖSTƏR
    // =====================================================

    function bildirisleriYenile() {
        magazaBildirisiniYoxla();
        stokBildirisleriniYoxla();

        const bildirisler = bildirisleriGetir();
        const oxunmamislar = bildirisler.filter(function (bildiris) {
            return !bildiris.oxundu;
        });

        let panelHTML = `
            <div style="padding: 10px; font-weight: bold; border-bottom: 2px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
                <span>Bildirişlər</span>
            </div>
        `;

        if (bildirisler.length === 0) {
            panelHTML += `
                <p class="bildiris-yoxdur" style="padding: 15px; text-align: center; color: #888;">
                    Yeni bildiriş yoxdur.
                </p>
            `;
        } else {
            bildirisler.forEach(function (bildiris) {
                panelHTML += bildiris.html;
            });
        }

        if (bildirisPanel) {
            bildirisPanel.innerHTML = panelHTML;
        }

        // Qırmızı dairəvi say indikatoru
        if (bildirisSayi) {
            if (oxunmamislar.length > 0) {
                bildirisSayi.style.display = "flex";
                bildirisSayi.textContent = oxunmamislar.length;
            } else {
                bildirisSayi.style.display = "none";
            }
        }
    }


    // İlk işə düşmə
    bildirisleriYenile();


    // =====================================================
    // 5. 🔔 İKONA KLİK (Bildirişlər açılarkən oxunmuş etmək)
    // =====================================================

    if (bildirisBtn && bildirisPanel) {
        bildirisBtn.addEventListener("click", function (e) {
            e.stopPropagation();

            if (bildirisPanel.style.display === "block") {
                bildirisPanel.style.display = "none";
                return;
            }

            bildirisPanel.style.display = "block";

            // Paneli açanda oxunmamışları oxunmuş edirik ki, qırmızı say yox olsun
            const bildirisler = bildirisleriGetir();
            bildirisler.forEach(function (bildiris) {
                bildiris.oxundu = true;
            });
            bildirisleriYaddaSaxla(bildirisler);

            if (bildirisSayi) {
                bildirisSayi.style.display = "none";
            }
        });
    }


    // =====================================================
    // 6. PANELDƏN KƏNARA KLİK
    // =====================================================

    document.addEventListener("click", function (e) {
        if (
            bildirisPanel &&
            bildirisBtn &&
            !bildirisPanel.contains(e.target) &&
            !bildirisBtn.contains(e.target)
        ) {
            bildirisPanel.style.display = "none";
        }
    });


    // =====================================================
    // 7. STORAGE DƏYİŞƏNDƏ YENİLƏ
    // =====================================================

    window.addEventListener("storage", function (e) {
        if (e.key === "mehsullar" || e.key === "magazaAdi") {
            bildirisleriYenile();
        }
    });

});