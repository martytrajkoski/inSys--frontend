import React, { useState } from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams } from "react-router-dom";

const TipNabavka: React.FC = () => {
    const { br_faktura } = useParams<string>();
    const [tip, setTip] = useState<string>("javna");
    const [datum, setDatum] = useState<string>();

    const [brDogovor, setBrDogovor] = useState<number>();
    const [vaznostDo, setVaznostDo] = useState<string>();
    const [soglasnoDogovor, setSoglasnoDogovor] = useState<boolean>();
    const [ostanatiRaspSredstva, setOstanatiRaspSredstva] = useState<number>();
    
    const [istTip, setIstTip] = useState<boolean>();
    const [vkPotroseno, setVkPotroseno] = useState<number>();

    const storeTipNabavka = async (e:any) => {
        e.preventDefault();
        console.log('istTip, vkPotroseno', istTip, vkPotroseno)
        try {
            const response = await axiosClient.post("/tipnabavka/addDocument", {
                br_faktura: parseInt(br_faktura || "0", 10),
                tip: tip,
                read: true,
                datum: datum,

                br_dogovor: brDogovor,
                vaznost_do: vaznostDo,
                ostanati_rasp_sredstva: ostanatiRaspSredstva,
                soglasno_dogovor: soglasnoDogovor,

                ist_tip: istTip,
                vk_potroseno: vkPotroseno,
            });

            if (response.status === 201) {
                console.log("Tip Nabavka created");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <form onSubmit={storeTipNabavka}>
                <div className="form-item">
                    <h3>Информации за тип на набавка </h3>
                    <div className="form-item-select">
                        <p>Содржината на фактурата, предметот на наплата е согласно:</p>
                        <select value={tip} onChange={(e) => setTip(e.target.value)}>
                            <option value="javna">Јавна набавка</option>
                            <option value="tender">Набавка без тендер</option>
                        </select>
                    </div>
                </div>
                {tip === "javna" && (
                    <div className="form-item">
                        <h3><i>(За јавна набавка)</i></h3>
                        <div className="form-item-inputs">
                            <input
                                type="number"
                                placeholder="Број на договор"
                                value={brDogovor}
                                onChange={(e) => setBrDogovor(Number(e.target.value))}
                            />
                            <input
                                type="date"
                                placeholder="Важност на договор до"
                                value={vaznostDo}
                                onChange={(e) => setVaznostDo(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Останати расположливи средства"
                                value={ostanatiRaspSredstva}
                                onChange={(e) => setOstanatiRaspSredstva(Number(e.target.value))}
                            />
                        </div>
                        <div className="form-item-radio">
                            <p>Описот на сите ставки и единечната цена во фактурата е согласно договорот:</p>
                            <div className="form-radio">
                                <div>
                                    <input
                                        type="radio"
                                        name="edinecna_cena"
                                        checked={soglasnoDogovor === true}
                                        onChange={() => setSoglasnoDogovor(true)}
                                    />
                                    <label>Да</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        name="edinecna_cena"
                                        checked={soglasnoDogovor === false}
                                        onChange={() => setSoglasnoDogovor(false)}
                                    />
                                    <label>Не</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-item-inputs">
                            <input
                                type="date"
                                placeholder="Датум..."
                                value={datum}
                                onChange={(e) => setDatum(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {tip === "tender" && (
                    <div className="form-item">
                        <h3><i>(За јавна набавка без тендер)</i></h3>
                        <div className="form-item-radio">
                            <p>Дали до сега е набавувана стока или услуга од ист тип:</p>
                            <div className="form-radio">
                                <div>
                                    <input
                                        type="radio"
                                        name="isti_tip_stoka"
                                        checked={istTip === true}
                                        onChange={() => setIstTip(true)}
                                    />
                                    <label>Да</label>
                                </div>
                                <div>
                                    <input
                                        type="radio"
                                        name="isti_tip_stoka"
                                        checked={istTip === false}
                                        onChange={() => setIstTip(false)}
                                    />
                                    <label>Не</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-item-inputs">
                            <input
                                type="number"
                                placeholder="Вкупно потрошени средства по основ на набавка од тој тип"
                                value={vkPotroseno}
                                onChange={(e) => setVkPotroseno(Number(e.target.value))}
                            />
                        </div>
                         <div className="form-item-inputs">
                            <input
                                type="date"
                                placeholder="Датум..."
                                value={datum}
                                onChange={(e) => setDatum(e.target.value)}
                            />
                        </div>
                    </div>
                )}


                <div className="form-buttons">
                    <div></div>
                    <div className="form-buttons-edit">
                        <button type="submit">Save</button>
                        <button type="button">Edit</button>
                        <button type="button">Delete</button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default TipNabavka;
