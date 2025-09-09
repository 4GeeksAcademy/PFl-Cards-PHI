import React from "react";
import OnepacK from "../assets/img/1pack.png";
import FivepacK from "../assets/img/5pack.png";
import TenpacK from "../assets/img/10pack.png";

const packImages = {
  "1 Pack": OnepacK,
  "5 Packs": FivepacK,
  "10 Packs": TenpacK
};

export default function PackCard({ title, description, buttonText, onComprar }) {
  return (
    <div className="card text-center shadow-sm" style={{ width: "350px", minHeight: "180px", display: "flex", flexDirection: "column", justifyContent: "space-between", backgroundColor: "rgba(88, 86, 86, 0.59)" }}>
      <div className="card-body d-flex flex-column align-items-center">
        <img
          className="card-img-top"
          src={packImages[title]}
          alt={title}
          style={{
            width: "100%",          
            maxWidth: "250px",      
            height: "auto",         
            objectFit: "contain",
            marginBottom: "20px"
          }}
        />
        <h5 className="card-title" style={{ fontSize: "2rem" }}>{title}</h5>
        <p className="card-text" style={{ fontSize: "1.2rem" }}>{description}</p>
      </div>
    </div>
  );
}