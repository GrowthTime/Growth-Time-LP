// GT System — DADOS FICTÍCIOS compartilhados por todas as telas da demonstração.
// Empresa inventada: "Moda Fashion" (confecção/atacado de moda, Fortaleza-CE).
// REGRA: nenhum nome, telefone, @ ou número de cliente real. Tudo aqui é encenação.
// Todas as telas leem daqui (window.GT) para os números baterem entre si.
const GT = {};

// ---------- formatação ----------
GT.fmt = {
  brl: (n, d = 0) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }),
  brlK: (n) => n >= 1000000 ? 'R$ ' + (n / 1000000).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' mi' : n >= 1000 ? 'R$ ' + (n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil' : GT.fmt.brl(n),
  num: (n) => Number(n).toLocaleString('pt-BR'),
  pct: (n, d = 1) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + '%',
  x: (n) => Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + 'x',
};

// ---------- empresa ----------
GT.company = {
  name: 'Moda Fashion', slug: 'modafashion', site: 'modafashion.com.br', city: 'Fortaleza · CE',
  ig: '@modafashion', igFollowers: 48200, segment: 'Atacado de moda feminina',
  waPublic: '(85) 9 8123-4321', logo: 'MF', color: '#38cc9c',
  bioUrl: 'gt.link/modafashion', storeUrl: 'modafashion.lojagt.com',
};

// ---------- equipe ----------
// color = cor do avatar. chipId = número de WhatsApp em que a pessoa atende.
GT.sellers = [
  { id: 'marina', name: 'Marina Alves', initials: 'MA', color: '#38cc9c', role: 'Gestora', chipId: 'v1', email: 'marina@modafashion.com.br', goalOuro: 210000, goalPrata: 185000, goalBronze: 150000, month: 198000, day: 9400, week: 47500, conv: 18 },
  { id: 'ana', name: 'Ana Silva', initials: 'AS', color: '#8b5cf6', role: 'Vendedora', chipId: 'v1', goalOuro: 180000, goalPrata: 160000, goalBronze: 130000, month: 176000, day: 8100, week: 41200, conv: 16 },
  { id: 'julia', name: 'Júlia Costa', initials: 'JC', color: '#f59e0b', role: 'Vendedora', chipId: 'v2', goalOuro: 160000, goalPrata: 140000, goalBronze: 115000, month: 142000, day: 6200, week: 33800, conv: 14 },
  { id: 'bia', name: 'Bia Ramos', initials: 'BR', color: '#ec4899', role: 'Vendedora', chipId: 'v2', goalOuro: 150000, goalPrata: 130000, goalBronze: 105000, month: 104000, day: 3900, week: 24100, conv: 11 },
  { id: 'paula', name: 'Paula Ribeiro', initials: 'PR', color: '#0ea5e9', role: 'Vendedora', chipId: 'v3', goalOuro: 120000, goalPrata: 100000, goalBronze: 80000, month: 86000, day: 4100, week: 21000, conv: 12 },
  { id: 'carla', name: 'Carla Mendes', initials: 'CM', color: '#f97316', role: 'Vendedora', chipId: 'v2', goalOuro: 110000, goalPrata: 95000, goalBronze: 75000, month: 79000, day: 3200, week: 18600, conv: 10 },
  { id: 'bruna', name: 'Bruna Lima', initials: 'BL', color: '#64748b', role: 'Suporte', chipId: 'sup', goalOuro: 0, goalPrata: 0, goalBronze: 0, month: 0, day: 0, week: 0, conv: 0 },
];
GT.seller = (id) => GT.sellers.find((s) => s.id === id);
GT.team = { goalOuro: 700000, goalPrata: 600000, goalBronze: 500000, goalDay: 32000, goalWeek: 175000, month: 620000, day: 31700, week: 167600, trend: 102, remainingWorkDays: 4, elapsedWorkDays: 18, totalWorkDays: 22 };

// ---------- canais ----------
GT.channel = {
  whatsapp: { label: 'WhatsApp', color: '#25D366', icon: 'phone' },
  instagram: { label: 'Instagram', color: 'linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)', icon: 'instagram' },
  messenger: { label: 'Messenger', color: '#0084FF', icon: 'zap' },
  sms: { label: 'SMS', color: '#6366f1', icon: 'message-square-text' },
};

