"use client";

import { FormEvent, useState } from "react";

export default function ReviewForm() {
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const formElement = event.currentTarget;

    try {
      const form = new FormData(formElement);
      form.set("rating", String(rating));

      const response = await fetch("/api/reviews", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível enviar sua avaliação.");

      formElement.reset();
      setRating(5);
      setMessage("Avaliação enviada! Ela aparecerá no site depois de ser aprovada.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro ao enviar avaliação.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="reviewForm" onSubmit={submit}>
      <div className="reviewFormTitle">
        <div>
          <span>CONTE COMO FOI</span>
          <h3>Deixe sua avaliação</h3>
        </div>
        <div className="starPicker" aria-label={`${rating} estrelas`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} estrela${star > 1 ? "s" : ""}`}>
              {star <= rating ? "★" : "☆"}
            </button>
          ))}
        </div>
      </div>

      <div className="reviewFormGrid">
        <label>
          Seu nome
          <input name="client_name" maxLength={80} required placeholder="Ex.: Ana" />
        </label>
        <label>
          Foto do resultado <small>(opcional)</small>
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" />
        </label>
      </div>

      <label>
        Comentário
        <textarea name="text" minLength={5} maxLength={700} required placeholder="Conte o que achou do atendimento e do resultado..." />
      </label>

      <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="reviewSubmitRow">
        <p>Sua avaliação fica pendente até a Bella Onça aprovar no painel.</p>
        <button className="btn reviewSubmit" disabled={busy}>{busy ? "Enviando..." : "Enviar avaliação"}</button>
      </div>
      {message && <p className="formMessage">{message}</p>}
    </form>
  );
}
