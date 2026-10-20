import { useEffect, useRef, useState } from "react";

const MEDIA_ASSETS = [
  { key: "portrait1", paths: ["/media/imagem1.jpg"], kind: "image" },
  { key: "portrait2", paths: ["/media/imagem2.jpg", "/media/imagem2jpg"], kind: "image" },
  { key: "portrait3", paths: ["/media/imagem3.jpg"], kind: "image" },
  { key: "portrait4", paths: ["/media/imagem4.jpg"], kind: "image" },
  { key: "heroVideo", paths: ["/media/video2.mp4"], kind: "video" },
  { key: "experienceVideo", paths: ["/media/video1.mp4"], kind: "video" },
] as const;

type MediaKey = (typeof MEDIA_ASSETS)[number]["key"];
type ResolvedMedia = Partial<Record<MediaKey, string>>;

async function findAvailableAsset(paths: readonly string[], kind: "image" | "video") {
  for (const path of paths) {
    try {
      const response = await fetch(path, { method: "HEAD" });
      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
      const expectedType = kind === "image" ? "image/" : "video/";
      if (response.ok && contentType.includes(expectedType)) return path;
    } catch {
      // Keep the designed fallback when the optional asset has not been added yet.
    }
  }
  return undefined;
}

function useAvailableMedia() {
  const [media, setMedia] = useState<ResolvedMedia>({});

  useEffect(() => {
    let active = true;
    Promise.all(
      MEDIA_ASSETS.map(async (asset) => [asset.key, await findAvailableAsset(asset.paths, asset.kind)] as const),
    ).then((entries) => {
      if (!active) return;
      const available: ResolvedMedia = {};
      for (const [key, path] of entries) {
        if (path) available[key] = path;
      }
      setMedia(available);
    });
    return () => {
      active = false;
    };
  }, []);

  return media;
}

function useScrollReveals() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const headings = Array.from(document.querySelectorAll<HTMLElement>(
      ".hero h1, .essence-heading h2, .gallery-intro h2, .experience-content h2, .platforms-intro h2, .contact-main h2",
    ));
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      headings.forEach((heading) => heading.classList.add("is-in-view"));
      return () => document.documentElement.classList.remove("motion-ready");
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
    );
    const headingObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-in-view", entry.isIntersecting);
        });
      },
      { threshold: 0.05, rootMargin: "40px 0px" },
    );
    items.forEach((item) => observer.observe(item));
    headings.forEach((heading) => headingObserver.observe(heading));
    return () => {
      observer.disconnect();
      headingObserver.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
}

function ArrowMark({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="arrow-mark">
      <path d="M4 14 14 4M5 4h9v9" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="arrow-mark">
      <path d="M9 2v13m0 0 5-5m-5 5-5-5" />
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className="whatsapp-mark">
      <path d="M16.08 4.15a11.43 11.43 0 0 0-9.8 17.33l-1.5 5.47 5.6-1.47a11.44 11.44 0 1 0 5.7-21.33Z" />
      <path d="M12.15 10.17c-.3-.68-.62-.7-.91-.71h-.77c-.27 0-.7.1-1.06.5-.37.4-1.4 1.36-1.4 3.31s1.44 3.84 1.64 4.1c.2.27 2.78 4.45 6.86 6.06 3.4 1.34 4.09 1.07 4.83 1 .74-.06 2.38-.97 2.72-1.9.34-.94.34-1.75.24-1.92-.1-.17-.37-.27-.77-.47-.4-.2-2.38-1.17-2.75-1.3-.37-.14-.64-.2-.9.2-.27.4-1.03 1.3-1.27 1.56-.24.27-.47.3-.87.1-.4-.2-1.7-.62-3.23-1.99-1.2-1.07-2-2.39-2.24-2.79-.23-.4-.02-.62.18-.82.18-.18.4-.47.6-.7.2-.24.26-.4.4-.67.13-.27.06-.5-.04-.7-.1-.2-.87-2.16-1.22-2.95Z" />
    </svg>
  );
}

