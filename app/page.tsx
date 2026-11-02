import Image from "next/image";
import { getSiteContent } from "@/lib/public-content";
import BeforeAfterSlider from "@/components/site/BeforeAfterSlider";
import ReviewForm from "@/components/site/ReviewForm";
import StyleFinder from "@/components/site/StyleFinder";

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function waLink(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "#contato";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function lines(value: string) {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

export default async function Home() {
  const { services, models, beforeAfter, reviews, gallery, certificates, highlights, faqs, settings } = await getSiteContent();
  const whatsapp = waLink(settings.whatsapp, "Olá! Vi o site da Bella Onça e gostaria de agendar um horário.");
  const instagram = settings.instagram.replace(/^@/, "");
  const professionalPhoto = settings.professional_photo_url || "/bella-onca-reference.jpeg";

  const preferredCategoryOrder = ["Cílios", "Sobrancelhas"];
  const sortCategories = (categories: string[]) => categories.sort((a, b) => {
    const aIndex = preferredCategoryOrder.indexOf(a);
    const bIndex = preferredCategoryOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b, "pt-BR");
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const serviceCategories = sortCategories(Array.from(new Set(services.map((item) => item.category || "Outros"))));
  const modelCategories = sortCategories(Array.from(new Set(models.map((item) => item.category || "Outros"))));
  const beforeAfterCategories = sortCategories(Array.from(new Set(beforeAfter.map((item) => item.category || "Cílios"))));
  const galleryCategories = sortCategories(Array.from(new Set(gallery.map((item) => item.category || "Outros"))));

  return (
    <main>
      <header className="topbar shell">
  <a className="brand" href="#inicio" aria-label="Bella Onça - início">
    <span className="brandMark" style={{ overflow: "hidden" }}>
      <img
        src="/logo-bella-onca.png"
        alt="Bella Onça"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
          display: "block",
        }}
      />
    </span>

    <span>
      <strong>Bella Onça</strong>
      <small>Cílios & Sobrancelhas</small>
    </span>
  </a>

  <nav>
    <a href="#antes-depois">Resultados</a>
    <a href="#modelos">Modelos</a>
    <a href="#galeria">Galeria</a>
    <a href="#avaliacoes">Avaliações</a>
  </nav>

  <a
    className="btn btnSmall"
    href={whatsapp}
    target={settings.whatsapp ? "_blank" : undefined}
  >
    Agendar
  </a>
</header>

      <section id="inicio" className="hero">
        <div className="heroGlow" />
        <div className="shell heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">BELLA ONÇA • CÍLIOS & SOBRANCELHAS</p>
            <h1>{settings.hero_title}</h1>
            <p className="lead">{settings.hero_subtitle}</p>
            <div className="heroActions">
              <a className="btn" href={whatsapp} target={settings.whatsapp ? "_blank" : undefined}>Agendar pelo WhatsApp</a>
              <a className="btn btnGhost" href="#modelos">Conhecer os modelos</a>
            </div>
            <div className="miniInfo">
              <span>✦ Atendimento personalizado</span>
              <span>✦ Cílios & sobrancelhas</span>
              <span>✦ {settings.hours}</span>
            </div>
          </div>
          <div className="heroCard">
            <div className="spots" aria-hidden="true" />
            <Image src="/bella-onca-hero.jpg" alt="Bella Onça - Cílios e Sobrancelhas" width={1080} height={1440} priority />
            <div className="heroCardTag">Realce sua beleza. Valorize seu olhar.</div>
          </div>
        </div>
      </section>

      {highlights.length > 0 && (
        <section className="section highlightSection">
          <div className="shell">
            <div className="sectionHead compactHead">
              <div><p className="eyebrow">EM DESTAQUE</p><h2>Novidades & especiais</h2></div>
              <p>Espaço para novidades, procedimentos em evidência e campanhas da Bella Onça.</p>
            </div>
            <div className="highlightGrid">
              {highlights.map((item) => (
                <article className="highlightCard" key={item.id}>
                  <div className="highlightImage"><Image src={item.image_url || "/bella-onca-reference.jpeg"} alt={item.title} width={800} height={700} /></div>
                  <div className="highlightCopy">
                    {item.badge && <span className="badge">{item.badge}</span>}
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                    <a className="textLink" href={waLink(settings.whatsapp, item.button_message || `Olá! Gostaria de saber mais sobre ${item.title}.`)} target={settings.whatsapp ? "_blank" : undefined}>{item.button_text || "Quero saber mais"} →</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section shell">
        <div className="sectionHead">
          <div><p className="eyebrow">QUAL COMBINA COM VOCÊ?</p><h2>Encontre seu estilo</h2></div>
          <p>Escolha o tipo de resultado que você gosta e veja referências cadastradas pela Bella Onça.</p>
        </div>
        <StyleFinder models={models} whatsapp={settings.whatsapp} />
      </section>

      <section id="antes-depois" className="section sectionAlt">
        <div className="shell">
          <div className="sectionHead">
            <div><p className="eyebrow">RESULTADOS REAIS</p><h2>Antes & Depois</h2></div>
            <p>Arraste o controle das fotos para comparar o resultado do procedimento.</p>
          </div>
          <div className="contentCategories">
            {beforeAfterCategories.map((category) => {
              const items = beforeAfter.filter((item) => (item.category || "Cílios") === category);
              return (
                <section className="contentCategory" key={category}>
                  <div className="contentCategoryHead">
                    <div><span>Categoria</span><h3>{category}</h3></div>
                    <span className="categoryPill">{items.length} resultado{items.length === 1 ? "" : "s"}</span>
                  </div>
                  <div className="beforeGrid">
                    {items.map((item) => (
                      <article className="beforeCard" key={item.id}>
                        <BeforeAfterSlider
                          before={item.before_url || "/bella-onca-reference.jpeg"}
                          after={item.after_url || "/bella-onca-reference.jpeg"}
                          title={item.title}
                        />
                        <div className="cardBody"><small>{item.service || category}</small><h3>{item.title}</h3><p>{item.description}</p></div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section id="modelos" className="section shell">
        <div className="sectionHead">
          <div><p className="eyebrow">ESCOLHA SEU ESTILO</p><h2>Modelos & Referências</h2></div>
          <p>Referências separadas entre cílios e sobrancelhas, com descrição e valor.</p>
        </div>
        <div className="contentCategories">
          {modelCategories.map((category) => {
            const items = models.filter((item) => (item.category || "Outros") === category);
            return (
              <section className="contentCategory" key={category}>
                <div className="contentCategoryHead">
                  <div><span>Categoria</span><h3>{category}</h3></div>
                  <span className="categoryPill">{items.length} modelo{items.length === 1 ? "" : "s"}</span>
                </div>
                <div className="modelGrid">
                  {items.map((item) => (
                    <article className={`modelCard ${item.featured ? "featuredModel" : ""}`} key={item.id}>
                      <div className="modelImage">
                        {item.featured && <span className="imageBadge">Destaque</span>}
                        <Image src={item.image_url || "/bella-onca-reference.jpeg"} alt={item.title} width={800} height={1000} />
                      </div>
                      <div className="cardBody">
                        <small>{item.category} • {item.style_tag || "Natural"}</small>
                        <div className="priceRow"><h3>{item.title}</h3><strong>{money(Number(item.price))}</strong></div>
                        <p>{item.description}</p>
                        <a className="textLink" href={waLink(settings.whatsapp, `Olá! Gostaria de agendar o modelo ${item.title} de ${money(Number(item.price))}.`)} target={settings.whatsapp ? "_blank" : undefined}>Quero esse modelo →</a>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section id="servicos" className="section sectionAlt">
        <div className="shell">
          <div className="sectionHead">
            <div><p className="eyebrow">SERVIÇOS</p><h2>Tabela de preços</h2></div>
            <p>Valores organizados por categoria e atualizados pelo painel administrativo.</p>
          </div>
          <div className="priceCategories">
            {serviceCategories.map((category) => {
              const categoryServices = services.filter((service) => service.category === category);
              return (
                <section className="priceCategory" key={category}>
                  <div className="priceCategoryHead">
                    <div><span className="priceCategoryKicker">Categoria</span><h3>{category}</h3></div>
                    <span className="priceCategoryCount">{categoryServices.length} opções</span>
                  </div>
                  <div className="priceTable">
                    {categoryServices.map((service) => (
                      <div className="priceItem" key={service.id}>
                        <div><h4>{service.name}</h4><p>{service.description}</p></div>
                        <div className="priceAction"><strong>{money(Number(service.price))}</strong><a href={waLink(settings.whatsapp, `Olá! Gostaria de saber mais sobre ${service.name}.`)} target={settings.whatsapp ? "_blank" : undefined}>Consultar</a></div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      <section id="galeria" className="section shell">
        <div className="sectionHead">
          <div><p className="eyebrow">PORTFÓLIO</p><h2>Galeria de trabalhos</h2></div>
          <p>Resultados, detalhes e trabalhos da Bella Onça além das comparações de antes e depois.</p>
        </div>
        <div className="contentCategories">
          {galleryCategories.map((category) => (
            <section className="contentCategory" key={category}>
              <div className="contentCategoryHead"><div><span>Categoria</span><h3>{category}</h3></div></div>
              <div className="galleryGrid">
                {gallery.filter((item) => (item.category || "Outros") === category).map((item) => (
                  <figure className="galleryCard" key={item.id}>
                    <Image src={item.image_url || "/bella-onca-reference.jpeg"} alt={item.title} width={900} height={900} />
                    <figcaption><strong>{item.title}</strong>{item.description && <span>{item.description}</span>}</figcaption>
                  </figure>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="section sectionDark">
        <div className="shell aboutGrid">
          <div className="aboutPhoto"><Image src={professionalPhoto} alt={settings.professional_name || "Profissional Bella Onça"} width={900} height={1100} /></div>
          <div className="aboutCopy lightCopy">
            <p className="eyebrow">SOBRE A PROFISSIONAL</p>
            <h2>{settings.professional_name || "Bella Onça"}</h2>
            <strong className="professionalTitle">{settings.professional_title}</strong>
            <p>{settings.about_text}</p>
            {certificates.length > 0 && (
              <div className="certList">
                {certificates.map((item) => (
                  <div className="certItem" key={item.id}>
                    {item.image_url && <Image src={item.image_url} alt={item.title} width={110} height={110} />}
                    <div><strong>{item.title}</strong><span>{[item.issuer, item.year].filter(Boolean).join(" • ")}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section shell">
        <div className="sectionHead">
          <div><p className="eyebrow">CUIDADOS</p><h2>Antes e depois do procedimento</h2></div>
          <p>Orientações simples ajudam a ter uma experiência melhor e preservar o resultado.</p>
        </div>
        <div className="careGrid">
          <article className="carePanel"><span>ANTES</span><h3>Como se preparar</h3>{lines(settings.care_before).map((item) => <p key={item}>✦ {item}</p>)}</article>
          <article className="carePanel"><span>DEPOIS</span><h3>Como cuidar</h3>{lines(settings.care_after).map((item) => <p key={item}>✦ {item}</p>)}</article>
        </div>
      </section>

      <section id="avaliacoes" className="section reviewSection">
        <div className="shell">
          <div className="sectionHead">
            <div><p className="eyebrow">QUEM JÁ VEIO, CONTA</p><h2>Avaliações</h2></div>
            <p>Estrelas, comentários e fotos enviadas por clientes. Novas avaliações passam por aprovação antes de aparecerem.</p>
          </div>
          <div className="reviewGrid">
            {reviews.map((review) => (
              <article className="reviewCard" key={review.id}>
                {review.photo_url && <div className="reviewPhoto"><Image src={review.photo_url} alt={`Resultado enviado por ${review.client_name}`} width={700} height={520} /></div>}
                <div className="reviewCardBody">
                  <div className="stars">{"★".repeat(review.rating)}{"☆".repeat(Math.max(0, 5 - review.rating))}</div>
                  <p>“{review.text}”</p>
                  <strong>{review.client_name}</strong>
                </div>
              </article>
            ))}
          </div>
          <ReviewForm />
        </div>
      </section>

      <section className="section sectionAlt">
        <div className="shell faqWrap">
          <div><p className="eyebrow">DÚVIDAS FREQUENTES</p><h2>Antes de agendar</h2></div>
          <div className="faqList">
            {faqs.map((faq) => <details key={faq.id}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className="section shell policyGrid">
        <div className="policyCard">
          <p className="eyebrow">POLÍTICA DE AGENDAMENTO</p>
          <h2>Para organizar seu horário</h2>
          {lines(settings.booking_policy).map((item) => <p key={item}>{item}</p>)}
        </div>
        <div className="locationCard">
          <p className="eyebrow">ATENDIMENTO</p>
          <h3>{settings.hours}</h3>
          <p>{settings.address || "Endereço informado no momento do agendamento."}</p>
          <a className="textLink" href={whatsapp} target={settings.whatsapp ? "_blank" : undefined}>Confirmar horário e localização →</a>
        </div>
      </section>

      <section id="contato" className="section shell contactCard">
        <div><p className="eyebrow">AGENDE SEU HORÁRIO</p><h2>Seu próximo olhar começa aqui.</h2><p>{settings.address || "Atendimento com horário marcado."}</p></div>
        <div className="contactActions">
          <a className="btn" href={whatsapp} target={settings.whatsapp ? "_blank" : undefined}>Falar no WhatsApp</a>
          {instagram && <a className="btn btnGhost" href={`https://instagram.com/${instagram}`} target="_blank">@{instagram}</a>}
        </div>
      </section>

      <footer className="footer">
        <div className="shell footerRow"><div><strong>Bella Onça</strong><span>Cílios & Sobrancelhas</span></div><a href="/admin">Área administrativa</a></div>
      </footer>

      {settings.whatsapp && <a className="floatWa" href={whatsapp} target="_blank" aria-label="Agendar pelo WhatsApp">WhatsApp</a>}
    </main>
  );
}
