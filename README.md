# RB Industrial — Site Institucional

Site estático (HTML/CSS/JS puro, sem framework, sem backend) da RB Industrial: usinagem, caldeiraria e montagem industrial em Sete Lagoas/MG.

- **Produção:** https://rb-industrial.vercel.app
- **Repositório:** https://github.com/phaborges/rb-industrial

## Stack

Nenhuma dependência de build. `index.html` + `css/styles.css` + `js/main.js` + `assets/img/*`. Qualquer servidor estático serve o site.

## Rodar localmente

```bash
python -m http.server 8080
# ou
npx serve .
```

Depois abra `http://localhost:8080`.

## Deploy

Conectado à Vercel via GitHub. **Todo push na branch `master` publica automaticamente em produção** — não é necessário rodar `vercel` manualmente no dia a dia.

Deploy manual (se precisar):
```bash
npm i -g vercel
vercel login
vercel --prod
```

## Recuperação em caso de perda total do ambiente local

O site existe em **3 cópias independentes**: disco local, GitHub (histórico completo) e Vercel (build publicado). Perder uma não derruba as outras.

Se o computador local for perdido, para reconstruir o ambiente de trabalho:

```bash
git clone https://github.com/phaborges/rb-industrial.git
cd rb-industrial
vercel link    # reconecta ao projeto existente na Vercel
```

A Vercel também mantém **todo deploy anterior acessível e reversível** (rollback instantâneo pelo dashboard, sem precisar de novo build) — nunca é preciso "recriar" um deploy que já funcionou.

## Onde estão os materiais originais

- `assets/fonte-original/portfolio-comercial-rb-industrial.pdf` — apresentação comercial original enviada pela RB Industrial. Fonte de todo o texto e histórico da empresa usado no site.
- `assets/raw-extract/` — todas as 64 fotos extraídas em resolução original do PDF acima, antes de qualquer corte/otimização. Útil para reaproveitar em novas peças (redes sociais, impressos) sem precisar reprocessar o PDF.
- `assets/img/` — versões finais, otimizadas e cortadas, efetivamente usadas no site.

## Segurança

- **Headers HTTP** definidos em `vercel.json`: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **Branch `master` protegida** no GitHub: force-push e exclusão de branch bloqueados.
- **Sem secrets/chaves de API** no código — site 100% estático, formulário de contato usa link direto para WhatsApp (`wa.me`), sem backend.
- **HTTPS obrigatório** — servido via CDN da Vercel, certificado renovado automaticamente.

Detalhes completos da auditoria de segurança: ver caso documentado no vault Juvito (`segundocerebro/Juvito/Obsidian-juvito/Casos/`).

## Contato técnico do projeto

Dúvidas sobre a RB Industrial (não sobre o código): comercial1@rbindustrial.com.br · (31) 3774-8959
