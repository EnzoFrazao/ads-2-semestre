import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["sobre", "habilidades", "projetos", "experiência", "contato"];

const SKILLS = [
  { name: "PHP / Laravel", level: 88, color: "#7c3aed" },
  { name: "Java / Spring Boot", level: 82, color: "#f59e0b" },
  { name: "Python / FastAPI", level: 78, color: "#3b82f6" },
  { name: "PostgreSQL / Redis", level: 80, color: "#10b981" },
  { name: "Docker", level: 75, color: "#00d4ff" },
  { name: "Next.js / TypeScript", level: 70, color: "#00ff87" },
  { name: "n8n / Automação", level: 72, color: "#f97316" },
];

const PROJECTS = [
  {
    name: "SafeWork",
    tag: "FUNDADOR",
    desc: "Plataforma de segurança no trabalho com visão computacional para detectar EPIs em tempo real e prevenir acidentes.",
    tech: ["Python", "FastAPI", "Computer Vision", "Docker"],
    color: "#00ff87",
    icon: "🛡️",
    link: "https://github.com/EnzoFrazao",
  },
  {
    name: "Agiliza Transparência",
    tag: "STC/MA",
    desc: "Sistema para gestão de solicitações de transparência do Governo do Maranhão. Backend robusto com rastreamento de status.",
    tech: ["TypeScript", "Laravel", "PostgreSQL", "Docker"],
    color: "#00d4ff",
    icon: "🏛️",
    link: "https://github.com/EnzoFrazao/agiliza-transparencia-back",
  },
  {
    name: "Project IA",
    tag: "PYTHON",
    desc: "Projeto de inteligência artificial explorando modelos de machine learning e automação de processos com Python.",
    tech: ["Python", "ML", "Automação"],
    color: "#a855f7",
    icon: "🤖",
    link: "https://github.com/EnzoFrazao/Project_IA",
  },
  {
    name: "Vértice Consultoria",
    tag: "TYPESCRIPT",
    desc: "Sistema web para consultoria com TypeScript. Interface moderna para gestão de clientes e projetos.",
    tech: ["TypeScript", "Next.js", "PostgreSQL"],
    color: "#f59e0b",
    icon: "📊",
    link: "https://github.com/EnzoFrazao/vertice-consultoria",
  },
  {
    name: "Gerenciamento de Solicitações",
    tag: "FULLSTACK",
    desc: "Sistema para registro, atribuição e rastreamento de solicitações internas com controle de responsáveis.",
    tech: ["PHP", "Laravel", "MySQL"],
    color: "#f97316",
    icon: "⚙️",
    link: "https://github.com/EnzoFrazao/GerenciamentoDeSolicitacoesInternas",
  },
  {
    name: "TechX Front",
    tag: "TYPESCRIPT",
    desc: "Frontend moderno com TypeScript para aplicação de tecnologia. Design responsivo e componentizado.",
    tech: ["TypeScript", "React", "Tailwind"],
    color: "#ec4899",
    icon: "💻",
    link: "https://github.com/EnzoFrazao/techXfront",
  },
];

const EXPERIENCE = [
  {
    role: "Desenvolvedor Full Stack",
    company: "STC/MA — Secretaria de Transparência do Maranhão",
    period: "2024 — Atual",
    desc: "Desenvolvimento de sistemas governamentais para gestão de transparência pública. Implementação de APIs RESTful, sistemas de autenticação e dashboards administrativos.",
    color: "#00ff87",
  },
  {
    role: "Fundador & Desenvolvedor",
    company: "SafeWork",
    period: "2024 — Atual",
    desc: "Criação de plataforma SaaS de segurança ocupacional com visão computacional para detecção de EPIs em tempo real, integrando Python, FastAPI e modelos de IA.",
    color: "#00d4ff",
  },
  {
    role: "Estudante de Engenharia de Software",
    company: "Graduação",
    period: "2023 — Atual",
    desc: "Formação em engenharia de software com foco em desenvolvimento backend, arquitetura de sistemas e boas práticas de programação.",
    color: "#a855f7",
  },
];

