import { motion } from "framer-motion";
import React from "react";
import { MdError, MdWarning, MdInfo } from "react-icons/md";
import "./httpErrorResponse.css";

const HttpErrorResponse = ({ errorData, onRetry = null, className = "" }) => {
    // Determinar el tipo de error basado en el status code
    const getErrorType = (status) => {
        if (status >= 500) return "server";
        if (status >= 400) return "client";
        return "unknown";
    };

    // Obtener el icono apropiado según el tipo de error
    const getErrorIcon = (status) => {
        const errorType = getErrorType(status);
        switch (errorType) {
            case "server":
                return <MdError size={48} />;
            case "client":
                return <MdWarning size={48} />;
            default:
                return <MdInfo size={48} />;
        }
    };

    // Obtener mensaje por defecto si no hay detail
    const getDefaultMessage = (status, statusText) => {
        if (status >= 500) {
            return "We're experiencing technical difficulties. Please try again later.";
        }
        if (status >= 400) {
            return "There was an issue with your request. Please check and try again.";
        }
        return statusText || "An unexpected error occurred.";
    };

    const errorType = getErrorType(errorData.status);
    const displayMessage = errorData.detail?.message || getDefaultMessage(errorData.status, errorData.statusText);

    return (
        <motion.div
            className={`http-error-response ${errorType} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
        >
            <div className="error-header">
                <div className={`error-icon ${errorType}`}>
                    {getErrorIcon(errorData.status)}
                </div>
                <div className="error-info">
                    <h3 className="error-title">
                        Error {errorData.status}
                    </h3>
                    <span className="error-subtitle">
                        {errorData.statusText}
                    </span>
                </div>
            </div>

            <div className="error-content">
                <div className="error-message">
                    <p>{displayMessage}</p>
                </div>

                {/* Detalles técnicos expandibles */}
                <details className="error-details">
                    <summary>Technical Details</summary>
                    <div className="error-technical">
                        <div className="tech-row">
                            <span className="tech-label">Status Code:</span>
                            <span className="tech-value">{errorData.status}</span>
                        </div>
                        <div className="tech-row">
                            <span className="tech-label">Status Text:</span>
                            <span className="tech-value">{errorData.statusText}</span>
                        </div>
                        {errorData.detail?.message && (
                            <div className="tech-row">
                                <span className="tech-label">Detail:</span>
                                <span className="tech-value">{errorData.detail.message}</span>
                            </div>
                        )}
                    </div>
                </details>

                {/* Botón de reintentar si se proporciona */}
                {onRetry && (
                    <motion.button
                        className="retry-button"
                        onClick={onRetry}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        Try Again
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default HttpErrorResponse;