document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. LOGIN SƏHİFƏSİ
    // ==========================================

    const loginForm = document.getElementById("loginForm");
    const loginMesaj = document.getElementById("loginMesaj");
    const magazaAdiInput = document.getElementById("magazaAdiInput");

    const saxlanilanMagaza = localStorage.getItem("magazaAdi");

    // Mağaza artıq varsa, birbaşa index.html-ə keç
    if (saxlanilanMagaza && loginForm) {
        window.location.replace("./index.html");
        return;
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            if (!magazaAdiInput) {
                return;
            }

            let magazaAdi = magazaAdiInput.value.trim();

            // Mağaza adı yoxlamaları
            const yalnizHerfReqemBosluq = /^[a-zA-ZəƏüÜöÖğĞşŞçÇıİ0-9\s]+$/.test(magazaAdi);
            const yalnizHerfler = magazaAdi.replace(/[^a-zA-ZəƏüÜöÖğĞşŞçÇıİ]/g, "");
            const temizAd = magazaAdi.replace(/\s/g, "").toLowerCase();
            const unikalHerfler = new Set(temizAd);

            if (
                magazaAdi.length < 3 ||
                !yalnizHerfReqemBosluq ||
                yalnizHerfler.length < 3 ||
                unikalHerfler.size <= 1
            ) {
                if (loginMesaj) {
                    loginMesaj.textContent = "Zəhmət olmasa düzgün mağaza adı daxil edin!";
                    loginMesaj.style.color = "#ef4444";
                    loginMesaj.style.fontWeight = "600";
                }
                return;
            }

            if (!magazaAdi.toLowerCase().endsWith("store")) {
                magazaAdi += " Store";
            }

            // 🟢 SERVERƏ VƏ TELEGRAMA SORĞU GÖNDƏRİRİK
            try {
                await fetch('/api/create-store', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        storeName: magazaAdi, 
                        userName: "Qoşqar Hüseynov" 
                    })
                });
            } catch (err) {
                console.error("Server bağlantı xətası:", err);
            }

            // Mağazanı yadda saxla
            localStorage.setItem("magazaAdi", magazaAdi);

            if (loginMesaj) {
                loginMesaj.textContent = "Mağaza uğurla yaradıldı: " + magazaAdi;
                loginMesaj.style.color = "#10b981";
                loginMesaj.style.fontWeight = "600";
            }

            setTimeout(function () {
                window.location.replace("./index.html");
            }, 1000);
        });
    }

    // ==========================================
    // 2. ANA SƏHİFƏ (MAĞAZA ADINI GÖSTƏR)
    // ==========================================

    const magazaGosterici = document.getElementById("magazaAdiGosterici");

    if (magazaGosterici) {
        const magazaAdi = localStorage.getItem("magazaAdi");

        if (magazaAdi) {
            magazaGosterici.textContent = magazaAdi;
        } else {
            window.location.replace("./login.html");
            return;
        }
    }

    // ==========================================
    // 3. PARAMETRLƏR (MAĞAZA ADINI DƏYİŞ)
    // ==========================================

    const magazadeyisInput = document.getElementById("magazadeyis");
    const magazaAdiniSaxlaBtn = document.getElementById("magazaAdiniSaxla");
    const magazaMesaj = document.getElementById("magazaMesaj");

    if (magazadeyisInput) {
        const cariAd = localStorage.getItem("magazaAdi");
        if (cariAd) {
            magazadeyisInput.value = cariAd;
        }
    }

    if (magazaAdiniSaxlaBtn) {
        magazaAdiniSaxlaBtn.addEventListener("click", function () {
            if (!magazadeyisInput) return;

            let yeniAd = magazadeyisInput.value.trim();
            const yalnizHerfReqemBosluq = /^[a-zA-ZəƏüÜöÖğĞşŞçÇıİ0-9\s]+$/.test(yeniAd);
            const yalnizHerfler = yeniAd.replace(/[^a-zA-ZəƏüÜöÖğĞşŞçÇıİ]/g, "");
            const temizYeniAd = yeniAd.replace(/\s/g, "").toLowerCase();
            const unikalHerfler = new Set(temizYeniAd);

            if (
                yeniAd.length < 3 ||
                !yalnizHerfReqemBosluq ||
                yalnizHerfler.length < 3 ||
                unikalHerfler.size <= 1
            ) {
                if (magazaMesaj) {
                    magazaMesaj.textContent = "Zəhmət olmasa düzgün mağaza adı daxil edin!";
                    magazaMesaj.style.color = "#ef4444";
                    magazaMesaj.style.fontWeight = "600";
                    magazaMesaj.style.fontSize = "13px";
                }
                return;
            }

            if (!yeniAd.toLowerCase().endsWith("store")) {
                yeniAd += " Store";
            }

            localStorage.setItem("magazaAdi", yeniAd);

            if (magazaMesaj) {
                magazaMesaj.textContent = "Mağaza adı uğurla yeniləndi!";
                magazaMesaj.style.color = "#10b981";
                magazaMesaj.style.fontWeight = "600";
                magazaMesaj.style.fontSize = "13px";

                setTimeout(function () {
                    magazaMesaj.textContent = "";
                }, 3000);
            }
        });
    }

    // ==========================================
    // 4. BÜTÜN MƏLUMATLARI SIFIRLA
    // ==========================================

    const sifirlaBtn = document.querySelector(".danger-btn");

    if (sifirlaBtn) {
        sifirlaBtn.addEventListener("click", async function () {
            const tesdiq = confirm("Bütün məlumatları və mağazanı silmək istədiyinizdən əminsinizmi?");

            if (!tesdiq) {
                return;
            }

            const silinecekMagaza = localStorage.getItem("magazaAdi");

            // 🔴 SERVERƏ SİLİnmə SORĞUSU GÖNDƏRİRİK
            try {
                await fetch('/api/delete-store', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        storeName: silinecekMagaza, 
                        userName: "Qoşqar Hüseynov" 
                    })
                });
            } catch (err) {
                console.error("Server xətası:", err);
            }

            localStorage.removeItem("mehsullar");
            localStorage.removeItem("satislar");
            localStorage.removeItem("sonMusteri");
            localStorage.removeItem("magazaAdi");

            alert("Məlumatlar uğurla sıfırlandı və mağaza silindi!");

            window.location.replace("./login.html");
        });
    }

});