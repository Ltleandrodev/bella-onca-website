"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

type Props = {
  before: string;
  after: string;
  title: string;
};

export default function BeforeAfterSlider({ before, after, title }: Props) {
  const [position, setPosition] = useState(50);

  return (
    <div className="compare" style={{ "--compare": `${position}%` } as CSSProperties}>
      <Image src={before} alt={`Antes - ${title}`} width={900} height={700} className="compareBase" />
      <div className="compareAfter">
        <Image src={after} alt={`Depois - ${title}`} width={900} height={700} />
      </div>
      <span className="compareLabel beforeLabel">Antes</span>
      <span className="compareLabel afterLabel">Depois</span>
      <span className="compareLine" aria-hidden="true"><i>↔</i></span>
      <input
        className="compareRange"
        type="range"
        min="0"
        max="100"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        aria-label={`Comparar antes e depois de ${title}`}
      />
    </div>
  );
}
