import React from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import type { FakturaType, IzdavaciType } from "../../../types/types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const Prodekan: React.FC = () => {
  const [faktura, setFaktura] = useState<FakturaType[]>([]);
  const { br_faktura } = useParams<{ br_faktura: string }>();

  // TEHNICKI SEKRETAR
  const [arhivski_br, setArhivski_br] = useState<string>("");
  const [br_dogovor, setBr_dogovor] = useState<number>();
  const [izdavaci_id, setIzdavaci_id] = useState<number>();
  const [iznos_dogovor, setIznos_dogovor] = useState<number>();
  const [vk_vrednost, setVk_vrednost] = useState<number>();
  const [datumTehnicki, setDatumTehnicki] = useState<string>("");

  // TIP NABAVKA
  const [tip, setTip] = useState<string>("javna");
  const [datumTip, setDatumTip] = useState<string>("");
  const [brDogovor, setBrDogovor] = useState<number>();
  const [vaznostDo, setVaznostDo] = useState<string>("");
  const [soglasnoDogovor, setSoglasnoDogovor] = useState<number>();
  const [ostanatiRaspSredstva, setOstanatiRaspSredstva] = useState<number>();
  const [istTip, setIstTip] = useState<number>();
  const [vkPotroseno, setVkPotroseno] = useState<number>();

  // BARATEL NABAVKA
  const [brKartonBaratel, setBrKartonBaratel] = useState<number>();
  const [nazivProekt, setNazivProekt] = useState<string>("");
  const [poteklo, setPoteklo] = useState<string>("");
  const [datumBaratel, setDatumBaratel] = useState<string>("");
  const [baratelId, setBaratelId] = useState<number>();

  // SMETKOVODSTVO
  const [brKartonSmetkovodstvo, setBrKartonSmetkovodstvo] = useState<number>();
  const [sostojbaKarton, setSostojbaKarton] = useState<string>("");
  const [osnovaEvidentiranje, setOsnovaEvidentiranje] = useState<number>();
  const [formular, setFormular] = useState<number>();
  const [vneseniSredstva, setVneseniSredstva] = useState<number>();
  const [smetka, setSmetka] = useState<string>("");
  const [konto, setKonto] = useState<string>("");
  const [datumSmetkovodstvo, setDatumSmetkovodstvo] = useState<string>("");

  const fetchFakturas = async () => {
    try {
      const response = await axiosClient.get(`/faktura/show/${br_faktura}`);

      if (response.status === 201) {
        const data = response.data.faktura;

        setFaktura(data);

        // Tehnicki Sekretar
        setArhivski_br(data.tehnicki_sekretar?.arhivski_br ?? "");
        setBr_dogovor(data.tehnicki_sekretar?.br_dogovor ?? undefined);
        setDatumTehnicki(data.tehnicki_sekretar?.datum ?? "");
        setIzdavaci_id(data.tehnicki_sekretar?.izdavaci_id ?? undefined);
        setIznos_dogovor(data.tehnicki_sekretar?.iznos_dogovor ?? undefined);
        setVk_vrednost(data.tehnicki_sekretar?.vk_vrednost ?? undefined);

        // Tip Nabavka
        setTip(data.tip_nabavka?.tip ?? "javna");
        setDatumTip(data.tip_nabavka?.datum ?? "");
        if (data.tip_nabavka?.tip === "javna") {
          setBrDogovor(
            data.tip_nabavka?.javna_nabavka?.br_dogovor ?? undefined
          );
          setVaznostDo(data.tip_nabavka?.javna_nabavka?.vaznost_do ?? "");
          setSoglasnoDogovor(
            data.tip_nabavka?.javna_nabavka?.soglasno_dogovor ?? undefined
          );
          setOstanatiRaspSredstva(
            data.tip_nabavka?.javna_nabavka?.ostanati_rasp_sredstva ?? undefined
          );
          console.log(data.tip_nabavka?.tip);
        } else {
          setIstTip(data.tip_nabavka?.tender?.ist_tip ?? undefined);
          setVkPotroseno(data.tip_nabavka?.tender?.vk_potroseno ?? undefined);
        }

        // Baratel Nabavka
        setBaratelId(data.baratel_javna_nabavka?.baratel_id ?? undefined);
        setBrKartonBaratel(data.baratel_javna_nabavka?.br_karton ?? undefined);
        setNazivProekt(data.baratel_javna_nabavka?.naziv_proekt ?? "");
        setPoteklo(data.baratel_javna_nabavka?.poteklo ?? "");
        setDatumBaratel(data.baratel_javna_nabavka?.datum ?? "");

        // Smetkovodstvo
        setBrKartonSmetkovodstvo(data.smetkovodstvo?.br_karton ?? undefined);
        setSostojbaKarton(data.smetkovodstvo?.sostojba_karton ?? "");
        setOsnovaEvidentiranje(
          data.smetkovodstvo?.osnova_evidentiranje ?? undefined
        );
        setFormular(data.smetkovodstvo?.formular ?? undefined);
        setVneseniSredstva(data.smetkovodstvo?.vneseni_sredstva ?? undefined);
        setSmetka(data.smetkovodstvo?.smetka ?? "");
        setKonto(data.smetkovodstvo?.konto ?? "");
        setDatumSmetkovodstvo(data.smetkovodstvo?.datum ?? "");
      }
    } catch (error) {
      console.error("Error fetching faktura:", error);
    }
  };

  useEffect(() => {
    fetchFakturas();
  }, []);

  return (
    <form action="">
      <div className="form-item">
        <h3>1. Основни информации (технички секретар)</h3>
        <div className="form-item-inputs">
          <input
            type="text"
            placeholder="Број на фактура"
            value={br_faktura ?? ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Број на договор"
            value={br_dogovor}
            readOnly
          />
          <input
            type="text"
            placeholder="Износ на фактура"
            value={iznos_dogovor}
            readOnly
          />
          <input
            type="text"
            placeholder="Датум"
            value={datumTehnicki}
            readOnly
          />
          <input
            type="text"
            placeholder="Издавач на фактура"
            value={String(izdavaci_id ?? "")}
            readOnly
          />
          <input
            type="text"
            placeholder="Вкупна вредност на фактура (со ДДВ)"
            value={String(vk_vrednost ?? "")}
            readOnly
          />
        </div>
      </div>
      <div className="form-item">
        <h3>2. Информации за тип на набавка (одделение за јавна набавка)</h3>
        <div className="form-item-select">
          <p>Содржината на фактурата, предметот на наплата е согласно:</p>
          <input
            type="text"
            placeholder="Тип на набавка"
            value={tip ? "Јавна Набавка" : "Набавка без тендер"}
            readOnly
            className="form-item-input"
          />
        </div>
      </div>
      {tip === "javna" ? (
        <div className="form-item">
          <h3>
            <i>(За јавна набавка)</i>
          </h3>
          <div className="form-item-inputs">
            <input
              type="text"
              placeholder="Број на договор"
              value={String(brDogovor) ?? ""}
              readOnly
            />
            <input
              type="text"
              placeholder="Важност на договор до"
              value={vaznostDo}
              readOnly
            />
            <input
              type="text"
              placeholder="Описот на сите ставки и единечната цена во фактурата е согласно договорот:"
              value={soglasnoDogovor ? "Да" : "Не"}
              readOnly
            />
            <input
              type="text"
              placeholder="Останати расположливи средства бпо договорот (без вред. на факт.)"
              value={ostanatiRaspSredstva ?? ""}
              readOnly
            />
          </div>
        </div>
      ) : (
        <div className="form-item">
          <h3>
            <i>(За јавна набавка без тендер)</i>
          </h3>
          <div className="form-item-inputs">
            <input
              type="text"
              placeholder="Дали до сега е набавувана стока или услуга од исти тип:"
              value={istTip ?? ""}
              readOnly
            />
            <input
              type="text"
              placeholder="Вкупно потрошени средства по основ на набавка од тој тип"
              value={vkPotroseno ?? ""}
              readOnly
            />
          </div>
        </div>
      )}
      <div className="form-item">
        <h3>
          3. Информации за евиденција (одделение за јавна набавка или барател на
          набавка)
        </h3>
        <div className="form-item-inputs">
          <input
            type="text"
            placeholder="Барател на набавката"
            value={String(baratelId ?? "")}
            readOnly
          />
          <input
            type="text"
            placeholder="Број на картон"
            value={brKartonBaratel ?? ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Назив на проектот/работата"
            value={nazivProekt}
            readOnly
          />
        </div>
        <div className="form-item-inputs">
          <input
            type="text"
            placeholder="Потекло на финансиите"
            value={poteklo}
            readOnly
          />
          <input
            type="text"
            placeholder="Датум"
            value={datumBaratel}
            readOnly
          />
        </div>
      </div>
      <div className="form-item">
        <h3>4. Информации од сметководство</h3>
        <div className="form-item-inputs">
          <input
            type="text"
            placeholder="Број на картон"
            value={brKartonSmetkovodstvo ?? ""}
            readOnly
          />
          <input
            type="text"
            placeholder="Состојба на картон"
            value={sostojbaKarton}
            readOnly
          />
          <input type="text" placeholder="Сметка" value={smetka} readOnly />
          <input type="text" placeholder="Конто" value={konto} readOnly />
          <input
            type="text"
            placeholder="Датум"
            value={datumSmetkovodstvo}
            readOnly
          />
        </div>
      </div>
      <div className="form-item">
        <h3>5. Одобрување за плаќање на фактура (продекан за финансии)</h3>
        <p>
          Согласно информациите наведени во точките 1, 2, 3 и 4 го одобрувам
          плаќањето на фактурата
        </p>
        <div className="form-item-inputs">
          <input type="text" placeholder="Датум" />
          <input type="text" placeholder="Потпис" />
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
  );
};

export default Prodekan;