function VideoBackdrop({ src }: { src?: string }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (prefersReducedMotion) video.pause();
    else void video.play().catch(() => undefined);
  }, [prefersReducedMotion, src]);

  if (!src) return null;
  return (
    <video
      ref={videoRef}
      className="section-video"
      src={src}
      autoPlay={!prefersReducedMotion}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

const galleryItems = [
  { key: "portrait1", filename: "imagem1.jpg", className: "gallery-frame--portrait" },
  { key: "portrait2", filename: "imagem2.jpg", className: "gallery-frame--wide" },
  { key: "portrait3", filename: "imagem3.jpg", className: "gallery-frame--detail" },
  { key: "portrait4", filename: "imagem4.jpg", className: "gallery-frame--landscape" },
] as const;

export default function Home() {
  const media = useAvailableMedia();
  useScrollReveals();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<string[]>([]);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedImage && !dialog.open) dialog.showModal();
    if (!selectedImage && dialog.open) dialog.close();
  }, [selectedImage]);

  const closeMenu = () => setMenuOpen(false);
  const markImageUnavailable = (key: string) => {
    setFailedImages((current) => (current.includes(key) ? current : [...current, key]));
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Amanda Lenns — início" onClick={closeMenu}>
          <span className="wordmark-seal" aria-hidden="true">A<span>L</span></span>
          <span className="wordmark-name">AMANDA <i>LENNS</i></span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Fechar" : "Menu"}</span>
          <span className={`menu-glyph${menuOpen ? " menu-glyph--open" : ""}`} aria-hidden="true"><i /><i /></span>
        </button>
        <nav id="primary-navigation" className={`primary-navigation${menuOpen ? " primary-navigation--open" : ""}`} aria-label="Navegação principal">
          <a href="#essencia" onClick={closeMenu}>Essência</a>
          <a href="#galeria" onClick={closeMenu}>Galeria</a>
          <a href="#experiencia" onClick={closeMenu}>Presença</a>
          <a className="nav-contact" href="#contato" onClick={closeMenu}>Contato <ArrowMark diagonal /></a>
        </nav>
      </header>

      <main id="conteudo">
        <section id="inicio" className="hero" aria-labelledby="hero-title">
          <div className="hero-backdrop" aria-hidden="true">
            <div className="hero-light hero-light--one" />
            <div className="hero-light hero-light--two" />
            <VideoBackdrop src={media.heroVideo} />
            <div className="hero-grain" />
          </div>
          <div className="hero-topline">
            <span>Presença, sem pressa</span>
            <span className="hero-coordinate">BR · 01</span>
          </div>
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> Uma presença discreta e carinhosa</p>
            <h1 id="hero-title"><span>Um momento</span><em>para desacelerar.</em></h1>
            <p className="hero-subtitle">Amanda Lenns — companhia para respirar, relaxar e estar presente.</p>
            <a className="text-cta hero-cta" href="#essencia">
              <span>Conheça sua essência</span><ArrowMark />
            </a>
          </div>
          <div className="hero-signature" aria-hidden="true">
            <span className="signature-orbit signature-orbit--outer" />
            <span className="signature-orbit signature-orbit--inner" />
            <span className="signature-initials">A<span>L</span></span>
            <span className="signature-caption">discrição · carinho</span>
          </div>
          <a className="hero-scroll" href="#essencia" aria-label="Rolar para a seção Essência">
            <span className="scroll-line" /><span>Role para descobrir</span>
          </a>
          <span className="hero-index" aria-hidden="true">01 <i>—</i> 06</span>
        </section>

        <section id="essencia" className="essence section-pad" aria-labelledby="essence-title">
          <div className="section-overline" data-reveal>
            <span className="section-number">02 / 06</span>
            <span className="section-label">Essência</span>
            <span className="section-rule" />
          </div>
          <div className="essence-layout">
            <div className="essence-heading" data-reveal>
              <p className="eyebrow"><span className="eyebrow-dot" /> Um jeito de estar</p>
              <h2 id="essence-title">Discreta.<br /><em>Carinhosa.</em></h2>
            </div>
            <div className="essence-copy" data-reveal>
              <span className="ornamental-mark" aria-hidden="true">✳</span>
              <p>Amanda Lenns é uma presença reservada e atenciosa — para quem procura companhia e um momento para relaxar.</p>
              <p>Uma pausa da pressa, com espaço para estar à vontade.</p>
              <a className="underlined-link" href="#galeria">Explore o universo visual <ArrowMark diagonal /></a>
            </div>
          </div>
          <div className="essence-foot" aria-hidden="true"><span>AMANDA LENNS</span><span>DISCRIÇÃO, EM CADA DETALHE</span></div>
        </section>

        <section id="galeria" className="gallery-section section-pad" aria-labelledby="gallery-title">
          <div className="section-overline" data-reveal>
            <span className="section-number">03 / 06</span>
            <span className="section-label">Universo visual</span>
            <span className="section-rule" />
          </div>
          <div className="gallery-intro" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> Um olhar, sem excessos</p>
            <h2 id="gallery-title">Presença em<br /><em>fragmentos.</em></h2>
            <p className="gallery-intro-note">Imagens selecionadas para conhecer Amanda Lenns.</p>
          </div>
          <div className="gallery-composition">
            {galleryItems.map((item, index) => {
              const imageSrc = media[item.key as MediaKey];
              const isUnavailable = !imageSrc || failedImages.includes(item.key);
              const filename = item.filename;
              return (
                <figure key={item.key} className={`gallery-figure ${item.className}`} data-reveal>
                  {isUnavailable ? (
                    <div className="gallery-placeholder" aria-label={`Espaço reservado para ${filename}`}>
                      <span className="placeholder-index">0{index + 1}</span>
                      <span className="placeholder-stem" aria-hidden="true" />
                      <span className="placeholder-caption">Adicionar arquivo <b>{filename}</b></span>
                      <span className="placeholder-ambient" aria-hidden="true" />
                    </div>
                  ) : (
                    <button
                      className="gallery-image-button"
                      type="button"
                      onClick={() => setSelectedImage(imageSrc)}
                      aria-label={`Ampliar fotografia ${index + 1} de Amanda Lenns`}
                    >
                      <img
                        src={imageSrc}
                        alt={`Fotografia ${index + 1} de Amanda Lenns`}
                        loading="lazy"
                        decoding="async"
                        onError={() => markImageUnavailable(item.key)}
                      />
                      <span className="gallery-image-index">0{index + 1}</span>
                      <span className="gallery-image-open">Ampliar <ArrowMark diagonal /></span>
                    </button>
                  )}
                </figure>
              );
            })}
          </div>
          <p className="gallery-footnote" data-reveal>Fotografias autorizadas serão exibidas aqui quando adicionadas.</p>
        </section>

        <section id="experiencia" className="experience-section" aria-labelledby="experience-title">
          <div className="experience-background" aria-hidden="true">
            <VideoBackdrop src={media.experienceVideo} />
            <div className="experience-wash" />
          </div>
          <div className="experience-inner section-pad">
            <div className="section-overline section-overline--light" data-reveal>
              <span className="section-number">04 / 06</span>
              <span className="section-label">O que importa</span>
              <span className="section-rule" />
            </div>
            <div className="experience-content" data-reveal>
              <p className="eyebrow"><span className="eyebrow-line" /> Companhia que acolhe</p>
              <h2 id="experience-title">Discrição<br /><em>no gesto.</em><br />Carinho<br /><em>na presença.</em></h2>
              <div className="experience-aside">
                <span className="experience-aside-mark" aria-hidden="true">AL</span>
                <p>Para homens que desejam companhia e um instante para relaxar. Com discrição, cuidado e gentileza.</p>
                <span className="experience-note">Informações práticas serão incluídas quando forem confirmadas.</span>
              </div>
            </div>
            <div className="experience-bottom" aria-hidden="true"><span>UM MOMENTO DE CALMA</span><span>03 — PRESENÇA</span></div>
          </div>
        </section>

        <section id="plataformas" className="platforms-section section-pad" aria-labelledby="platforms-title">
          <div className="section-overline" data-reveal>
            <span className="section-number">05 / 06</span>
            <span className="section-label">Canais oficiais</span>
            <span className="section-rule" />
          </div>
          <div className="platforms-layout">
            <div className="platforms-intro" data-reveal>
              <p className="eyebrow"><span className="eyebrow-dot" /> Conteúdo & conexão</p>
              <h2 id="platforms-title">Nos canais<br /><em>certos.</em></h2>
              <p>Os links oficiais serão adicionados assim que forem informados.</p>
            </div>
            <div className="channel-list" aria-label="Canais digitais provisórios">
              <button className="channel-row" type="button" disabled aria-disabled="true" data-reveal>
                <span className="channel-index">01</span>
                <span className="channel-title">Instagram</span>
                <span className="channel-status">Link não informado</span>
                <span className="channel-arrow" aria-hidden="true"><ArrowMark diagonal /></span>
              </button>
              <button className="channel-row" type="button" disabled aria-disabled="true" data-reveal>
                <span className="channel-index">02</span>
                <span className="channel-title">Conteúdo digital</span>
                <span className="channel-status">Canal a configurar</span>
                <span className="channel-arrow" aria-hidden="true"><ArrowMark diagonal /></span>
              </button>
              <a className="channel-row channel-row--internal" href="#contato" data-reveal>
                <span className="channel-index">03</span>
                <span className="channel-title">Contato</span>
                <span className="channel-status">Ir para os canais oficiais</span>
                <span className="channel-arrow" aria-hidden="true"><ArrowMark diagonal /></span>
              </a>
            </div>
          </div>
          <div className="platforms-note" data-reveal><span className="note-star" aria-hidden="true">✳</span><span>Sem atalhos inventados. Apenas canais confirmados.</span></div>
        </section>

        <section id="contato" className="contact-section section-pad" aria-labelledby="contact-title">
          <div className="contact-grain" aria-hidden="true" />
          <div className="section-overline section-overline--light" data-reveal>
            <span className="section-number">06 / 06</span>
            <span className="section-label">Contato</span>
            <span className="section-rule" />
          </div>
          <div className="contact-main" data-reveal>
            <p className="eyebrow"><span className="eyebrow-line" /> Um próximo passo, no seu tempo</p>
            <h2 id="contact-title">Uma conversa<br /><em>começa aqui.</em></h2>
            <p className="contact-description">Os canais de contato serão incluídos nesta página assim que forem confirmados.</p>
            <button className="contact-placeholder" type="button" disabled aria-disabled="true">
              <WhatsAppMark />
              <span><b>WhatsApp</b><small>Link oficial a adicionar</small></span>
              <span className="placeholder-arrow" aria-hidden="true"><ArrowMark diagonal /></span>
            </button>
            <a className="contact-secondary" href="#plataformas">Ver canais digitais <ArrowMark diagonal /></a>
          </div>
          <div className="contact-stamp" aria-hidden="true"><span>AMANDA</span><i>LENNS</i><small>DISCRETA · CARINHOSA</small></div>
          <span className="contact-index" aria-hidden="true">06</span>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#inicio">AMANDA <i>LENNS</i></a>
        <span className="footer-note">Presença, com discrição e carinho.</span>
        <a className="footer-top" href="#inicio">Voltar ao início <ArrowMark diagonal /></a>
      </footer>

      <a className="floating-channels" href="#plataformas" aria-label="Ir aos canais oficiais">
        <span className="floating-channels-orbit" aria-hidden="true" />
        <span>Canais</span><ArrowMark diagonal />
      </a>
      <button className="floating-whatsapp" type="button" disabled aria-disabled="true" aria-label="WhatsApp — link oficial ainda não informado">
        <span className="floating-whatsapp-halo" aria-hidden="true" />
        <span className="floating-whatsapp-face"><WhatsAppMark /></span>
        <span className="floating-whatsapp-label">WhatsApp <i>· link em breve</i></span>
      </button>

      <dialog
        ref={dialogRef}
        className="gallery-dialog"
        aria-label="Fotografia ampliada de Amanda Lenns"
        onClose={() => setSelectedImage(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setSelectedImage(null);
        }}
      >
        <button className="dialog-close" type="button" onClick={() => setSelectedImage(null)} aria-label="Fechar fotografia ampliada">Fechar <span aria-hidden="true">×</span></button>
        {selectedImage && <img src={selectedImage} alt="Fotografia ampliada de Amanda Lenns" />}
      </dialog>
    </div>
  );
}
