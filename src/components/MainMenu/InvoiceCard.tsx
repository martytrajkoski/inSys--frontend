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
  console.log('title', title)
  const invoiceReadFilter = () => {
    const filtered: FakturaType[] = items.filter(item => {
      if (title == "Нови фактури") {
        switch (role) {
          case "Јавна набавка":
            return item.tip_nabavka === null;
          case "Барател на набавка":
            return item.baratel_javna_nabavka === null;
          case "Сметководство":
            return item.smetkovodstvo === null;
          case "Продекан за финансии":
            return item.approved_at === null;
          // case "Технички секретар":
          //   return item.tehnicki_sekretar?.read === 0;
          default:
            return false;
        }
      } else {
        switch (role) {
          case "Јавна набавка":
            return item.tip_nabavka?.read === 1;
          case "Барател на набавка":
            return item.baratel_javna_nabavka?.read === 1;
          case "Сметководство":
            return item.smetkovodstvo?.read === 1;
          case "Продекан за финансии":
            return item.approved_at !== null;
          // case "Технички секретар":
          //   return item.tehnicki_sekretar?.read === 1;
          default:
            return false;
        }
      }
    });

    setFakturas(filtered);
  };
  console.log('fakturas', fakturas)
  useEffect(() => {
    invoiceReadFilter();
  }, [items, role, title]);

  return (
    <div className="invoice-component">
      <h1>{title}</h1>
      <div className="invoice-card">
        <div className="invoice-card-items">
          <div className="invoice-card-item">
            <div>Број на фактура</div>
            <div>Датум</div>
            <div>Статус</div>
          </div>
          {fakturas.map((item, index) => {
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
              // Add for Технички секретар if needed
              default:
                isRead = false;
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
                <div className={`invoice-flag ${isRead ? "read" : "unread"}`}>
                  <p>{isRead ? "Прочитано" : "Непрочитано"}</p>
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
