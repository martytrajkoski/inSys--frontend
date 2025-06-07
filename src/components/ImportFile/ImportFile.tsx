import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import { useNavigate } from "react-router-dom";

interface ScanInvoiceModalProps {
    onClose: () => void;
}

const ImportFile: React.FC<ScanInvoiceModalProps> = ({onClose}) => {

    const navigate = useNavigate();
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

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('arhivski_br', 'AB-12');     
        formData.append('br_faktura', '3');       
        formData.append('datum', '2025-06-07');               
        formData.append('scan_file', file);              

        try {
            const response = await axiosClient.post('/tehnickisekretar/store_pdf', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            });

            if (response.status === 201) {
                console.log('Tehnicki Sekretar and Faktuta created');
                navigate('/');  
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            if (error.response?.status === 422) {
            console.error('Validation errors:', error.response.data.errors);
            }
        }
        };

    console.log("file", file);
    
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
                    <button onClick={handleUpload}>submit</button>
                {/* {file && <p>Selected file: {file.name}</p>} */}
            </div>
        </div>
    )
}

export default ImportFile;