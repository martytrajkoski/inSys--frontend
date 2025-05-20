import React from "react";
import type { FakturaType } from "../../types/types";

const InvoiceCard: React.FC<{title: string, items: FakturaType[]}> = ({title, items}) => {
    return(
        <div className="invoice-component">
            <h1>{title}</h1>
            <div className="invoice-card">
                <div className="invoice-card-items">
                    <div className="invoice-card-item">
                        {items.map((item, index)=>(
                            <>
                                <p key={index}>{item.br_faktura}</p>
                                <div className="invoice-flag">{item.status}</div>
                            </>
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default InvoiceCard;