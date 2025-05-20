import React from "react";

const PublicProcurementDepartment: React.FC = () => {
    return(
        <>
            <form>
                <div className="form-item">
                    <h3>Информации за тип на набавка </h3>
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
                    <h3>Информации за евиденција</h3>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Датум"/>
                        <input type="text" placeholder="Наплата"/>
                        <input type="text" placeholder="Назив на проектот/работата"/>
                    </div>
                    <div className="form-item-radio">
                        <p>Потекло на финансиите:</p>
                        <div className="form-radio">
                            <div>
                                <input type="radio" name="poteklo_na_finansii"/>
                                <label>Средства на МФС</label>
                            </div>
                            <div>
                                <input type="radio" name="poteklo_na_finansii"/>
                                <label>Буџет</label>
                            </div>
                        </div>
                    </div>
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

export default PublicProcurementDepartment;