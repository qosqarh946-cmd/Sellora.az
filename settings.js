document.addEventListener("DOMContentLoaded", function () {
    const sifirlaBtn = document.querySelector(".danger-btn");
    const mesaj = document.getElementById("sifirlamaMesaj");
    const modal = document.getElementById("tesdiqModal");
    const heriBtn = document.getElementById("tesdiqHeri");
    const legvBtn = document.getElementById("tesdiqLegv");

    if (sifirlaBtn) {
        // Mövcud klik hadisələrinin qarşısını almaq üçün düyməni təmizləyirik
        sifirlaBtn.replaceWith(sifirlaBtn.cloneNode(true));
        const yeniSifirlaBtn = document.querySelector(".danger-btn");

        yeniSifirlaBtn.addEventListener("click", function () {
            if (modal) {
                modal.style.display = "flex";
            }
        });
    }

    if (legvBtn) {
        legvBtn.addEventListener("click", function () {
            if (modal) {
                modal.style.display = "none";
            }
        });
    }

    if (heriBtn) {
        heriBtn.addEventListener("click", async function () {
            // Məlumatları təmizləməzdən əvvəl mağaza adını yadda saxlayırıq
            const silinecekMagaza = localStorage.getItem("magazaAdi");

            // 🔴 Serverə və Telegram-a bildiriş göndəririk
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

            // LocalStorage məlumatlarını təmizləyirik
            localStorage.removeItem("mehsullar");
            localStorage.removeItem("selloraSifarisler");
            localStorage.removeItem("magazaAdi");

            if (modal) {
                modal.style.display = "none";
            }

            if (mesaj) {
                mesaj.style.color = "#ef4444";
                mesaj.innerText = "Məlumatlar sıfırlandı!";
            }

            // Bir müddət sonra login səhifəsinə yönləndiririk
            setTimeout(() => {
                window.location.replace("./login.html");
            }, 1500);
        });
    }
});