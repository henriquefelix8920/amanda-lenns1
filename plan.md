# Plano — reestruturação editorial de Amanda Lenns

## Brief e hipóteses

A usuária pediu: “use a habilidade cinematic-web-studio e reestruture esse site: https://github.com/henriquefelix8920/amanda-lenns1”. Ela também informou que, se não gostar, pedirá para voltar ao anterior. Como a instrução é execução imediata, não há pausa para aprovar conceito. Hipóteses: preservar português do Brasil, marca e retratos já existentes; manter todos os dados de contato/canais não confirmados como indisponíveis; não publicar nem alterar `main` nesta rodada. O trabalho fica isolado na branch local `redesign/cinematic-amanda` para reverter com segurança.

## Direções consideradas

**Casa em penumbra — probabilidade 0,06.** Editorial íntimo de fim de tarde: papel marfim, vinho escuro e luz âmbar; abertura assimétrica com retrato verdadeiro; scroll atravessa promessa, retratos, presença e contato. Movimento limitado a revelações curtas. Risco: contraste insuficiente se as cores de papel e vinho forem usadas sem cuidado.

**Arquivo de gestos — probabilidade 0,04.** Linguagem de folha de contato fotográfica, números de cena e recortes quase documentais em uma página predominantemente clara. Risco: pode parecer portfólio de moda, diminuindo a sensação de acolhimento.

**Sala noturna — probabilidade 0,03.** Quase monocromia escura, vídeo em tela inteira e títulos de alto contraste. Risco: aproxima-se da solução preto/dourado já presente e aumenta o custo visual em mobile.

## Direção escolhida

**Casa em penumbra — “um espaço seguro para sair da pressa”.** O site deve fazer a pessoa sentir calma, entender que a proposta é companhia discreta e saber onde encontrar canais oficiais — sem simular uma ação de contato ainda não configurada.

Design editorial cinematográfico de revista, guiado por retrato, matéria e luz de janela. Atributos: reservada, acolhedora e contemporânea. Papel quente e areia tornam a abertura humana; vinho e café dão profundidade e discrição; âmbar aparece como acento de luz, nunca como brilho generalizado. A página usa capítulos encadeados e larguras variáveis, alternando campo claro, imagem em escala e cena escura, sem deixar uma grade de cards dominar.

A tipografia permanece Newsreader para títulos e Jost para interface/copy, com escala fluida. O selo AL existente fica reduzido a assinatura editorial, enquanto “Amanda Lenns” permanece por extenso. A voz usa frases curtas e serenas: “Presença, sem pressa.” e “Um momento para desacelerar.” Cor proprietária: vinho profundo `#6b2429`, com papel `#f3eee5` e café `#211917`.

O fio condutor são um folio lateral discreto, a régua vinho que guia a navegação e retratos próprios em molduras editoriais verticais. Âncoras continuam nativas; menu serve toque e teclado; retratos abrem num diálogo acessível; CTAs apontam só a destinos existentes. Não haverá botão de WhatsApp falso, parallax ou animações decorativas contínuas. Revelações curtas de opacidade/posição são desativadas com `prefers-reduced-motion`.

## Mapa de cenas

1. **Abertura — promessa.** Manchete e retrato próprio numa composição editorial dividida, com entrada mínima; mobile preserva o título antes do retrato.
2. **Essência — contexto.** Texto breve em área de papel, destacando discrição, carinho e pausa; revelação discreta.
3. **Retratos — prova visual.** Composição assimétrica com fotos fornecidas; ampliar por diálogo; mobile empilha imagens sem cortes forçados.
4. **Presença — clímax.** Cena tipográfica escura com uma frase grande como pausa narrativa; sem imagem ou vídeo de fundo.
5. **Canais — próximo passo.** Lista editorial com Instagram e conteúdo digital marcados claramente como “link não informado”; contato interno funcional.
6. **Contato — fechamento.** Convite sem promessa de canal, CTA de navegação para os canais e rodapé enxuto.

## Arquitetura e assets

Reutilizar React e Vite com dependências existentes; não adicionar bibliotecas de animação nem Three.js. Atualizar `client/src/pages/Home.tsx`, estilos em `client/src/index.css` e metadados em `client/index.html`. Manter os originais das fotos e gerar derivados WebP proporcionais para a página. As fotos existentes incluem PNGs nomeados como `.jpg`; os derivados usarão extensão e MIME corretos. Os vídeos não serão usados: os quadros exibem marcas d’água de ferramentas, incompatíveis com o acabamento editorial. As imagens externas encontradas não serão usadas; os assets próprios são mais adequados e evitam atribuir a Amanda a aparência de uma pessoa de banco.

Não adicionar backend, login, banco de dados, formulário ou canais. Os destinos ausentes continuam honestamente indisponíveis.

## Estrutura do repositório

`client/src/pages/Home.tsx` concentra cenas, navegação e diálogo da galeria; `client/src/index.css` define cores, tipografia, composição, breakpoints e movimento reduzido; `client/public/media/` contém originais e derivados; `client/index.html` contém metadados e fontes existentes.