function useInView(ref: React.RefObject<Element | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between mb-1">
        <span className="font-mono text-sm" style={{ color: "#e8e8ff" }}>{name}</span>
        <span className="font-mono text-xs" style={{ color, fontFamily: "'JetBrains Mono', monospace" }}>{level}%</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "#1e1e40" }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: inView ? `${level}%` : "0%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: inView ? `0 0 10px ${color}66` : "none",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative border rounded-sm p-6 transition-all duration-300 hover:scale-[1.02]"
      style={{
        background: "#111128",
        borderColor: "#1e1e40",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = project.color + "66";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 30px ${project.color}18`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "#1e1e40";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{project.icon}</span>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded-sm border"
          style={{ color: project.color, borderColor: project.color + "44", background: project.color + "08", fontFamily: "'JetBrains Mono', monospace" }}
        >
          {project.tag}
        </span>
      </div>
      <h3
        className="font-display text-lg font-bold mb-2 group-hover:transition-all duration-300"
        style={{ fontFamily: "'Orbitron', sans-serif", color: "#e8e8ff" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = project.color; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#e8e8ff"; }}
      >
        {project.name}
      </h3>
      <p className="text-sm leading-relaxed mb-4" style={{ color: "#8888bb" }}>{project.desc}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.tech.map(t => (
          <span
            key={t}
            className="text-xs px-2 py-0.5 rounded-sm"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8888bb", background: "#1e1e40" }}
          >
            {t}
          </span>
        ))}
      </div>
      <div
        className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-b-sm"
        style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
      />
    </a>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("sobre");
  const [scrolled, setScrolled] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);

    // Random glitch effect on name
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);

    // Update active nav on scroll
    const sections = NAV_LINKS.map(id => document.getElementById(id));
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(s => s && observer.observe(s));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(glitchInterval);
      observer.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-full grid-bg" style={{ background: "#05050f", color: "#e8e8ff" }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute rounded-full blur-3xl float" style={{ width: 500, height: 500, top: -150, left: -100, background: "radial-gradient(circle, #00ff8710 0%, transparent 70%)" }} />
        <div className="absolute rounded-full blur-3xl" style={{ width: 400, height: 400, top: "40%", right: -100, background: "radial-gradient(circle, #00d4ff08 0%, transparent 70%)", animationDelay: "2s" }} />
        <div className="absolute rounded-full blur-3xl float" style={{ width: 300, height: 300, bottom: "10%", left: "30%", background: "radial-gradient(circle, #a855f710 0%, transparent 70%)", animationDelay: "4s" }} />
      </div>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(5, 5, 15, 0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid #1e1e4066" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span
            className="font-display text-sm font-bold tracking-widest cursor-pointer"
            style={{ fontFamily: "'Orbitron', sans-serif", color: "#00ff87", letterSpacing: "0.2em" }}
            onClick={() => scrollTo("sobre")}
          >
            {"<EF />"}
          </span>
          <div className="hidden md:flex gap-8">
            {NAV_LINKS.map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="font-mono text-xs uppercase tracking-widest transition-all duration-200"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: activeSection === link ? "#00ff87" : "#8888bb",
                  textShadow: activeSection === link ? "0 0 12px #00ff87" : "none",
                  letterSpacing: "0.15em",
                }}
              >
                {link}
              </button>
            ))}
          </div>
          <a
            href="mailto:enzofrazaoengsoft@gmail.com"
            className="hidden md:block text-xs font-mono px-4 py-2 rounded-sm border transition-all duration-300 hover:bg-neon hover:text-void"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              borderColor: "#00ff87",
              color: "#00ff87",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#00ff87";
              (e.currentTarget as HTMLElement).style.color = "#05050f";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #00ff8766";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "#00ff87";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            contato
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="sobre"
        className="relative min-h-screen flex items-center"
        style={{ zIndex: 1, paddingTop: "80px" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-24 w-full grid md:grid-cols-2 gap-16 items-center">
          <div className="fade-up">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-12" style={{ background: "#00ff87" }} />
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#00ff87", fontFamily: "'JetBrains Mono', monospace" }}>
                disponível para projetos
              </span>
              <span className="w-2 h-2 rounded-full" style={{ background: "#00ff87", boxShadow: "0 0 8px #00ff87", animation: "blink 1.5s infinite" }} />
            </div>

            <h1
              className="font-display leading-tight mb-4"
              style={{
                fontFamily: "'Orbitron', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 900,
                animation: glitchActive ? "glitch 0.3s infinite" : "none",
              }}
            >
              <span style={{ color: "#e8e8ff" }}>Enzo</span>{" "}
              <span style={{ color: "#00ff87", textShadow: "0 0 30px #00ff8766" }}>Frazao</span>
            </h1>

            <div className="mb-6 font-mono text-lg cursor" style={{ color: "#00d4ff", fontFamily: "'JetBrains Mono', monospace" }}>
              Backend Developer & Software Engineer
            </div>

            <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: "#8888bb" }}>
              Desenvolvedor backend apaixonado por construir sistemas robustos e escaláveis.
              Fundador da <span style={{ color: "#00ff87" }}>SafeWork</span> — plataforma de IA para segurança ocupacional.
              Atualmente desenvolvendo soluções para o <span style={{ color: "#00d4ff" }}>Governo do Maranhão</span>.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo("projetos")}
                className="px-6 py-3 rounded-sm font-mono text-sm font-semibold transition-all duration-300"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  background: "#00ff87",
                  color: "#05050f",
                  boxShadow: "0 0 20px #00ff8755",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 40px #00ff87aa"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #00ff8755"; }}
              >
                ver projetos →
              </button>
              <a
                href="https://github.com/EnzoFrazao"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-sm font-mono text-sm border transition-all duration-300"
                style={{ fontFamily: "'JetBrains Mono', monospace", borderColor: "#1e1e40", color: "#8888bb" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#8888bb";
                  (e.currentTarget as HTMLElement).style.color = "#e8e8ff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1e1e40";
                  (e.currentTarget as HTMLElement).style.color = "#8888bb";
                }}
              >
                github ↗
              </a>
              <a
                href="https://linkedin.com/in/enzofrazaovencio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-sm font-mono text-sm border transition-all duration-300"
                style={{ fontFamily: "'JetBrains Mono', monospace", borderColor: "#1e1e40", color: "#8888bb" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#00d4ff";
                  (e.currentTarget as HTMLElement).style.color = "#00d4ff";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1e1e40";
                  (e.currentTarget as HTMLElement).style.color = "#8888bb";
                }}
              >
                linkedin ↗
              </a>
            </div>
          </div>

          {/* Right side: terminal card */}
          <div className="relative fade-up" style={{ animationDelay: "0.2s" }}>
            <div
              className="rounded-sm border overflow-hidden"
              style={{ background: "#0d0d1a", borderColor: "#1e1e40", boxShadow: "0 0 60px #00ff8710" }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "#1e1e40", background: "#111128" }}>
                <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                <span className="ml-3 font-mono text-xs" style={{ color: "#3a3a6a", fontFamily: "'JetBrains Mono', monospace" }}>enzo@safework ~</span>
              </div>
              {/* Terminal body */}
              <div className="p-5 font-mono text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8 }}>
                <div><span style={{ color: "#00ff87" }}>$</span> <span style={{ color: "#8888bb" }}>whoami</span></div>
                <div style={{ color: "#e8e8ff" }}>enzo_frazao_vencio</div>
                <div className="mt-2"><span style={{ color: "#00ff87" }}>$</span> <span style={{ color: "#8888bb" }}>cat skills.json</span></div>
                <div style={{ color: "#1e1e40" }}>{"{"}</div>
                <div className="pl-4"><span style={{ color: "#00d4ff" }}>"backend"</span><span style={{ color: "#1e1e40" }}>:</span> <span style={{ color: "#00ff87" }}>"PHP, Java, Python"</span><span style={{ color: "#1e1e40" }}>,</span></div>
                <div className="pl-4"><span style={{ color: "#00d4ff" }}>"infra"</span><span style={{ color: "#1e1e40" }}>:</span> <span style={{ color: "#a855f7" }}>"Docker, Redis, PostgreSQL"</span><span style={{ color: "#1e1e40" }}>,</span></div>
                <div className="pl-4"><span style={{ color: "#00d4ff" }}>"ai"</span><span style={{ color: "#1e1e40" }}>:</span> <span style={{ color: "#f59e0b" }}>"n8n, Computer Vision"</span></div>
                <div style={{ color: "#1e1e40" }}>{"}"}</div>
                <div className="mt-2"><span style={{ color: "#00ff87" }}>$</span> <span style={{ color: "#8888bb" }}>echo $LOCATION</span></div>
                <div style={{ color: "#e8e8ff" }}>Maranhão, Brasil 🇧🇷</div>
                <div className="mt-2"><span style={{ color: "#00ff87" }}>$</span> <span style={{ color: "#8888bb" }}>status</span></div>
                <div>
                  <span style={{ color: "#00ff87" }}>●</span> <span style={{ color: "#e8e8ff" }}>open to work & collab</span>
                  <span className="ml-1" style={{ animation: "blink 1s infinite", color: "#00ff87" }}>_</span>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div
              className="absolute -bottom-6 -right-6 border rounded-sm p-4 float"
              style={{ background: "#111128", borderColor: "#00d4ff33", boxShadow: "0 0 20px #00d4ff18" }}
            >
              <div className="font-mono text-2xl font-bold" style={{ color: "#00d4ff", fontFamily: "'Orbitron', sans-serif" }}>12+</div>
              <div className="font-mono text-xs" style={{ color: "#8888bb", fontFamily: "'JetBrains Mono', monospace" }}>projetos</div>
            </div>
            <div
              className="absolute -top-6 -left-6 border rounded-sm p-4 float"
              style={{ background: "#111128", borderColor: "#00ff8733", boxShadow: "0 0 20px #00ff8718", animationDelay: "2s" }}
            >
              <div className="font-mono text-2xl font-bold" style={{ color: "#00ff87", fontFamily: "'Orbitron', sans-serif" }}>2+</div>
              <div className="font-mono text-xs" style={{ color: "#8888bb", fontFamily: "'JetBrains Mono', monospace" }}>anos exp.</div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="habilidades" className="relative py-28" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-xs tracking-widest" style={{ color: "#00ff87", fontFamily: "'JetBrains Mono', monospace" }}>02.</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: "#e8e8ff" }}>
                habilidades
              </h2>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #1e1e40, transparent)" }} />
            </div>
            <p className="max-w-lg text-sm" style={{ color: "#8888bb" }}>
              Stack focada em backend robusto, automações inteligentes e infraestrutura escalável.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-2">
            {SKILLS.map((s, i) => (
              <SkillBar key={s.name} {...s} delay={i * 80} />
            ))}
          </div>

          {/* Tech tags */}
          <div className="mt-12 flex flex-wrap gap-2">
            {["REST APIs", "Microserviços", "Autenticação JWT", "CI/CD", "Linux", "Git", "ORM", "MVC", "SOLID", "Clean Architecture"].map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projetos" className="relative py-28" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-xs tracking-widest" style={{ color: "#00ff87", fontFamily: "'JetBrains Mono', monospace" }}>03.</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: "#e8e8ff" }}>
                projetos
              </h2>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #1e1e40, transparent)" }} />
            </div>
            <p className="max-w-lg text-sm" style={{ color: "#8888bb" }}>
              Do governo ao empreendedorismo — sistemas que resolvem problemas reais.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROJECTS.map(p => <ProjectCard key={p.name} project={p} />)}
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://github.com/EnzoFrazao"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm transition-colors duration-200"
              style={{ color: "#00ff87", fontFamily: "'JetBrains Mono', monospace" }}
            >
              ver todos no github →
            </a>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experiência" className="relative py-28" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <span className="font-mono text-xs tracking-widest" style={{ color: "#00ff87", fontFamily: "'JetBrains Mono', monospace" }}>04.</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Orbitron', sans-serif", color: "#e8e8ff" }}>
                experiência
              </h2>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, #1e1e40, transparent)" }} />
            </div>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "linear-gradient(180deg, #00ff87, #00d4ff, #a855f7)" }} />
            <div className="space-y-10 pl-10">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div
                    className="absolute -left-10 w-3 h-3 rounded-full border-2 top-1.5"
                    style={{ background: exp.color, borderColor: exp.color, boxShadow: `0 0 12px ${exp.color}`, left: "-2.6rem" }}
                  />
                  <div
                    className="border rounded-sm p-6 transition-all duration-300"
                    style={{ background: "#111128", borderColor: "#1e1e40" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = exp.color + "44";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${exp.color}11`;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "#1e1e40";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display font-bold text-lg" style={{ fontFamily: "'Orbitron', sans-serif", color: "#e8e8ff", fontSize: "1rem" }}>
                          {exp.role}
                        </h3>
                        <div className="font-mono text-sm mt-0.5" style={{ color: exp.color, fontFamily: "'JetBrains Mono', monospace" }}>
                          {exp.company}
                        </div>
                      </div>
                      <span
                        className="font-mono text-xs px-3 py-1 rounded-sm border"
                        style={{ fontFamily: "'JetBrains Mono', monospace", color: "#8888bb", borderColor: "#1e1e40", whiteSpace: "nowrap" }}
                      >
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#8888bb" }}>{exp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contato" className="relative py-28" style={{ zIndex: 1 }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="font-mono text-xs mb-4 tracking-widest" style={{ color: "#00ff87", fontFamily: "'JetBrains Mono', monospace" }}>
              05. contato
            </div>
            <h2
              className="font-display font-bold mb-6"
              style={{ fontFamily: "'Orbitron', sans-serif", color: "#e8e8ff", fontSize: "clamp(2rem, 5vw, 3rem)" }}
            >
              vamos construir algo{" "}
              <span style={{ color: "#00ff87", textShadow: "0 0 30px #00ff8766" }}>juntos</span>
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: "#8888bb" }}>
              Aberto a oportunidades, projetos freelance e colaborações. Se você tem uma ideia interessante,
              vamos conversar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href="mailto:enzofrazaoengsoft@gmail.com"
                className="px-8 py-4 rounded-sm font-mono text-sm font-semibold transition-all duration-300"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  background: "#00ff87",
                  color: "#05050f",
                  boxShadow: "0 0 30px #00ff8755",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px #00ff87aa"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px #00ff8755"; }}
              >
                enviar email ✉
              </a>
              <a
                href="https://linkedin.com/in/enzofrazaovencio"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-sm font-mono text-sm border transition-all duration-300"
                style={{ fontFamily: "'JetBrains Mono', monospace", borderColor: "#1e1e40", color: "#8888bb" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#00d4ff";
                  (e.currentTarget as HTMLElement).style.color = "#00d4ff";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px #00d4ff22";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1e1e40";
                  (e.currentTarget as HTMLElement).style.color = "#8888bb";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                linkedin ↗
              </a>
            </div>

            {/* Social links */}
            <div className="flex justify-center gap-8">
              {[
                { label: "github", href: "https://github.com/EnzoFrazao" },
                { label: "instagram", href: "https://instagram.com/enzo_frazao" },
                { label: "email", href: "mailto:enzofrazaoengsoft@gmail.com" },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs transition-colors duration-200"
                  style={{ fontFamily: "'JetBrains Mono', monospace", color: "#3a3a6a" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#00ff87"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#3a3a6a"; }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t py-8" style={{ zIndex: 1, borderColor: "#1e1e40" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono text-xs" style={{ color: "#3a3a6a", fontFamily: "'JetBrains Mono', monospace" }}>
            © 2024 Enzo Frazao Vencio
          </span>
          <span className="font-mono text-xs" style={{ color: "#3a3a6a", fontFamily: "'JetBrains Mono', monospace" }}>
            built with <span style={{ color: "#00ff87" }}>React</span> + <span style={{ color: "#00d4ff" }}>TypeScript</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
