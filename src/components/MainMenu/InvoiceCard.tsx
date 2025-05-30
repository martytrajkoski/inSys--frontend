import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FakturaType, InvoiceType } from "../../types/types";

const getRouteByRole = (role: string, br_faktura: number): string => {
  switch (role) {
    case "Продекан за финансии":
      return `/prodekan/${br_faktura}`;
    case "Технички секретар":
      return `/tehnickisekretar/${br_faktura}`;
    case "Јавна набавка":
      return `/tipnabavka/${br_faktura}`;
    case "Барател на набавка":
      return `/baratelnabavka/${br_faktura}`;
    case "Сметководство":
      return `/smetkovodstvo/${br_faktura}`;
    default:
      return "/";
  }
};

const getFakturaFlag = (item: string): string | null => {
  switch (item) {
    case "ready":
      return "Спремна";
    case "pending":
      return "Чекање";
    case "approved":
      return "Прифатена";
    case "rejected":
      return "Одбиена";
    default:
      return null;
  }
};

const getStatusDepartment = (
  role: string,
  item: FakturaType
): string | null => {
  switch (role) {
    case "Технички Секретар":
      return item.tehnicki_sekretar
        ? getFakturaFlag(item.tehnicki_sekretar.status)
        : null;
    case "Сметководство":
      return item.smetkovodstvo
        ? getFakturaFlag(item.smetkovodstvo.status)
        : null;
    case "Јавна набавка":
      return item.tip_nabavka ? getFakturaFlag(item.tip_nabavka.status) : null;
    case "Барател на набавка":
      return item.baratel_javna_nabavka
        ? getFakturaFlag(item.baratel_javna_nabavka.status)
        : null;
    default:
      return null;
  }
};

const InvoiceCard: React.FC<InvoiceType> = ({ title, items, role }) => {
  const [fakturas, setFakturas] = useState<FakturaType[]>([]);

  const invoiceReadFilter = () => {
    if (role === "Технички секретар") {
      setFakturas(items);
      return;
    }

    const filtered: FakturaType[] = items.filter((item) => {
      if (title === "Нови фактури") {
        switch (role) {
          case "Јавна набавка":
            return item.tip_nabavka === null;
          case "Барател на набавка":
            return item.baratel_javna_nabavka === null;
          case "Сметководство":
            return item.smetkovodstvo === null;
          case "Продекан за финансии":
            return item.approved_at === null;
          default:
            return false;
        }
      } else if (title === "Прегледани фактури") {
        switch (role) {
          case "Јавна набавка":
            return item.tip_nabavka?.read === 1;
          case "Барател на набавка":
            return item.baratel_javna_nabavka?.read === 1;
          case "Сметководство":
            return item.smetkovodstvo?.read === 1;
          case "Продекан за финансии":
            return item.approved_at !== null;
          default:
            return false;
        }
      }

      return true;
    });

    setFakturas(filtered);
  };

  useEffect(() => {
    invoiceReadFilter();
  }, [items, role, title]);

  return (
    <div className="invoice-component">
      <div className="invoice-card">
        <div className="invoice-card-items">
          <div
            className="invoice-card-item"
            style={{ background: "#D9D9D9", cursor: "auto" }}
          >
            <div>Архивски број</div>
            <div>Број на фактура</div>
            <div>Датум</div>
            {role !== "Продекан за финансии" && <div>Статус</div>}
            <div>Статус на фактура</div>
          </div>
          {fakturas.map((item, index) => {
            let statusLabel = getFakturaFlag(item.status);
            let statusDepartment = getStatusDepartment(role, item);

            return (
              <Link
                to={getRouteByRole(role, item.br_faktura)}
                className="invoice-card-item"
                key={index}
              >
                <div>{item.tehnicki_sekretar.arhivski_br}</div>
                <div>{item.br_faktura}</div>
                <div className="invoice-date">
                  {new Date(item.created_at).toISOString().slice(0, 10)}
                </div>
                  {role !== "Продекан за финансии" && (
                    <div>
                      {statusDepartment ? (
                        <p
                          className={`invoice-status-department-flag ${
                            statusDepartment === "Прифатена"
                              ? "approved"
                              : statusDepartment === "Одбиена"
                              ? "rejected"
                              : "pending"
                          }`}
                        >
                          {statusDepartment}
                        </p>
                      ) : (
                        <p className="invoice-status-department-flag pending">Чекање</p>
                      )}
                    </div>
                  )}
                <div>
                  {item.is_sealed ? (
                    <p className="sealed">Запечатена</p>
                  ) : (
                    <p
                      className={`invoice-status-faktura-flag ${
                        statusLabel === "Спремна" ? "approved" : "pending"
                      }`}
                    >
                      {statusLabel}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
