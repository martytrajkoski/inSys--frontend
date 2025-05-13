import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

interface ScanInvoiceModalProps {
    onClose: () => void;
}

const ImportFile: React.FC<ScanInvoiceModalProps> = ({onClose}) => {

    const [file, setFile] = useState<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (e:any) => {
      setFile(e.target.files[0]);
    };
  
    const handleDrop = (e:any) => {
      e.preventDefault();
      setFile(e.dataTransfer.files[0]);
    };
  
    const handleDragOver = (e:any) => {
      e.preventDefault();
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
            containerRef.current &&
            !containerRef.current.contains(e.target as Node)
            ) {
            onClose();
            }
        };

        const handleEscKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
            onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscKey);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscKey);
        };
    }, [onClose]);



    return(
        <div className="import-file-backdrop">
            <div 
                className="upload-container"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                ref={containerRef}
                >
                <div className="upload-content">
                    <div className="upload-icon">
                        <FontAwesomeIcon icon={faUpload}/>
                    </div>
                    <p>Drag & drop or <span className="upload-choose">Choose file</span> to upload</p>
                    <p className="upload-formats">PDF</p>
                    <input 
                        type="file" 
                        className="upload-input" 
                        onChange={handleFileChange}
                        accept="application/pdf"
                    />
                </div>
                {/* {file && <p>Selected file: {file.name}</p>} */}
            </div>
        </div>
    )
}

export default ImportFile;