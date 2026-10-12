/**
 * ============================================================
 * As regras de arquitetura, EXECUTÁVEIS.
 * ------------------------------------------------------------
 * Este arquivo é a camada 2 da escada de enforcement do
 * INVARIANTES.md: a regra deixou de ser texto (advisório) e
 * virou teste. Rode:  npm run arch
 *
 * O projeto chegou com o arch VERMELHO de propósito: 2 violações
 * plantadas da Regra da Dependência, corrigidas no código na
 * trilha ARQ (ARQ-4 e ARQ-5).
 *
 * ARQ-6 feito — a régua evoluiu junto com o código: com a camada
 * Repository pronta (ARQ-1..3), nasceu a 4ª regra,
 * "so-repositories-importam-o-driver". Ela só existe agora porque,
 * antes da camada, ela gritaria em todo service — e regra que
 * sempre grita vira ruído.
 * ============================================================
 */
module.exports = {
  forbidden: [
    {
      name: "rotas-so-conhecem-controllers",
      comment:
        "Uma rota roteia. Se ela importa service ou banco, a fronteira Route/Controller vazou.",
      severity: "error",
      from: { path: "^src/routes" },
      to: { path: "^src/(services|repositories|database)" },
    },
    {
      name: "controllers-nao-tocam-o-banco",
      comment:
        "Controller traduz HTTP <-> domínio. Acesso a dados é papel do service (e, depois da trilha ARQ, do repository).",
      severity: "error",
      from: { path: "^src/controllers" },
      to: { path: "^src/(database|repositories)|^node_modules/(better-sqlite3|@prisma)" },
    },
    {
      name: "services-nao-conhecem-a-web",
      comment:
        "A Regra da Dependência: o domínio não sabe que a web existe. Service que importa express (ou middleware/controller/rota) inverteu a seta — mesmo que seja 'só um tipo'.",
      severity: "error",
      from: { path: "^src/services" },
      to: { path: "^src/(controllers|routes|middlewares)|^node_modules/(express|multer)" },
    },
    {
      name: "so-repositories-importam-o-driver",
      comment:
        "Só a camada Repository conhece o driver do banco (src/database hoje, Prisma na trilha ORM). Qualquer outro arquivo que precise de dados pede a um repository — é isso que permite trocar o banco sem que o resto do sistema perceba.",
      severity: "error",
      from: { path: "^src/(?!repositories)" },
      to: { path: "^src/database|^node_modules/@prisma" },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
  },
};
