import React from "react";
import { Link } from "react-router-dom";
import type { FakturaType, InvoiceType } from "../../types/types";

const getRouteByRole = (role: string, br_faktura: string): string => {
  const encoded = encodeURIComponent(br_faktura);
  switch (role) {
    case "Продекан за финансии":
      return `/prodekan/${encoded}`;
    case "Технички секретар":
      return `/tehnickisekretar/${encoded}`;
    case "Јавна набавка":
      return `/tipnabavka/${encoded}`;
    case "Барател на набавка":
      return `/baratelnabavka/${encoded}`;
    case "Сметководство":
      return `/smetkovodstvo/${encoded}`;
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
  if (item.is_sealed) return "Прифатена";
  switch (role) {
    case "Технички секретар":
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

const InvoiceCard: React.FC<InvoiceType> = ({ items, role }) => {
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
          {items.map((item, index) => {
            let statusLabel = getFakturaFlag(item.status);
            let statusDepartment = getStatusDepartment(role, item);
            return (
              <>
                <Link
                  to={getRouteByRole(role, item.br_faktura)}
                  className="invoice-card-item"
                  key={index}
                >
                  <div>{item.tehnicki_sekretar.arhivski_br}</div>
                  <div>{item.br_faktura}</div>
                  <div className="invoice-date">
                    {new Date(item.tehnicki_sekretar.datum)
                      .toISOString()
                      .slice(0, 10)}
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
                        <p className="invoice-status-department-flag pending">
                          Чекање
                        </p>
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
              </>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
