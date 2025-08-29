import React from "react";
import Card from "./Card";

const Opening = ({ packs = [], onClose }) => (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.7)" }}>
        <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
                <div className="modal-header d-flex flex-row align-items-center justify-content-between">
                    <h5 className="modal-title text-center flex-grow-1">Congratulations!</h5>
                    <button type="button" className="btn-close ms-3" onClick={onClose}></button>
                </div>
                <div className="modal-body">
                    {(!Array.isArray(packs) || packs.length === 0) ? (
                        <p>Loading Cards...</p>
                    ) : (
                        packs.map((pack, packIdx) => (
                            <div key={packIdx} className="mb-4">
                                <div className="d-flex justify-content-center gap-4 flex-wrap">
                                    {Array.isArray(pack)
                                        ? pack.map((card, idx) => (
                                            <Card key={card.id || idx} card={card} hideAddToDeck={true} />
                                        ))
                                        : <Card key={packIdx} card={pack} hideAddToDeck={true} />}
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="modal-footer d-flex justify-content-center">
                    <button type="button" className="btn btn-secondary" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default Opening;