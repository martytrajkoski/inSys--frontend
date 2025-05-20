import React from "react";

const Accounting:React.FC = () => {
    return(
        <>
            <form action="">
                <div className="form-item">
                    <h3>Информации од сметководство</h3>
                    <div className="form-item-inputs">
                        <input type="text" placeholder="Број на картон (Конто)"/>
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
                    <div className="form-buttons">
                        <div></div>
                        <div className="form-buttons-edit">
                            <button>Save</button>
                            <button>Edit</button>
                            <button>Delete</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )   
}

export default Accounting;