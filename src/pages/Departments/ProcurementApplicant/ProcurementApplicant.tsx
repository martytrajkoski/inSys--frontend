import React from "react";

const ProcurementApplicant: React.FC = () => {
    return (
        <>
            <form action="">
                <div className="form-item">
                    <h3>Информации за евиденција </h3>
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
    );
};

export default ProcurementApplicant;
