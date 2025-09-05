import PackCardHome from "./PackCardHome";
import { useNavigate } from "react-router-dom";

const packData = [
    {
        title: "1 Pack",
        description: "A pack with 5 random cards.",
        quantity: 1
    },
    {
        title: "5 Packs",
        description: "Five packs with random cards.",
        quantity: 5
    },
    {
        title: "10 Packs",
        description: "Ten packs with random cards.",
        quantity: 10
    }
];

export default function PackCarousel() {
    const navigate = useNavigate();

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-dark text-white fw-bold">
                🎴 New pack offer!
            </div>

            <div className="card-body d-flex justify-content-center ">
                <div
                    id="packCarousel"
                    className="carousel slide"
                    data-bs-ride="carousel"
                    style={{ width: "100%", maxWidth: "350px" }}
                >
                    <div className="carousel-inner">
                        {packData.map((pack, idx) => (
                            <div
                                key={idx}
                                className={`carousel-item ${idx === 0 ? "active" : ""}`}
                            >
                                <PackCardHome
                                    title={pack.title}
                                    description={pack.description}
                                    buttonText="Buy"
                                    onComprar={() => navigate("/shop")}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Controles de navegación */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#packCarousel"
                        data-bs-slide="prev"
                    >
                        <span
                            className="carousel-control-prev-icon"
                            aria-hidden="true"
                            style={{ filter: "invert(1)" }} 
                        ></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#packCarousel"
                        data-bs-slide="next"
                    >
                        <span
                            className="carousel-control-next-icon"
                            aria-hidden="true"
                            style={{ filter: "invert(1)" }} 
                        ></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div
                className="card-footer text-center text-decoration-underline text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/shop")}
            >
                View all packs →
            </div>
        </div>
    );
}