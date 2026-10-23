import { useEffect, useRef, useState } from "react";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  layout: string;
};

const galleryItems: GalleryItem[] = [
  {
    id: "portrait1",
    src: "/media/imagem1.webp",
    alt: "Retrato de Amanda Lenns em um estúdio claro.",
    caption: "Um olhar tranquilo",
    layout: "gallery-item--lead",
  },
  {
    id: "portrait2",
    src: "/media/imagem3.webp",
    alt: "Retrato de Amanda Lenns em uma pose sentada, em estúdio.",
    caption: "Sem excessos",
    layout: "gallery-item--detail",
  },
  {
    id: "portrait3",
    src: "/media/imagem4.webp",
    alt: "Retrato de Amanda Lenns em um cenário de estúdio em tons claros.",
    caption: "Presença em detalhes",
    layout: "gallery-item--wide",
  },
];

function useScrollReveals() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;

    const configureReveals = () => {
      observer?.disconnect();
      document.documentElement.classList.remove("motion-ready");

      if (preference.matches || !("IntersectionObserver" in window)) {
        document
          .querySelectorAll<HTMLElement>("[data-reveal]")
          .forEach(item => {
            item.classList.add("is-visible");
          });
        return;
      }

      document.documentElement.classList.add("motion-ready");
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer?.unobserve(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -32px 0px" }
      );
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)")
        .forEach(item => {
          observer?.observe(item);
        });
    };

    configureReveals();
    preference.addEventListener("change", configureReveals);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", configureReveals);
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);
}

function ArrowMark({ diagonal = false }: { diagonal?: boolean }) {
  return diagonal ? (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="arrow-mark">
      <path d="M5 15 15 5M6 5h9v9" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="arrow-mark">
      <path d="M10 3v13m0 0 5-5m-5 5-5-5" />
    </svg>
  );
}

