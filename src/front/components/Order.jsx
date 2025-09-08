import React, { useState, useEffect } from "react";

const options = [
    { value: "all", label: "Your cards", double: false },
    { value: "rarity", label: "Rarity", double: true },
    { value: "points", label: "Points", double: true },
    { value: "missing", label: "Missing", double: false },
    { value: "all_with_missing", label: "All collection", double: false }
];

const Order = ({ filter, setFilter, orderAsc, setOrderAsc }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 576);
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Estilos para los botones azules
    const blueBtnStyle = isActive => ({
        fontWeight: isActive ? "bold" : "normal",
        borderWidth: isActive ? "2px" : "1px",
        background: isActive ? "#1976d2" : "#2196f3",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        boxShadow: "0 2px 6px rgba(25, 118, 210, 0.15)"
    });

    if (isMobile) {
        return (
            <div className="mb-3" style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <button
                        style={blueBtnStyle(false)}
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        Filter
                    </button>
                    {showDropdown && (
                        <div
                            style={{
                                position: "absolute",
                                top: "110%",
                                left: 0,
                                zIndex: 10,
                                background: "#fff",
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                minWidth: "120px"
                            }}
                        >
                            {options.map(opt => (
                                <button
                                    key={opt.value}
                                    style={blueBtnStyle(filter === opt.value)}
                                    className={filter === opt.value ? "active" : ""}
                                    onClick={() => {
                                        setShowDropdown(false);
                                        if (opt.double) {
                                            if (filter === opt.value) {
                                                setOrderAsc(!orderAsc);
                                            } else {
                                                setFilter(opt.value);
                                                setOrderAsc(true);
                                            }
                                        } else {
                                            setFilter(opt.value);
                                        }
                                    }}
                                >
                                    {opt.label}
                                    {opt.double && filter === opt.value && (
                                        <span style={{ marginLeft: "6px" }}>
                                            {orderAsc ? "↑" : "↓"}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Vista escritorio: botones en línea
    return (
        <div
            className="mb-3"
            style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            {options.map(opt => (
                <button
                    key={opt.value}
                    style={blueBtnStyle(filter === opt.value)}
                    className={filter === opt.value ? "active" : ""}
                    onClick={() => {
                        if (opt.double) {
                            if (filter === opt.value) {
                                setOrderAsc(!orderAsc);
                            } else {
                                setFilter(opt.value);
                                setOrderAsc(true);
                            }
                        } else {
                            setFilter(opt.value);
                        }
                    }}
                >
                    {opt.label}
                    {opt.double && filter === opt.value && (
                        <span style={{ marginLeft: "6px" }}>
                            {orderAsc ? "↑" : "↓"}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default Order;