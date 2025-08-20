import React from "react";
import PackCard from "../components/PackCard";

const Shop = () => {
    return (
        <div className="row justify-content-center g-4 mt-5 mb-5">
            <div className="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                <PackCard
                    title="Pack de 1 Sobre"
                    description="Un sobre con cartas aleatorias."
                    buttonText="Comprar 1"
                />
            </div>
            <div className="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                <PackCard
                    title="Pack de 5 Sobres"
                    description="Cinco sobres con cartas aleatorias."
                    buttonText="Comprar 5"
                />
            </div>
            <div className="col-12 col-sm-8 col-md-4 d-flex justify-content-center">
                <PackCard
                    title="Pack de 10 Sobres"
                    description="Diez sobres con cartas aleatorias."
                    buttonText="Comprar 10"
                />
            </div>
        </div>
    );
}
export default Shop