export default function Home() {
  useScrollReveals();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedPhoto && !dialog.open) dialog.showModal();
    if (!selectedPhoto && dialog.open) dialog.close();
  }, [selectedPhoto]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => {
    if (menuOpen) requestAnimationFrame(() => menuToggleRef.current?.focus());
    setMenuOpen(false);
  };

  return (
    <div className="editorial-site">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="site-header">
        <a
          className="wordmark"
          href="#inicio"
          aria-label="Amanda Lenns — início"
          onClick={closeMenu}
        >
          <span className="wordmark-seal" aria-hidden="true">
            <span>A</span>
            <i>L</i>
          </span>
          <span className="wordmark-copy">
            <strong>
              AMANDA <i>LENNS</i>
            </strong>
            <small>Presença, sem pressa</small>
          </span>
        </a>

        <button
          ref={menuToggleRef}
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Fechar navegação" : "Abrir navegação"}
          onClick={() => setMenuOpen(open => !open)}
        >
          <span>{menuOpen ? "Fechar" : "Menu"}</span>
          <span
            className={`menu-glyph${menuOpen ? " menu-glyph--open" : ""}`}
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>

        <nav
          id="primary-navigation"
          className={`primary-navigation${menuOpen ? " primary-navigation--open" : ""}`}
          aria-label="Navegação principal"
        >
          <a href="#essencia" onClick={closeMenu}>
            Essência
          </a>
          <a href="#galeria" onClick={closeMenu}>
            Retratos
          </a>
          <a href="#presenca" onClick={closeMenu}>
            Presença
          </a>
          <a className="nav-contact" href="#contato" onClick={closeMenu}>
            Contato <ArrowMark diagonal />
          </a>
        </nav>
      </header>

      <main id="conteudo">
        <section id="inicio" className="hero" aria-labelledby="hero-title">
          <div className="hero-grain" aria-hidden="true" />
          <div className="hero-topline" data-reveal>
            <span>Uma presença discreta e carinhosa</span>
            <span className="hero-folio">BR · 01 / 06</span>
          </div>

          <div className="hero-layout">
            <div className="hero-copy" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow-rule" /> Um intervalo na pressa
              </p>
              <h1 id="hero-title">
                <span>Um momento</span>
                <em>para</em>
                <em>desacelerar.</em>
              </h1>
              <p className="hero-description">
                Amanda Lenns — companhia para respirar, relaxar e estar
                presente.
              </p>
              <a className="text-cta hero-cta" href="#essencia">
                <span>Conheça a Amanda</span>
                <ArrowMark />
              </a>
            </div>

            <figure className="hero-portrait" data-reveal>
              <div className="hero-photo-mat">
                <img
                  src="/media/imagem2.webp"
                  alt="Amanda Lenns em um retrato de estúdio com fundo claro."
                  width="1200"
                  height="1800"
                  fetchPriority="high"
                  decoding="async"
                />
                <span className="portrait-register" aria-hidden="true">
                  AL · 01
                </span>
              </div>
              <figcaption>
                Retrato de Amanda Lenns <span>— presença, sem pressa</span>
              </figcaption>
            </figure>
          </div>

          <div className="hero-bottomline">
            <span>Uma pausa, com espaço para estar à vontade.</span>
            <a
              className="scroll-cue"
              href="#essencia"
              aria-label="Rolar para a seção Essência"
            >
              <span>Role para descobrir</span>
              <ArrowMark />
            </a>
          </div>
        </section>

        <section
          id="essencia"
          className="essence-section chapter chapter--wine"
          aria-labelledby="essence-title"
        >
          <div className="chapter-topline" data-reveal>
            <span className="chapter-number">02 / 06</span>
            <span className="chapter-name">Essência</span>
            <span className="chapter-rule" />
          </div>
          <div className="essence-layout">
            <div className="essence-title" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow-dot" /> Um jeito de estar
              </p>
              <h2 id="essence-title">
                Discreta.
                <br />
                <em>Carinhosa.</em>
              </h2>
            </div>
            <div className="essence-copy" data-reveal>
              <span className="essence-mark" aria-hidden="true">
                A<span>L</span>
              </span>
              <p>
                Amanda Lenns é uma presença reservada e atenciosa — para quem
                procura companhia e um momento para relaxar.
              </p>
              <p>Uma pausa da pressa, com espaço para estar à vontade.</p>
              <a className="underlined-link" href="#galeria">
                Explore os retratos <ArrowMark diagonal />
              </a>
            </div>
          </div>
          <div className="chapter-footer" aria-hidden="true">
            <span>AMANDA LENNS</span>
            <span>DISCRIÇÃO EM CADA DETALHE</span>
          </div>
        </section>

        <section
          id="galeria"
          className="gallery-section chapter"
          aria-labelledby="gallery-title"
        >
          <div className="chapter-topline" data-reveal>
            <span className="chapter-number">03 / 06</span>
            <span className="chapter-name">Retratos</span>
            <span className="chapter-rule" />
          </div>
          <div className="gallery-intro" data-reveal>
            <div>
              <p className="eyebrow">
                <span className="eyebrow-dot" /> Um olhar, sem excessos
              </p>
              <h2 id="gallery-title">
                Presença em
                <br />
                <em>fragmentos.</em>
              </h2>
            </div>
            <p className="gallery-intro-note">
              Retratos selecionados para conhecer Amanda Lenns, com delicadeza e
              simplicidade.
            </p>
          </div>

          <div className="gallery-composition">
            {galleryItems.map((photo, index) => (
              <figure
                key={photo.id}
                className={`gallery-figure ${photo.layout}`}
                data-reveal
              >
                <button
                  className="gallery-photo-button"
                  type="button"
                  aria-label={`Ampliar retrato ${index + 1}: ${photo.alt}`}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="photo-topline" aria-hidden="true">
                    <span>0{index + 1}</span>
                    <ArrowMark diagonal />
                  </span>
                  <span className="photo-shade" aria-hidden="true" />
                </button>
                <figcaption>
                  <span>0{index + 1}</span>
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="gallery-footnote" data-reveal>
            Toque ou clique em um retrato para ampliar.
          </p>
        </section>

        <section
          id="presenca"
          className="presence-section chapter chapter--dark"
          aria-labelledby="presence-title"
        >
          <div className="presence-grain" aria-hidden="true" />
          <div className="chapter-topline chapter-topline--light" data-reveal>
            <span className="chapter-number">04 / 06</span>
            <span className="chapter-name">O que importa</span>
            <span className="chapter-rule" />
          </div>
          <div className="presence-layout">
            <div className="presence-heading" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow-rule" /> Companhia que acolhe
              </p>
              <h2 id="presence-title">
                Discrição
                <br />
                <em>no gesto.</em>
                <br />
                Carinho
                <br />
                <em>na presença.</em>
              </h2>
            </div>
            <aside className="presence-aside" data-reveal>
              <span className="presence-initials" aria-hidden="true">
                AL
              </span>
              <p>
                Para quem deseja companhia e um instante para relaxar. Com
                discrição, cuidado e gentileza.
              </p>
              <span className="presence-note">
                Um momento simples, vivido no seu tempo.
              </span>
            </aside>
          </div>
          <div className="presence-footer" aria-hidden="true">
            <span>UM MOMENTO DE CALMA</span>
            <span>04 — PRESENÇA</span>
          </div>
        </section>

        <section
          id="plataformas"
          className="channels-section chapter"
          aria-labelledby="channels-title"
        >
          <div className="chapter-topline" data-reveal>
            <span className="chapter-number">05 / 06</span>
            <span className="chapter-name">Canais oficiais</span>
            <span className="chapter-rule" />
          </div>
          <div className="channels-layout">
            <div className="channels-intro" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow-dot" /> Conteúdo & conexão
              </p>
              <h2 id="channels-title">
                Nos canais
                <br />
                <em>certos.</em>
              </h2>
              <p>
                Os links oficiais serão adicionados assim que forem informados.
              </p>
            </div>
            <div
              className="channel-list"
              role="list"
              aria-label="Canais digitais"
            >
              <div className="channel-row" role="listitem" data-reveal>
                <span className="channel-index">01</span>
                <span className="channel-copy">
                  <strong>Instagram</strong>
                  <small>Perfil oficial a informar</small>
                </span>
                <span className="channel-status">Em breve</span>
              </div>
              <div className="channel-row" role="listitem" data-reveal>
                <span className="channel-index">02</span>
                <span className="channel-copy">
                  <strong>Conteúdo digital</strong>
                  <small>Canal oficial a informar</small>
                </span>
                <span className="channel-status">Em breve</span>
              </div>
              <a
                className="channel-row channel-row--contact"
                role="listitem"
                href="#contato"
                data-reveal
              >
                <span className="channel-index">03</span>
                <span className="channel-copy">
                  <strong>Contato</strong>
                  <small>Ver informações disponíveis</small>
                </span>
                <span className="channel-arrow">
                  <ArrowMark diagonal />
                </span>
              </a>
            </div>
          </div>
          <p className="channels-note" data-reveal>
            <span aria-hidden="true">✳</span> Sem atalhos inventados. Apenas
            canais confirmados.
          </p>
        </section>

        <section
          id="contato"
          className="contact-section chapter chapter--wine"
          aria-labelledby="contact-title"
        >
          <div className="chapter-topline chapter-topline--light" data-reveal>
            <span className="chapter-number">06 / 06</span>
            <span className="chapter-name">Contato</span>
            <span className="chapter-rule" />
          </div>
          <div className="contact-layout">
            <div className="contact-main" data-reveal>
              <p className="eyebrow">
                <span className="eyebrow-rule" /> Um próximo passo, no seu tempo
              </p>
              <h2 id="contact-title">
                Uma conversa
                <br />
                <em>começa aqui.</em>
              </h2>
              <p className="contact-description">
                Os canais de contato serão incluídos nesta página assim que
                forem confirmados.
              </p>
              <a className="contact-cta" href="#plataformas">
                Ver canais oficiais <ArrowMark diagonal />
              </a>
            </div>
            <div className="contact-seal" aria-hidden="true">
              <span>AMANDA</span>
              <i>LENNS</i>
              <small>DISCRETA · CARINHOSA</small>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#inicio">
          AMANDA <i>LENNS</i>
        </a>
        <span className="footer-note">Presença, com discrição e carinho.</span>
        <a className="footer-top" href="#inicio">
          Voltar ao início <ArrowMark diagonal />
        </a>
      </footer>

      <dialog
        ref={dialogRef}
        className="photo-dialog"
        aria-label="Retrato ampliado de Amanda Lenns"
        onClose={() => setSelectedPhoto(null)}
        onCancel={() => setSelectedPhoto(null)}
        onClick={event => {
          if (event.target === dialogRef.current) setSelectedPhoto(null);
        }}
      >
        <div className="dialog-heading">
          <span>
            AMANDA LENNS <i>·</i> RETRATO
          </span>
          <button
            className="dialog-close"
            type="button"
            aria-label="Fechar retrato ampliado"
            onClick={() => setSelectedPhoto(null)}
          >
            Fechar <span aria-hidden="true">×</span>
          </button>
        </div>
        {selectedPhoto && (
          <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
        )}
      </dialog>
    </div>
  );
}
