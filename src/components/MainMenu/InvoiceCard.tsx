import React from "react";

const InvoiceCard: React.FC<{title: string, items: string}> = ({title, items}) => {
    return(
        <div className="invoice-component">
            <h1>{title}</h1>
            <div className="invoice-card">
                <div className="invoice-card-items">
                    <div className="invoice-card-item">
                        <p>Faktura 1</p>
                        <div className="invoice-flag">unread</div>
                    </div>
                    <div className="invoice-card-item">
                        <p>Faktura 1</p>
                        <div className="invoice-flag">unread</div>
                    </div>
                    <div className="invoice-card-item">
                        <p>Faktura 1</p>
                        <div className="invoice-flag">unread</div>
                    </div>
                    <div className="invoice-card-item">
                        <p>Faktura 1</p>
                        <div className="invoice-flag">unread</div>
                    </div>
                    <div className="invoice-card-item">
                        <p>Faktura 1</p>
                        <div className="invoice-flag">unread</div>
                    </div>
                    <div className="invoice-card-item">
                        <p>Faktura 1</p>
                        <div className="invoice-flag">unread</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InvoiceCard;