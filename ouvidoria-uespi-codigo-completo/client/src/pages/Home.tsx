/*
  Ouvidoria UESPI - Versão Profissional Enterprise
  Sistema de manifestações, protocolos, transparência e atendimento
  Sem login obrigatório na entrada. Login opcional no menu.
  Validações robustas, animações profissionais, chat inteligente, filtros avançados.
*/

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Accessibility,
  AlertCircle,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  Filter,
  GraduationCap,
  HeartHandshake,
  HelpCircle,
  Home as HomeIcon,
  Info,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Newspaper,
  Phone,
  PieChart,
  QrCode,
  Search,
  Send,
  ShieldAlert,
  Star,
  ThumbsUp,
  Trash2,
  User,
  Users,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";

type SectionKey =
  | "inicio"
  | "nova"
  | "protocolo"
  | "faq"
  | "transparencia"
  | "noticias"
  | "avaliacao"
  | "mapa"
  | "estudantil"
  | "professores"
  | "acessibilidade"
  | "assedio"
  | "psicologico"
  | "academico"
  | "documentos"
  | "chat"
  | "reitoria"
  | "eventos"
  | "comunidade"
  | "ajuda";

type Protocol = {
  id: string;
  tipo: string;
  assunto: string;
  data: string;
  status: "Recebida" | "Em análise" | "Em andamento" | "Respondida";
  descricao: string;
  sigilosa: boolean;
  email?: string;
};

type ChatMessage = {
  from: "bot" | "user";
  text: string;
  time: string;
  id: string;
};

type User = {
  nome: string;
  email: string;
  vinculo: string;
  campus: string;
  avatar: string;
};

type Toast = {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
};

const heroImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663646302662/TzsR5PGskGgeZtQAwGoa7p/ouvidoria-uespi-hero-DsfhUdX7M77EDPSVvaK3L5.webp";
const campusImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663646302662/TzsR5PGskGgeZtQAwGoa7p/ouvidoria-uespi-campus-ghoFbdTx6gkHAEau4j3GxR.webp";
const chatImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663646302662/TzsR5PGskGgeZtQAwGoa7p/ouvidoria-uespi-chat-PTLfHLDBioGmcMLAJCgUR5.webp";
const transparencyImage = "https://d2xsxph8kpxj0f.cloudfront.net/310519663646302662/TzsR5PGskGgeZtQAwGoa7p/ouvidoria-uespi-transparencia-gGxsgZJgHcbt3wmBfNthoa.webp";

const menuItems: Array<{ key: SectionKey; label: string; icon: typeof HomeIcon }> = [
  { key: "inicio", label: "Início", icon: HomeIcon },
  { key: "nova", label: "Nova Manifestação", icon: ClipboardList },
  { key: "protocolo", label: "Acompanhar Protocolo", icon: Search },
  { key: "faq", label: "Perguntas Frequentes", icon: HelpCircle },
  { key: "transparencia", label: "Transparência", icon: PieChart },
  { key: "noticias", label: "Notícias", icon: Newspaper },
  { key: "avaliacao", label: "Avaliação do Atendimento", icon: Star },
  { key: "mapa", label: "Mapa dos Campi", icon: MapPin },
  { key: "estudantil", label: "Ouvidoria Estudantil", icon: GraduationCap },
  { key: "professores", label: "Ouvidoria dos Professores", icon: Users },
  { key: "acessibilidade", label: "Inclusão e Acessibilidade", icon: Accessibility },
  { key: "assedio", label: "Combate ao Bullying e Assédio", icon: ShieldAlert },
  { key: "psicologico", label: "Atendimento Psicológico", icon: HeartHandshake },
  { key: "academico", label: "Suporte Acadêmico", icon: BookOpen },
  { key: "documentos", label: "Documentos", icon: FileText },
  { key: "chat", label: "Chat Online", icon: MessageCircle },
  { key: "reitoria", label: "Fale com a Reitoria", icon: Mail },
  { key: "eventos", label: "Eventos e Campanhas", icon: CalendarDays },
  { key: "comunidade", label: "Comunidade UESPI", icon: Building2 },
  { key: "ajuda", label: "Central de Ajuda", icon: Info },
];

const quickCards = [
  { key: "nova" as SectionKey, title: "Fazer uma Manifestação", desc: "Registre sua solicitação", icon: MessageCircle, color: "blue" },
  { key: "protocolo" as SectionKey, title: "Acompanhar Protocolo", desc: "Consulte o andamento", icon: Search, color: "green" },
  { key: "faq" as SectionKey, title: "Perguntas Frequentes", desc: "Tire suas dúvidas", icon: HelpCircle, color: "yellow" },
  { key: "transparencia" as SectionKey, title: "Transparência", desc: "Relatórios e estatísticas", icon: PieChart, color: "purple" },
];

const manifestationTypes = [
  { tipo: "Denúncia", desc: "Comunique uma irregularidade ou ato ilícito.", icon: ShieldAlert, color: "red" },
  { tipo: "Reclamação", desc: "Manifeste sua insatisfação com um serviço.", icon: ThumbsUp, color: "orange" },
  { tipo: "Elogio", desc: "Expresse sua satisfação com um serviço.", icon: ThumbsUp, color: "green" },
  { tipo: "Sugestão", desc: "Envie uma ideia ou proposta de melhoria.", icon: MessageCircle, color: "yellow" },
  { tipo: "Solicitação", desc: "Peça uma providência ou informação.", icon: HelpCircle, color: "blue" },
];

