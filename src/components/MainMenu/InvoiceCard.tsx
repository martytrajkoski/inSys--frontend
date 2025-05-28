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

      return false;
    });

    setFakturas(filtered);
  };

  useEffect(() => {
    invoiceReadFilter();
  }, [items, role, title]);

  return (
    <div className="invoice-component">
      <h1>{title}</h1>
      <div className="invoice-card">
        <div className="invoice-card-items">
          <div className="invoice-card-item" style={{background:'#D9D9D9', cursor: "auto"}}>
            <div>Број на фактура</div>
            <div>Датум</div>
            <div>Статус</div>
          </div>
          {fakturas.map((item, index) => {
            let statusLabel = "";

            if (role === "Технички секретар") {
              statusLabel = "Креирано";
            } else {
              let isRead = false;
              switch (role) {
                case "Јавна набавка":
                  isRead = !!item.tip_nabavka?.read;
                  break;
                case "Барател на набавка":
                  isRead = !!item.baratel_javna_nabavka?.read;
                  break;
                case "Сметководство":
                  isRead = !!item.smetkovodstvo?.read;
                  break;
                case "Продекан за финансии":
                  isRead = item.approved_at !== null;
                  break;
              }
              statusLabel = isRead ? "Прочитано" : "Непрочитано";
            }

            return (
              <Link
                to={getRouteByRole(role, item.br_faktura)}
                className="invoice-card-item"
                key={index}
              >
                <div>{item.br_faktura}</div>
                <div className="invoice-date">
                  {new Date(item.created_at).toISOString().slice(0, 10)}
                </div>
                <div
                  className={`invoice-flag ${
                    role === "Технички секретар"
                      ? "created"
                      : statusLabel === "Прочитано"
                      ? "read"
                      : "unread"
                  }`}
                >
                  <p>{statusLabel}</p>
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
