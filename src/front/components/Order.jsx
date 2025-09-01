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

    if (isMobile) {
        return (
            <div className="mb-3" style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ minWidth: "120px" }}
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
                                boxShadow: "0 2px 8px #bbb",
                                minWidth: "120px"
                            }}
                        >
                            {options.map(opt => (
                                <button
                                    key={opt.value}
                                    className={`btn btn-outline-primary w-100${filter === opt.value ? " active" : ""}`}
                                    style={{
                                        fontWeight: filter === opt.value ? "bold" : "normal",
                                        borderWidth: filter === opt.value ? "2px" : "1px",
                                        background: filter === opt.value ? "#e3f2fd" : "white",
                                        color: filter === opt.value ? "#1976d2" : "#333",
                                        borderRadius: 0
                                    }}
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
                    className={`btn btn-outline-primary${filter === opt.value ? " active" : ""}`}
                    style={{
                        fontWeight: filter === opt.value ? "bold" : "normal",
                        borderWidth: filter === opt.value ? "2px" : "1px",
                        background: filter === opt.value ? "#e3f2fd" : "white",
                        color: filter === opt.value ? "#1976d2" : "#333"
                    }}
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