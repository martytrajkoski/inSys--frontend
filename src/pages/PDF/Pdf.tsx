import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axiosClient from '../../axiosClient/axiosClient';
import type { FakturaType } from '../../types/types';
import Logo from "../../../public/Logo/Asset_3.png";
import { useParams } from 'react-router-dom';

const Pdf: React.FC = () => {
    const { br_faktura } = useParams<{ br_faktura: string }>();
    const [faktura, setFaktura] = useState<FakturaType>();
    const invoiceRef = useRef<HTMLDivElement>(null);

    const fetchFaktura = async () => {
        try {
            const response = await axiosClient.get(`/faktura/show/${br_faktura}`);
            if (response.status === 201) {
                setFaktura(response.data.faktura);
                handleDownloadPDF();
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchFaktura();
    }, []);

    const handleDownloadPDF = async () => {
        if (!invoiceRef.current) return;

        await new Promise((res) => setTimeout(res, 500));

        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Faktura${br_faktura}.pdf`);
    };

    return (
        <div>
            <div className="invoice-form" ref={invoiceRef}>
                <section>
                    <img src={Logo} alt="Logo" />
                    <hr />
                </section>

                <h1>ЗАДОЛЖИТЕЛЕН ПРИЛОГ НА ВЛЕЗНА ФАКТУРА</h1>

                {/* Section 1 */}
                <section>
                    <h2>1. Основни информации</h2>
                    <table>
                        <tbody>
                            <tr><td>Број на фактура:</td><td>{faktura?.br_faktura}</td></tr>
                            <tr><td>Архивски број:</td><td>{faktura?.tehnicki_sekretar.arhivski_br}</td></tr>
                            <tr><td>Издавач на фактура:</td><td>{faktura?.tehnicki_sekretar.izdavaci_id}</td></tr>
                            <tr><td>Износ на договор:</td><td>{faktura?.tehnicki_sekretar.iznos_dogovor}</td></tr>
                            <tr><td>Датум:</td><td>{faktura?.tehnicki_sekretar.datum}</td></tr>
                            <tr><td>Потпис:</td><td>{faktura?.tehnicki_sekretar.submited_by.name ?? faktura?.tehnicki_sekretar.updated_by.name}</td></tr>
                        </tbody>
                    </table>
                </section>

                {/* Section 2 */}
                <section className="invoice-section">
                    <h2>2. Информации за тип на набавка</h2>

                    <table>
                        <tbody>
                            <tr>
                                <td>Содржината на фактурата, предметот на наплатата е согласно:</td>
                                <td>{faktura?.tip_nabavka.tip}</td>
                            </tr>

                            {faktura?.tip_nabavka.tip === "javna" ? (
                                <>
                                    <tr>
                                        <td>Број на договор:</td>
                                        <td>{faktura?.tip_nabavka.javna_nabavka?.br_dogovor}</td>
                                    </tr>
                                    <tr>
                                        <td>Важност на договорот до:</td>
                                        <td>{faktura?.tip_nabavka.javna_nabavka?.vaznost_do}</td>
                                    </tr>
                                        <tr>
                                            <td>Вкупна вредност на фактура (со ДДВ):</td>
                                            <td>{faktura?.tip_nabavka.vk_vrednost}</td>
                                        </tr>
                                    <tr>
                                        <td>Останати расположливи средства по договорот (без вкл. на фак.):</td>
                                        <td>{faktura?.tip_nabavka.javna_nabavka?.ostanati_rasp_sredstva}</td>
                                    </tr>
                                    <tr>
                                        <td>Опис на сите ставки и единичната цена на фактурата, согласно договорот:</td>
                                        <td>{faktura?.tip_nabavka.javna_nabavka?.soglasno_dogovor}</td>
                                    </tr>
                                    <tr>
                                        <td>Датум:</td>
                                        <td>{faktura?.tip_nabavka.datum}</td>
                                    </tr>
                                    <tr>
                                        <td>Потпис:</td>
                                        <td>{faktura?.tip_nabavka.submited_by.name ?? faktura?.tip_nabavka.updated_by.name}</td>
                                    </tr>
                                </>
                            ) : (
                                <>
                                    <tr>
                                        <td>Дали до сега е набавувана стока или услуга од ист тип:</td>
                                        <td>{faktura?.tip_nabavka.tender?.ist_tip}</td>
                                    </tr>
                                    <tr>
                                        <td>Вкупно потрошени средства по основ на набавка од тој тип:</td>
                                        <td>{faktura?.tip_nabavka.tender?.vk_potroseno}</td>
                                    </tr>
                                    <tr>
                                        <td>Датум:</td>
                                        <td>{faktura?.tip_nabavka.datum}</td>
                                    </tr>
                                    <tr>
                                        <td>Потпис:</td>
                                        <td>{faktura?.tip_nabavka.submited_by.name ?? faktura?.tip_nabavka.updated_by.name}</td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </section>


                {/* Section 3 */}
                <section className="invoice-section">
                    <h2>3. Информации за евиденција</h2>

                    <table>
                        <tbody>
                            <tr>
                                <td>Барател на набавката која е предмет на наплатата:</td>
                                <td>{faktura?.baratel_javna_nabavka.baratel}</td>
                            </tr>
                            <tr>
                                <td><b>Предлог за евиденција на трошокот</b></td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Назив на проектот/работата:</td>
                                <td>{faktura?.baratel_javna_nabavka.naziv_proekt} </td>
                            </tr>
                            <tr>
                                <td>Потекло на финансиите:</td>
                                <td>{faktura?.baratel_javna_nabavka.poteklo} </td>
                            </tr>
                            <tr>
                                <td>Број на картон (конто):</td>
                                <td>{faktura?.baratel_javna_nabavka.br_karton} </td>
                            </tr>
                            <tr>
                                <td>Датум:</td>
                                <td>{faktura?.baratel_javna_nabavka.datum}</td>
                            </tr>
                            <tr>
                                <td>Потпис:</td>
                                <td>{faktura?.baratel_javna_nabavka.submited_by.name ?? faktura?.baratel_javna_nabavka.updated_by.name}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>


                {/* Section 4 */}
                <section className="invoice-section">
                    <h2>4. Информации од сметководство</h2>

                    <table>
                        <tbody>
                            <tr>
                                <td>Број на картон (конто):</td>
                                <td>{faktura?.smetkovodstvo.br_karton} </td>
                            </tr>
                            <tr>
                                <td>Состојба на картон:</td>
                                <td>{faktura?.smetkovodstvo.sostojba_karton} </td>
                            </tr>
                            <tr>
                                <td>Предметот на набавка има основа за евидентирање како основно средство(а):</td>
                                <td>{faktura?.smetkovodstvo.osnova_evidentiranje ? "Да" : "Не"}</td>
                            </tr>
                            <tr>
                                <td>Пополнет е формулар за задолжување на основно средство:</td>
                                <td>{faktura?.smetkovodstvo.formular ? "Да" : "Не"} </td>
                            </tr>
                            <tr>
                                <td>Средства се внесени (поединечно) како новонабавени за тековната година:</td>
                                <td>{faktura?.smetkovodstvo.vneseni_sredstva ? "Да" : "Не"} </td>
                            </tr>
                            <tr>
                                <td>Предлог сметка за наплата од:</td>
                                <td>{faktura?.smetkovodstvo.smetka} </td>
                            </tr>
                            <tr>
                                <td>Предлог конто за наплата од:</td>
                                <td>{faktura?.smetkovodstvo.konto} </td>
                            </tr>
                            <tr>
                                <td>Датум:</td>
                                <td>{faktura?.smetkovodstvo.datum} </td>
                            </tr>
                            <tr>
                                <td>Потпис:</td>
                                <td>{faktura?.smetkovodstvo.submited_by.name ?? faktura?.smetkovodstvo.updated_by.name}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>


                {/* Section 5 */}
                <section className="invoice-section">
                    <h2>5. Одобрување за плаќање на фактура</h2>
                    <p>Согласно информациите наведени во точките 1, 2, 3 и 4, го одобрувам плаќањето на фактурата:</p>

                    <table>
                        <tbody>
                            <tr>
                                <td>Датум:</td>
                                <td>{faktura?.tehnicki_sekretar.datum}</td>
                            </tr>
                            <tr>
                                <td>Потпис:</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </section>

            </div>
        </div>
    );
};

export default Pdf;
