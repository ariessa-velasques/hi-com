/*
 * VAGAS DA HI-COM
 * ================
 * Para adicionar uma vaga nova: copie um dos blocos { ... } abaixo,
 * cole antes do "];" no final, e edite os textos entre aspas.
 * Para remover uma vaga: apague o bloco { ... } inteiro dela.
 * Para tirar uma vaga do ar sem apagar: mude "ativa: true" para "ativa: false".
 *
 * Campos:
 *   id              - identificador único, só letras minúsculas/números/hífen (não repetir)
 *   titulo          - nome da vaga, ex: "Técnico de Campo"
 *   local           - cidade/UF, ex: "Brasília/DF"
 *   tipo            - um de: "Freelance", "Full Time", "Internship", "Part Time", "Temporary"
 *   remota          - true se a vaga é remota, false se não é
 *   dataPublicacao  - data no formato "AAAA-MM-DD" (usada só para calcular "publicado há X dias")
 *   resumo          - texto curto que aparece fechado, antes de clicar
 *   responsabilidades, requisitos, beneficios - listas de textos (podem ter quantos itens quiser)
 *   ativa           - true para aparecer no site, false para ficar oculta
 */

const JOBS_DATA = [
  {
    id: "tecnico",
    titulo: "Técnico",
    local: "Maranhão/MA",
    tipo: "Full Time",
    remota: false,
    dataPublicacao: "2026-07-23",
    resumo:
      "A Hi-Com é uma empresa de tecnologia e comunicação que desenvolve soluções " +
      "inovadoras para conectar pessoas e negócios. Nossa equipe é movida por inovação, " +
      "colaboração e excelência no atendimento aos nossos clientes.",
    responsabilidades: [
      "Instalação, manutenção e configuração de redes, cabeamento estruturado e equipamentos de infraestrutura.",
      "Atendimento técnico em campo, seguindo normas de segurança e procedimentos da empresa.",
      "Diagnóstico e resolução de problemas técnicos em sistemas de conectividade e segurança eletrônica.",
      "Elaboração de relatórios técnicos das atividades realizadas.",
    ],
    requisitos: [
      "Ensino técnico completo em Eletrotécnica, Telecomunicações, Redes ou área correlata.",
      "Experiência prévia com cabeamento estruturado e/ou redes elétricas.",
      "Disponibilidade para viagens e atendimento em campo.",
      "CNH categoria B (desejável).",
    ],
    beneficios: [
      "Vale-transporte e vale-alimentação.",
      "Plano de saúde e odontológico.",
      "Oportunidade de crescimento em uma empresa consolidada há mais de 20 anos no mercado.",
    ],
    ativa: true,
  },
];
