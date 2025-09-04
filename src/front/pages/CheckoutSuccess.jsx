import { useEffect, useRef, useState } from "react";

export default function CheckoutSuccess() {
  const [msg, setMsg] = useState("Confirming purchase...");
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return; // Evita múltiples ejecuciones en modo estricto
    didRun.current = true; 

    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get("session_id");
    if (!sessionId) { setMsg("Missing session_id."); return; }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.msg || "Confirm error");
        setMsg("Packs granted. You can now open them!");
      })
      .catch(() => setMsg("Could not confirm purchase."));
  }, []);

  // UI helpers 
  const isSuccess = msg.startsWith("Packs granted");
  const isError = msg.startsWith("Could not") || msg.startsWith("Missing");
  const isLoading = !isSuccess && !isError;

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 p-3">
      <div className="card shadow-sm w-100" style={{ maxWidth: 520 }}>
        <div className="card-body text-center p-4 p-md-5">
          {/* Icono según estado */}
          {isSuccess && (
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 72, height: 72, backgroundColor: "rgba(25,135,84,.1)" }}
            >
              {/* Tick verde */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 7L10 17l-6-6" stroke="#198754" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          {isLoading && (
            <div className="mb-3">
              {/* Spinner Bootstrap */}
              <div className="spinner-border" role="status" aria-hidden="true"></div>
            </div>
          )}

          {isError && (
            <div
              className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 72, height: 72, backgroundColor: "rgba(220,53,69,.1)" }}
            >
              {/* Icono de error */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 8v5m0 3h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          {/* Mensaje */}
          <h5 className="card-title mb-2">
            {isSuccess ? "Payment confirmed" : isError ? "We couldn’t finish your purchase" : "Processing payment"}
          </h5>
          <p className="card-text text-muted mb-4" style={{ minHeight: 24 }}>{msg}</p>

          {/* Botones */}
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <a href="/shop" className="btn btn-outline-secondary btn-sm px-3">Go to Shop</a>
            <a href="/packopen" className="btn btn-success btn-sm px-3">{isSuccess ? "Open Packs" : "Try Again"}</a>
          </div>
        </div>
      </div>
    </div>
  );
}