// ---------- números / chips conectados ----------
// provider: cloud_api = API oficial; coexistence = API oficial SEM perder o celular; instagram/messenger = Meta.
GT.chips = [
  { id: 'v1', label: 'Vendas 1', number: '(85) 9 8123-4321', short: '4321', channel: 'whatsapp', provider: 'coexistence', status: 'connected', health: 'ok', quality: 'Alta', sellerIds: ['marina', 'ana'], convosToday: 62, purpose: 'Vendas', campaignTag: 'MF · Vendas 1 · 4321' },
  { id: 'v2', label: 'Vendas 2', number: '(85) 9 9654-7788', short: '7788', channel: 'whatsapp', provider: 'cloud_api', status: 'connected', health: 'ok', quality: 'Alta', sellerIds: ['julia', 'bia', 'carla'], convosToday: 48, purpose: 'Vendas', campaignTag: 'MF · Vendas 2 · 7788' },
  { id: 'v3', label: 'Vendas 3', number: '(11) 9 8877-2255', short: '2255', channel: 'whatsapp', provider: 'cloud_api', status: 'connected', health: 'attention', quality: 'Média', sellerIds: ['paula'], convosToday: 21, purpose: 'Vendas · SP', campaignTag: 'MF · Vendas 3 · 2255' },
  { id: 'sup', label: 'Suporte', number: '(85) 9 8011-5566', short: '5566', channel: 'whatsapp', provider: 'coexistence', status: 'connected', health: 'ok', quality: 'Alta', sellerIds: ['bruna'], convosToday: 17, purpose: 'Pós-venda' },
  { id: 'ig', label: 'Instagram @modafashion', number: '@modafashion', short: 'IG', channel: 'instagram', provider: 'instagram', status: 'connected', health: 'ok', sellerIds: ['ana', 'julia'], convosToday: 34, purpose: 'Direct' },
  { id: 'ms', label: 'Messenger · Moda Fashion', number: 'fb.com/modafashion', short: 'FB', channel: 'messenger', provider: 'messenger', status: 'connected', health: 'ok', sellerIds: ['bia'], convosToday: 6, purpose: 'Página' },
];
GT.chip = (id) => GT.chips.find((c) => c.id === id);

