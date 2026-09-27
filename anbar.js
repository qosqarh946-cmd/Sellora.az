// ==========================================
// 1. MƏHSUL ƏLAVƏ ETMƏ — INDEX.HTML
// ==========================================

const mehsulForm = document.getElementById("mehsulForm");

if (mehsulForm) {

    const mehsulBtn = document.getElementById("mehsulBtn");
    const mehsulSekli = document.getElementById("mehsulSekli");

    // ==============================
    // ŞƏKİL ÖNİZLƏMƏ
    // ==============================

    if (mehsulSekli) {

        mehsulSekli.addEventListener("change", function () {

            const fayl = this.files[0];

            if (!fayl) return;

            const reader = new FileReader();

            reader.onload = function (e) {

                let sekilOnizleme =
                    document.getElementById("sekilOnizleme");

                if (!sekilOnizleme) {

                    sekilOnizleme = document.createElement("img");

                    sekilOnizleme.id = "sekilOnizleme";

                    sekilOnizleme.style.width = "80px";
                    sekilOnizleme.style.height = "80px";
                    sekilOnizleme.style.objectFit = "cover";
                    sekilOnizleme.style.borderRadius = "10px";
                    sekilOnizleme.style.marginTop = "10px";
                    sekilOnizleme.style.display = "block";

                    mehsulSekli.insertAdjacentElement(
                        "afterend",
                        sekilOnizleme
                    );
                }

                sekilOnizleme.src = e.target.result;
            };

            reader.readAsDataURL(fayl);
        });
    }


    // ==============================
    // MƏHSUL ƏLAVƏ ET
    // ==============================

    mehsulForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const fayl =
            document.getElementById("mehsulSekli")?.files[0];


        // Şəkil varsa oxu
        if (fayl) {

            const reader = new FileReader();

            reader.onload = function (e) {

                mehsulYaddaSaxla(e.target.result);

            };

            reader.readAsDataURL(fayl);

        } else {

            // Şəkil seçilməyibsə
            mehsulYaddaSaxla("");

        }

    });


    // ==============================
    // MƏHSULU YADDA SAXLA
    // ==============================

    function mehsulYaddaSaxla(sekil) {

        const yeniMehsul = {

            id: Date.now(),

            ad:
                document
                    .getElementById("mehsulAdi")
                    .value
                    .trim(),

            kod:
                document
                    .getElementById("mehsulKodu")
                    .value
                    .trim(),

            kateqoriya:
                document
                    .getElementById("kateqoriya")
                    .value
                    .trim(),

            stok:
                parseInt(
                    document
                        .getElementById("stokSayi")
                        .value
                ) || 0,

            // MƏHSUL ŞƏKLİ
            sekil: sekil
        };


        let mehsullar =
            JSON.parse(
                localStorage.getItem("mehsullar")
            ) || [];


        mehsullar.push(yeniMehsul);


        localStorage.setItem(
            "mehsullar",
            JSON.stringify(mehsullar)
        );


        // ==============================
        // YAŞIL MESAJ
        // ==============================

        let mesaj =
            document.getElementById("mehsulMesaj");


        if (!mesaj) {

            mesaj = document.createElement("p");

            mesaj.id = "mehsulMesaj";

            mesaj.style.color = "#10b981";
            mesaj.style.fontWeight = "bold";
            mesaj.style.fontSize = "14px";
            mesaj.style.textAlign = "center";
            mesaj.style.marginTop = "8px";


            mehsulBtn.insertAdjacentElement(
                "afterend",
                mesaj
            );
        }


        mesaj.textContent =
            "Məhsul əlavə olundu";


        // FORMU TƏMİZLƏ
        mehsulForm.reset();


        // ŞƏKİL ÖNİZLƏMƏNİ SİL
        const sekilOnizleme =
            document.getElementById("sekilOnizleme");


        if (sekilOnizleme) {

            sekilOnizleme.remove();

        }


        setTimeout(function () {

            mesaj.textContent = "";

        }, 3000);
    }
}


// ==========================================
// 2. ANBAR PANELİ
// ==========================================

const anbarBody =
    document.getElementById("anbarBody");