const notices = [
  { date: "21/05/2024", title: "Manutenção programada no sistema SIGAA", type: "Sistema" },
  { date: "17/05/2024", title: "Campanha de combate ao assédio e bullying", type: "Campanha" },
  { date: "10/05/2024", title: "Semana da Acessibilidade na UESPI", type: "Evento" },
];

const faqItems = [
  { q: "Como registrar uma manifestação?", a: "Clique em Nova Manifestação, escolha o tipo, informe seus dados e descreva a situação com detalhes. O sistema gera um protocolo automaticamente." },
  { q: "Posso fazer uma denúncia sigilosa?", a: "Sim. Ao preencher o formulário, marque a opção de sigilo. Os dados serão tratados com confidencialidade pela Ouvidoria." },
  { q: "Como acompanho meu protocolo?", a: "Acesse Acompanhar Protocolo e informe o número gerado após o envio. Também é possível consultar os protocolos recentes na tela inicial." },
  { q: "Qual é o prazo médio de resposta?", a: "O painel apresenta prazo médio de 6,2 dias. Casos complexos podem exigir análise complementar, sempre com atualização de status." },
  { q: "Minha manifestação é confidencial?", a: "Você pode solicitar sigilo ao registrar. Neste caso, apenas os responsáveis pela Ouvidoria terão acesso às suas informações." },
  { q: "Posso acompanhar manifestações de terceiros?", a: "Não. Cada protocolo é acessível apenas pelo usuário que o registrou, garantindo privacidade e segurança dos dados." },
];

const campusData = [
  { nome: "Teresina - Poeta Torquato Neto", endereco: "Campus Universitário, Teresina, PI", telefone: "(86) 3213-7942", email: "ouvidoria@uespi.br" },
  { nome: "Parnaíba", endereco: "Av. Getúlio Vargas, Parnaíba, PI", telefone: "(86) 3323-1234", email: "parnaiba@uespi.br" },
  { nome: "Picos", endereco: "Rua Cícero Duarte, Picos, PI", telefone: "(89) 3422-5678", email: "picos@uespi.br" },
  { nome: "Floriano", endereco: "Rua Getúlio Vargas, Floriano, PI", telefone: "(89) 3532-9101", email: "floriano@uespi.br" },
  { nome: "Corrente", endereco: "Av. Principal, Corrente, PI", telefone: "(89) 3632-3456", email: "corrente@uespi.br" },
  { nome: "São Raimundo Nonato", endereco: "Campus Universitário, São Raimundo Nonato, PI", telefone: "(89) 3732-7890", email: "srnonato@uespi.br" },
];

const newsData = [
  { date: "21/05/2024", title: "Manutenção programada no sistema SIGAA", desc: "O sistema SIGAA passará por manutenção programada no próximo fim de semana. Não será possível acessar o sistema entre 22h de sexta e 6h de segunda.", type: "Sistema" },
  { date: "17/05/2024", title: "Campanha de combate ao assédio e bullying", desc: "A Ouvidoria lança campanha institucional com foco em conscientização e prevenção de assédio moral, sexual e bullying no ambiente acadêmico.", type: "Campanha" },
  { date: "10/05/2024", title: "Semana da Acessibilidade na UESPI", desc: "Evento de uma semana com palestras, oficinas e atividades sobre inclusão e acessibilidade para toda a comunidade acadêmica.", type: "Evento" },
  { date: "05/05/2024", title: "Ouvidoria amplia canais de atendimento", desc: "Novo chat online 24h e expansão do horário de atendimento presencial. Consulte os novos horários em Canais de Atendimento.", type: "Atendimento" },
];

const initialProtocols: Protocol[] = [
  {
    id: "2024.05.000123",
    tipo: "Reclamação",
    assunto: "Infraestrutura - Ar condicionado",
    data: "20/05/2024",
    status: "Em andamento",
    descricao: "Solicitação recebida e encaminhada ao setor responsável.",
    sigilosa: false,
    email: "demo@uespi.br",
  },
];