// ---------- conversas ----------
// origin.type: ad (anúncio, CTWA) · bio (link da bio) · comment (comentário→Direct) · organic · referral (indicação) · broadcast (disparo)
// temp: hot/cold/frozen · qual: qualified/pending/not_qualified · tier: ouro/prata/bronze/null
const gtT = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
GT.conversations = [
  { id: 1, name: 'Patrícia Modas', phone: '(85) 9 9812-3344', initials: 'PM', city: 'Sobral · CE', chipId: 'v1', channel: 'whatsapp', sellerId: 'marina', temp: 'hot', qual: 'qualified', tier: 'ouro', origin: { type: 'ad', label: 'Anúncio · Coleção Verão' }, last: 'Fechei! Pode mandar a grade P ao GG 🙌', time: '2min', unread: 2,
    messages: [
      { k: 'them', t: 'Oi! Vi o anúncio da coleção verão, ainda tem a grade completa do vestido midi?', time: gtT(9, 12) },
      { k: 'me', t: 'Oi Patrícia! Tem sim 😊 Grade P ao GG, 6 peças, R$ 389 a grade. Quer que eu monte com as 3 cores?', time: gtT(9, 13) },
      { k: 'them', t: 'Quero ver as cores primeiro', time: gtT(9, 14) },
      { k: 'me', t: 'Te mandei o catálogo com as fotos. O terracota é o que mais sai 🔥', time: gtT(9, 15) },
      { k: 'them', t: 'Fechei! Pode mandar a grade P ao GG 🙌', time: gtT(9, 31) },
    ] },
  { id: 2, name: 'Revenda Bella', phone: '(11) 9 8444-1290', initials: 'RB', city: 'Guarulhos · SP', chipId: 'v3', channel: 'whatsapp', sellerId: 'paula', temp: 'hot', qual: 'pending', tier: null, origin: { type: 'bio', label: 'Link da bio' }, last: 'Qual o mínimo do atacado?', time: '8min', unread: 1,
    messages: [
      { k: 'them', t: 'Olá, vim pelo link do Instagram. Qual o mínimo do atacado?', time: gtT(9, 40) },
    ] },
  { id: 3, name: 'Camila Atacado', phone: '(71) 9 9655-7781', initials: 'CA', city: 'Salvador · BA', chipId: 'v2', channel: 'whatsapp', sellerId: 'julia', temp: 'cold', qual: 'qualified', tier: 'prata', origin: { type: 'organic', label: 'Orgânico' }, last: 'Você: Te enviei o catálogo novo 👗', time: '1h', unread: 0,
    messages: [
      { k: 'them', t: 'Bom dia! Chegou coisa nova?', time: gtT(8, 2) },
      { k: 'me', t: 'Te enviei o catálogo novo 👗', time: gtT(8, 20) },
    ] },
  { id: 4, name: 'lojinha.da.bia', phone: '@lojinha.da.bia', initials: 'LB', city: 'Instagram', chipId: 'ig', channel: 'instagram', sellerId: 'ana', temp: 'hot', qual: 'pending', tier: null, origin: { type: 'comment', label: 'Comentou "quero" no post' }, last: 'Recebi! Quanto fica a grade de 6?', time: '3min', unread: 1,
    messages: [
      { k: 'me', t: 'Oi! Você comentou no post do conjunto linho 💚 Aqui está a tabela de atacado que prometi: gt.link/mf-tabela', time: gtT(9, 36), auto: true },
      { k: 'them', t: 'Recebi! Quanto fica a grade de 6?', time: gtT(9, 38) },
    ] },
  { id: 5, name: 'Loja da Duda', phone: '(31) 9 8123-0098', initials: 'LD', city: 'Contagem · MG', chipId: 'v2', channel: 'whatsapp', sellerId: 'bia', temp: 'frozen', qual: 'not_qualified', tier: null, origin: { type: 'ad', label: 'Anúncio · Grade Atacado' }, last: 'Obrigada, vou pensar', time: 'Ontem', unread: 0,
    messages: [
      { k: 'them', t: 'Vocês vendem no varejo?', time: gtT(15, 10) },
      { k: 'me', t: 'Trabalhamos só no atacado, a partir de 6 peças 😊', time: gtT(15, 12) },
      { k: 'them', t: 'Obrigada, vou pensar', time: gtT(15, 30) },
    ] },
  { id: 6, name: 'Fernanda Boutique', phone: '(85) 9 9110-2200', initials: 'FB', city: 'Fortaleza · CE', chipId: 'v1', channel: 'whatsapp', sellerId: 'ana', temp: 'hot', qual: 'qualified', tier: 'ouro', origin: { type: 'broadcast', label: 'Disparo · Lançamento' }, last: 'Separa 2 grades do cropped pra mim', time: '25min', unread: 0,
    messages: [
      { k: 'me', t: 'Fernanda, saiu a coleção nova! Quer que eu separe antes de abrir pro público?', time: gtT(8, 0), template: true },
      { k: 'them', t: 'Separa 2 grades do cropped pra mim', time: gtT(9, 8) },
    ] },
  { id: 7, name: 'Roberta Store', phone: 'Messenger', initials: 'RS', city: 'Facebook', chipId: 'ms', channel: 'messenger', sellerId: 'bia', temp: 'cold', qual: 'pending', tier: null, origin: { type: 'organic', label: 'Página do Facebook' }, last: 'Tem loja física?', time: '2h', unread: 0,
    messages: [{ k: 'them', t: 'Tem loja física?', time: gtT(7, 45) }] },
  { id: 8, name: 'Ateliê Mariana', phone: '(62) 9 9321-8877', initials: 'AM', city: 'Goiânia · GO', chipId: 'v3', channel: 'whatsapp', sellerId: 'paula', temp: 'hot', qual: 'qualified', tier: 'bronze', origin: { type: 'referral', label: 'Indicação · Patrícia Modas' }, last: 'A Patrícia me indicou vocês!', time: '40min', unread: 1,
    messages: [{ k: 'them', t: 'A Patrícia me indicou vocês!', time: gtT(8, 55) }] },
  { id: 9, name: 'Cliente Pós-venda · Lúcia', phone: '(85) 9 8777-1010', initials: 'LC', city: 'Caucaia · CE', chipId: 'sup', channel: 'whatsapp', sellerId: 'bruna', temp: 'cold', qual: 'qualified', tier: 'prata', origin: { type: 'organic', label: 'Suporte' }, last: 'Você: Troca aprovada, etiqueta enviada ✅', time: '1h', unread: 0,
    messages: [{ k: 'them', t: 'Veio uma peça com defeito na costura', time: gtT(8, 30) }, { k: 'me', t: 'Troca aprovada, etiqueta enviada ✅', time: gtT(8, 41) }] },
  { id: 10, name: 'estilo.nay', phone: '@estilo.nay', initials: 'EN', city: 'Instagram', chipId: 'ig', channel: 'instagram', sellerId: 'julia', temp: 'cold', qual: 'pending', tier: null, origin: { type: 'comment', label: 'Comentou "preço" na live' }, last: 'Você: Segue a tabela 💚', time: '5h', unread: 0,
    messages: [{ k: 'me', t: 'Segue a tabela 💚', time: gtT(4, 10), auto: true }] },
  { id: 11, name: 'Grupo · Equipe Vendas', phone: '6 participantes', initials: 'EV', group: true, chipId: 'v1', channel: 'whatsapp', sellerId: null, temp: null, qual: null, tier: null, origin: null, last: 'Marina: bati a meta de hoje! 🎉', time: '3h', unread: 0, messages: [{ k: 'them', t: 'Marina: bati a meta de hoje! 🎉', time: gtT(6, 30) }] },
];
GT.conversationsFor = (chipId) => chipId && chipId !== 'all' ? GT.conversations.filter((c) => c.chipId === chipId) : GT.conversations;
GT.originIcon = { ad: 'megaphone', bio: 'link-2', comment: 'message-square-reply', organic: 'search', referral: 'gift', broadcast: 'send' };

