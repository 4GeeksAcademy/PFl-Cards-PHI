import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

// Este componente permite que el scroll vaya al inicio al cambiar de vista.
// Además, muestra un botón para subir arriba cuando haces scroll hacia abajo.

const ScrollToTop = ({ location, children }) => {
    const prevLocation = useRef(location);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        if (location !== prevLocation.current) {
            window.scrollTo(0, 0);
        }
        prevLocation.current = location;
    }, [location]);

    useEffect(() => {
        const onScroll = () => {
            setShowButton(window.scrollY > 200);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <>
            {children}
            {showButton && (
                <button
                    onClick={handleClick}
                    style={{
                        position: "fixed",
                        right: "24px",
                        bottom: "32px",
                        background: "#1976d2",
                        border: "none",
                        borderRadius: "50%",
                        width: "48px",
                        height: "48px",
                        fontSize: "1.7rem",
                    }}
                    aria-label="Scroll to top"
                    title="Scroll to top"
                >
                    ↑
                </button>
            )}
        </>
    );
};

export default ScrollToTop;

ScrollToTop.propTypes = {
    location: PropTypes.object,
    children: PropTypes.any
};