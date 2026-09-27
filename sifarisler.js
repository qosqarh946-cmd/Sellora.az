document.addEventListener("DOMContentLoaded", function () { 
 
    // ============================== 
    // MƏHSUL SEÇİMİ 
    // ============================== 
 
    const mehsulSecimi = 
        document.getElementById("sifarisMehsulu"); 
 
    const miqdarInput = 
        document.getElementById("sifarisMiqdari"); 
 
 
    if (mehsulSecimi) { 
 
        const mehsullar = 
            JSON.parse(localStorage.getItem("mehsullar")) || []; 
 
        mehsulSecimi.innerHTML = 
            '<option value="">Məhsul seçin</option>'; 
 
        mehsullar.forEach(function (mehsul) { 
 
            const option = 
                document.createElement("option"); 
 
            option.value = mehsul.id; 
 
            option.textContent = 
                mehsul.ad; 
 
            option.dataset.stok = 
                mehsul.stok; 
 
            mehsulSecimi.appendChild(option); 
        }); 
    } 
 
 
    // ============================== 
    // MİQDAR / STOK 
    // ============================== 
 
    if (mehsulSecimi && miqdarInput) { 
 
        mehsulSecimi.addEventListener("change", function () { 
 
            const secilenOption = 
                this.options[this.selectedIndex]; 
 
 
            if (!secilenOption.value) { 
 
                miqdarInput.value = 1; 
                miqdarInput.max = ""; 
 
                return; 
            } 
 
 
            const stok = 
                parseInt(secilenOption.dataset.stok) || 0; 
 
            miqdarInput.max = stok; 
 
            miqdarInput.value = 1; 
        }); 
    } 
 
 
    // ============================== 
    // SİFARİŞ FORMU 
    // ============================== 
 
    const sifarisForm = 
        document.getElementById("sifarisForm"); 
 
    let mesaj = 
        document.getElementById("mesaj"); 
 
 
    if (!mesaj && sifarisForm) { 
 
        mesaj = 
            document.createElement("p"); 
 
        mesaj.id = "mesaj"; 
 
        sifarisForm.appendChild(mesaj); 
    } 
 
 
    if (sifarisForm) { 
 
        sifarisForm.addEventListener("submit", function (e) { 
 
            e.preventDefault(); 
 
 
            // ============================== 
            // MƏHSUL VƏ MİQDAR 
            // ============================== 
 
            const secilenMehsul = 
                document.getElementById("sifarisMehsulu"); 
 
            const miqdarInput = 
                document.getElementById("sifarisMiqdari"); 
 
 
            const mehsulId = 
                secilenMehsul 
                    ? secilenMehsul.value 
                    : ""; 
 
 
            const miqdar = 
                parseInt( 
                    miqdarInput 
                        ? miqdarInput.value 
                        : 0 
                ) || 0; 
 
 
            if (!mehsulId) { 
 
                if (mesaj) { 
 
                    mesaj.style.display = "block"; 
                    mesaj.style.color = "#ef4444"; 
                    mesaj.style.fontWeight = "600"; 
                    mesaj.style.marginTop = "15px"; 
 
                    mesaj.innerText = 
                        "Zəhmət olmasa məhsul seçin!"; 
 
 
                    setTimeout(function () { 
                        mesaj.innerText = ""; 
                    }, 3000); 
                } 
 
                return; 
            } 
 
 
            // ============================== 
            // MƏHSULU TAP 
            // ============================== 
 
            const mehsullar = 
                JSON.parse( 
                    localStorage.getItem("mehsullar") 
                ) || []; 
 
 
            const secilenMehsulMelumat = 
                mehsullar.find(function (mehsul) { 
 
                    return String(mehsul.id) === 
                        String(mehsulId); 
 
                }); 
 
 
            if (!secilenMehsulMelumat) { 
 
                if (mesaj) { 
 
                    mesaj.style.display = "block"; 
                    mesaj.style.color = "#ef4444"; 
                    mesaj.style.fontWeight = "600"; 
 
                    mesaj.innerText = 
                        "Seçilən məhsul anbarda tapılmadı!"; 
                } 
 
                return; 
            } 
 
 
            // ============================== 
            // MİQDAR YOXLAMASI 
            // ============================== 
 
            if (miqdar < 1) { 
 
                if (mesaj) { 
 
                    mesaj.style.display = "block"; 
                    mesaj.style.color = "#ef4444"; 
                    mesaj.style.fontWeight = "600"; 
 
                    mesaj.innerText = 
                        "Miqdar ən azı 1 olmalıdır!"; 
                } 
 
                return; 
            } 
 
 
            if ( 
                miqdar > 
                Number(secilenMehsulMelumat.stok) 
            ) { 
 
                if (mesaj) { 
 
                    mesaj.style.display = "block"; 
                    mesaj.style.color = "#ef4444"; 
                    mesaj.style.fontWeight = "600"; 
 
                    mesaj.innerText = 
                        "Anbarda yalnız " + 
                        secilenMehsulMelumat.stok + 
                        " ədəd məhsul var!"; 
 
 
                    setTimeout(function () { 
                        mesaj.innerText = ""; 
                    }, 3000); 
                } 
 
                return; 
            } 
 
 
            // ============================== 
            // MÜŞTƏRİ MƏLUMATLARI 
            // ============================== 
 
            const musteriAdiElement = 
                document.getElementById("musteriAdi"); 
 
            const telefonElement = 
                document.getElementById("telefon"); 
 
            const unvanElement = 
                document.getElementById("unvan"); 
 
 
            const musteriAdi = 
                musteriAdiElement 
                    ? musteriAdiElement.value.trim() 
                    : ""; 
 
 
            const telefon = 
                telefonElement 
                    ? telefonElement.value.trim() 
                    : ""; 
 
 
            const unvan = 
                unvanElement 
                    ? unvanElement.value.trim() 
                    : ""; 
 
 
            if (!musteriAdi) { 
 
                if (mesaj) { 
 
                    mesaj.style.display = "block"; 
                    mesaj.style.color = "#ef4444"; 
                    mesaj.style.fontWeight = "600"; 
                    mesaj.style.marginTop = "15px"; 
 
                    mesaj.innerText = 
                        "Zəhmət olmasa müştəri adını daxil edin!"; 
 
 
                    setTimeout(function () { 
                        mesaj.innerText = ""; 
                    }, 3000); 
                } 
 
                return; 
            } 
 
 
            // ============================== 
            // MÜŞTƏRİ STATUSU 
            // ============================== 
 
            const musteriStatusuElement = 
                document.querySelector( 
                    'input[name="musteriStatusu"]:checked' 
                ); 
 
 
            const musteriStatusu = 
                musteriStatusuElement 
                    ? musteriStatusuElement.value 
                    : "Yeni Müştəri"; 
 
 
            // ============================== 
            // QİYMƏTLƏR 
            // ============================== 
 
            const alisQiymetiElement = 
                document.getElementById("alisQiymeti"); 
 
            const satisQiymetiElement = 
                document.getElementById("satisQiymeti"); 
 
            const catdirilmaQiymetiElement = 
                document.getElementById("catdirilmaQiymeti"); 
 
 
            const alisQiymeti = 
                alisQiymetiElement 
                    ? parseFloat(alisQiymetiElement.value) || 0 
                    : 0; 
 
 
            const satisQiymeti = 
                satisQiymetiElement 
                    ? parseFloat(satisQiymetiElement.value) || 0 
                    : 0; 
 
 
            const catdirilmaQiymeti = 
                catdirilmaQiymetiElement 
                    ? parseFloat(catdirilmaQiymetiElement.value) || 0 
                    : 0; 
 
 
            // ============================== 
            // TARİX 
            // ============================== 
 
            const satisTarixiElement = 
                document.getElementById("satisTarixi"); 
 
 
            const satisTarixi = 
                satisTarixiElement 
                    ? satisTarixiElement.value 
                    : ""; 
 
 
            const tarix = 
                satisTarixi || 
                new Date() 
                    .toISOString() 
                    .split("T")[0]; 
 
 
            // ============================== 
            // ÖDƏNİŞ 
            // ============================== 
 
            const odenisNovuElement = 
                document.getElementById("odenisNovu"); 
 
 
            const odenisNovu = 
                odenisNovuElement 
                    ? odenisNovuElement.value 
                    : ""; 
 
 
            // ============================== 
            // SAAT 
            // ============================== 
 
            let saat = ""; 
 
 
            const secilenSaat = 
                document.querySelector( 
                    "#saatCedveli .secilmis" 
                ); 
 
 
            if (secilenSaat) { 
 
                saat = 
                    secilenSaat.dataset.saat || 
                    secilenSaat.innerText || 
                    ""; 
            } 
 
 
            // ============================== 
            // STOKDAN ÇIX 
            // ============================== 
 
            secilenMehsulMelumat.stok = 
                Number(secilenMehsulMelumat.stok) - 
                miqdar; 
 
 
            localStorage.setItem( 
                "mehsullar", 
                JSON.stringify(mehsullar) 
            ); 
 
 
            // ============================== 
            // YENİ SİFARİŞ 
            // ============================== 
 
            const yeniSifaris = { 
 
                // MÜŞTƏRİ 
                musteriAdi: musteriAdi, 
                telefon: telefon, 
                unvan: unvan, 
 
                // ÇOX VACİB 
                // Yeni Müştəri / Daimi Müştəri 
                musteriStatusu: musteriStatusu, 
 
 
                // MƏHSUL 
                mehsulId: secilenMehsulMelumat.id, 
                mehsulAdi: secilenMehsulMelumat.ad, 
                miqdar: miqdar, 
 
 
                // QİYMƏTLƏR 
                alisQiymeti: alisQiymeti, 
                satisQiymeti: satisQiymeti, 
                catdirilmaQiymeti: catdirilmaQiymeti, 
 
 
                // ÖDƏNİŞ 
                odenis: odenisNovu, 
 
 
                // TARİX / SAAT 
                tarix: tarix, 
                saat: saat, 
 
 
                // SİFARİŞ STATUSU 
                status: "Gözləmədə" 
            }; 
 
 
            // ============================== 
            // SİFARİŞLƏRİ GÖTÜR 
            // ============================== 
 
            let sifarisler = 
                JSON.parse( 
                    localStorage.getItem( 
                        "selloraSifarisler" 
                    ) 
                ) || []; 
 
 
            // Yeni sifarişi əlavə et 
            sifarisler.push(yeniSifaris); 
 
 
            // Yadda saxla 
            localStorage.setItem( 
                "selloraSifarisler", 
                JSON.stringify(sifarisler) 
            ); 
 
 
            // ============================== 
            // UĞURLU MESAJ 
            // ============================== 
 
            if (mesaj) { 
 
                mesaj.style.display = "block"; 
                mesaj.style.visibility = "visible"; 
                mesaj.style.opacity = "1"; 
 
                mesaj.style.color = "#10b981"; 
                mesaj.style.fontSize = "16px"; 
                mesaj.style.fontWeight = "700"; 
                mesaj.style.marginTop = "15px"; 
                mesaj.style.padding = "10px 0"; 
 
                mesaj.innerText = 
                    "Sifarişiniz təsdiqləndi!"; 
 
 
                setTimeout(function () { 
 
                    mesaj.innerText = ""; 
 
                }, 3000); 
            } 
 
 
            // ============================== 
            // FORMU TƏMİZLƏ
            // ============================== 
 
            sifarisForm.reset();

 
            // ==============================
            // MÜŞTƏRİ MƏLUMATLARINI TƏMİZLƏ
            // ==============================

            const musteriAdiInput =
                document.getElementById("musteriAdi");

            const telefonInput =
                document.getElementById("telefon");

            const unvanInput =
                document.getElementById("unvan");


            if (musteriAdiInput) {

                musteriAdiInput.value = "";
            }


            if (telefonInput) {

                telefonInput.value = "";
            }


            if (unvanInput) {

                unvanInput.value = "";
            }


            // ==============================
            // YENİ MÜŞTƏRİ SEÇİLSİN
            // ==============================

            const yeniMusteriRadio =
                document.querySelector(
                    'input[name="musteriStatusu"][value="Yeni Müştəri"]'
                );


            if (yeniMusteriRadio) {

                yeniMusteriRadio.checked = true;
            }


            // ==============================
            // MİQDAR SIFIRLANSIN
            // ==============================

            const yeniMiqdarInput =
                document.getElementById("sifarisMiqdari");


            if (yeniMiqdarInput) {

                yeniMiqdarInput.value = 1;
                yeniMiqdarInput.max = "";
            }
 
        }); 
    } 
 
 
    // ============================== 
    // SİFARİŞ CƏDVƏLİ 
    // ============================== 
 
    const tbody = 
        document.getElementById("sifarisListi"); 
 
 
    const umumiSay = 
        document.getElementById("umumiSay"); 
 
 
    const catdirilanSay = 
        document.getElementById("catdirilanSay"); 
 
 
    const legvSay = 
        document.getElementById("legvSay"); 
 
 
    const yeniMusteriSay = 
        document.getElementById("yeniMusteriSay"); 
 
 
    const daimiMusteriSay = 
        document.getElementById("daimiMusteriSay"); 
 
 
    let sifarisler = 
        JSON.parse( 
            localStorage.getItem( 
                "selloraSifarisler" 
            ) 
        ) || []; 
 
 
    // ============================== 
    // MƏLUMATLARI GÖSTƏR 
    // ============================== 
 
    function melumatlariGoster() { 
 
        if (!tbody) return; 
 
 
        tbody.innerHTML = ""; 
 
 
        let umumi = sifarisler.length; 
 
        let catdirilan = 0; 
 
        let legv = 0; 
 
        let yeniMusteri = 0; 
 
        let daimiMusteri = 0; 
 
 
        sifarisler.forEach(function (sifaris, index) { 
 
 
            // ============================== 
            // SİFARİŞ STATUSLARI 
            // ============================== 
 
            if (sifaris.status === "Çatdırıldı") { 
                catdirilan++; 
            } 
 
 
            if (sifaris.status === "Ləğv olundu") { 
                legv++; 
            } 
 
 
            // ============================== 
            // MÜŞTƏRİ STATUSLARI 
            // ============================== 
 
            if ( 
                sifaris.musteriStatusu === 
                "Yeni Müştəri" 
            ) { 
 
                yeniMusteri++; 
            } 
 
 
            if ( 
                sifaris.musteriStatusu === 
                "Daimi Müştəri" 
            ) { 
 
                daimiMusteri++; 
            } 
 
 
            // ============================== 
            // STATUS RƏNGİ 
            // ============================== 
 
            let statusRengi = "#f59e0b"; 
 
 
            if ( 
                sifaris.status === 
                "Çatdırıldı" 
            ) { 
 
                statusRengi = "#10b981"; 
            } 
 
 
            if ( 
                sifaris.status === 
                "Ləğv olundu" 
            ) { 
 
                statusRengi = "#ef4444"; 
            } 
 
 
            // ============================== 
            // CƏDVƏL 
            // ============================== 
 
            tbody.innerHTML += ` 
 
                <tr> 
 
                    <td> 
                        ${sifaris.musteriAdi || "-"} 
                    </td> 
 
 
                    <td> 
                        ${sifaris.telefon || "-"} 
                    </td> 
 
 
                    <td> 
                        ${sifaris.mehsulAdi || "-"} 
                    </td> 
 
 
                    <td> 
                        ${sifaris.miqdar || 0} 
                    </td> 
 
 
                    <td> 
                        ${sifaris.musteriStatusu || "Yeni Müştəri"} 
                    </td> 
 
 
                    <td> 
                        ${Number( 
                            sifaris.satisQiymeti || 0 
                        ).toFixed(2)} AZN 
                    </td> 
 
 
                    <td> 
                        ${Number( 
                            sifaris.catdirilmaQiymeti || 0 
                        ).toFixed(2)} AZN 
                    </td> 
 
 
                    <td> 
                        ${sifaris.odenis || "-"} 
                    </td> 
 
 
                    <td> 
                        ${sifaris.tarix || "-"} 
                    </td> 
 
 
                    <td> 
 
                        <strong 
                            style="color:${statusRengi};" 
                        > 
                            ${sifaris.status} 
                        </strong> 
 
                    </td> 
 
 
                    <td> 
 
                        <div style=" 
                            display:flex; 
                            gap:5px; 
                            flex-wrap:wrap; 
                            align-items:center; 
                        "> 
 
                            <button 
                                onclick="statusuDeyis(${index}, 'Çatdırıldı')" 
                                style=" 
                                    background:#10b981; 
                                    color:white; 
                                    border:none; 
                                    padding:6px 10px; 
                                    border-radius:6px; 
                                    cursor:pointer; 
                                " 
                            > 
                                Çatdırıldı 
                            </button> 
 
 
                            <button 
                                onclick="statusuDeyis(${index}, 'Ləğv olundu')" 
                                style=" 
                                    background:#f59e0b; 
                                    color:white; 
                                    border:none; 
                                    padding:6px 10px; 
                                    border-radius:6px; 
                                    cursor:pointer; 
                                " 
                            > 
                                Ləğv et 
                            </button> 
 
 
                   
 
                        </div> 
 
 
                        <div 
                            id="mesaj-${index}" 
                            style="margin-top:5px;" 
                        ></div> 
 
                    </td> 
 
                </tr> 
 
            `; 
        }); 
 
 
        // ============================== 
        // STATİSTİKALAR 
        // ============================== 
 
        if (umumiSay) { 
            umumiSay.innerText = umumi; 
        } 
 
 
        if (catdirilanSay) { 
            catdirilanSay.innerText = catdirilan; 
        } 
 
 
        if (legvSay) { 
            legvSay.innerText = legv; 
        } 
 
 
        if (yeniMusteriSay) { 
            yeniMusteriSay.innerText = yeniMusteri; 
        } 
 
 
        if (daimiMusteriSay) { 
            daimiMusteriSay.innerText = daimiMusteri; 
        } 
 
    } 
 
 
    // ============================== 
    // STATUS DƏYİŞ 
    // ============================== 
 
    window.statusuDeyis = 
        function (index, yeniStatus) { 
 
 
            const sifaris = 
                sifarisler[index]; 
 
 
            if (!sifaris) return; 
 
 
            const kohneStatus = 
                sifaris.status; 
 
 
            if (kohneStatus === yeniStatus) { 
                return; 
            } 
 
 
            let mehsullar = 
                JSON.parse( 
                    localStorage.getItem("mehsullar") 
                ) || []; 
 
 
            const mehsulIndex = 
                mehsullar.findIndex(function (m) { 
 
                    return String(m.id) === 
                        String(sifaris.mehsulId); 
 
                }); 
 
 
            // ============================== 
            // LƏĞV EDİLƏNDƏ STOKU GERİ QAYTAR 
            // ============================== 
 
            if ( 
                yeniStatus === "Ləğv olundu" && 
                kohneStatus !== "Ləğv olundu" 
            ) { 
 
                if (mehsulIndex !== -1) { 
 
                    mehsullar[mehsulIndex].stok = 
                        Number( 
                            mehsullar[mehsulIndex].stok 
                        ) + 
                        Number(sifaris.miqdar); 
                } 
            } 
 
 
            // ============================== 
            // LƏĞVDƏN ÇIXIB ÇATDIRILANDA 
            // ============================== 
 
            if ( 
                yeniStatus === "Çatdırıldı" && 
                kohneStatus === "Ləğv olundu" 
            ) { 
 
                if (mehsulIndex !== -1) { 
 
                    const stok = 
                        Number( 
                            mehsullar[mehsulIndex].stok 
                        ); 
 
 
                    const miqdar = 
                        Number(sifaris.miqdar); 
 
 
                    if (stok < miqdar) { 
 
                        alert( 
                            "Bu sifarişi çatdırmaq üçün anbarda kifayət qədər məhsul yoxdur!" 
                        ); 
 
                        return; 
                    } 
 
 
                    mehsullar[mehsulIndex].stok = 
                        stok - miqdar; 
                } 
            } 
 
 
            localStorage.setItem( 
                "mehsullar", 
                JSON.stringify(mehsullar) 
            ); 
 
 
            // ============================== 
            // SİFARİŞ STATUSUNU DƏYİŞ 
            // ============================== 
 
            sifaris.status = 
                yeniStatus; 
 
 
            /* 
                BURADA MÜŞTƏRİ STATUSUNA TOXUNMURUQ. 
 
                Yeni Müştəri / Daimi Müştəri 
                olduğu kimi qalır. 
            */ 
 
 
            localStorage.setItem( 
                "selloraSifarisler", 
                JSON.stringify(sifarisler) 
            ); 
 
 
            melumatlariGoster(); 
 
        }; 
 
 
    // ============================== 
    // SİFARİŞİ SİL 
    // ============================== 
 
    window.sifarişiSil = 
        function (index) { 
 
 
            const mesajDiv = 
                document.getElementById( 
                    `mesaj-${index}` 
                ); 
 
 
            if (mesajDiv) { 
 
                mesajDiv.style.color = 
                    "#ef4444"; 
 
                mesajDiv.innerText = 
                    "Silindi!"; 
            } 
 
 
            setTimeout(function () { 
 
                sifarisler.splice(index, 1); 
 
                localStorage.setItem( 
                    "selloraSifarisler", 
                    JSON.stringify(sifarisler) 
                ); 
 
                melumatlariGoster(); 
 
            }, 1000); 
 
        }; 
 
 
    // ============================== 
    // AXTARIŞ 
    // ============================== 
 
    const axtaris = 
        document.getElementById( 
            "sifarisAxtaris" 
        ); 
 
 
    if (axtaris) { 
 
        axtaris.addEventListener( 
            "input", 
            function () { 
 
 
                const axtarilan = 
                    this.value 
                        .toLowerCase() 
                        .trim(); 
 
 
                const butunSifarisler = 
                    JSON.parse( 
                        localStorage.getItem( 
                            "selloraSifarisler" 
                        ) 
                    ) || []; 
 
 
                sifarisler = 
                    butunSifarisler.filter( 
                        function (sifaris) { 
 
 
                            return ( 
 
                                String( 
                                    sifaris.musteriAdi || "" 
                                ) 
                                    .toLowerCase() 
                                    .includes(axtarilan) 
 
 
                                || 
 
 
                                String( 
                                    sifaris.telefon || "" 
                                ) 
                                    .toLowerCase() 
                                    .includes(axtarilan) 
 
 
                                || 
 
 
                                String( 
                                    sifaris.mehsulAdi || "" 
                                ) 
                                    .toLowerCase() 
                                    .includes(axtarilan) 
 
                            ); 
 
                        } 
                    ); 
 
 
                melumatlariGoster(); 
 
            } 
        ); 
    } 
 
 
    // ============================== 
    // İLK GÖSTƏRİŞ 
    // ============================== 
 
    melumatlariGoster(); 
 
});