// ---------- Instagram ----------
GT.igPosts = [
  { id: 'p1', title: 'Conjunto linho — lançamento', kind: 'Reels', likes: 2140, comments: 318, reach: 41200, date: '10/09', grad: 'linear-gradient(160deg,#e3d5c8,#8f7461)' },
  { id: 'p2', title: 'Grade P ao GG por R$ 389', kind: 'Carrossel', likes: 1560, comments: 204, reach: 28900, date: '08/09', grad: 'linear-gradient(160deg,#d5cfc8,#5f5852)' },
  { id: 'p3', title: 'Bastidores da confecção', kind: 'Reels', likes: 3320, comments: 122, reach: 63500, date: '05/09', grad: 'linear-gradient(160deg,#cfd9d2,#5b7d6b)' },
  { id: 'p4', title: 'Vestido midi terracota', kind: 'Foto', likes: 980, comments: 87, reach: 15200, date: '03/09', grad: 'linear-gradient(160deg,#e2d2d2,#9e6f70)' },
  { id: 'p5', title: 'Live · aulão de grade', kind: 'Live', likes: 1210, comments: 540, reach: 22800, date: '01/09', grad: 'linear-gradient(160deg,#d8d3e0,#6e6386)' },
  { id: 'p6', title: 'Cropped canelado 4 cores', kind: 'Carrossel', likes: 1740, comments: 166, reach: 30100, date: '29/08', grad: 'linear-gradient(160deg,#d3dde3,#5f7e8f)' },
];
GT.igStats = { followers: 48200, followersDelta: 1240, reach7d: 187400, profileVisits: 6120, bioClicks: 1870, dmFromComments: 412, comments7d: 1437 };
// Automações comentário→Direct (fiel ao editor real: gatilho → resposta pública → DM isca → sequência → fim)
GT.igAutomations = [
  { id: 'a1', name: 'Tabela de atacado · post do linho', trigger: 'comment_post', postIds: ['p1', 'p2'], keywords: ['quero', 'preço', 'tabela'], excludeKeywords: ['não'], publicReplyEnabled: true,
    publicReplies: ['Te chamei no Direct! 📩', 'Mandei a tabela no seu Direct 💚', 'Olha o Direct, acabei de te enviar 😉'],
    dm: 'Oi! Você comentou no post do conjunto linho 💚 Aqui está a tabela de atacado que prometi: gt.link/mf-tabela',
    sequence: [{ after: '2 min', t: 'Ficou alguma dúvida sobre a grade? Posso montar uma pra você agora 😊' }, { after: '1 dia', t: 'Passando pra lembrar: o pedido mínimo é 1 grade (6 peças). Quer que eu reserve?' }],
    end: 'Encaminhar para uma vendedora (rodízio)', active: true, stats: { comments: 318, replied: 296, dms: 289, answered: 174, sales: 41 } },
  { id: 'a2', name: 'Live · palavra "preço"', trigger: 'comment_live', postIds: [], keywords: ['preço', 'valor'], excludeKeywords: [], publicReplyEnabled: false, publicReplies: [],
    dm: 'Oi! Você pediu o preço na live 🎥 A grade sai por R$ 389 (6 peças). Tabela completa: gt.link/mf-tabela',
    sequence: [{ after: '5 min', t: 'Quer garantir antes de acabar? Me diz as cores 🎨' }], end: 'Marcar como lead qualificado', active: true, stats: { comments: 540, replied: 0, dms: 388, answered: 201, sales: 37 } },
  { id: 'a3', name: 'Story · resposta "cupom"', trigger: 'story_reply', postIds: [], keywords: ['cupom'], excludeKeywords: [], publicReplyEnabled: false, publicReplies: [],
    dm: 'Aqui está seu cupom de primeira compra: MF10 🎁 Vale até domingo.', sequence: [], end: 'Nada — encerrar', active: false, stats: { comments: 96, replied: 0, dms: 96, answered: 44, sales: 9 } },
];
// Roteiro da ENCENAÇÃO comentário → resposta pública → Direct → vira conversa (usar em Instagram.jsx)
GT.igCommentScene = [
  { user: '@lojinha.da.bia', text: 'quero 😍', reply: 'Te chamei no Direct! 📩', convoId: 4 },
  { user: '@revenda.dani', text: 'Quero a tabela', reply: 'Mandei a tabela no seu Direct 💚' },
  { user: '@boutique.lu', text: 'preço?', reply: 'Olha o Direct, acabei de te enviar 😉' },
  { user: '@carol.modas', text: 'Lindo demais', reply: null },
  { user: '@ateliê.mari', text: 'QUERO!!', reply: 'Te chamei no Direct! 📩' },
];
GT.igActivity = [
  { time: '09:36', user: '@lojinha.da.bia', event: 'Comentou "quero 😍" no post Conjunto linho', step: 'comment' },
  { time: '09:36', user: '@lojinha.da.bia', event: 'Resposta pública: "Te chamei no Direct! 📩"', step: 'reply' },
  { time: '09:36', user: '@lojinha.da.bia', event: 'Direct enviado com a tabela', step: 'dm' },
  { time: '09:38', user: '@lojinha.da.bia', event: 'Respondeu no Direct → conversa aberta para Ana Silva', step: 'answered' },
  { time: '09:31', user: '@revenda.dani', event: 'Comentou "Quero a tabela"', step: 'comment' },
  { time: '09:31', user: '@revenda.dani', event: 'Direct enviado com a tabela', step: 'dm' },
  { time: '09:12', user: '@boutique.lu', event: 'Comentou "preço?" → Direct enviado', step: 'dm' },
  { time: '08:58', user: '@ateliê.mari', event: 'Comprou 2 grades · R$ 778', step: 'sale' },
];

