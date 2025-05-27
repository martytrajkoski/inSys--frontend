import React from "react";
import { Link } from "react-router-dom";
import type { InvoiceType } from "../../types/types";

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
  
  return (
    <div className="invoice-component">
      <h1>{title}</h1>
      <div className="invoice-card">
        <div className="invoice-card-items">
          <div className="invoice-card-item">
            <p>Број на фактура</p>
            <div>Датум</div>
            <div>Статус</div>
          </div>
          {items.map((item, index) => (
            <Link
              to={getRouteByRole(role, item.br_faktura)}
              className="invoice-card-item"
              key={index}
            >
              <p>{item.br_faktura}</p>
              <div className="invoice-date">
                {new Date(item.created_at).toISOString().slice(0, 10)}
              </div>
              <div className="invoice-flag">
                <p>{item.status}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