function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function makeProtocolId() {
  const date = new Date();
  const seq = Math.floor(100000 + Math.random() * 899999);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${seq}`;
}

function getAvatarColor(name: string) {
  const colors = ["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function exportToCSV(data: Protocol[]) {
  const headers = ["Protocolo", "Tipo", "Assunto", "Data", "Status", "Sigilosa"];
  const rows = data.map((p) => [p.id, p.tipo, p.assunto, p.data, p.status, p.sigilosa ? "Sim" : "Não"]);
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `protocolos-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const [active, setActive] = useState<SectionKey>("inicio");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("Solicitação");
  const [protocols, setProtocols] = useState<Protocol[]>(() => {
    const saved = localStorage.getItem("ouvidoria-uespi-protocolos");
    return saved ? JSON.parse(saved) : initialProtocols;
  });
  const [lookup, setLookup] = useState("");
  const [lookupResult, setLookupResult] = useState<Protocol | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("ouvidoria-uespi-chat");
    return saved
      ? JSON.parse(saved)
      : [{ from: "bot", text: "Olá! Sou o atendimento rápido da Ouvidoria UESPI. Posso ajudar com protocolo, denúncia, prazos, acessibilidade ou contato.", time: nowTime(), id: "1" }];
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("ouvidoria-uespi-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [filterType, setFilterType] = useState<string>("Todos");
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    localStorage.setItem("ouvidoria-uespi-protocolos", JSON.stringify(protocols));
  }, [protocols]);

  useEffect(() => {
    localStorage.setItem("ouvidoria-uespi-chat", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatOpen]);

  const filteredMenu = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return menuItems;
    return menuItems.filter((item) => item.label.toLowerCase().includes(term));
  }, [search]);

  const filteredProtocols = useMemo(() => {
    let result = protocols;
    if (filterType !== "Todos") result = result.filter((p) => p.tipo === filterType);
    if (filterStatus !== "Todos") result = result.filter((p) => p.status === filterStatus);
    return result;
  }, [protocols, filterType, filterStatus]);

  const addToast = (type: Toast["type"], message: string) => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const goTo = (key: SectionKey) => {
    setActive(key);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") || "Usuário");
    const email = String(form.get("email") || "");
    const vinculo = String(form.get("vinculo") || "Estudante");
    const campus = String(form.get("campus") || "Teresina");

    if (!validateEmail(email)) {
      addToast("error", "E-mail inválido. Verifique e tente novamente.");
      return;
    }

    const newUser: User = { nome, email, vinculo, campus, avatar: nome.charAt(0).toUpperCase() };
    setUser(newUser);
    localStorage.setItem("ouvidoria-uespi-user", JSON.stringify(newUser));
    setShowLoginModal(false);
    addToast("success", `Bem-vindo(a), ${nome}! Sua conta foi criada com sucesso.`);
    setChatMessages((prev) => [
      ...prev,
      { from: "bot", text: `Bem-vindo(a), ${nome}! Agora você pode acompanhar seus protocolos personalizados.`, time: nowTime(), id: Math.random().toString() },
    ]);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("ouvidoria-uespi-user");
    addToast("info", "Você foi desconectado.");
  };

  const submitManifestation = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const form = new FormData(event.currentTarget);
    const assunto = String(form.get("assunto") || "Manifestação");
    const descricao = String(form.get("descricao") || "");
    const email = String(form.get("email") || "");

    if (!validateEmail(email)) {
      addToast("error", "E-mail inválido. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const protocol: Protocol = {
        id: makeProtocolId(),
        tipo: selectedType,
        assunto,
        data: new Date().toLocaleDateString("pt-BR"),
        status: "Recebida",
        descricao,
        sigilosa: form.get("sigilosa") === "on",
        email,
      };
      setProtocols((prev) => [protocol, ...prev]);
      setLookup(protocol.id);
      setLookupResult(protocol);
      event.currentTarget.reset();
      setSelectedType("Solicitação");
      setLoading(false);
      addToast("success", `Manifestação registrada! Protocolo: ${protocol.id}`);
      setChatMessages((prev) => [
        ...prev,
        { from: "bot", text: `Manifestação registrada com sucesso! Seu protocolo é ${protocol.id}. Você pode acompanhar o andamento na área de protocolos.`, time: nowTime(), id: Math.random().toString() },
      ]);
      goTo("protocolo");
    }, 800);
  };

  const searchProtocol = (event?: React.FormEvent) => {
    event?.preventDefault();
    if (!lookup.trim()) {
      addToast("warning", "Digite um número de protocolo.");
      return;
    }
    const found = protocols.find((item) => item.id.toLowerCase() === lookup.trim().toLowerCase());
    if (found) {
      setLookupResult(found);
      addToast("success", "Protocolo encontrado!");
    } else {
      setLookupResult(null);
      addToast("error", "Protocolo não encontrado.");
    }
  };

  const answerFor = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes("protocolo") || lower.includes("acompanhar")) return "Para acompanhar, acesse Acompanhar Protocolo e digite o número gerado. Se preferir, use o protocolo de exemplo: 2024.05.000123.";
    if (lower.includes("denún") || lower.includes("assedio") || lower.includes("assédio") || lower.includes("bullying")) return "Para denúncias, escolha o tipo Denúncia em Nova Manifestação. Você pode marcar sigilo para proteger suas informações.";
    if (lower.includes("prazo") || lower.includes("resposta")) return "O prazo médio atual é de 6,2 dias. O status pode aparecer como Recebida, Em análise, Em andamento ou Respondida.";
    if (lower.includes("acessibilidade") || lower.includes("inclusão")) return "A área Inclusão e Acessibilidade reúne orientação sobre atendimento prioritário, adaptação de materiais e suporte nos campi.";
    if (lower.includes("contato") || lower.includes("email") || lower.includes("telefone")) return "Canais de atendimento: ouvidoria@uespi.br, telefone (86) 3213-7942, de segunda a sexta, das 8h às 17h.";
    if (lower.includes("documento")) return "Na área Documentos você encontra carta de serviços, relatório anual, guia do usuário e política de privacidade.";
    if (lower.includes("oi") || lower.includes("olá")) return "Olá! Como posso ajudá-lo hoje? Posso orientar sobre protocolos, denúncias, prazos, acessibilidade ou canais de contato.";
    return "Entendi sua dúvida. Você pode registrar uma manifestação, consultar protocolo, acessar FAQ ou falar com a Ouvidoria pelos canais oficiais. Quer que eu direcione você para alguma dessas opções?";
  };

  const sendChat = (text = chatText) => {
    const clean = text.trim();
    if (!clean) return;
    setChatMessages((prev) => [...prev, { from: "user", text: clean, time: nowTime(), id: Math.random().toString() }]);
    setChatText("");
    window.setTimeout(() => {
      setChatMessages((prev) => [...prev, { from: "bot", text: answerFor(clean), time: nowTime(), id: Math.random().toString() }]);
    }, 600);
  };

  const updateStatus = (id: string) => {
    setProtocols((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const statuses: Array<"Recebida" | "Em análise" | "Em andamento" | "Respondida"> = ["Recebida", "Em análise", "Em andamento", "Respondida"];
          const currentIndex = statuses.indexOf(item.status);
          return { ...item, status: statuses[(currentIndex + 1) % statuses.length] };
        }
        return item;
      }),
    );
    addToast("info", "Status atualizado.");
  };

  const deleteProtocol = (id: string) => {
    setProtocols((prev) => prev.filter((p) => p.id !== id));
    addToast("success", "Protocolo removido.");
  };

  const clearChat = () => {
    setChatMessages([{ from: "bot", text: "Histórico do chat foi limpo. Como posso ajudá-lo?", time: nowTime(), id: "1" }]);
    addToast("info", "Histórico do chat limpo.");
  };

  return (
    <div className="site-shell">
      <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`} aria-label="Menu principal">
        <div className="brand-block">
          <div className="brand-crest" aria-hidden="true">U</div>
          <div>
            <strong>OUVIDORIA</strong>
            <span>UESPI</span>
          </div>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu"><X size={18} /></button>
        </div>

        <nav className="side-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.key} className={active === item.key ? "active" : ""} onClick={() => goTo(item.key)}>
                <Icon size={17} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-actions">
          {user ? (
            <>
              <div className="user-info">
                <span className="avatar" style={{ backgroundColor: getAvatarColor(user.nome) }}>{user.avatar}</span>
                <div>
                  <strong>{user.nome}</strong>
                  <small>{user.vinculo}</small>
                </div>
              </div>
              <button className="logout-button" onClick={handleLogout}><LogOut size={16} /> Sair</button>
            </>
          ) : (
            <button className="login-button" onClick={() => setShowLoginModal(true)}><User size={16} /> Fazer login</button>
          )}
        </div>
      </aside>

      {sidebarOpen && <button className="overlay" aria-label="Fechar menu" onClick={() => setSidebarOpen(false)} />}

      <div className="main-shell">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu"><Menu size={23} /></button>
          <form className="global-search" onSubmit={(event) => event.preventDefault()}>
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar no sistema..." aria-label="Buscar no sistema" />
            {search && (
              <div className="search-results">
                {filteredMenu.length ? filteredMenu.map((item) => <button key={item.key} onClick={() => goTo(item.key)}>{item.label}</button>) : <span>Nenhuma opção encontrada.</span>}
              </div>
            )}
          </form>
          <div className="top-actions">
            <button className="icon-action" aria-label="Notificações"><Bell size={19} /><span className="badge">3</span></button>
            <button className="icon-action" aria-label="Modo contraste" onClick={() => document.body.classList.toggle("high-contrast")}><Moon size={18} /></button>
            <button className="icon-action" aria-label="Acessibilidade" onClick={() => goTo("acessibilidade")}><Accessibility size={19} /></button>
            {!user && <button className="profile-button" onClick={() => setShowLoginModal(true)}><User size={18} /> Entrar</button>}
            {user && (
              <button className="profile-button">
                <span className="avatar" style={{ backgroundColor: getAvatarColor(user.nome) }}>{user.avatar}</span>
                <span><strong>{user.nome}</strong><small>{user.vinculo}</small></span>
                <ChevronDown size={15} />
              </button>
            )}
          </div>
        </header>

        <main className="content-area">
          {active === "inicio" && (
            <section className="dashboard-grid animate-in">
              <div className="left-flow">
                <div className="welcome-row">
                  <div>
                    <h1>Bem-vindo à Ouvidoria UESPI! <span aria-hidden="true">👋</span></h1>
                    <p>Canal de diálogo entre você e nossa instituição. Registre manifestações, acompanhe protocolos e contribua para melhorias.</p>
                  </div>
                </div>

                <div className="quick-grid">
                  {quickCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <button key={card.title} className="quick-card" onClick={() => goTo(card.key)}>
                        <span className={`service-icon ${card.color}`}><Icon size={27} /></span>
                        <strong>{card.title}</strong>
                        <small>{card.desc}</small>
                      </button>
                    );
                  })}
                </div>

                <div className="hero-band">
                  <div className="hero-illustration" style={{ backgroundImage: `linear-gradient(90deg, rgba(0,61,142,.92), rgba(0,61,142,.45)), url(${heroImage})` }}>
                    <h2>Sua voz transforma a <span>UESPI!</span></h2>
                  </div>
                  <div className="hero-copy">
                    <p>Participe, contribua e ajude a construir uma universidade cada vez melhor para todos.</p>
                    <button onClick={() => goTo("nova")}>Começar agora</button>
                  </div>
                </div>

                <section className="panel-card">
                  <div className="section-heading"><h2>Tipos de Manifestação</h2><button onClick={() => goTo("nova")}>Ver todos</button></div>
                  <div className="type-grid">
                    {manifestationTypes.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.tipo} className="type-card" onClick={() => { setSelectedType(item.tipo); goTo("nova"); }}>
                          <span className={`service-icon ${item.color}`}><Icon size={18} /></span>
                          <strong>{item.tipo}</strong>
                          <small>{item.desc}</small>
                        </button>
                      );
                    })}
                  </div>
                </section>

                <div className="bottom-grid">
                  <section className="panel-card protocols-card">
                    <div className="section-heading"><h2>Protocolos Recentes</h2><button onClick={() => goTo("protocolo")}>Ver todos</button></div>
                    <div className="table-wrap">
                      <table>
                        <thead><tr><th>Protocolo</th><th>Tipo</th><th>Assunto</th><th>Data</th><th>Status</th></tr></thead>
                        <tbody>{protocols.slice(0, 3).map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.tipo}</td><td>{item.assunto}</td><td>{item.data}</td><td><span className="status-pill">{item.status}</span></td></tr>)}</tbody>
                      </table>
                    </div>
                  </section>
                  <section className="panel-card real-time-card">
                    <h2>Atendimento em tempo real</h2>
                    <p>Fale com nossa equipe pelo chat online. Horário: Segunda a Sexta, 8h às 17h.</p>
                    <button onClick={() => { setChatOpen(true); goTo("chat"); }}><MessageCircle size={18} /> Iniciar Chat</button>
                  </section>
                </div>
              </div>

              <aside className="right-flow">
                <section className="panel-card notices-card">
                  <div className="section-heading"><h2>Avisos e Comunicados</h2><button onClick={() => goTo("noticias")}>Ver todos</button></div>
                  {notices.map((notice, index) => <article key={notice.title} className="notice-item"><span className={`notice-dot n${index}`} /><div><small>{notice.date}</small><strong>{notice.title}</strong></div></article>)}
                </section>
                <TransparencyNumbers compact />
                <ContactCard />
                <SocialCard />
              </aside>
            </section>
          )}

          {active === "nova" && <ManifestationPage selectedType={selectedType} setSelectedType={setSelectedType} onSubmit={submitManifestation} loading={loading} />}
          {active === "protocolo" && <ProtocolPage protocols={filteredProtocols} lookup={lookup} setLookup={setLookup} lookupResult={lookupResult} searchProtocol={searchProtocol} updateStatus={updateStatus} deleteProtocol={deleteProtocol} filterType={filterType} setFilterType={setFilterType} filterStatus={filterStatus} setFilterStatus={setFilterStatus} exportData={() => exportToCSV(filteredProtocols)} />}
          {active === "faq" && <FaqPage />}
          {active === "transparencia" && <TransparencyPage />}
          {active === "noticias" && <NewsPage />}
          {active === "avaliacao" && <EvaluationPage addToast={addToast} />}
          {active === "mapa" && <CampiPage />}
          {active === "chat" && <ChatPage messages={chatMessages} text={chatText} setText={setChatText} sendChat={sendChat} endRef={chatEndRef} clearChat={clearChat} />}
          {!["inicio", "nova", "protocolo", "faq", "transparencia", "noticias", "avaliacao", "mapa", "chat"].includes(active) && <GenericPage active={active} goTo={goTo} />}
        </main>

        <footer className="footer-bar">
          <span>© 2024 Universidade Estadual do Piauí - UESPI</span>
          <nav><button onClick={() => alert("LGPD e Privacidade: página demonstrativa.")}>LGPD e Privacidade</button><button onClick={() => goTo("acessibilidade")}>Acessibilidade</button><button onClick={() => alert("Termos de Uso: conteúdo demonstrativo.")}>Termos de Uso</button></nav>
        </footer>
      </div>

      <button className="floating-chat-button" onClick={() => setChatOpen((open) => !open)} aria-label="Abrir chat online"><MessageCircle size={24} /></button>
      {chatOpen && <FloatingChat messages={chatMessages} text={chatText} setText={setChatText} sendChat={sendChat} close={() => setChatOpen(false)} endRef={chatEndRef} clearChat={clearChat} />}

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

function LoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: (event: React.FormEvent<HTMLFormElement>) => void }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        <form className="login-form" onSubmit={onLogin}>
          {mode === "login" ? (
            <>
              <h2>Bem-vindo de volta</h2>
              <label>E-mail<input type="email" name="email" placeholder="seu.email@uespi.br" required /></label>
              <label>Senha<div className="password-field"><input type={showPassword ? "text" : "password"} name="password" placeholder="Digite sua senha" required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
              <button type="submit" className="primary-button">Entrar</button>
              <p className="toggle-mode">Não tem conta? <button type="button" onClick={() => setMode("register")}>Crie uma agora</button></p>
            </>
          ) : (
            <>
              <h2>Criar nova conta</h2>
              <label>Nome completo<input type="text" name="nome" placeholder="Seu nome" required /></label>
              <label>E-mail<input type="email" name="email" placeholder="seu.email@uespi.br" required /></label>
              <div className="form-row">
                <label>Vínculo<select name="vinculo" required><option>Estudante</option><option>Professor(a)</option><option>Servidor(a)</option><option>Comunidade externa</option></select></label>
                <label>Campus<select name="campus" required><option>Teresina</option><option>Parnaíba</option><option>Picos</option><option>Floriano</option><option>Corrente</option><option>São Raimundo Nonato</option></select></label>
              </div>
              <label>Senha<div className="password-field"><input type={showPassword ? "text" : "password"} name="password" placeholder="Crie uma senha" required /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
              <button type="submit" className="primary-button">Criar conta</button>
              <p className="toggle-mode">Já tem conta? <button type="button" onClick={() => setMode("login")}>Faça login</button></p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function ManifestationPage({ selectedType, setSelectedType, onSubmit, loading }: { selectedType: string; setSelectedType: (type: string) => void; onSubmit: (event: React.FormEvent<HTMLFormElement>) => void; loading: boolean }) {
  return (
    <section className="page-stack animate-in">
      <PageTitle title="Nova Manifestação" description="Registre denúncia, reclamação, elogio, sugestão ou solicitação. O protocolo será gerado automaticamente." />
      <div className="two-column-page">
        <form className="panel-card form-card" onSubmit={onSubmit}>
          <label>Tipo de manifestação<select value={selectedType} onChange={(event) => setSelectedType(event.target.value)}>{manifestationTypes.map((item) => <option key={item.tipo}>{item.tipo}</option>)}</select></label>
          <div className="form-row"><label>Campus<select name="campus"><option>Teresina - Poeta Torquato Neto</option><option>Parnaíba</option><option>Picos</option><option>Floriano</option><option>Corrente</option><option>São Raimundo Nonato</option></select></label><label>Setor<input name="setor" placeholder="Ex.: Biblioteca, Secretaria, Restaurante" required /></label></div>
          <label>E-mail<input name="email" type="email" placeholder="seu.email@uespi.br" required /></label>
          <label>Assunto<input name="assunto" placeholder="Ex.: Solicitação de melhoria na biblioteca" required /></label>
          <label>Descrição<textarea name="descricao" rows={7} placeholder="Descreva os fatos, local, data e demais informações importantes." required /></label>
          <label className="checkbox-line"><input type="checkbox" name="sigilosa" /> Solicitar tratamento sigiloso desta manifestação</label>
          <div className="form-actions"><button type="reset" className="secondary-button" disabled={loading}>Limpar</button><button type="submit" className="primary-button" disabled={loading}>{loading ? "Enviando..." : "Enviar manifestação"} <Send size={17} /></button></div>
        </form>
        <aside className="panel-card guidance-card">
          <img src={campusImage} alt="Ilustração institucional da universidade" />
          <h2>Antes de enviar</h2>
          <p>Inclua informações objetivas, anexos quando necessário e escolha o tipo mais adequado. Denúncias podem ser registradas com sigilo.</p>
          <ul><li>Receba número de protocolo imediatamente.</li><li>Acompanhe o andamento pelo painel.</li><li>Consulte os canais oficiais de atendimento.</li></ul>
        </aside>
      </div>
    </section>
  );
}

function ProtocolPage({ protocols, lookup, setLookup, lookupResult, searchProtocol, updateStatus, deleteProtocol, filterType, setFilterType, filterStatus, setFilterStatus, exportData }: { protocols: Protocol[]; lookup: string; setLookup: (value: string) => void; lookupResult: Protocol | null; searchProtocol: (event?: React.FormEvent) => void; updateStatus: (id: string) => void; deleteProtocol: (id: string) => void; filterType: string; setFilterType: (value: string) => void; filterStatus: string; setFilterStatus: (value: string) => void; exportData: () => void }) {
  return (
    <section className="page-stack animate-in">
      <PageTitle title="Acompanhar Protocolo" description="Consulte a tramitação de suas manifestações e visualize o histórico de atendimentos." />
      <form className="panel-card lookup-card" onSubmit={searchProtocol}><Search size={19} /><input value={lookup} onChange={(event) => setLookup(event.target.value)} placeholder="Digite seu protocolo. Ex.: 2024.05.000123" /><button>Consultar</button></form>
      {lookupResult && <article className="panel-card protocol-detail"><div><small>Protocolo</small><h2>{lookupResult.id}</h2><p>{lookupResult.assunto}</p></div><span className="status-pill big">{lookupResult.status}</span><div className="timeline"><span className="done">Recebida</span><span className={lookupResult.status !== "Recebida" ? "done" : ""}>Em análise</span><span className={lookupResult.status === "Em andamento" || lookupResult.status === "Respondida" ? "done" : ""}>Em andamento</span><span className={lookupResult.status === "Respondida" ? "done" : ""}>Respondida</span></div><p>{lookupResult.descricao}</p></article>}
      <section className="panel-card">
        <div className="section-heading"><h2>Todos os protocolos</h2><div className="filter-controls"><select value={filterType} onChange={(e) => setFilterType(e.target.value)}><option>Todos os tipos</option>{["Denúncia", "Reclamação", "Elogio", "Sugestão", "Solicitação"].map((t) => <option key={t}>{t}</option>)}</select><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}><option>Todos os status</option><option>Recebida</option><option>Em análise</option><option>Em andamento</option><option>Respondida</option></select><button className="export-button" onClick={exportData}><Download size={16} /> Exportar CSV</button></div></div>
        <div className="table-wrap"><table><thead><tr><th>Protocolo</th><th>Tipo</th><th>Assunto</th><th>Data</th><th>Status</th><th>Ações</th></tr></thead><tbody>{protocols.map((item) => <tr key={item.id}><td>{item.id}</td><td>{item.tipo}</td><td>{item.assunto}</td><td>{item.data}</td><td><span className="status-pill">{item.status}</span></td><td><button className="small-link" onClick={() => updateStatus(item.id)}>Próximo</button><button className="small-link delete" onClick={() => deleteProtocol(item.id)}><Trash2 size={14} /></button></td></tr>)}</tbody></table></div>
      </section>
    </section>
  );
}

function FaqPage() {
  const [open, setOpen] = useState(0);
  return <section className="page-stack animate-in"><PageTitle title="Perguntas Frequentes" description="Respostas rápidas para dúvidas comuns sobre a Ouvidoria UESPI." />{faqItems.map((item, index) => <article key={item.q} className="panel-card faq-item"><button onClick={() => setOpen(open === index ? -1 : index)}><strong>{item.q}</strong><ChevronDown className={open === index ? "rotate" : ""} /></button>{open === index && <p>{item.a}</p>}</article>)}</section>;
}

function TransparencyPage() {
  return <section className="page-stack animate-in"><PageTitle title="Transparência" description="Indicadores, relatórios e estatísticas de atendimento da Ouvidoria." /><div className="two-column-page"><TransparencyNumbers /><section className="panel-card image-report"><img src={transparencyImage} alt="Ilustração de transparência em números" /><h2>Relatório completo</h2><p>Dados demonstrativos consolidados por mês, tipo de manifestação, status e tempo médio de resposta.</p><button className="primary-button" onClick={() => alert("Relatório demonstrativo gerado na interface.")}><FileCheck2 size={18} /> Gerar relatório</button></section></div></section>;
}

function NewsPage() {
  return <section className="page-stack animate-in"><PageTitle title="Notícias" description="Comunicados oficiais, campanhas e informativos institucionais." /><div className="news-grid">{newsData.map((notice) => <article key={notice.title} className="panel-card news-card"><small>{notice.type} • {notice.date}</small><h2>{notice.title}</h2><p>{notice.desc}</p><button className="small-link">Ler comunicado</button></article>)}</div></section>;
}

function EvaluationPage({ addToast }: { addToast: (type: Toast["type"], message: string) => void }) {
  const [score, setScore] = useState(0);
  return <section className="page-stack animate-in"><PageTitle title="Avaliação do Atendimento" description="Ajude a melhorar a qualidade dos serviços da Ouvidoria." /><form className="panel-card form-card" onSubmit={(event) => { event.preventDefault(); if (score === 0) { addToast("warning", "Selecione uma avaliação."); return; } addToast("success", "Avaliação enviada com sucesso!"); setScore(0); }}><label>Como você avalia o atendimento recebido?</label><div className="rating-row">{[1,2,3,4,5].map((value) => <button type="button" key={value} onClick={() => setScore(value)} className={score >= value ? "star-on" : ""}><Star fill="currentColor" /></button>)}</div><label>Comentário<textarea rows={6} placeholder="Conte como foi sua experiência." /></label><button className="primary-button">Enviar avaliação</button></form></section>;
}

function CampiPage() {
  return <section className="page-stack animate-in"><PageTitle title="Mapa dos Campi" description="Localize unidades e canais de apoio da UESPI." /><div className="campi-grid">{campusData.map((campus) => <article key={campus.nome} className="panel-card campus-card"><h2>{campus.nome}</h2><p><MapPin size={16} /> {campus.endereco}</p><p><Phone size={16} /> {campus.telefone}</p><p><Mail size={16} /> {campus.email}</p></article>)}</div></section>;
}

function ChatPage({ messages, text, setText, sendChat, endRef, clearChat }: { messages: ChatMessage[]; text: string; setText: (value: string) => void; sendChat: (text?: string) => void; endRef: React.RefObject<HTMLDivElement | null>; clearChat: () => void }) {
  return <section className="page-stack animate-in"><PageTitle title="Chat Online" description="Atendimento rápido com respostas automáticas para orientar sua navegação." /><div className="two-column-page"><div className="panel-card chat-large"><div className="chat-header"><strong>Histórico do Chat</strong><button onClick={clearChat} className="clear-btn"><Trash2 size={16} /> Limpar</button></div><ChatMessages messages={messages} endRef={endRef} /><ChatInput text={text} setText={setText} sendChat={sendChat} /></div><aside className="panel-card guidance-card"><img src={chatImage} alt="Ilustração do chat online" /><h2>Respostas rápidas</h2><QuickReplies sendChat={sendChat} /></aside></div></section>;
}

function GenericPage({ active, goTo }: { active: SectionKey; goTo: (key: SectionKey) => void }) {
  const item = menuItems.find((menu) => menu.key === active);
  const Icon = item?.icon || LayoutDashboard;
  return <section className="page-stack animate-in"><PageTitle title={item?.label || "Serviço"} description="Área funcional integrada ao painel da Ouvidoria UESPI." /><div className="panel-card generic-service"><Icon size={42} /><h2>{item?.label}</h2><p>Esta opção está estruturada no front-end e pronta para receber conteúdo institucional específico, formulários adicionais ou integração futura com sistemas acadêmicos.</p><div className="service-actions"><button className="primary-button" onClick={() => goTo("nova")}>Registrar manifestação</button><button className="secondary-button" onClick={() => goTo("chat")}>Abrir chat</button></div></div></section>;
}

function TransparencyNumbers({ compact = false }: { compact?: boolean }) {
  return <section className={`panel-card transparency-card ${compact ? "compact" : ""}`}><div className="section-heading"><h2>Transparência em números</h2><button>Ver relatório completo</button></div><div className="metrics-grid"><Metric value="1.245" label="Manifestações recebidas" /><Metric value="980" label="Manifestações respondidas" /><Metric value="85%" label="Taxa de resolução" green /><Metric value="6,2 dias" label="Prazo médio de resposta" /></div><div className="mini-chart" aria-label="Gráfico demonstrativo"><span style={{ height: "24%" }} /><span style={{ height: "44%" }} /><span style={{ height: "61%" }} /><span style={{ height: "42%" }} /><span style={{ height: "38%" }} /><span style={{ height: "57%" }} /><span style={{ height: "79%" }} /><span style={{ height: "70%" }} /><span style={{ height: "52%" }} /><span style={{ height: "62%" }} /><span style={{ height: "78%" }} /></div><div className="chart-labels"><small>Jan</small><small>Fev</small><small>Mar</small><small>Abr</small><small>Mai</small></div></section>;
}

function Metric({ value, label, green }: { value: string; label: string; green?: boolean }) { return <div className="metric"><strong className={green ? "green" : ""}>{value}</strong><span>{label}</span></div>; }

function ContactCard() { return <section className="panel-card contact-card"><h2>Canais de Atendimento</h2><p><Mail size={16} /> ouvidoria@uespi.br</p><p><Phone size={16} /> (86) 3213-7942</p><p><Clock3 size={16} /> Segunda a Sexta, 8h às 17h</p><p><MessageCircle size={16} /> Chat Online</p></section>; }
function SocialCard() { return <section className="panel-card social-card"><h2>Siga-nos</h2><div><span>IG</span><span>f</span><span>▶</span><span>X</span><span>in</span></div></section>; }
function PageTitle({ title, description }: { title: string; description: string }) { return <header className="page-title"><h1>{title}</h1><p>{description}</p></header>; }
function QuickReplies({ sendChat }: { sendChat: (text?: string) => void }) { return <div className="quick-replies">{["Acompanhar protocolo", "Registrar denúncia", "Qual o prazo de resposta?", "Preciso de acessibilidade", "Canais de contato"].map((text) => <button key={text} onClick={() => sendChat(text)}>{text}</button>)}</div>; }
function ChatMessages({ messages, endRef }: { messages: ChatMessage[]; endRef: React.RefObject<HTMLDivElement | null> }) { return <div className="chat-messages">{messages.map((message) => <div key={message.id} className={`chat-bubble ${message.from}`}><p>{message.text}</p><small>{message.time}</small></div>)}<div ref={endRef} /></div>; }
function ChatInput({ text, setText, sendChat }: { text: string; setText: (value: string) => void; sendChat: (text?: string) => void }) { return <form className="chat-input" onSubmit={(event) => { event.preventDefault(); sendChat(); }}><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Digite sua mensagem..." /><button aria-label="Enviar mensagem"><Send size={18} /></button></form>; }
function FloatingChat({ messages, text, setText, sendChat, close, endRef, clearChat }: { messages: ChatMessage[]; text: string; setText: (value: string) => void; sendChat: (text?: string) => void; close: () => void; endRef: React.RefObject<HTMLDivElement | null>; clearChat: () => void }) { return <aside className="floating-chat"><header><div><strong>Chat Online</strong><small>Respostas rápidas</small></div><div><button onClick={clearChat} className="clear-btn" aria-label="Limpar chat"><Trash2 size={16} /></button><button onClick={close} aria-label="Fechar chat"><X size={18} /></button></div></header><QuickReplies sendChat={sendChat} /><ChatMessages messages={messages} endRef={endRef} /><ChatInput text={text} setText={setText} sendChat={sendChat} /></aside>; }
function ToastContainer({ toasts }: { toasts: Toast[] }) { return <div className="toast-container">{toasts.map((toast) => <div key={toast.id} className={`toast ${toast.type}`}><div className="toast-icon">{toast.type === "success" && <CheckCircle size={18} />}{toast.type === "error" && <XCircle size={18} />}{toast.type === "warning" && <AlertCircle size={18} />}{toast.type === "info" && <Info size={18} />}</div><p>{toast.message}</p></div>)}</div>; }