// ---------- Link da bio ----------
GT.bio = {
  url: 'gt.link/modafashion', title: 'Moda Fashion', subtitle: 'Atacado de moda feminina · grade P ao GG · enviamos para todo o Brasil',
  blocks: [
    { type: 'consultora', enabled: true, label: 'Falar com consultora', rotation: ['marina', 'ana', 'julia', 'bia', 'paula'] },
    { type: 'banners', enabled: true, items: [{ t: 'Coleção Verão 26', grad: 'linear-gradient(160deg,#d9c3ad,#8c6a4f)' }, { t: 'Grade a partir de R$ 389', grad: 'linear-gradient(160deg,#c9d3cb,#5f7a6a)' }, { t: 'Frete grátis acima de 3 grades', grad: 'linear-gradient(160deg,#d6d0dc,#6b5f7a)' }] },
    { type: 'vitrine', enabled: true, catalogo: true, ig: true },
    { type: 'link', enabled: true, label: 'Catálogo em PDF', url: 'modafashion.com.br/catalogo' },
    { type: 'link', enabled: true, label: 'Loja online (atacado)', url: 'modafashion.lojagt.com' },
    { type: 'form', enabled: true, title: 'Quero receber a tabela', fields: ['Nome', 'WhatsApp', 'Cidade'] },
  ],
  social: { instagram: '@modafashion', tiktok: '@modafashion', youtube: 'Moda Fashion Atacado', facebook: 'fb.com/modafashion' },
  stats: { views7d: 6120, clicks7d: 1870, whatsapp7d: 1104, form7d: 212, sales7d: 38 },
};

