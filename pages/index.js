import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, CheckCircle, Clock, ShieldCheck, Star, Leaf, Flame, 
  ChevronRight, Download, Copy, Smartphone, Lock, Activity, AlertCircle, Check, Zap, Menu, User, X, Mail, Send, FileText, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURAÇÃO (Mantivemos a lógica inteligente) ---
const DIET_DATABASE = {
  "Secar barriga (Urgente)": [
    ['01', 'Ovos Mexidos Cremosos + Café', 'Filé de Frango Grelhado + Salada Verde', 'Sopa Detox de Abóbora'], 
    ['02', 'Iogurte Natural + Chia', 'Peixe Assado com Ervas + Brócolis', 'Omelete de Forno com Legumes'], 
    ['03', 'Abacate Amassado + Ovos', 'Carne Moída Refogada + Abobrinha', 'Caldo de Ossos (Colágeno)'], 
    ['04', 'Café Turbo (Óleo de Coco)', 'Sobrecoxa Assada + Couve Refogada', 'Creme de Chuchu com Gengibre'], 
    ['05', 'Queijo Coalho Grelhado', 'Lombo Suíno + Repolho Roxo', 'Salada de Atum com Ovos'], 
    ['06', 'Ovos Cozidos + Castanhas', 'Frango ao Curry + Arroz de Couve-flor', 'Wrap de Alface com Frango'], 
    ['07', 'Panqueca Low Carb', 'Peixe Assado + Espinafre', 'Sopa Detox Verde']
  ],
  "Desinchar o corpo todo": [
    ['01', 'Suco Verde Detox + 2 Ovos', 'Peixe ao Molho de Coco + Arroz Integral', 'Sopa Creme de Abóbora'], 
    ['02', 'Melão com Hortelã', 'Frango Grelhado + Aspargos', 'Salada Refrescante de Pepino'], 
    ['03', 'Mamão com Linhaça', 'Salmão Assado + Purê de Batata Doce', 'Creme de Cenoura com Gengibre'], 
    ['04', 'Chá de Hibisco + Torrada', 'Iscas de Carne + Chuchu', 'Omelete com Espinafre'], 
    ['05', 'Abacaxi com Canela', 'Filé de Tilápia + Mix de Folhas', 'Sopa de Legumes Anti-inflamatória'], 
    ['06', 'Melancia + Queijo Branco', 'Frango Desfiado + Purê de Mandioca', 'Salada Caprese (Tomate e Manjericão)'], 
    ['07', 'Água de Coco + Castanhas', 'Peixe Assado + Tomate Confit', 'Caldo Verde Light (Sem Batata)']
  ],
  "default": [
    ['01', 'Mamão + Aveia', 'Frango Grelhado + Quiabo', 'Sopa de Legumes Variados'], 
    ['02', 'Iogurte + Frutas Vermelhas', 'Peixe Cozido + Purê Rústico', 'Creme de Aipim com Carne'], 
    ['03', 'Banana Cozida com Canela', 'Carne de Panela + Cenoura', 'Ovos Mexidos com Tomate'], 
    ['04', 'Suco de Laranja Lima', 'Arroz Soltinho + Frango Assado', 'Canja de Galinha Nutritiva'], 
    ['05', 'Maçã Cozida', 'Peixe Grelhado + Salada Colorida', 'Caldo de Feijão (só o caldinho)'], 
    ['06', 'Pera Fatiada', 'Frango com Polenta Mole', 'Creme de Espinafre'], 
    ['07', 'Gelatina Natural', 'Peixe Assado com Batatas', 'Sopa Leve de Legumes']
  ]
};

const RECIPES_CONTENT = [
  {
    title: "Sopa Detox de Abóbora com Gengibre",
    ing: "• 1/2 abóbora cabotiá descascada\n• 1 pedaço de gengibre (3cm)\n• 1 cebola picada\n• 2 dentes de alho amassados\n• 1 colher (sopa) de azeite\n• Sal e pimenta a gosto\n• 500ml de água fervente",
    prep: "1. Numa panela, aqueça o azeite e refogue a cebola e o alho até dourarem.\n2. Adicione a abóbora em cubos e refogue por 2 minutos.\n3. Cubra com a água fervente e deixe cozinhar até a abóbora desmanchar (aprox. 25 min).\n4. Espere amornar e bata no liquidificador com o gengibre descascado.\n5. Volte para a panela, acerte o sal e aqueça antes de servir."
  },
  {
    title: "Suco Verde Desinchaço Turbo",
    ing: "• 1 folha de couve manteiga (sem o talo grosso)\n• 1 maçã pequena com casca\n• Suco de 1/2 limão\n• 1 pedaço pequeno de gengibre\n• 200ml de água gelada ou água de coco",
    prep: "1. Higienize bem as folhas de couve e a maçã.\n2. Pique a maçã retirando as sementes.\n3. Coloque todos os ingredientes no liquidificador.\n4. Bata por 2 minutos na potência máxima até ficar homogêneo.\n5. Beba imediatamente sem coar para aproveitar as fibras."
  }
];

