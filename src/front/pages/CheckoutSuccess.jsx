import { useEffect, useState } from "react";

export default function CheckoutSuccess() {
  const [msg, setMsg] = useState("Confirming purchase...");

  useEffect(() => {
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

  return <div style={{ padding: 24 }}>{msg}</div>;
}