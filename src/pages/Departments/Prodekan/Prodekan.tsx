import React from "react";
import axiosClient from "../../../axiosClient/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentSection from "../../../components/Comment-Section/Comment-Section";
import SweetAlert from "../../../components/Sweet-Alert/Sweet-Alert";

const Prodekan: React.FC = () => {
  const { br_faktura } = useParams<{ br_faktura: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  //PRODEKAN
  const [datumProdekan, setDatumProdekan] = useState<string>("");
  const [isSealed, setIsSealed] = useState<boolean>();

  // COMMENTS
  const [commentTehnicki, setCommentTehnicki] = useState<string>("");
  const [commentTipNabavka, setCommentTipNabavka] = useState<string>("");
  const [commentBaratel, setCommentBaratel] = useState<string>("");
  const [commentSmetkovodstvo, setCommentSmetkovodstvo] = useState<string>("");

  const [statusTehnicki, setStatusTehnicki] = useState<string>("");
  const [statusTipNabavka, setStatusTipNabavka] = useState<string>("");
  const [statusBaratel, setStatusBaratel] = useState<string>("");
  const [statusSmetkovodstvo, setStatusSmetkovodstvo] = useState<string>("");

  const fetchFakturas = async () => {
    try {
      const response = await axiosClient.get(`/faktura/show/${br_faktura}`);

      if (response.status === 201) {
        const data = response.data.faktura;

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

        //Prodekan
        setDatumProdekan(
          data?.updated_at
            ? new Date(data.updated_at).toISOString().slice(0, 10)
            : ""
        );
        setIsSealed(data?.is_sealed ?? undefined);

        // COMMENTS
        setCommentTehnicki(data.tehnicki_sekretar?.comment ?? "");
        setCommentTipNabavka(data.tip_nabavka?.comment ?? "");
        setCommentBaratel(data.baratel_javna_nabavka?.comment ?? "");
        setCommentSmetkovodstvo(data.smetkovodstvo?.comment ?? "");

        setStatusTehnicki(data.tehnicki_sekretar?.status ?? "");
        setStatusTipNabavka(data.tip_nabavka?.status ?? "");
        setStatusBaratel(data.baratel_javna_nabavka?.status ?? "");
        setStatusSmetkovodstvo(data.smetkovodstvo?.status ?? "");
      }
    } catch (error) {
      console.error("Error fetching faktura:", error);
    }
  };

  const handleApproval = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const confirmApproval = async () => {
    setShowConfirmModal(false);
    await storeProdekan();
  };

  const cancelApproval = () => {
    setShowConfirmModal(false);
  };

  const storeProdekan = async () => {
    try {
      const response = await axiosClient.patch(`/prodekan/statusplakjanje`, {
        br_faktura: Number(br_faktura),
        status: "approved",
        is_sealed: true,
        review_comment: "",
      });

    if (response.status === 201) {
      console.log("Фактурата е успешно запечатена.");
      navigate('/');
    }

    if(response.status === 401){
    }
  } catch (error) {
    console.error("Грешка при ажурирање на статусот:", error);
  }
};


  useEffect(() => {
    if (br_faktura) {
      fetchFakturas();
    }
  }, [br_faktura]);

  return (
    <form>
      <div className="form-item">
        <h3>1. Основни информации (технички секретар)</h3>
        <div className="form-item-inputs">
          <label>Архивски број на влезна фактура 05-12-</label>
          <input type="text" value={arhivski_br ?? ""} readOnly />

          <label>Број на фактура</label>
          <input type="text" value={br_faktura ?? ""} readOnly />

          <label>Број на договор</label>
          <input type="text" value={br_dogovor} readOnly />

          <label>Износ на фактура</label>
          <input type="text" value={iznos_dogovor} readOnly />

          <label>Датум</label>
          <input type="text" value={datumTehnicki} readOnly />

          <label>Издавач на фактура</label>
          <input type="text" value={String(izdavaci_id ?? "")} readOnly />

          <label>Вкупна вредност на фактура (со ДДВ)</label>
          <input type="text" value={String(vk_vrednost ?? "")} readOnly />
        </div>
      </div>

      {!isSealed && (
        <CommentSection
          brFaktura={br_faktura ?? ""}
          endpoint="/prodekan/statustehnicki"
          initialStatus={statusTehnicki}
          initialComment={commentTehnicki}
        />
      )}

      <div className="form-item">
        <h3>2. Информации за тип на набавка (одделение за јавна набавка)</h3>
        <div className="form-item-select">
          <label>Содржината на фактурата, предметот на наплата е согласно:</label>
          <input
            type="text"
            value={tip ? "Јавна Набавка" : "Набавка без тендер"}
            readOnly
            className="form-item-input"
          />
        </div>
      </div>
      {tip === "javna" ? (
        <div className="form-item">
          <div className="form-item-inputs">
            <label>Број на договор</label>
            <input type="text" value={String(brDogovor) ?? ""} readOnly />
            <label>Важност на договор до</label>
            <input type="text" value={vaznostDo} readOnly />
            <label>
              Описот на сите ставки и единечната цена во фактурата е согласно
              договорот:
            </label>
            <input type="text" value={soglasnoDogovor ? "Да" : "Не"} readOnly />
            <label>
              Останати расположливи средства бпо договорот (без вред. на факт.)
            </label>
            <input type="text" value={ostanatiRaspSredstva ?? ""} readOnly />
            <label>Датум</label>
            <input type="date" value={datumTip ?? ""} readOnly />
          </div>
        </div>
      ) : (
        <div className="form-item">
          <div className="form-item-inputs">
            <label>
              Дали до сега е набавувана стока или услуга од исти тип:
            </label>
            <input type="text" value={istTip ?? ""} readOnly />
            <label>
              Вкупно потрошени средства по основ на набавка од тој тип
            </label>
            <input type="text" value={vkPotroseno ?? ""} readOnly />
            <label>Датум</label>
            <input type="date" value={datumTip ?? ""} readOnly />
          </div>
        </div>
      )}

      {!isSealed && (
        <CommentSection
          brFaktura={br_faktura ?? ""}
          endpoint="/prodekan/statustipnabavka"
          initialStatus={statusTipNabavka}
          initialComment={commentTipNabavka}
        />
      )}

      <div className="form-item">
        <h3>
          3. Информации за евиденција (одделение за јавна набавка или барател на
          набавка)
        </h3>
        <div className="form-item-inputs">
          <label>Барател на набавката</label>
          <input type="text" value={String(baratelId ?? "")} readOnly />
          <label>Број на картон</label>
          <input type="text" value={brKartonBaratel ?? ""} readOnly />
          <label>Назив на проектот/работата</label>
          <input type="text" value={nazivProekt} readOnly />
        </div>
        <div className="form-item-inputs">
          <label>Потекло на финансиите</label>
          <input type="text" value={poteklo} readOnly />
          <label>Датум</label>
          <input type="text" value={datumBaratel} readOnly />
        </div>
      </div>

      {!isSealed && (
        <CommentSection
          brFaktura={br_faktura ?? ""}
          endpoint="/prodekan/statusbaratelnabavka"
          initialStatus={statusBaratel}
          initialComment={commentBaratel}
        />
      )}

      <div className="form-item">
        <h3>4. Информации од сметководство (сметководство) </h3>
        <div className="form-item-inputs">
          <label>Број на картон</label>
          <input type="text" value={brKartonSmetkovodstvo ?? ""} readOnly />
          <label>Состојба на картон</label>
          <input type="text" value={sostojbaKarton} readOnly />
          <label>Предметот е формулар за задолжување на основно средство</label>
          <input
            type="text"
            value={osnovaEvidentiranje ? "Да" : "Не"}
            readOnly
          />
          <label>Пополнет е формулар за задолжување на основно средство</label>
          <input type="text" value={formular ? "Да" : "Не"} readOnly />
          <label>
            Средствата се внесени како новонабавени за тековната година
          </label>
          <input type="text" value={vneseniSredstva ? "Да" : "Не"} readOnly />
          <label>Сметка</label>
          <input type="text" value={smetka} readOnly />
          <label>Конто</label>
          <input type="text" value={konto} readOnly />
          <label>Датум</label>
          <input type="text" value={datumSmetkovodstvo} readOnly />
        </div>
      </div>

      {!isSealed && (
        <CommentSection
          brFaktura={br_faktura ?? ""}
          endpoint="/prodekan/statussmetkovodstvo"
          initialStatus={statusSmetkovodstvo}
          initialComment={commentSmetkovodstvo}
        />
      )}

      <div className="form-item">
        <h3>5. Одобрување за плаќање на фактура (продекан за финансии)</h3>
        <label>
          Согласно информациите наведени во точките 1, 2, 3 и 4 го одобрувам
          плаќањето на фактурата.
        </label>
        <div className="form-item-inputs">
          <label>Датум</label>
          <input
            type="date"
            value={datumProdekan}
            onChange={(e) => setDatumProdekan(e.target.value)}
            readOnly={isSealed}
          />
        </div>
      </div>
      <div className="form-buttons">
        <div></div>
        <div className="form-buttons-edit">
          {!isSealed && (
            <button onClick={(e) => handleApproval(e)}>
              Одобри ја фактурата
            </button>
          )}
        </div>
      </div>
      <SweetAlert
        visible={showConfirmModal}
        onConfirm={confirmApproval}
        onCancel={cancelApproval}
      />
    </form>
  );
};

export default Prodekan;