if (anbarBody) {

    anbarGoster();


    // ==============================
    // ANBAR AXTARIŞI
    // ==============================

    const anbarAxtaris =
        document.getElementById("anbarAxtaris");


    if (anbarAxtaris) {

        anbarAxtaris.addEventListener(
            "input",
            function () {

                anbarGoster(this.value);

            }
        );
    }
}


// ==========================================
// 3. ANBARDA MƏHSULLARI GÖSTƏR
// ==========================================

function anbarGoster(axtarisMetni = "") {

    const anbarBody =
        document.getElementById("anbarBody");


    if (!anbarBody) return;


    const mehsullar =
        JSON.parse(
            localStorage.getItem("mehsullar")
        ) || [];


    anbarBody.innerHTML = "";


    // ==============================
    // AXTARIŞ
    // ==============================

    const axtaris =
        axtarisMetni
            .toLowerCase()
            .trim();


    const filtreliMehsullar =
        mehsullar.filter(function (mehsul) {

            return (

                mehsul.ad
                    .toLowerCase()
                    .includes(axtaris)

                ||

                (mehsul.kod || "")
                    .toLowerCase()
                    .includes(axtaris)

            );

        });


    // ==============================
    // MƏHSUL YOXDUR
    // ==============================

    if (filtreliMehsullar.length === 0) {

        anbarBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    ${
                        axtaris
                            ? "Məhsul tapılmadı"
                            : "Anbarda məhsul yoxdur"
                    }
                </td>
            </tr>
        `;

    } else {

        filtreliMehsullar.forEach(
            function (mehsul) {

                const tr =
                    document.createElement("tr");


                // ==============================
                // ŞƏKİL
                // ==============================

                let sekilHTML = "-";


                if (mehsul.sekil) {

                    sekilHTML = `
                        <img
                            src="${mehsul.sekil}"
                            alt="${mehsul.ad}"
                            style="
                                width:55px;
                                height:55px;
                                object-fit:cover;
                                border-radius:8px;
                                display:block;
                            "
                        >
                    `;

                }


                tr.innerHTML = `

                    <td>
                        ${sekilHTML}
                    </td>

                    <td>
                        ${mehsul.ad}
                    </td>

                    <td>
                        ${mehsul.kod || "-"}
                    </td>

                    <td>
                        ${mehsul.kateqoriya || "-"}
                    </td>

                    <td>
                        ${mehsul.stok}
                    </td>

                    <td>

                        <button
                            onclick="mehsulDeyis(${mehsul.id})"
                        >
                            Dəyiş
                        </button>


                        <button
                            onclick="mehsulSil(${mehsul.id})"
                        >
                            Sil
                        </button>

                    </td>

                `;


                anbarBody.appendChild(tr);

            }
        );
    }


    // ==============================
    // ÜMUMİ STOK HESABLA
    // ==============================

    let umumiStok = 0;


    mehsullar.forEach(
        function (mehsul) {

            umumiStok +=
                Number(mehsul.stok) || 0;

        }
    );


    const umumiStokElement =
        document.getElementById("umumiStok");


    const umumiCesidElement =
        document.getElementById("umumiCesid");


    if (umumiStokElement) {

        umumiStokElement.textContent =
            umumiStok;

    }


    if (umumiCesidElement) {

        umumiCesidElement.textContent =
            mehsullar.length;

    }
}


// ==========================================
// 4. MƏHSULU SİL
// ==========================================

function mehsulSil(id) {

    let mehsullar =
        JSON.parse(
            localStorage.getItem("mehsullar")
        ) || [];


    mehsullar =
        mehsullar.filter(
            function (mehsul) {

                return mehsul.id !== id;

            }
        );


    localStorage.setItem(
        "mehsullar",
        JSON.stringify(mehsullar)
    );


    anbarGoster();


    // SİLİNDİ MESAJI
    mesajGoster(
        "Məhsul silindi"
    );
}


// ==========================================
// 5. MƏHSULU DƏYİŞ
// ==========================================

function mehsulDeyis(id) {

    const mehsullar =
        JSON.parse(
            localStorage.getItem("mehsullar")
        ) || [];


    const mehsul =
        mehsullar.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!mehsul) return;


    // ƏVVƏLKİ PANEL VARSA SİL
    const kohnePanel =
        document.getElementById(
            "deyisPanel"
        );


    if (kohnePanel) {

        kohnePanel.remove();

    }


    // ==============================
    // DƏYİŞMƏ PANELİ
    // ==============================

    const panel =
        document.createElement("div");


    panel.id = "deyisPanel";


    panel.style.marginTop = "20px";
    panel.style.padding = "20px";
    panel.style.borderRadius = "12px";
    panel.style.background =
        "rgba(255,255,255,0.05)";


    panel.innerHTML = `

        <h3>Məhsulu dəyiş</h3>


        <div class="form-group">

            <label>Məhsul adı</label>

            <input
                type="text"
                id="deyisAd"
                value="${mehsul.ad}"
            >

        </div>


        <div class="form-group">

            <label>Məhsul kodu</label>

            <input
                type="text"
                id="deyisKod"
                value="${mehsul.kod || ""}"
            >

        </div>


        <div class="form-group">

            <label>Kateqoriya</label>

            <input
                type="text"
                id="deyisKateqoriya"
                value="${mehsul.kateqoriya || ""}"
            >

        </div>


        <div class="form-group">

            <label>Stok sayı</label>

            <input
                type="number"
                id="deyisStok"
                min="0"
                value="${mehsul.stok}"
            >

        </div>


        <button id="deyisYaddaSaxla">
            Dəyişiklikləri yadda saxla
        </button>


        <button id="deyisLegv">
            Ləğv et
        </button>


        <p id="deyisMesaj"></p>

    `;


    const container =
        document.querySelector(".container");


    container.appendChild(panel);


    // ==============================
    // YADDA SAXLA
    // ==============================

    document
        .getElementById(
            "deyisYaddaSaxla"
        )
        .addEventListener(
            "click",
            function () {

                let mehsullar =
                    JSON.parse(
                        localStorage.getItem(
                            "mehsullar"
                        )
                    ) || [];


                const secilen =
                    mehsullar.find(
                        function (item) {

                            return item.id === id;

                        }
                    );


                if (!secilen) return;


                secilen.ad =
                    document
                        .getElementById(
                            "deyisAd"
                        )
                        .value
                        .trim();


                secilen.kod =
                    document
                        .getElementById(
                            "deyisKod"
                        )
                        .value
                        .trim();


                secilen.kateqoriya =
                    document
                        .getElementById(
                            "deyisKateqoriya"
                        )
                        .value
                        .trim();


                secilen.stok =
                    parseInt(
                        document
                            .getElementById(
                                "deyisStok"
                            )
                            .value
                    ) || 0;


                // ŞƏKİLƏ TOXUNMURUQ
                // Köhnə şəkil olduğu kimi qalır.


                localStorage.setItem(
                    "mehsullar",
                    JSON.stringify(
                        mehsullar
                    )
                );


                panel.remove();


                anbarGoster();


                mesajGoster(
                    "Məhsul dəyişdirildi"
                );

            }
        );


    // ==============================
    // LƏĞV ET
    // ==============================

    document
        .getElementById(
            "deyisLegv"
        )
        .addEventListener(
            "click",
            function () {

                panel.remove();

            }
        );
}


// ==========================================
// 6. MESAJ GÖSTƏR
// ==========================================

function mesajGoster(metn) {

    let mesaj =
        document.getElementById(
            "anbarMesaj"
        );


    if (!mesaj) {

        mesaj =
            document.createElement("p");


        mesaj.id =
            "anbarMesaj";


        mesaj.style.color =
            "#10b981";


        mesaj.style.fontWeight =
            "bold";


        mesaj.style.fontSize =
            "14px";


        mesaj.style.textAlign =
            "center";


        mesaj.style.marginTop =
            "15px";


        const container =
            document.querySelector(
                ".container"
            );


        container.appendChild(
            mesaj
        );
    }


    mesaj.textContent = metn;


    setTimeout(
        function () {

            mesaj.textContent = "";

        },
        3000
    );
}
const mehsulSekli = document.getElementById('mehsulSekli');
const sekilOnizleme = document.getElementById('sekilOnizleme');
const plusSimvol = document.getElementById('plusSimvol');

if (mehsulSekli) {
    mehsulSekli.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                sekilOnizleme.src = e.target.result;
                sekilOnizleme.style.display = 'block';
                if (plusSimvol) {
                    plusSimvol.style.display = 'none';
                }
            }
            reader.readAsDataURL(file);
        }
    });
}