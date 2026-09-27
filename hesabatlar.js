document.addEventListener("DOMContentLoaded", function () {
    const umumiAlisCemi = document.getElementById("umumiAlisCemi");
    const umumiSatisCemi = document.getElementById("umumiSatisCemi");
    const umumiQazanc = document.getElementById("umumiQazanc");

    // Sifarişləri localStorage-dən oxuyuruq
    let sifarisler = JSON.parse(localStorage.getItem("selloraSifarisler")) || [];

    let toplamAlis = 0;
    let toplamSatis = 0;

    sifarisler.forEach(sifaris => {
        // Yalnız "Çatdırıldı" statusundakı sifarişlər hesabata daxil edilir
        if (sifaris.status === "Çatdırıldı") {
            let alis = parseFloat(sifaris.alisQiymeti) || 0;
            let satis = parseFloat(sifaris.satisQiymeti) || 0;
            let kuryer = parseFloat(sifaris.catdirilmaQiymeti) || 0;

            // Ümumi alış xərci = Alış qiyməti + Kuryer xərci
            toplamAlis += (alis + kuryer);
            toplamSatis += satis;
        }
    });

    let qazanc = toplamSatis - toplamAlis;

    // Nəticələri HTML elementlərinə yazırıq
    if (umumiAlisCemi) {
        umumiAlisCemi.innerText = toplamAlis.toFixed(2) + " AZN";
    }
    if (umumiSatisCemi) {
        umumiSatisCemi.innerText = toplamSatis.toFixed(2) + " AZN";
    }
    if (umumiQazanc) {
        umumiQazanc.innerText = qazanc.toFixed(2) + " AZN";
        // Əgər qazanc müsbətdirsə yaşıl, mənfidirsə qırmızı rəng olsun
        umumiQazanc.style.color = qazanc >= 0 ? "#10b981" : "#ef4444";
    }
});