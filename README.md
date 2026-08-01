# Hi-Com — Site institucional

Site institucional da **Hi-Com Comunicação de Dados** (nome fantasia HC Comunicação de Dados),
empresa fundada em 2002 por Francisco Gomes Pedrosa, especializada em soluções de
tecnologia e telecomunicações: cabeamento estruturado metálico e óptico (LAN), redes
ópticas metropolitanas (WAN), sistemas de segurança eletrônica e infraestrutura de
redes elétricas e lógicas. Atua há mais de duas décadas, com expansão estratégica para
as regiões Centro-Oeste, Norte e Nordeste do Brasil.

## Para quem é o site

- **Clientes atuais e potenciais** (órgãos públicos, universidades, empresas e
  instituições que contratam infraestrutura de rede, cabeamento e segurança
  eletrônica) — apresentação institucional, portfólio de projetos e canal de contato.
- **Candidatos a vagas** — páginas de banco de talentos e "trabalhe conosco", com
  formulário de candidatura.
- **Parceiros de negócio e órgãos de compliance** — página de integridade e
  compliance, código de ética e ATAs de registro de preço.
- **Visitantes em geral** — blog institucional com notícias e comunicados da empresa.

## Estrutura do projeto

Site estático, sem framework e sem build step (HTML + CSS + JavaScript puro):

```
index.html          → home
pages/               → demais páginas (uma por arquivo .html)
css/                 → uma folha por seção/componente (ver cada <head> para a lista usada)
js/                  → scripts da página (nav mobile, filtro de vagas, listagem de blog)
img/                 → imagens usadas pelas páginas
assets/              → documentos e materiais (PDFs de ATA, banners, etc.)
php/                 → endpoint de envio do formulário de candidatura
docs/                → documentação interna de padrões de implementação
```

Não há sistema de templates: o header/nav/footer é repetido manualmente em cada
página HTML. Vagas e posts do blog, por outro lado, são orientados a dados — veja
[`docs/PADRAO-VAGAS-E-BLOG.md`](docs/PADRAO-VAGAS-E-BLOG.md) para o padrão de como
adicionar uma vaga ou um post novo sem mexer em HTML/CSS.
