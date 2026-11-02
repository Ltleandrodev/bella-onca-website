"use client";

import { useMemo, useState } from "react";
import type { ModelItem } from "@/lib/types";

type Props = { models: ModelItem[]; whatsapp: string };

const styles = [
  { key: "Natural", title: "Natural", text: "Quero realçar o olhar sem ficar muito marcado." },
  { key: "Marcante", title: "Marcante", text: "Gosto de um efeito mais cheio e que apareça bastante." },
  { key: "Alongado", title: "Alongado", text: "Quero destacar o canto externo e alongar o olhar." },
  { key: "Definido", title: "Definido", text: "Quero desenho, alinhamento e acabamento bem definidos." }
];

function waLink(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "#contato";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function StyleFinder({ models, whatsapp }: Props) {
  const [style, setStyle] = useState("Natural");
  const matches = useMemo(() => models.filter((item) => (item.style_tag || "Natural") === style).slice(0, 3), [models, style]);

  return (
    <div className="styleFinder">
      <div className="styleChoices">
        {styles.map((item) => (
          <button key={item.key} className={style === item.key ? "active" : ""} onClick={() => setStyle(item.key)}>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </button>
        ))}
      </div>
      <div className="styleResult">
        <p className="eyebrow">SUGESTÕES PARA VOCÊ</p>
        <h3>{style}</h3>
        {matches.length ? (
          <div className="styleMatches">
            {matches.map((item) => <a key={item.id} href="#modelos"><strong>{item.title}</strong><span>{item.category}</span></a>)}
          </div>
        ) : (
          <p>Ainda não há modelos marcados como “{style}”. A profissional pode te ajudar a escolher.</p>
        )}
        <a className="textLink" href={waLink(whatsapp, `Olá! Quero ajuda para escolher um modelo com efeito ${style.toLowerCase()}.`)} target={whatsapp ? "_blank" : undefined}>Pedir uma recomendação pelo WhatsApp →</a>
      </div>
    </div>
  );
}
