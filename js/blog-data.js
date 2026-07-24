/*
 * POSTS DO BLOG DA HI-COM
 * =======================
 * Para adicionar um post novo: copie um dos blocos { ... } abaixo,
 * cole antes do "];" no final, e edite os textos entre aspas.
 * Para remover um post: apague o bloco { ... } inteiro dele.
 * Para tirar um post do ar sem apagar: mude "ativo: true" para "ativo: false".
 *
 * Campos:
 *   id         - identificador único, só letras minúsculas/números/hífen (não repetir, vira parte do link)
 *   titulo     - título do post
 *   data       - data de exibição, já formatada como você quer que apareça, ex: "24 de julho de 2023"
 *   imagem     - caminho da imagem, relativo à pasta img/ (ex: "blog/meu-post.jpg")
 *   resumo     - texto curto que aparece no card da listagem (1-2 frases)
 *   descricao  - texto completo que aparece na página do post (pode ter mais de um parágrafo,
 *                separe parágrafos com "\n\n")
 *   ativo      - true para aparecer no site, false para ficar oculto
 */

const BLOG_DATA = [
  {
    id: "dia-do-trabalhador",
    titulo: "Feliz Dia do Trabalhador",
    data: "1º de maio",
    imagem: "blog/dia-do-trabalhador.jpg",
    resumo: "Obrigado à nossa equipe pelo comprometimento em construir os resultados da Hi-Com todos os dias.",
    descricao:
      "Neste 1º de maio, a Hi-Com celebra e agradece a cada colaborador que faz parte da nossa " +
      "história. É o comprometimento, a colaboração e a dedicação da nossa equipe que constroem, " +
      "todos os dias, os resultados que nos tornam referência em soluções de tecnologia e " +
      "comunicação de dados.\n\nDesejamos um Feliz Dia do Trabalhador a todos que, com seu " +
      "trabalho, transformam desafios em conquistas.",
    ativo: true,
  },
  {
    id: "justica-4-0",
    titulo: "Justiça 4.0 lança pesquisa sobre Integridade e Compliance",
    data: "24 de julho de 2023",
    imagem: "blog/justica-4-0.jpg",
    resumo: "Iniciativa reforça a importância de práticas éticas e transparentes nas relações institucionais.",
    descricao:
      "O programa Justiça 4.0 lançou uma pesquisa voltada para práticas de integridade e " +
      "compliance em relações institucionais e comerciais. A iniciativa reforça um movimento " +
      "que a Hi-Com já adota internamente: conduzir negócios com ética, transparência e em " +
      "conformidade com a legislação vigente.\n\nAcompanhamos de perto discussões como essa " +
      "porque acreditamos que integridade e inovação tecnológica caminham juntas — é assim que " +
      "construímos relações de confiança duradouras com nossos clientes e parceiros.",
    ativo: true,
  },
  {
    id: "seguranca-ti",
    titulo: "Segurança e compliance em TI",
    data: "Em breve",
    imagem: "blog/seguranca-ti.jpg",
    resumo: "Conteúdo do blog será publicado em breve.",
    descricao: "Conteúdo do blog será publicado em breve.",
    ativo: true,
  },
];
