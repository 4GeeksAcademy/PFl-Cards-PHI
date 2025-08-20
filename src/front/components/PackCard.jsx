import React from "react";

export default function PackCard({ title, description, buttonText }) {
  return (
    <div className="card text-center shadow-sm" style={{ width: "18rem" }}>
      <div className="card-body">
        <img class="card-img-top" src="https://images.wikidexcdn.net/mwuploads/wikidex/thumb/d/de/latest/20240212215431/Jirachi_%28Brecha_Parad%C3%B3jica_TCG%29.png/230px-Jirachi_%28Brecha_Parad%C3%B3jica_TCG%29.png"/>
        {/* <div
          className="bg-secondary mb-3"
          style={{ width: "100%", height: "150px" }}
        ></div> */}

        <h5 className="card-title">{title}</h5>
        <p className="card-text">{description}</p>

        <button className="btn btn-primary">{buttonText}</button>
      </div>
    </div>
  );
}