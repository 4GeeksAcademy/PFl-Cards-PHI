import React from "react";
import OnepacK from "/workspaces/PFl-Cards-PHI/docs/Imagenes/1pack.png";
import FivepacK from "/workspaces/PFl-Cards-PHI/docs/Imagenes/5pack.png";
import TenpacK from "/workspaces/PFl-Cards-PHI/docs/Imagenes/10pack.png";

const packImages = {
  "1 Pack": OnepacK,
  "5 Packs": FivepacK,
  "10 Packs": TenpacK
};

export default function PackCard({ title, description, buttonText, onComprar }) {
  return (
    <div className="card text-center shadow-sm" style={{ width: "22rem", minHeight: "520px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div className="card-body d-flex flex-column align-items-center">
        <img
          className="card-img-top"
          src={packImages[title]}
          alt={title}
          style={{
            width: "240px",
            height: "240px",
            objectFit: "contain",
            marginBottom: "20px"
          }}
        />
        <h5 className="card-title" style={{ fontSize: "2rem" }}>{title}</h5>
        <p className="card-text" style={{ fontSize: "1.2rem" }}>{description}</p>
      </div>
      <div className="card-footer bg-transparent border-0">
        <button className="btn btn-primary btn-lg" onClick={onComprar}>{buttonText}</button>
      </div>
    </div>
  );
}