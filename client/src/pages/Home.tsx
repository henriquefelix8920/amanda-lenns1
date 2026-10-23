import { useEffect, useRef, useState, type CSSProperties } from "react";

const MEDIA_SOURCES = {
  portrait1: "/media/imagem1.webp",
  portrait2: "/media/imagem2.webp",
  portrait3: "/media/imagem3.webp",
  portrait4: "/media/imagem4.webp",
  heroVideo: "/media/video2.mp4",
  experienceVideo: "/media/video1.mp4",
} as const;

function useScrollReveals() {
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
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
    items.forEach((item) => observer.observe(item));
    return () => {
      observer.disconnect();
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

function VideoBackdrop({ src, loadImmediately = false }: { src: string; loadImmediately?: boolean }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [isNearViewport, setIsNearViewport] = useState(loadImmediately);
  const [isVisible, setIsVisible] = useState(loadImmediately);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      setIsVisible(true);
      return;
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    visibilityObserver.observe(video);

    if (!loadImmediately) {
      const preloadObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsNearViewport(true);
            preloadObserver.disconnect();
          }
        },
        { rootMargin: "480px 0px", threshold: 0 },
      );
      preloadObserver.observe(video);
      return () => {
        visibilityObserver.disconnect();
        preloadObserver.disconnect();
      };
    }

    return () => visibilityObserver.disconnect();
  }, [loadImmediately]);

  useEffect(() => {
    const updatePageVisibility = () => setIsPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", updatePageVisibility);
    updatePageVisibility();
    return () => document.removeEventListener("visibilitychange", updatePageVisibility);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const shouldPlay = !prefersReducedMotion && isPageVisible && (loadImmediately || isVisible);
    if (!shouldPlay) video.pause();
    else void video.play().catch(() => undefined);
  }, [isPageVisible, isVisible, loadImmediately, prefersReducedMotion, src]);

  return (
    <video
      ref={videoRef}
      className="section-video"
      src={isNearViewport && !prefersReducedMotion ? src : undefined}
      autoPlay={!prefersReducedMotion && isPageVisible && (loadImmediately || isVisible)}
      muted
      loop
      playsInline
      preload={isNearViewport && !prefersReducedMotion ? "metadata" : "none"}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

const galleryItems = [
  { key: "portrait1", filename: "imagem1.webp", className: "gallery-frame--portrait" },
  { key: "portrait2", filename: "imagem2.webp", className: "gallery-frame--wide" },
  { key: "portrait3", filename: "imagem3.webp", className: "gallery-frame--detail" },
  { key: "portrait4", filename: "imagem4.webp", className: "gallery-frame--landscape" },
] as const;

type GalleryItem = (typeof galleryItems)[number];
const carouselAngles = [0, 54, 180, 306] as const;

function PhotoCarousel({
  items,
  getSrc,
  failedImages,
  onSelect,
  onError,
}: {
  items: readonly GalleryItem[];
  getSrc: (item: GalleryItem) => string | undefined;
  failedImages: string[];
  onSelect: (src: string) => void;
  onError: (key: string) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isPaused || isFocused || items.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [isFocused, isPaused, items.length, prefersReducedMotion]);

  const moveTo = (direction: number) => {
    setActiveIndex((current) => (current + direction + items.length) % items.length);
  };
  const trackStyle = { "--track-angle": `${-(carouselAngles[activeIndex] ?? 0)}deg` } as CSSProperties;

  return (
    <div
      className="photo-carousel"
      role="region"
      aria-label="Carrossel de fotografias de Amanda Lenns"
      aria-roledescription="carrossel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsFocused(false);
      }}
    >
      <div className="photo-carousel-stage">
        <span className="carousel-light-arc carousel-light-arc--one" aria-hidden="true" />
        <span className="carousel-light-arc carousel-light-arc--two" aria-hidden="true" />
        <div className="photo-carousel-track" style={trackStyle}>
          {items.map((item, index) => {
            const src = getSrc(item);
            const isUnavailable = !src || failedImages.includes(item.key);
            return (
              <button
                key={item.key}
                className={`carousel-photo${isUnavailable ? " carousel-photo--unavailable" : ""}`}
                type="button"
                style={{ "--card-angle": `${carouselAngles[index] ?? (index * 360) / items.length}deg` } as CSSProperties}
                onClick={() => src && !isUnavailable && onSelect(src)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") { event.preventDefault(); moveTo(1); }
                  if (event.key === "ArrowLeft") { event.preventDefault(); moveTo(-1); }
                }}
                tabIndex={index === activeIndex && !isUnavailable ? 0 : -1}
                aria-label={`Ampliar fotografia ${index + 1} de Amanda Lenns`}
                aria-pressed={index === activeIndex}
                disabled={isUnavailable}
              >
                {isUnavailable ? (
                  <span className="carousel-empty-mark" aria-hidden="true">AL</span>
                ) : (
                  <img
                    src={src}
                    alt={`Fotografia ${index + 1} de Amanda Lenns`}
                    loading="eager"
                    decoding="async"
                    onError={() => onError(item.key)}
                  />
                )}
                <span className="carousel-photo-shade" aria-hidden="true" />
                <span className="carousel-photo-index">0{index + 1}</span>
                <span className="carousel-photo-caption">Amanda Lenns</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="carousel-controls">
        <button className="carousel-arrow" type="button" onClick={() => moveTo(-1)} aria-label="Fotografia anterior">
          <span aria-hidden="true">←</span>
        </button>
        <div className="carousel-pagination" aria-label="Escolher fotografia">
          {items.map((item, index) => (
            <button
              key={item.key}
              className={`carousel-dot${index === activeIndex ? " carousel-dot--active" : ""}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Mostrar fotografia ${index + 1}`}
              aria-pressed={index === activeIndex}
            />
          ))}
        </div>
        <button className="carousel-arrow" type="button" onClick={() => moveTo(1)} aria-label="Próxima fotografia">
          <span aria-hidden="true">→</span>
        </button>
        <span className="carousel-count" aria-live="off">0{activeIndex + 1}<i> / 0{items.length}</i></span>
      </div>
    </div>
  );
}

const channels = [
  { kind: "instagram", name: "Instagram", descriptor: "Momentos" },
  { kind: "privacy", name: "Privacy", descriptor: "Conteúdo exclusivo" },
  { kind: "onlyfans", name: "OnlyFans", descriptor: "Área exclusiva" },
  { kind: "photos", name: "Packs de fotos", descriptor: "Coleções" },
  { kind: "videos", name: "Vídeos", descriptor: "Conteúdo em movimento" },
] as const;

function ChannelMark({ kind }: { kind: (typeof channels)[number]["kind"] }) {
  if (kind === "instagram") {
    return (
      <svg className="channel-mark channel-mark--instagram" viewBox="0 0 64 64" aria-hidden="true">
        <defs><linearGradient id="instagram-gradient" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#ffd776" /><stop offset=".48" stopColor="#f24867" /><stop offset="1" stopColor="#8b39ce" /></linearGradient></defs>
        <rect x="7" y="7" width="50" height="50" rx="15" fill="none" stroke="url(#instagram-gradient)" strokeWidth="4" />
        <circle cx="32" cy="32" r="12" fill="none" stroke="url(#instagram-gradient)" strokeWidth="4" />
        <circle cx="47" cy="17" r="3.3" fill="#f36b74" />
      </svg>
    );
  }
  if (kind === "privacy") {
    return (
      <svg className="channel-mark channel-mark--privacy" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 7a23 23 0 0 1 23 23c0 12.7-10.3 23-23 23H14a5 5 0 0 1-4.2-7.8L17 35a23 23 0 0 1 15-28Z" fill="none" stroke="currentColor" strokeWidth="5" strokeLinejoin="round" />
        <path d="M24 28a8 8 0 1 1 13.5 5.8V42h-11v-8.2A8 8 0 0 1 24 28Z" fill="currentColor" />
      </svg>
    );
  }
  if (kind === "onlyfans") {
    return <span className="onlyfans-mark" aria-hidden="true">OF</span>;
  }
  if (kind === "photos") {
    return (
      <svg className="channel-mark channel-mark--media" viewBox="0 0 64 64" aria-hidden="true">
        <rect x="8" y="13" width="48" height="38" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
        <circle cx="23" cy="26" r="4" fill="currentColor" />
        <path d="m12 45 13-12 9 8 7-7 11 11" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="channel-mark channel-mark--media" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="8" y="13" width="48" height="38" rx="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="m27 23 15 9-15 9V23Z" fill="currentColor" />
    </svg>
  );
}

export default function Home() {
  const media = MEDIA_SOURCES;
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
        <nav
          id="primary-navigation"
          className={`primary-navigation${menuOpen ? " primary-navigation--open" : ""}`}
          aria-label="Navegação principal"
          onKeyDown={(event) => {
            if (event.key === "Escape" && menuOpen) {
              closeMenu();
              document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
            }
          }}
        >
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
            <VideoBackdrop src={media.heroVideo} loadImmediately />
            <div className="hero-grain" />
          </div>
          <div className="hero-topline">
            <span>Presença, sem pressa</span>
          </div>
          <div className="hero-content">
            <p className="eyebrow hero-eyebrow"><span className="eyebrow-line" /> Uma presença discreta e carinhosa</p>
            <h1 id="hero-title"><span>Um momento</span><em>para desacelerar.</em></h1>
            <p className="hero-subtitle">Amanda Lenns — companhia para respirar, relaxar e estar presente.</p>
            <a className="text-cta hero-cta" href="#essencia">
              <span>Conheça minha essência</span><ArrowMark />
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
            <span className="section-label">Universo visual</span>
            <span className="section-rule" />
          </div>
          <div className="gallery-intro" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> Um olhar, sem excessos</p>
            <h2 id="gallery-title">Presença em<br /><em>fragmentos.</em></h2>
          </div>
          <PhotoCarousel
            items={galleryItems}
            getSrc={(item) => media[item.key]}
            failedImages={failedImages}
            onSelect={setSelectedImage}
            onError={markImageUnavailable}
          />
        </section>

        <section id="experiencia" className="experience-section" aria-labelledby="experience-title">
          <div className="experience-background" aria-hidden="true">
            <VideoBackdrop src={media.experienceVideo} />
            <div className="experience-wash" />
          </div>
          <div className="experience-inner section-pad">
            <div className="section-overline section-overline--light" data-reveal>
              <span className="section-label">O que importa</span>
              <span className="section-rule" />
            </div>
            <div className="experience-content" data-reveal>
              <p className="eyebrow"><span className="eyebrow-line" /> Companhia que acolhe</p>
              <h2 id="experience-title">Discrição<br /><em>no gesto.</em><br />Carinho<br /><em>na presença.</em></h2>
              <div className="experience-aside">
                <span className="experience-aside-mark" aria-hidden="true">AL</span>
                <p>Para homens que desejam companhia e um instante para relaxar. Com discrição, cuidado e gentileza.</p>
              </div>
            </div>
            <div className="experience-bottom" aria-hidden="true"><span>UM MOMENTO DE CALMA</span><span>PRESENÇA</span></div>
          </div>
        </section>

        <section id="plataformas" className="platforms-section section-pad" aria-labelledby="platforms-title">
          <div className="section-overline" data-reveal>
            <span className="section-label">Canais oficiais</span>
            <span className="section-rule" />
          </div>
          <div className="platforms-layout">
            <div className="platforms-intro" data-reveal>
              <p className="eyebrow"><span className="eyebrow-dot" /> Conteúdo & conexão</p>
              <h2 id="platforms-title">Nos canais<br /><em>certos.</em></h2>
            </div>
            <div className="brand-showcase" aria-label="Marcas e formatos de conteúdo">
              <div className="brand-stage">
                <span className="brand-stage-glow" aria-hidden="true" />
                <ul className="brand-orbit">
                  {channels.map((channel, index) => (
                    <li
                      className={`brand-orbit-card brand-orbit-card--${channel.kind}`}
                      key={channel.kind}
                      style={{ "--brand-angle": `${(index * 360) / channels.length}deg` } as CSSProperties}
                    >
                      <div className="brand-card">
                        <span className="brand-icon"><ChannelMark kind={channel.kind} /></span>
                        <span className="brand-name">{channel.name}</span>
                        <span className="brand-descriptor">{channel.descriptor}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <span className="brand-orbit-ring" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="contact-section section-pad" aria-labelledby="contact-title">
          <div className="contact-grain" aria-hidden="true" />
          <div className="section-overline section-overline--light" data-reveal>
            <span className="section-label">Contato</span>
            <span className="section-rule" />
          </div>
          <div className="contact-main" data-reveal>
            <p className="eyebrow"><span className="eyebrow-line" /> Um próximo passo, no seu tempo</p>
            <h2 id="contact-title">Uma conversa<br /><em>começa aqui.</em></h2>
            <button className="contact-placeholder" type="button" disabled aria-disabled="true" aria-label="WhatsApp, link oficial ainda não informado">
              <WhatsAppMark />
              <span><b>WhatsApp</b><small>Link oficial a adicionar</small></span>
              <span className="placeholder-arrow" aria-hidden="true"><ArrowMark diagonal /></span>
            </button>
            <a className="contact-secondary" href="#plataformas">Ver canais digitais <ArrowMark diagonal /></a>
          </div>
          <div className="contact-stamp" aria-hidden="true"><span>AMANDA</span><i>LENNS</i><small>DISCRETA · CARINHOSA</small></div>
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
        <span className="floating-whatsapp-face"><WhatsAppMark /></span>
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