// ---------- produtos / vitrine ----------
GT.sizes = ['P', 'M', 'G', 'GG'];
GT.products = [
  { id: 'pr1', sku: 'MF-1021', name: 'Conjunto linho cropped + short', category: 'Conjuntos', price: 64.9, gradePrice: 389.4, colors: ['Terracota', 'Off-white', 'Verde oliva'], stock: 84, sold: 312, revenue: 20249, grad: 'linear-gradient(160deg,#e9dccd,#c9a98a)', active: true, showcase: true },
  { id: 'pr2', sku: 'MF-1034', name: 'Vestido midi terracota', category: 'Vestidos', price: 79.9, gradePrice: 479.4, colors: ['Terracota', 'Preto'], stock: 36, sold: 248, revenue: 19815, grad: 'linear-gradient(160deg,#d8c3c3,#a8767a)', active: true, showcase: true },
  { id: 'pr3', sku: 'MF-1040', name: 'Cropped canelado', category: 'Blusas', price: 29.9, gradePrice: 179.4, colors: ['Preto', 'Branco', 'Rosa', 'Azul'], stock: 210, sold: 704, revenue: 21049, grad: 'linear-gradient(160deg,#cfd8d3,#8aa49a)', active: true, showcase: true },
  { id: 'pr4', sku: 'MF-1052', name: 'Calça wide leg alfaiataria', category: 'Calças', price: 89.9, gradePrice: 539.4, colors: ['Bege', 'Preto'], stock: 0, sold: 190, revenue: 17081, grad: 'linear-gradient(160deg,#e3e0d8,#9c968c)', active: true, showcase: false, soldOut: true },
  { id: 'pr5', sku: 'MF-1060', name: 'Saia midi plissada', category: 'Saias', price: 59.9, gradePrice: 359.4, colors: ['Off-white', 'Vinho'], stock: 58, sold: 156, revenue: 9344, grad: 'linear-gradient(160deg,#e6d5d0,#b98a8a)', active: true, showcase: true },
  { id: 'pr6', sku: 'MF-1071', name: 'Blazer leve oversized', category: 'Casacos', price: 119.9, gradePrice: 719.4, colors: ['Bege', 'Verde oliva'], stock: 22, sold: 98, revenue: 11750, grad: 'linear-gradient(160deg,#d9dfcf,#8f9c78)', active: true, showcase: true },
  { id: 'pr7', sku: 'MF-1085', name: 'Body decote V', category: 'Blusas', price: 34.9, gradePrice: 209.4, colors: ['Preto', 'Branco', 'Nude'], stock: 140, sold: 402, revenue: 14030, grad: 'linear-gradient(160deg,#e0d6e2,#9a83a3)', active: true, showcase: true },
  { id: 'pr8', sku: 'MF-1090', name: 'Short jeans destroyed', category: 'Shorts', price: 54.9, gradePrice: 329.4, colors: ['Jeans claro', 'Jeans escuro'], stock: 66, sold: 221, revenue: 12133, grad: 'linear-gradient(160deg,#cdd6df,#6f8399)', active: true, showcase: true },
  { id: 'pr9', sku: 'MF-1102', name: 'Macaquinho viscose', category: 'Macacões', price: 69.9, gradePrice: 419.4, colors: ['Estampado', 'Preto'], stock: 41, sold: 133, revenue: 9297, grad: 'linear-gradient(160deg,#e9e1c9,#b9a56e)', active: true, showcase: true },
  { id: 'pr10', sku: 'MF-1110', name: 'Camisa social feminina', category: 'Camisas', price: 74.9, gradePrice: 449.4, colors: ['Branco', 'Azul claro'], stock: 30, sold: 87, revenue: 6516, grad: 'linear-gradient(160deg,#dfe6ea,#7f98a6)', active: false, showcase: false, manualOff: true },
  { id: 'pr11', sku: 'MF-1123', name: 'Kit 3 regatas básicas', category: 'Blusas', price: 49.9, gradePrice: 299.4, colors: ['Sortido'], stock: 120, sold: 264, revenue: 13174, grad: 'linear-gradient(160deg,#dcd3e6,#7f6f9a)', active: true, showcase: true, bait: true },
  { id: 'pr12', sku: 'MF-1130', name: 'Vestido longo festa', category: 'Vestidos', price: 149.9, gradePrice: 899.4, colors: ['Preto', 'Verde esmeralda'], stock: 12, sold: 44, revenue: 6596, grad: 'linear-gradient(160deg,#cfdad2,#4f7a66)', active: true, showcase: true },
];
GT.categories = ['Conjuntos', 'Vestidos', 'Blusas', 'Calças', 'Saias', 'Casacos', 'Shorts', 'Macacões', 'Camisas'];
GT.stores = [
  { id: 's1', name: 'Moda Fashion Atacado', slug: 'modafashion', url: 'modafashion.lojagt.com', mode: 'atacado', minMode: 'grade', minLabel: 'Pedido mínimo: 1 grade (P ao GG)', rotation: ['marina', 'ana', 'julia', 'bia', 'paula'], social: { instagram: '@modafashion', tiktok: '@modafashion', youtube: 'Moda Fashion Atacado' }, visits7d: 4280, carts7d: 612, orders7d: 138 },
  { id: 's2', name: 'MF Outlet · Varejo', slug: 'mf-outlet', url: 'mf-outlet.lojagt.com', mode: 'varejo', minMode: 'unit', minLabel: 'Sem pedido mínimo', rotation: ['paula'], social: { instagram: '@mf.outlet' }, visits7d: 1130, carts7d: 96, orders7d: 22 },
];
GT.ranking = {
  mostSold: ['pr3', 'pr7', 'pr1', 'pr11', 'pr2', 'pr8'],
  repurchase: [{ id: 'pr3', rate: 68 }, { id: 'pr7', rate: 61 }, { id: 'pr1', rate: 54 }, { id: 'pr11', rate: 49 }],
  bait: ['pr11', 'pr3'],
  bySeller: [{ sellerId: 'marina', pieces: 2410, revenue: 198000 }, { sellerId: 'ana', pieces: 2120, revenue: 176000 }, { sellerId: 'julia', pieces: 1690, revenue: 142000 }, { sellerId: 'bia', pieces: 1240, revenue: 104000 }, { sellerId: 'paula', pieces: 1010, revenue: 86000 }],
};

// ---------- rastreamento ----------
// Cada link /r/<token> → destino (número/pool com rodízio) → mede clique → conversa → venda.
GT.trackingLinks = [
  { id: 'l1', name: 'Anúncio · Coleção Verão', token: 'r/verao26', dest: 'pool', pool: ['v1', 'v2'], utm: 'meta_ads', clicks: 4820, convos: 1610, sales: 118, revenue: 45900 },
  { id: 'l2', name: 'Link da bio', token: 'r/bio', dest: 'pool', pool: ['v1', 'v2', 'v3'], utm: 'instagram_bio', clicks: 1870, convos: 1104, sales: 38, revenue: 14780 },
  { id: 'l3', name: 'Story · cupom MF10', token: 'r/story-mf10', dest: 'chip', pool: ['v2'], utm: 'instagram_story', clicks: 960, convos: 402, sales: 21, revenue: 8170 },
  { id: 'l4', name: 'Indicação · Patrícia Modas', token: 'r/ind-patricia', dest: 'chip', pool: ['v1'], utm: 'indicacao', clicks: 112, convos: 64, sales: 9, revenue: 3500 },
  { id: 'l5', name: 'YouTube · descrição', token: 'r/yt', dest: 'pool', pool: ['v3'], utm: 'youtube', clicks: 340, convos: 121, sales: 6, revenue: 2330 },
];
GT.attribution = { adRevenue: 178500, bioRevenue: 14780, commentRevenue: 22400, organicRevenue: 361000, referralRevenue: 18900, broadcastRevenue: 24420 };

