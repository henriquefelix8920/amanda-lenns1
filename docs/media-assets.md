# Mídia de Amanda Lenns

## Arquivos publicados

As cópias de entrega ficam em `client/public/media/` e são usadas diretamente pelo site:

- `video2.mp4` — fundo do hero, carregado de imediato, mudo e pausado quando sai da tela ou a aba fica oculta.
- `video1.mp4` — fundo da seção Presença, carregado quando a seção se aproxima da viewport, mudo e pausado fora de vista.
- `imagem1.webp` a `imagem4.webp` — galeria editorial; carregamento adiado até as imagens se aproximarem da viewport.

Os dois vídeos publicados são H.264, sem faixa de áudio e com `faststart`. As imagens publicadas mantêm as proporções dos retratos; as três imagens originais maiores foram redimensionadas proporcionalmente para até 1.600 px de altura antes da conversão para WebP.

## Arquivos-mestre

Os originais fornecidos estão preservados em `docs/media-originals/`; não são baixados pelo site. Se as versões públicas precisarem ser refeitas, use os mestres e mantenha as extensões e os nomes que estão nessa pasta. Publique apenas mídias com autorização. Caso uma cópia de entrega esteja ausente, a página mantém seu tratamento visual de fallback.
