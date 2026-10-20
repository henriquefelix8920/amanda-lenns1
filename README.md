# Amanda Lenns — Presença

React / Express / tRPC / Drizzle starter, adapted from the Sandbox web-db-user template.

- `pnpm dev`: development server; honors `PORT` (default 3000).
- `pnpm build` / `pnpm start`: build and serve `dist/index.js` and `dist/public/`.
- `pnpm db:migrate`: apply checked-in migrations. `pnpm db:push`: generate and apply new schema changes.
- `pnpm check` / `pnpm test`: types and application tests.

Start with the Webdev skill's default-template guide. Platform login, storage, payments and service contracts live in its shared references; read the relevant capability before extending its helper.

`server/_core/publicConfig.ts` exposes only named public runtime values. Private keys stay server-side. The platform serves managed `/manus-storage/` assets; the application does not register a second proxy.

Platform configuration is readable and editable through `webdev.config`. Default settings are initial values, not enforced constraints. The agent may modify the files, commands and configuration or follow the flexible guide for another stack.


## Site Amanda Lenns — presença editorial

O site é uma página estática em português, criada com React, TypeScript e Vite. Para desenvolvimento, use Node.js com pnpm 10.18.0:

```bash
pnpm install --frozen-lockfile
pnpm dev:static
```

Para validar e preparar a saída de produção:

```bash
pnpm check
pnpm build:static
```

A pasta publicada pelo Vite é `dist/public`. O arquivo `vercel.json` especifica o build estático e a pasta de saída para importação posterior na Vercel. Não há banco de dados nem servidor necessários para esta página.

### Mídias autorizadas

Adicione as fotos e os vídeos fornecidos pela profissional em `client/public/media/`: `imagem1.jpg`, `imagem2.jpg`, `imagem3.jpg`, `imagem4.jpg`, `video2.mp4` (fundo do hero) e `video1.mp4` (fundo da seção Experiência). O nome de imagem `imagem2jpg`, sem ponto antes de `jpg`, também é aceito por compatibilidade; `imagem2.jpg` é recomendado. A página mantém composições abstratas próprias enquanto os arquivos ainda não estiverem presentes. Consulte `docs/media-assets.md` para detalhes.

### Canais oficiais

Os botões de WhatsApp e de canais digitais estão marcados como provisórios e sem destino clicável até que os links reais sejam informados. Não adicione links, perfis, serviços ou dados não confirmados. Os nomes temporários e os conteúdos estão em `client/src/pages/Home.tsx`.

Como o domínio público ainda não foi definido, o HTML não declara URL canônica nem `og:url` absolutos. Configure esses metadados quando o domínio final estiver disponível.