// ---------- anúncios (Meta) ----------
// chipShort = os 4 dígitos do número na campanha (é assim que a campanha casa com o chip).
GT.adCampaigns = [
  { id: 'c1', name: '[MF · 4321] Coleção Verão · Carrossel', chipShort: '4321', chipId: 'v1', status: 'Ativa', spend: 8200, msgs: 1610, leads: 720, sales: 118, revenue: 45900 },
  { id: 'c2', name: '[MF · 7788] Grade Atacado · Vídeo 15s', chipShort: '7788', chipId: 'v2', status: 'Ativa', spend: 6900, msgs: 1240, leads: 540, sales: 91, revenue: 35100 },
  { id: 'c3', name: '[MF · 2255] Depoimento Lojista · Reels', chipShort: '2255', chipId: 'v3', status: 'Ativa', spend: 5400, msgs: 860, leads: 350, sales: 52, revenue: 20200 },
  { id: 'c4', name: '[MF · 4321] Remarketing · Carrinho', chipShort: '4321', chipId: 'v1', status: 'Pausada', spend: 4300, msgs: 500, leads: 240, sales: 51, revenue: 19300 },
];
GT.ads = { spend: 24800, msgs: 4210, cpm: 2.48, leads: 1850, orders: 312, cpo: 33.4, revenue: 178500, roas: 7.2 };

// ---------- disparos ----------
GT.templates = [
  { id: 't1', name: 'lancamento_colecao', category: 'Marketing', status: 'Aprovado', lang: 'pt_BR', body: 'Oi {{1}}! Saiu a coleção nova da Moda Fashion 💚 Quer que eu separe a sua grade antes de abrir pro público?', buttons: ['Quero ver', 'Depois'] },
  { id: 't2', name: 'reposicao_grade', category: 'Utilidade', status: 'Aprovado', lang: 'pt_BR', body: 'Oi {{1}}, a grade {{2}} que você levou voltou pro estoque. Reservo pra você?', buttons: ['Reservar', 'Não, obrigada'] },
  { id: 't3', name: 'pos_venda_troca', category: 'Utilidade', status: 'Aprovado', lang: 'pt_BR', body: 'Olá {{1}}, seu pedido {{2}} foi entregue. Precisa de troca ou ajuste?', buttons: ['Está tudo certo', 'Preciso de troca'] },
  { id: 't4', name: 'black_friday_atacado', category: 'Marketing', status: 'Em análise', lang: 'pt_BR', body: 'Moda Fashion na Black: 3 grades = frete grátis 🚚 Válido até domingo.', buttons: ['Aproveitar'] },
];
GT.audiences = [
  { id: 'aud1', name: 'Clientes Ouro · sem compra há 30 dias', size: 184 },
  { id: 'aud2', name: 'Leads qualificados · nunca compraram', size: 1206 },
  { id: 'aud3', name: 'Compraram cropped canelado', size: 412 },
  { id: 'aud4', name: 'Todos os clientes ativos', size: 3280 },
];
GT.campaigns = [
  { id: 'cp1', name: 'Lançamento Coleção Verão', templateId: 't1', audienceId: 'aud4', status: 'Enviada', date: '10/09 08:00', sent: 3280, delivered: 3204, read: 2610, replied: 812, sales: 96, revenue: 37400, channel: 'whatsapp' },
  { id: 'cp2', name: 'Reativação Ouro 30d', templateId: 't2', audienceId: 'aud1', status: 'Enviando', date: 'hoje 09:00', sent: 121, delivered: 118, read: 74, replied: 23, sales: 4, revenue: 1560, channel: 'whatsapp' },
  { id: 'cp3', name: 'Pós-venda entregas da semana', templateId: 't3', audienceId: 'aud3', status: 'Agendada', date: 'amanhã 10:00', sent: 0, delivered: 0, read: 0, replied: 0, sales: 0, revenue: 0, channel: 'whatsapp' },
  { id: 'cp4', name: 'Aviso SMS · janela fechada', templateId: null, audienceId: 'aud2', status: 'Enviada', date: '09/09 18:00', sent: 640, delivered: 631, read: null, replied: 58, sales: 7, revenue: 2720, channel: 'sms' },
];
// Fluxo (canvas): nós e arestas. Botão de template RAMIFICA; "clicou?" ramifica; janela fechada → SMS.
GT.flows = [
  { id: 'f1', name: 'Lançamento com follow-up', status: 'Ativo', runs: 3280, inProgress: 412, done: 2868, sales: 96,
    nodes: [
      { id: 'n1', type: 'send', label: 'Template lancamento_colecao', x: 40, y: 120 },
      { id: 'n2', type: 'branch', label: 'Botão clicado?', x: 300, y: 120, options: ['Quero ver', 'Depois', 'Sem resposta'] },
      { id: 'n3', type: 'send', label: 'Catálogo + link da grade', x: 560, y: 30 },
      { id: 'n4', type: 'wait', label: 'Espera 2 dias', x: 560, y: 120 },
      { id: 'n5', type: 'send', label: 'Lembrete (texto livre — janela aberta)', x: 800, y: 120 },
      { id: 'n6', type: 'window', label: 'Janela fechada? → SMS', x: 560, y: 220 },
      { id: 'n7', type: 'action', label: 'Marcar lead quente · avisar vendedora', x: 800, y: 30 },
    ],
    edges: [['n1', 'n2'], ['n2', 'n3', 'Quero ver'], ['n2', 'n4', 'Depois'], ['n2', 'n6', 'Sem resposta'], ['n4', 'n5'], ['n3', 'n7']] },
  { id: 'f2', name: 'Recompra 21 dias', status: 'Ativo', runs: 1840, inProgress: 233, done: 1607, sales: 61, nodes: [], edges: [] },
  { id: 'f3', name: 'Pós-venda + avaliação', status: 'Pausado', runs: 920, inProgress: 0, done: 920, sales: 12, nodes: [], edges: [] },
];
GT.credits = { balance: 12480, monthUsed: 8210, perMsg: 0.32, sms: { balance: 3100, perMsg: 0.1 } };

