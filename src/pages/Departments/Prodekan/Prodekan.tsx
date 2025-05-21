import React from "react";

const Prodekan: React.FC = () =>{
    return(
        <>
            <form action="">
                <div className="form-item">
                    <h3>1. Основни информации (технички секретар)</h3>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Број на фактура"/>
                        <input type="text" placeholder="Датум"/>
                        <input type="text" placeholder="Издавач на фактура"/>
                        <input type="text" placeholder="Вкупна вредност на фактура (со ДДВ)"/>
                    </div>
                </div>
                <div className="form-item">
                    <h3>2. Информации за тип на набавка (одделение за јавна набавка)</h3>
                    <div className="form-item-select">
                        <p>Содржината на фактурата, предметот на наплата е согласно:</p>
                        <select name="" id="">
                            <option value="">Јавна набавка</option>
                            <option value="">Набавка без тендер</option>
                        </select>
                    </div>
                </div>
                <div className="form-item">
                    <h3><i>(За јавна набавка)</i></h3>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Број на договор"/>
                        <input type="text" placeholder="Важност на договор до"/>
                        <input type="text" placeholder="Останати расположливи средства"/>
                    </div>
                    <div className="form-item-radio">
                        <p>Описот на сите ставки и единечната цена во фактурата е согласно договорот:</p>
                        <div className="form-radio">
                            <div>
                                <input type="radio" name="edinecna_cena"/>
                                <label>Да</label>
                            </div>
                            <div>
                                <input type="radio" name="edinecna_cena"/>
                                <label>Не</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Датум..."/>
                        <input type="text" placeholder="Potpis..."/>
                    </div>
                </div>
                <div className="form-item">
                    <h3><i>(За јавна набавка без тендер)</i></h3>
                    <div className="form-item-radio">
                        <p>Дали до сега е набавувана стока или услуга од ист тип:</p>
                        <div className="form-radio">
                            <div>
                                <input type="radio" name="isti_tip_stoka"/>
                                <label>Да</label>
                            </div>
                            <div>
                                <input type="radio" name="isti_tip_stoka"/>
                                <label>Не</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Вкупно потрошени средства по основ на набавка од тој тип"/>
                        <input type="text" placeholder="Останати расположливи средства по договор"/>
                        <input type="text" placeholder="Потпис"/>
                    </div>
                </div>
                <div className="form-item">
                    <h3>3. Информации за евиденција (одделение за јавна набавка или барател на набавка)</h3>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Барател на набавката која е предмет на наплата"/>
                        <input type="text" placeholder="Број на картон" />
                        <input type="text" placeholder="Назив на проектот/работата" />
                    </div>
                    <div className="form-item-radio">
                        <p>Потекло на финансиите:</p>
                        <div className="form-radio">
                            <div>
                                <input type="radio" name="poteklo_finansii" />
                                <label>Средства на МФС</label>
                            </div>
                            <div>
                                <input type="radio" name="poteklo_finansii" />
                                <label>Буџет</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Датум" />
                        <input type="text" placeholder="Потпис" />
                    </div>
                </div>
                <div className="form-item">
                    <h3>4. Информации од сметководство</h3>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Број на картон"/>
                        <input type="text" placeholder="Состојба на картон"/>
                    </div>
                    <div className="form-item-radio">
                        <p>Предметот на набавка има основа за евидентирање како основно средство(а):</p>
                        <div className="form-radio">
                            <div>
                                <input type="radio" name="ima_osnova_evidencija"/>
                                <label>Да</label>
                            </div>
                            <div>
                                <input type="radio" name="ima_osnova_evidencija"/>
                                <label>Не</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-item-radio">
                        <p>Пополнет е формулар за задолжување на основно средство:</p>
                        <div className="form-radio">
                            <div>
                                <input type="radio" name="formular"/>
                                <label>Да</label>
                            </div>
                            <div>
                                <input type="radio" name="formular"/>
                                <label>Не</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-item-radio">
                        <p>Средствата се внесени (поединечно) како новонабавени за тековната година:</p>
                        <div className="form-radio">
                            <div>
                                <input type="radio" name="poedinecno"/>
                                <label>Да</label>
                            </div>
                            <div>
                                <input type="radio" name="poedinecno"/>
                                <label>Не</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-item-radio">
                        <p>Предлог сметка за наплата од:</p>
                        <div className="form-radio">
                            <div>
                                <input type="radio" name="predlog_smetka"/>
                                <label>603</label>
                            </div>
                            <div>
                                <input type="radio" name="predlog_smetka"/>
                                <label>788</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Предлог конго за наплата до:"/>
                        <input type="text" placeholder="Датум"/>
                        <input type="text" placeholder="Потпис"/>
                    </div>
                </div>
                <div className="form-item">
                    <h3>5. Одобрување за плаќање на фактура (продекан за финансии)</h3>
                    <p>Согласно информациите наведени во точките 1, 2, 3 и 4 го одобрувам плаќањето на фактурата</p>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Датум"/>
                        <input type="text" placeholder="Потпис"/>
                    </div>
                </div>
                <div className="form-buttons">
                        <div></div>
                        <div className="form-buttons-edit">
                            <button>Save</button>
                            <button>Edit</button>
                            <button>Delete</button>
                        </div>
                    </div>
            </form>
        </>
    )
}

export default Prodekan;