export default function App() {
  const [view, setView] = useState('landing');
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [pixData, setPixData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle');
  const [checkoutStep, setCheckoutStep] = useState('offer'); // offer, email, pix
  
  const userEmailRef = useRef(userEmail);
  const quizAnswersRef = useRef(quizAnswers);
  const [savedGoal, setSavedGoal] = useState("Secar barriga (Urgente)");

  // Persistência
  useEffect(() => {
    userEmailRef.current = userEmail;
    quizAnswersRef.current = quizAnswers;
  }, [userEmail, quizAnswers]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('tmformat_email');
    if (savedEmail) setUserEmail(savedEmail);
    const goal = localStorage.getItem('tmformat_goal');
    if (goal) setSavedGoal(goal);
    
    // Recupera Pix se existir
    const savedPix = localStorage.getItem('tmformat_pix_data');
    if (savedPix) {
      const parsedPix = JSON.parse(savedPix);
      setPixData(parsedPix);
      setView('result');
      setCheckoutStep('pix');
      verificarStatusIndividual(parsedPix.id);
      iniciarPolling(parsedPix.id); 
    }
  }, []);

  const QUIZ_QUESTIONS = [
    { text: "Qual seu objetivo principal?", options: ["Secar barriga (Urgente)", "Desinchar o corpo todo", "Melhorar digestão", "Perder peso na balança"] },
    { text: "Qual sua idade?", options: ["18-29 anos", "30-45 anos", "46-60 anos", "60+ anos"] },
    { text: "Qual seu maior obstáculo hoje?", options: ["Metabolismo lento", "Vontade de Doces", "Falta de Tempo", "Não gosto de salada"] },
    { text: "Quanto peso você quer eliminar?", options: ["2 a 3 kg (Em 7 dias)", "3 a 5 kg (Em 15 dias)", "Mais de 5 kg (Longo prazo)"] },
    { text: "Como é sua digestão?", options: ["Normal", "Me sinto inchada(o) fácil", "Tenho azia/refluxo"] },
    { text: "Qual horário você sente mais fome?", options: ["Manhã", "Almoço", "Fim de tarde (ansiedade)", "Noite/Madrugada"] },
    { text: "Já tentou dietas de 7 dias antes?", options: ["Sim, mas recuperei o peso", "Não, é a primeira vez"] },
    { text: "Você se compromete a seguir o plano por APENAS 7 dias?", options: ["Vou tentar...", "SIM! Consigo focar por 7 dias!"] }
  ];

  const handleAnswer = (answer) => {
    if (currentQuestion === 0) {
        localStorage.setItem('tmformat_goal', answer);
        setSavedGoal(answer);
    }
    setQuizAnswers([...quizAnswers, answer]);
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setView('loading');
    }
  };

  const submitEmailAndPay = async () => {
    if (!userEmail || !userEmail.includes('@')) {
      alert("Por favor, digite um e-mail válido.");
      return;
    }
    localStorage.setItem('tmformat_email', userEmail);
    setPaymentLoading(true);
    try {
      const res = await fetch('/api/criar-pix', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar pix');
      setPixData(data);
      localStorage.setItem('tmformat_pix_data', JSON.stringify(data));
      setCheckoutStep('pix');
      iniciarPolling(data.id);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar o Pix.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const verificarStatusIndividual = async (id) => {
    try {
      const res = await fetch(`/api/checar-status?id=${id}`);
      const data = await res.json();
      if (data.status === 'approved') {
        localStorage.removeItem('tmformat_pix_data');
        setView('success');
        handleAutoSendEmail();
        return true;
      }
    } catch (e) { console.error("Erro na verificação", e); }
    return false;
  };

  const iniciarPolling = (id) => {
    const interval = setInterval(async () => {
      const aprovado = await verificarStatusIndividual(id);
      if (aprovado) clearInterval(interval);
    }, 3000);
  };

  const handleAutoSendEmail = async () => {
    const currentEmail = userEmailRef.current || localStorage.getItem('tmformat_email');
    if (!currentEmail) return;
    setSendingEmail(true);
    const pdfBlob = await generatePDFBlob(); 
    try {
        const response = await fetch('/api/enviar-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: currentEmail, pdfBase64: pdfBlob, nome: "Aluna" })
        });
        if (response.ok) setEmailStatus('success'); else setEmailStatus('error');
    } catch (e) { setEmailStatus('error'); } 
    finally { setSendingEmail(false); }
  };

  const generatePDFBlob = async () => {
    if (!window.jspdf) {
        await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload = r; document.body.appendChild(s); });
        await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js"; s.onload = r; document.body.appendChild(s); });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const userGoal = savedGoal || quizAnswersRef.current[0] || "Secar barriga (Urgente)";
    const selectedMenu = DIET_DATABASE[userGoal] || DIET_DATABASE["default"];
    generatePDFContent(doc, userGoal, selectedMenu);
    return doc.output('datauristring');
  };

  const downloadManualPDF = async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const userGoal = savedGoal || "Secar barriga (Urgente)";
    const selectedMenu = DIET_DATABASE[userGoal] || DIET_DATABASE["default"];
    generatePDFContent(doc, userGoal, selectedMenu);
    doc.save("Protocolo_NutriOfficial.pdf");
  };

  const generatePDFContent = (doc, userGoal, selectedMenu) => {
    doc.setFillColor(255, 204, 0); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(15, 15, 15); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); 
    doc.text("Protocolo NutriOfficial™", 105, 20, null, null, "center");
    doc.setFontSize(14); doc.setFont('helvetica', 'normal');
    doc.text("Plano de Ativação Metabólica", 105, 30, null, null, "center");

    doc.setTextColor(50); doc.setFontSize(12);
    doc.text(`Objetivo: ${userGoal}`, 14, 55);
    
    doc.autoTable({ 
      startY: 65, 
      head: [['Dia', 'Café', 'Almoço', 'Jantar']], 
      body: selectedMenu, 
      theme: 'grid', 
      headStyles: { fillColor: [15, 15, 15], textColor: [255, 204, 0] },
      styles: { cellPadding: 4, fontSize: 10 }
    });
    
    doc.addPage();
    let yPos = 20;
    RECIPES_CONTENT.forEach((recipe) => {
        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(15, 15, 15);
        doc.text(recipe.title, 14, yPos); yPos += 10;
        doc.setFontSize(10); doc.setFont('helvetica', 'normal'); 
        const split = doc.splitTextToSize(recipe.ing + "\n\n" + recipe.prep, 180);
        doc.text(split, 14, yPos); yPos += split.length * 5 + 15;
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans text-[#0F0F0F] selection:bg-[#FFCC00]">
      
      {/* --- HEADER --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
                <div className="bg-[#FFCC00] text-black px-2 py-1 rounded-sm font-black text-sm tracking-tighter">NUTRI</div>
                <span className="font-bold text-lg tracking-tight">OFFICIAL™</span>
            </div>
            <button onClick={() => setShowLogin(true)} className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-black transition duration-300">
                <span className="hidden sm:inline">Já tem uma conta?</span>
                <span className="flex items-center gap-1 border border-gray-300 px-3 py-1.5 rounded-md hover:border-black hover:bg-gray-50">
                    <User size={16} /> Entrar
                </span>
            </button>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="flex-grow flex flex-col items-center justify-start pt-8 pb-12 px-4">

        <AnimatePresence mode='wait'>
            
            {/* 1. LANDING PAGE */}
            {view === 'landing' && (
                <motion.div key="landing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full max-w-3xl">
                    <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-xl overflow-hidden border border-gray-100 p-8 md:p-16 text-center">
                        <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500 mb-6 uppercase tracking-wider">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Análise Nutricional Gratuita
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
                            O Plano Nutricional Específico para o <br/>
                            <span className="bg-[#FFCC00] px-2">SEU Metabolismo.</span>
                        </h1>
                        <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                            Descubra os alimentos exatos que o seu corpo precisa para destravar a queima de gordura em apenas <strong>7 dias</strong>.
                        </p>
                        <button onClick={() => setView('quiz')} className="w-full md:w-auto bg-[#0F0F0F] text-white hover:bg-gray-900 font-bold text-lg px-10 py-5 rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex items-center justify-center gap-3 group">
                            INICIAR ANÁLISE DE PERFIL
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                        </button>
                        <p className="mt-6 text-xs text-gray-400 flex justify-center items-center gap-1">
                            <Clock size={12} /> Leva menos de 60 segundos
                        </p>
                    </div>
                </motion.div>
            )}

            {/* 2. QUIZ */}
            {view === 'quiz' && (
                <motion.div key="quiz" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="w-full max-w-2xl bg-white shadow-card rounded-xl overflow-hidden border border-gray-100 min-h-[500px]">
                    <div className="w-full bg-gray-100 h-1.5">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }} className="bg-[#FFCC00] h-1.5 shadow-[0_0_20px_rgba(255,204,0,0.5)]"></motion.div>
                    </div>
                    <div className="p-6 md:p-12">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-xs font-bold text-[#FFCC00] bg-black px-2 py-1 rounded uppercase tracking-wider">Passo {currentQuestion + 1} de {QUIZ_QUESTIONS.length}</span>
                            <span className="text-xs text-gray-400 font-medium">Análise Metabólica</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black mb-8 leading-tight">{QUIZ_QUESTIONS[currentQuestion].text}</h2>
                        <div className="grid gap-3">
                            {QUIZ_QUESTIONS[currentQuestion].options.map((opt, i) => (
                                <button key={i} onClick={() => handleAnswer(opt)} className="w-full text-left p-4 md:p-5 rounded-lg border-2 border-gray-100 font-bold text-[#0F0F0F] transition duration-200 bg-gray-50 flex items-center justify-between group hover:border-[#FFCC00] hover:bg-[#fffbe6] hover:-translate-y-0.5">
                                    <span>{opt}</span>
                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#FFCC00] transition" />
                                </button>
                            ))}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center items-center gap-2 text-xs text-gray-400">
                            <Lock size={12} /> Seus dados são processados anonimamente.
                        </div>
                    </div>
                </motion.div>
            )}

            {/* 3. LOADING */}
            {view === 'loading' && <LoadingScreen onComplete={() => setView('result')} />}

            {/* 4. RESULTADO & CHECKOUT (A "Vitrine") */}
            {view === 'result' && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-4xl relative">
                    
                    {/* Fundo: O Documento Real (Blur) */}
                    <div className="bg-white shadow-2xl rounded-xl border border-gray-200 p-8 md:p-12 relative overflow-hidden min-h-[800px]">
                        {/* Marca d'água */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 text-9xl font-black text-gray-100 opacity-20 pointer-events-none select-none">PREVIEW</div>

                        {/* Cabeçalho do Doc */}
                        <div className="flex justify-between items-end border-b-4 border-[#FFCC00] pb-6 mb-8">
                            <div>
                                <h1 className="text-3xl font-black uppercase tracking-tight text-[#0F0F0F]">Protocolo Oficial</h1>
                                <p className="text-sm text-gray-500 mt-1 font-medium">Paciente: <span className="text-black bg-[#FFCC00] px-1">VIP MEMBER</span></p>
                            </div>
                            <div className="text-right">
                                <div className="bg-black text-white text-xs font-bold px-3 py-1 rounded mb-1 inline-block">STATUS: PRONTO</div>
                                <p className="text-xs text-gray-400">{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Conteúdo Realista */}
                        <div className="space-y-8">
                            <div className="bg-[#fffbe6] p-4 border-l-4 border-[#FFCC00] rounded-r-md">
                                <h3 className="font-bold text-lg mb-1 text-black">Objetivo: {savedGoal}</h3>
                                <p className="text-sm text-gray-600">Este plano foi calculado com base nas suas respostas para acelerar o metabolismo em 7 dias.</p>
                            </div>

                            {/* Tabela de Dieta (Nitidez gradual) */}
                            <div>
                                <h4 className="font-black text-sm uppercase tracking-widest text-gray-400 mb-4">Cronograma Nutricional</h4>
                                <div className="space-y-4">
                                    {/* Dia 1 (Visível) */}
                                    <div className="flex gap-4 border-b border-gray-100 pb-4">
                                        <div className="w-12 h-12 bg-black text-[#FFCC00] rounded flex items-center justify-center font-black text-xl shrink-0">01</div>
                                        <div className="flex-1 space-y-1">
                                            <p className="font-bold text-sm text-black">Café: {DIET_DATABASE[savedGoal]?.[0][1] || "Ovos + Café"}</p>
                                            <p className="text-xs text-gray-500">Almoço: {DIET_DATABASE[savedGoal]?.[0][2] || "Salada Proteica"}</p>
                                        </div>
                                    </div>
                                    {/* Dia 2 (Meio Blur) */}
                                    <div className="flex gap-4 border-b border-gray-100 pb-4 opacity-50 blur-[1px]">
                                        <div className="w-12 h-12 bg-gray-200 text-gray-400 rounded flex items-center justify-center font-black text-xl shrink-0">02</div>
                                        <div className="flex-1 space-y-1">
                                            <p className="font-bold text-sm text-black">Café: {DIET_DATABASE[savedGoal]?.[1][1] || "..."}</p>
                                            <p className="text-xs text-gray-500">Almoço: ...</p>
                                        </div>
                                    </div>
                                    {/* Resto (Blur Total) */}
                                    <div className="space-y-4 blur-sm opacity-30 select-none">
                                        <div className="h-12 bg-gray-100 w-full rounded"></div>
                                        <div className="h-12 bg-gray-100 w-full rounded"></div>
                                        <div className="h-32 bg-gray-100 w-full rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OVERLAY DE CHECKOUT (O Bloqueio) */}
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white text-[#0F0F0F] rounded-xl shadow-2xl border-2 border-[#FFCC00] max-w-md w-full overflow-hidden">
                            {/* Header do Card */}
                            <div className="bg-[#0F0F0F] text-white p-4 text-center relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFCC00] transform translate-x-8 -translate-y-8 rotate-45"></div>
                                <div className="flex justify-center items-center gap-2 mb-1 relative z-10">
                                    <Lock size={18} className="text-[#FFCC00]" />
                                    <span className="font-black uppercase tracking-widest text-sm">Documento Protegido</span>
                                </div>
                                <p className="text-xs text-gray-400 relative z-10">Libere o acesso para baixar o PDF completo.</p>
                            </div>

                            <div className="p-6">
                                {/* Estado: OFERTA */}
                                {checkoutStep === 'offer' && (
                                    <>
                                        <div className="text-center mb-6">
                                            <div className="flex justify-center items-baseline gap-2">
                                                <span className="text-gray-400 line-through text-sm">R$ 97,00</span>
                                                <span className="text-4xl font-black tracking-tighter">R$ 24,90</span>
                                            </div>
                                            <p className="text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-0.5 rounded mt-2">OFERTA POR TEMPO LIMITADO</p>
                                        </div>

                                        <button onClick={() => setCheckoutStep('email')} className="w-full bg-[#FFCC00] hover:bg-[#E5B800] text-black font-black py-4 rounded-lg text-lg uppercase tracking-wide shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 mb-4 flex items-center justify-center gap-2">
                                            QUERO EMAGRECER AGORA <ArrowRight size={20}/>
                                        </button>

                                        <div className="flex justify-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                                            <span className="flex items-center gap-1"><ShieldCheck size={12}/> Compra Segura</span>
                                            <span className="flex items-center gap-1"><Zap size={12}/> Entrega Imediata</span>
                                        </div>
                                    </>
                                )}

                                {/* Estado: EMAIL */}
                                {checkoutStep === 'email' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <h3 className="font-bold text-center mb-4">Para onde enviamos o arquivo?</h3>
                                        <input 
                                            type="email" 
                                            placeholder="Seu melhor e-mail" 
                                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4 font-medium focus:border-[#FFCC00] outline-none transition"
                                            value={userEmail}
                                            onChange={(e) => setUserEmail(e.target.value)}
                                        />
                                        <button onClick={submitEmailAndPay} className="w-full bg-black text-white font-bold py-4 rounded-lg uppercase tracking-wide hover:bg-gray-800 transition flex items-center justify-center gap-2">
                                            {paymentLoading ? 'Gerando...' : 'Ir para Pagamento'} <ChevronRight size={16}/>
                                        </button>
                                    </motion.div>
                                )}

                                {/* Estado: PIX */}
                                {checkoutStep === 'pix' && pixData && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                                        <p className="text-sm font-bold mb-3">Escaneie o QR Code abaixo</p>
                                        <div className="bg-white p-2 border-2 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                                            <img src={pixData.qr_code_base64 ? `data:image/jpeg;base64,${pixData.qr_code_base64}` : 'https://placehold.co/200x200?text=QR+Code'} alt="QR Code Pix" className="w-32 h-32"/>
                                        </div>
                                        <button onClick={() => navigator.clipboard.writeText(pixData.qr_code)} className="w-full bg-gray-100 border border-gray-300 text-black py-3 rounded-lg font-bold text-xs flex justify-center gap-2 hover:bg-gray-200 transition mb-4">
                                            <Copy size={14}/> COPIAR CÓDIGO PIX
                                        </button>
                                        <div className="flex justify-center items-center gap-2 text-[#FFCC00] text-xs font-bold uppercase animate-pulse">
                                            <Activity size={14}/> Aguardando banco...
                                        </div>
                                        <p className="text-[10px] text-gray-400 mt-2">Beneficiário: Nicolas Durgante / Repr.</p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                </motion.div>
            )}

            {/* 5. SUCESSO */}
            {view === 'success' && (
                <motion.div key="success" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white border-2 border-[#FFCC00] p-8 rounded-xl text-center max-w-md shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#FFCC00]"></div>
                    <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-6 text-[#FFCC00]"><CheckCircle size={40} /></div>
                    <h2 className="text-3xl font-black mb-2 uppercase">Aprovado!</h2>
                    <p className="text-gray-500 mb-6 font-medium">Seu protocolo foi liberado e enviado para <strong>{userEmail}</strong>.</p>
                    <button onClick={downloadManualPDF} className="w-full bg-[#FFCC00] text-black font-black py-4 rounded-lg shadow-lg hover:bg-[#E5B800] transition flex justify-center gap-2 uppercase tracking-wide">
                        BAIXAR AGORA <Download/>
                    </button>
                </motion.div>
            )}

        </AnimatePresence>

        {/* LOGIN MODAL */}
        <AnimatePresence>
            {showLogin && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-sm overflow-hidden border-t-4 border-[#FFCC00] rounded-lg shadow-2xl">
                        <div className="p-8 relative">
                            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-black hover:text-gray-600"><X size={24} /></button>
                            <h2 className="text-2xl font-black text-black uppercase mb-1">Login</h2>
                            <p className="text-sm text-gray-500 mb-6">Acesse sua área exclusiva.</p>
                            
                            <div className="space-y-4">
                                {loginError && <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-xs font-bold">{loginError}</div>}
                                <div><label className="block text-xs font-bold text-gray-900 uppercase mb-1">E-mail</label><input type="email" className="w-full bg-gray-50 border-2 border-gray-200 p-3 rounded font-medium focus:border-[#FFCC00] outline-none"/></div>
                                <div><label className="block text-xs font-bold text-gray-900 uppercase mb-1">Senha</label><input type="password" className="w-full bg-gray-50 border-2 border-gray-200 p-3 rounded font-medium focus:border-[#FFCC00] outline-none"/></div>
                                <button onClick={() => setLoginError("Você ainda não possui um plano ativo.")} className="w-full bg-black text-white font-black py-4 rounded hover:bg-gray-800 transition uppercase tracking-wide">Entrar</button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

    </main>

    {/* Footer */}
    <footer className="bg-white text-gray-500 py-10 text-sm border-t border-gray-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
                <span className="font-bold tracking-tight text-black">NUTRI OFFICIAL™</span>
            </div>
            <p className="text-[10px] text-gray-400">© 2025 Todos os direitos reservados.</p>
        </div>
    </footer>
    </div>
  );
}

function LoadingScreen({ onComplete }) {
    const [progress, setProgress] = useState(0);
    const [text, setText] = useState("Iniciando conexão segura...");

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(onComplete, 500);
                    return 100;
                }
                // Lógica de textos baseada no progresso
                if (prev === 20) setText("Analisando perfil metabólico...");
                if (prev === 50) setText("Calculando macronutrientes...");
                if (prev === 80) setText("Gerando arquivo PDF...");
                return prev + 1;
            });
        }, 50); // 50ms * 100 = 5 segundos totais
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-md bg-white p-10 text-center rounded-xl shadow-card border border-gray-100">
            <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="w-24 h-24 border-4 border-gray-100 rounded-full"></div>
                <div className="w-24 h-24 border-4 border-transparent border-t-[#FFCC00] rounded-full absolute top-0 left-0 animate-spin"></div>
                <FileText className="absolute inset-0 m-auto text-gray-300" size={32}/>
            </div>
            <h3 className="text-xl font-black text-black mb-2 uppercase">Processando...</h3>
            <p className="text-sm text-gray-500 mb-8 font-medium h-6">{text}</p>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-[#FFCC00] h-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}