// ---------- relatórios automáticos ----------
GT.reports = [
  { id: 'rp1', name: 'Relatório semanal da empresa', when: 'Sexta · 08:00', to: 'WhatsApp do dono', kind: 'texto', active: true,
    preview: ['📊 *Moda Fashion — semana 08 a 12/09*', '', 'Faturamento: R$ 167,6 mil (+9% vs semana anterior)', 'Pedidos: 342 · Ticket: R$ 490', 'Conversas novas: 1.284 · Qualificadas: 43%', '', '🏆 Marina R$ 47,5 mil · Ana R$ 41,2 mil · Júlia R$ 33,8 mil', '', '📣 Anúncios: R$ 6,1 mil investidos → R$ 44,3 mil atribuídos (7,2x)', '🔗 Bio: 1.870 cliques → 38 vendas'] },
  { id: 'rp2', name: 'Relatório do time de vendas', when: 'Sexta · 08:05', to: 'Gestora', kind: 'texto', active: true,
    preview: ['👥 *Time de vendas — semana*', '', 'Tempo até a 1ª resposta (mediana): 4 min', '🔴 Leads sem resposta > 1h: 6 (Vendas 3)', 'Conversas por número: 4321 → 310 · 7788 → 244 · 2255 → 98', '', 'Saudações e ausências não contam como resposta.'] },
  { id: 'rp3', name: 'Relatório de redes sociais', when: 'Segunda · 08:00', to: 'WhatsApp do dono', kind: 'texto', active: true,
    preview: ['📱 *Instagram @modafashion — semana*', '', 'Seguidores: 48.200 (+1.240)', 'Alcance: 187 mil · Visitas ao perfil: 6.120', 'Comentários → Direct: 412 · Vendas: 87', '', 'Top post: Bastidores da confecção (63,5 mil alcance)', 'UF com mais seguidoras E vendas: CE, SP, BA'] },
];

// ---------- indicações ----------
GT.referral = { link: 'gt.link/mf-indica', rewardsMode: 'company', reward: 'R$ 50 de crédito por indicada que comprar 1 grade', rewardIndicated: '10% na primeira compra', total: 212, converted: 64, revenue: 18900,
  top: [{ name: 'Patrícia Modas', refs: 9, converted: 4 }, { name: 'Fernanda Boutique', refs: 7, converted: 3 }, { name: 'Camila Atacado', refs: 5, converted: 2 }] };

// ---------- integrações / API ----------
GT.integrations = { importacao: { name: 'Importação de clientes e pedidos', status: 'Atualizado há 4 min', items: ['Clientes', 'Pedidos', 'Produtos', 'Vendedoras'] }, meta: { status: 'Conectado', assets: ['WhatsApp Business (4 números)', 'Instagram @modafashion', 'Página Moda Fashion'] }, api: { key: 'gt_live_••••••••••••7f3a', calls30d: 18420, docs: 'docs-api.growthtime.com.br' } };

// ---------- dashboard / faturamento ----------
GT.kpis = {
  newClients: 1284, grossSales: 620000, netSales: 596400, refunds: 23600, ticket: 483, cpa: 38.4,
  funnel: { messages: 12480, qualified: 1850, qualifiedRate: 42, newQualified: 1642, unidentified: 208, orders: 312, conversion: 16.8, newOrders: 241, baseOrders: 71, newSales: 486000, baseSales: 134000 },
  byChannel: [{ label: 'Anúncios (CTWA)', value: 178500 }, { label: 'Orgânico / base', value: 361000 }, { label: 'Disparos', value: 24420 }, { label: 'Comentários → Direct', value: 22400 }, { label: 'Indicações', value: 18900 }, { label: 'Link da bio', value: 14780 }],
};

// ---------- agente IA (copiloto) ----------
GT.aiAgent = { mode: 'copiloto', enabled: true, suggestion: 'Patrícia já levou 3 grades este mês e perguntou de cores — sugiro oferecer a grade mista (3 cores) com frete grátis acima de 3 grades.', handled7d: 1206, avgFirstReply: '4 min' };

window.GT = GT;
