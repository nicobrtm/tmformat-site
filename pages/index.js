import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, CheckCircle, Clock, ShieldCheck, Star, Zap, Flame, 
  ChevronRight, Download, Copy, Smartphone, Lock, Activity, AlertCircle, Check, Menu, User, X, Mail, Send, FileText, CreditCard, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURAÇÃO DA DIETA (MATRIX) ---
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
  "Melhorar digestão": [
    ['01', 'Mamão + Psyllium + Chá de Hortelã', 'Frango Grelhado + Quiabo Refogado', 'Sopa de Legumes Batida'],
    ['02', 'Iogurte Natural + Ameixa Seca', 'Peixe Cozido + Purê de Batata', 'Creme de Aipim com Frango'],
    ['03', 'Banana Cozida + Canela', 'Carne de Panela + Cenoura Cozida', 'Ovos Mexidos Leves'],
    ['04', 'Suco de Laranja Lima', 'Arroz Bem Cozido + Frango Desfiado', 'Canja de Galinha (Sem Pele)'],
    ['05', 'Maçã Cozida sem Casca', 'Peixe Grelhado + Purê de Moranga', 'Caldo de Feijão (Coado)'],
    ['06', 'Pera Cozida', 'Frango Desfiado + Polenta Mole', 'Creme de Espinafre'],
    ['07', 'Gelatina Natural', 'Peixe Assado + Batata Cozida', 'Sopa Leve de Legumes']
  ],
  "Perder peso na balança": [
    ['01', 'Pão Integral + Ovos Mexidos', 'Arroz + Feijão + Frango Grelhado', 'Sanduíche Natural de Atum'],
    ['02', 'Tapioca com Queijo Branco', 'Macarrão Integral + Carne Moída', 'Salada de Frutas com Iogurte'],
    ['03', 'Cuscuz + Ovos', 'Batata Doce Assada + Peixe', 'Iogurte + Granola sem Açúcar'],
    ['04', 'Panqueca de Banana e Aveia', 'Escondidinho de Batata + Carne', 'Wrap Integral de Frango'],
    ['05', 'Vitamina de Frutas Vermelhas', 'Strogonoff Light + Arroz Integral', 'Omelete Recheado com Queijo'],
    ['06', 'Pão com Ricota Temperada', 'Carne Assada + Mandioca Cozida', 'Sopa de Feijão com Legumes'],
    ['07', 'Crepioca de Frango', 'Feijoada Light + Couve + Laranja', 'Mingau de Aveia com Cacau']
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

// --- RECEITAS DETALHADAS ---
const RECIPES_CONTENT = [
  {
    title: "Sopa Detox de Abóbora com Gengibre",
    time: "40 min",
    temp: "Fogo Médio",
    portions: "2 pratos",
    ing: "• 1/2 abóbora cabotiá descascada\n• 1 pedaço de gengibre (3cm)\n• 1 cebola picada\n• 2 dentes de alho amassados\n• 1 colher (sopa) de azeite\n• Sal e pimenta a gosto\n• 500ml de água fervente",
    prep: "1. Numa panela, aqueça o azeite e refogue a cebola e o alho até dourarem.\n2. Adicione a abóbora em cubos e refogue por 2 minutos.\n3. Cubra com a água fervente e deixe cozinhar até a abóbora desmanchar (aprox. 25 min).\n4. Espere amornar e bata no liquidificador com o gengibre descascado.\n5. Volte para a panela, acerte o sal e aqueça antes de servir."
  },
  {
    title: "Suco Verde Desinchaço Turbo",
    time: "5 min",
    temp: "Gelado",
    portions: "1 copo grande",
    ing: "• 1 folha de couve manteiga (sem o talo grosso)\n• 1 maçã pequena com casca\n• Suco de 1/2 limão\n• 1 pedaço pequeno de gengibre\n• 200ml de água gelada ou água de coco",
    prep: "1. Higienize bem as folhas de couve e a maçã.\n2. Pique a maçã retirando as sementes.\n3. Coloque todos os ingredientes no liquidificador.\n4. Bata por 2 minutos na potência máxima até ficar homogêneo.\n5. Beba imediatamente sem coar para aproveitar as fibras."
  }
];

// --- COMENTÁRIOS ESTILO TIKTOK ---
const REAL_COMMENTS = [
  { name: "Ana P.", text: "Gente o chá seca msm?? to precisando kkk", time: "há 2 min", likes: 12, img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
  { name: "Bruna Souza", text: "Comecei segunda, hj ja fechei o short jeans q nao entrava 😍 obrigada!!", time: "há 8 min", likes: 45, img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces" },
  { name: "Carla_Fitness", text: "Eu tinha mto medo de ser golpe mas chegou certinho no email, ufa 🙏 a dieta é top", time: "há 15 min", likes: 89, img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=100&h=100&fit=crop&crop=faces" }
];

export default function App() {
  const [view, setView] = useState('landing');
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [pixData, setPixData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState('idle');
  
  const userEmailRef = useRef(userEmail);
  const quizAnswersRef = useRef(quizAnswers);
  const [savedGoal, setSavedGoal] = useState("Secar barriga (Urgente)");

  useEffect(() => {
    userEmailRef.current = userEmail;
    quizAnswersRef.current = quizAnswers;
  }, [userEmail, quizAnswers]);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem('tmformat_email');
    if (savedEmail) setUserEmail(savedEmail);
    const goal = localStorage.getItem('tmformat_goal');
    if (goal) setSavedGoal(goal);
    const savedPix = localStorage.getItem('tmformat_pix_data');
    if (savedPix) {
      const parsedPix = JSON.parse(savedPix);
      setPixData(parsedPix);
      setView('checkout');
      verificarStatusIndividual(parsedPix.id);
      iniciarPolling(parsedPix.id); 
    }
  }, []);

  useEffect(() => { if (!showLogin) setLoginError(''); }, [showLogin]);

  // --- QUIZ COMPLETO ---
  const QUIZ_QUESTIONS = [
    {
      id: 1, question: "Qual seu objetivo principal?", subtitle: "Vamos personalizar os alimentos para a sua meta.",
      options: [{ text: "Secar barriga (Urgente)", icon: "🔥", color: "text-orange-500" }, { text: "Desinchar o corpo todo", icon: "💧", color: "text-blue-500" }, { text: "Melhorar digestão", icon: "🍃", color: "text-green-500" }, { text: "Perder peso na balança", icon: "⚖️", color: "text-purple-500" }]
    },
    {
      id: 2, question: "Quantos anos tem?", subtitle: "O metabolismo muda a cada década.",
      options: [{ text: "18 a 29 anos", icon: "👱‍♀️", color: "text-pink-400" }, { text: "30 a 45 anos", icon: "👩", color: "text-purple-400" }, { text: "45 a 60 anos", icon: "👩‍🦱", color: "text-indigo-400" }, { text: "60+ anos", icon: "👵", color: "text-gray-500" }]
    },
    {
      id: 3, question: "Como é a sua energia à tarde?", subtitle: "Isto indica-nos como está o seu nível de glicose.",
      options: [{ text: "Muito baixa (sinto sono)", icon: "😴", color: "text-blue-400" }, { text: "Normal, mas canso fácil", icon: "😐", color: "text-gray-500" }, { text: "Tenho picos de energia", icon: "⚡", color: "text-yellow-500" }, { text: "Estável o dia todo", icon: "🚀", color: "text-red-500" }]
    },
    {
      id: 4, question: "Sente a barriga inchada?", subtitle: "Identificando inflamação intestinal...",
      options: [{ text: "Sempre após comer", icon: "🎈", color: "text-red-400" }, { text: "Às vezes", icon: "🤔", color: "text-orange-400" }, { text: "Raramente", icon: "😌", color: "text-green-400" }, { text: "Nunca", icon: "❌", color: "text-gray-400" }]
    },
    {
      id: 5, question: "Quanta água bebe por dia?", subtitle: "A hidratação é chave para desinchar.",
      options: [{ text: "Menos de 1 litro", icon: "🌵", color: "text-yellow-600" }, { text: "Entre 1 e 2 litros", icon: "💧", color: "text-blue-400" }, { text: "Mais de 2 litros", icon: "🌊", color: "text-blue-600" }, { text: "Só bebo quando tenho sede", icon: "🤷‍♀️", color: "text-gray-400" }]
    },
    {
      id: 6, question: "Qual o seu maior ponto fraco?", subtitle: "Vamos incluir substitutos saudáveis.",
      options: [{ text: "Doces e Sobremesas", icon: "🍩", color: "text-pink-500" }, { text: "Pães e Massas", icon: "🥖", color: "text-yellow-500" }, { text: "Salgadinhos e Frituras", icon: "🍟", color: "text-red-500" }, { text: "Refrigerante ou Álcool", icon: "🥤", color: "text-purple-500" }]
    },
    {
      id: 7, question: "Qual o seu nível de atividade física?", subtitle: "Para calcularmos o seu gasto calórico basal.",
      options: [{ text: "Sedentário (Trabalho sentada)", icon: "🪑", color: "text-gray-500" }, { text: "Leve (Caminhadas ocasionais)", icon: "🚶‍♀️", color: "text-green-500" }, { text: "Moderado (Academia 3x/semana)", icon: "💪", color: "text-orange-500" }, { text: "Intenso (Treino todos os dias)", icon: "🏋️‍♀️", color: "text-red-500" }]
    },
    {
      id: 8, question: "Como é a qualidade do seu sono?", subtitle: "O sono regula as hormonas da fome.",
      options: [{ text: "Durmo pouco e acordo cansada", icon: "😫", color: "text-gray-600" }, { text: "Demoro a adormecer", icon: "👀", color: "text-blue-400" }, { text: "Durmo bem (7-8 horas)", icon: "😴", color: "text-indigo-500" }, { text: "Sono interrompido", icon: "🌙", color: "text-yellow-600" }]
    },
    {
      id: 9, question: "Quanto tempo tem para cozinhar?", subtitle: "Adaptamos as receitas à sua rotina.",
      options: [{ text: "Muito pouco (preciso de praticidade)", icon: "⚡", color: "text-orange-500" }, { text: "Consigo fazer o básico", icon: "🍳", color: "text-yellow-500" }, { text: "Gosto de preparar as refeições", icon: "👩‍🍳", color: "text-green-500" }, { text: "Tenho ajuda/como fora", icon: "🍽️", color: "text-blue-500" }]
    }
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
      setView('analyzing');
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
      setView('checkout');
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
        if (response.ok) {
            setEmailStatus('success');
        } else {
            console.error("Falha no envio do email.");
            setEmailStatus('error');
        }
    } catch (e) { 
        console.error("Erro no envio auto", e);
        setEmailStatus('error');
    } finally { 
        setSendingEmail(false); 
    }
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
    if (!window.jspdf) {
      await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload = r; document.body.appendChild(s); });
      await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js"; s.onload = r; document.body.appendChild(s); });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const userGoal = savedGoal || quizAnswers[0] || "Secar barriga (Urgente)";
    const selectedMenu = DIET_DATABASE[userGoal] || DIET_DATABASE["default"];
    generatePDFContent(doc, userGoal, selectedMenu);
    doc.save("Dieta_TmFormat_Premium.pdf");
  };

  const generatePDFContent = (doc, userGoal, selectedMenu) => {
    doc.setFillColor(255, 204, 0); doc.rect(0, 0, 210, 40, 'F'); // AMARELO QCY
    doc.setTextColor(0); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); 
    doc.text("Protocolo TmFormat", 105, 20, null, null, "center");
    doc.setFontSize(14); doc.setFont('helvetica', 'normal');
    doc.text("Guia Oficial de 7 Dias", 105, 30, null, null, "center");

    doc.setTextColor(50); doc.setFontSize(12);
    doc.text(`Objetivo Selecionado: ${userGoal}`, 14, 55);
    doc.text("Este plano foi estrategicamente montado para acelerar seu metabolismo.", 14, 62);
    
    doc.autoTable({ 
      startY: 70, 
      head: [['Dia', 'Café da Manhã', 'Almoço', 'Jantar']], 
      body: selectedMenu, 
      theme: 'grid', 
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 204, 0] }, // Preto e Amarelo
      styles: { cellPadding: 4, fontSize: 10 }
    });
    
    let finalY = doc.lastAutoTable.finalY + 15;
    doc.setDrawColor(255, 204, 0); doc.setLineWidth(1.5); doc.rect(14, finalY, 182, 35);
    doc.setTextColor(0); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); 
    doc.text("BÔNUS: Chá Secreto (Jejum)", 20, finalY + 10);
    doc.setTextColor(0); doc.setFont('helvetica', 'normal'); doc.setFontSize(10); 
    doc.text("Ingredientes: 500ml água, 1 pau de canela, 3 rodelas de gengibre.", 20, finalY + 20);
    doc.text("Preparo: Ferva a água com especiarias por 5 min. Adicione 1/2 limão no final.", 20, finalY + 26);

    doc.addPage();
    doc.setFillColor(255, 204, 0); doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(0); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text("Guia de Receitas Práticas", 105, 20, null, null, "center");

    let yPos = 45; 
    
    RECIPES_CONTENT.forEach((recipe) => {
        if (yPos > 250) { doc.addPage(); yPos = 30; }

        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text(recipe.title, 14, yPos);
        yPos += 7;

        doc.setFontSize(10); doc.setTextColor(100); doc.setFont('helvetica', 'bold');
        doc.text(`⏱ Tempo: ${recipe.time}  |  🔥 Fogo: ${recipe.temp}  |  🥣 Porções: ${recipe.portions}`, 14, yPos);
        yPos += 8;

        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(0);
        doc.text("Ingredientes:", 14, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        const splitIng = doc.splitTextToSize(recipe.ing, 180);
        doc.text(splitIng, 14, yPos);
        yPos += splitIng.length * 5 + 3;

        doc.setFont('helvetica', 'bold');
        doc.text("Modo de Preparo:", 14, yPos);
        yPos += 5;
        doc.setFont('helvetica', 'normal');
        const splitPrep = doc.splitTextToSize(recipe.prep, 180);
        doc.text(splitPrep, 14, yPos);
        yPos += splitPrep.length * 5 + 15;
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-yellow-200 overflow-x-hidden">
      
      {/* HEADER TIPO QCY (PRETO + AMARELO) */}
      {view === 'landing' && (
        <div className="bg-black text-white sticky top-0 z-50 shadow-md">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-yellow-400">
              <Zap size={28} className="fill-yellow-400 text-yellow-400"/>
              <span>TmFormat<span className="text-white">.</span></span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wide text-gray-300">
              <span className="hover:text-yellow-400 cursor-pointer transition">Método</span>
              <span className="hover:text-yellow-400 cursor-pointer transition">Resultados</span>
              <span className="hover:text-yellow-400 cursor-pointer transition">Sobre</span>
            </div>
            <button 
              onClick={() => setShowLogin(true)} 
              className="text-xs font-bold bg-white text-black flex items-center gap-2 hover:bg-yellow-400 px-4 py-2 rounded transition uppercase tracking-wide"
            >
              <User size={16} /> Área de Membros
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode='wait'>
        
        {/* 1. LANDING PAGE ESTILO QCY */}
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }} className="relative">
            <div className="max-w-6xl mx-auto px-4 pt-12 pb-24 flex flex-col-reverse md:flex-row items-center gap-12">
              <div className="md:w-1/2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-black text-yellow-400 px-4 py-1.5 rounded-sm text-xs font-black mb-6 uppercase tracking-wider">
                  <Check size={14}/> Tecnologia Metabólica 2025
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] text-black">
                  REATIVE O SEU <br/>
                  <span className="text-yellow-500">METABOLISMO</span>.
                </h1>
                <p className="text-gray-600 mb-10 leading-relaxed text-lg md:pr-10 font-medium">
                  Protocolo de alta performance baseado em bio-dados. Acelere a queima de gordura sem remédios.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('quiz')} className="bg-yellow-400 text-black text-xl font-black py-4 px-12 rounded-sm shadow-xl flex items-center justify-center gap-3 hover:bg-yellow-300 transition-all uppercase tracking-wide">
                    INICIAR ANÁLISE <ArrowRight size={24} />
                  </motion.button>
                </div>
                <div className="mt-8 flex items-center gap-6 justify-center md:justify-start text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span className="flex items-center gap-2"><ShieldCheck className="text-black"/> Garantia Total</span>
                    <span className="flex items-center gap-2"><Zap className="text-black"/> Acesso Imediato</span>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 relative">
                 <div className="relative z-0">
                    {/* Imagem estilo produto tecnológico */}
                    <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop" className="rounded-sm shadow-2xl w-full grayscale hover:grayscale-0 transition-all duration-700" alt="Prato Saudável" style={{clipPath: "polygon(10% 0, 100% 0, 100% 90%, 90% 100%, 0 100%, 0 10%)"}} />
                    
                    {/* Badge Flutuante Estilo Spec de Produto */}
                    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute -bottom-6 right-0 bg-black text-white p-6 rounded-sm shadow-xl border-l-4 border-yellow-400">
                       <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Resultado Médio</div>
                       <div className="text-4xl font-black text-yellow-400">-2.4kg <span className="text-sm font-normal text-white">/ semana</span></div>
                    </motion.div>
                 </div>
              </div>
            </div>

            {/* SEÇÃO DE PROVA SOCIAL */}
            <div className="bg-gray-100 py-16 border-t border-gray-200">
               <div className="max-w-2xl mx-auto px-4">
                  <h3 className="text-2xl font-black text-center mb-12 uppercase tracking-tight">Quem usa aprova</h3>
                  <div className="grid gap-6">
                      {REAL_COMMENTS.map((c, i) => (
                        <div key={i} className="bg-white p-6 rounded-sm shadow-sm flex gap-4 items-start border-l-4 border-yellow-400">
                          <img src={c.img} className="w-12 h-12 rounded-full object-cover grayscale" alt={c.name} />
                          <div>
                            <div className="flex justify-between items-center w-full mb-1">
                                <h4 className="font-bold text-sm text-black">{c.name}</h4>
                                <div className="flex text-yellow-500"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                            </div>
                            <p className="text-gray-600 text-sm font-medium leading-relaxed">"{c.text}"</p>
                          </div>
                        </div>
                      ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {/* 2. QUIZ ESTILO TECH */}
        {view === 'quiz' && (
          <motion.div key="quiz" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="max-w-lg mx-auto bg-white min-h-screen flex flex-col">
            <div className="w-full bg-gray-200 h-2"><motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }} className="bg-yellow-400 h-full"></motion.div></div>
            <div className="flex-1 p-8 flex flex-col justify-center">
              <span className="text-gray-400 font-black text-xs tracking-widest uppercase mb-4 flex items-center gap-2"><Activity size={12} className="text-yellow-500"/> Passo {currentQuestion + 1}/{QUIZ_QUESTIONS.length}</span>
              <h2 className="text-3xl font-black text-black mb-2 leading-none uppercase">{QUIZ_QUESTIONS[currentQuestion].question}</h2>
              <p className="text-gray-500 mb-8 text-sm font-medium border-l-2 border-yellow-400 pl-3">{QUIZ_QUESTIONS[currentQuestion].subtitle}</p>
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((opt, i) => (
                  <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => handleAnswer(opt.text)} className="w-full text-left p-5 border-2 border-gray-100 rounded-sm font-bold text-gray-800 flex items-center gap-4 hover:border-yellow-400 hover:bg-yellow-50 transition-all active:scale-95 group">
                    <span className={`text-2xl bg-gray-100 w-12 h-12 flex items-center justify-center rounded-sm group-hover:bg-yellow-400 transition-colors`}>{opt.icon}</span>
                    <span className="flex-1">{opt.text}</span>
                    <ChevronRight className="text-gray-300 group-hover:text-black" size={20}/>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. ANALISANDO */}
        {view === 'analyzing' && <AnalysisScreen onComplete={() => setView('capture_email')} />}

        {/* 4. CAPTURA DE EMAIL */}
        {view === 'capture_email' && (
            <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6 text-center bg-black text-white">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 text-black"><Mail size={48}/></div>
                <h2 className="text-3xl font-black mb-4 uppercase">Para onde enviamos?</h2>
                <p className="text-gray-400 mb-8 font-medium">Seu protocolo foi gerado. Digite seu e-mail para receber o acesso seguro.</p>
                <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="w-full bg-gray-900 border border-gray-700 rounded-sm p-5 mb-4 text-lg focus:border-yellow-400 focus:ring-0 outline-none text-white placeholder-gray-600"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
                <button onClick={submitEmailAndPay} className="w-full bg-yellow-400 text-black font-black py-5 rounded-sm shadow-lg hover:bg-yellow-300 transition active:scale-95 uppercase tracking-wide">IR PARA O PAGAMENTO</button>
                <p className="text-[10px] text-gray-500 mt-6 uppercase tracking-widest flex justify-center gap-2"><Lock size={10}/> Dados Criptografados</p>
            </motion.div>
        )}

        {/* 5. CHECKOUT REAL (COM PDF REALISTA AO FUNDO) */}
        {view === 'checkout' && pixData && (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">
            
            {/* BACKGROUND: DOCUMENTO REALISTA COM BLUR */}
            <div className="absolute inset-0 pt-16 px-4 pointer-events-none flex flex-col items-center bg-gray-200">
                <div className="w-full max-w-lg bg-white shadow-2xl border border-gray-300 h-full p-8 relative scale-95 origin-top opacity-60 blur-[3px]">
                    <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
                       <div className="flex items-center gap-2 text-black">
                          <Zap size={24} className="fill-black"/>
                          <span className="font-black text-xl uppercase tracking-tighter">TmFormat</span>
                       </div>
                       <span className="text-sm font-bold text-gray-400">CONFIDENCIAL</span>
                    </div>
                    <h1 className="text-3xl font-black text-black mb-2 uppercase">Protocolo: {savedGoal || quizAnswers[0] || "Personalizado"}</h1>
                    <p className="text-sm text-gray-600 mb-8 font-medium">Plano de Ativação Metabólica - Ciclo de 7 Dias</p>
                    
                    {/* CONTEÚDO REAL DA DIETA */}
                    <div className="space-y-6"> 
                        {(() => {
                            const userGoal = savedGoal || quizAnswers[0] || "Secar barriga (Urgente)";
                            const selectedMenu = DIET_DATABASE[userGoal] || DIET_DATABASE["default"];
                            return selectedMenu.slice(0, 5).map((day, i) => (
                               <div key={i} className="flex gap-4 text-sm border-b border-gray-100 pb-4">
                                  <div className="w-12 h-12 bg-black text-yellow-400 flex items-center justify-center font-black text-lg shrink-0">0{day[0]}</div>
                                  <div className="flex-1 space-y-2">
                                     <p className="font-bold text-black"><span className="text-yellow-600">CAFÉ:</span> {day[1]}</p>
                                     <p className="font-bold text-black"><span className="text-yellow-600">ALMOÇO:</span> {day[2]}</p>
                                     <p className="font-bold text-black"><span className="text-yellow-600">JANTAR:</span> {day[3]}</p>
                                  </div>
                               </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>

            {/* FOREGROUND: LOCK MODAL ESTILO QCY */}
            <div className="z-10 flex-1 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md shadow-2xl overflow-hidden border-2 border-black relative">
                    <div className="bg-black text-white p-5 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400 rotate-45 transform translate-x-10 -translate-y-10"></div>
                        <div className="flex justify-center items-center gap-2 mb-1 relative z-10"><Lock size={20} className="text-yellow-400" /><span className="font-black uppercase tracking-widest text-sm">Acesso Bloqueado</span></div>
                        <p className="text-xs text-gray-400 relative z-10">Finalize para liberar o download imediato.</p>
                    </div>
                    
                    {/* --- PRÉVIA DO ARQUIVO --- */}
                    <div className="px-6 pt-6">
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-center gap-4 shadow-sm">
                           <div className="w-12 h-12 bg-white flex items-center justify-center shadow-sm shrink-0 border border-gray-200">
                              <FileText size={24} className="text-black" />
                           </div>
                           <div className="text-left flex-1 min-w-0">
                              <h3 className="font-black text-black text-sm truncate uppercase">Protocolo: {savedGoal || quizAnswers[0] || "Personalizado"}</h3>
                              <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-wide">PDF • 2.4MB • Pronto</p>
                           </div>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4 border-dashed">
                            <span className="text-gray-400 font-bold text-sm line-through">R$ 47,00</span>
                            <span className="text-4xl font-black text-black tracking-tighter">R$ 24,90</span>
                        </div>

                        <div className="text-center mb-6">
                            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Escaneie o QR Code</div>
                            <div className="bg-white p-2 border-2 border-black inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                                <img src={pixData.qr_code_base64 ? `data:image/jpeg;base64,${pixData.qr_code_base64}` : 'https://placehold.co/200x200?text=QR+Code'} alt="QR Code Pix" className="w-40 h-40 mix-blend-multiply"/>
                            </div>
                            <button onClick={() => navigator.clipboard.writeText(pixData.qr_code)} className="w-full bg-black text-white py-4 font-bold text-xs flex justify-center gap-2 hover:bg-gray-800 transition-colors uppercase tracking-widest"><Copy size={14}/> Copiar Código Pix</button>
                        </div>

                        <div className="bg-gray-50 p-3 text-[10px] text-gray-500 text-center font-medium border border-gray-100">
                            Beneficiário: Nicolas Durgante / Repr. Autorizado
                        </div>

                        <div className="text-center mt-4"><div className="flex justify-center items-center gap-2 text-yellow-600 text-xs font-bold uppercase animate-pulse"><Activity size={14}/> Aguardando banco...</div></div>
                    </div>
                </motion.div>
            </div>
          </motion.div>
        )}

        {/* 6. SUCESSO */}
        {view === 'success' && (
          <motion.div key="success" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6 text-center bg-black text-white">
             <div className="bg-gray-900 border border-gray-800 p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-yellow-400"></div>
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 text-black"><CheckCircle size={40} /></div>
                <h2 className="text-3xl font-black mb-2 uppercase">Compra Aprovada!</h2>
                <p className="text-gray-400 mb-8 text-sm">Enviamos uma cópia para <strong>{userEmail}</strong>.</p>
                <button onClick={downloadManualPDF} className="w-full bg-yellow-400 text-black font-black py-5 shadow-[0px_0px_20px_rgba(250,204,21,0.4)] hover:bg-yellow-300 transition uppercase tracking-wide flex justify-center gap-2">
                    BAIXAR AGORA <Download/>
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL ESTILO QCY */}
      <AnimatePresence>
        {showLogin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white w-full max-w-sm overflow-hidden border-2 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.2)]">
              <div className="p-8 relative">
                <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-black hover:text-gray-600"><X size={24} /></button>
                <div className="text-center mb-8"><h2 className="text-2xl font-black text-black uppercase tracking-tight">Área do Aluno</h2><p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Acesso Restrito</p></div>
                <div className="space-y-4">
                  <AnimatePresence>{loginError && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-xs font-bold flex items-start gap-2"><AlertCircle size={14} className="shrink-0 mt-0.5" /><span>{loginError}</span></motion.div>)}</AnimatePresence>
                  <div><label className="block text-xs font-black text-black uppercase mb-1 ml-1">E-mail</label><input type="email" placeholder="seu@email.com" className="w-full bg-gray-50 border-2 border-gray-200 p-4 text-sm font-medium focus:border-yellow-400 focus:bg-white outline-none transition-colors"/></div>
                  <div><label className="block text-xs font-black text-black uppercase mb-1 ml-1">Senha</label><input type="password" placeholder="••••••••" className="w-full bg-gray-50 border-2 border-gray-200 p-4 text-sm font-medium focus:border-yellow-400 focus:bg-white outline-none transition-colors"/></div>
                  <button onClick={() => setLoginError("Você ainda não possui um plano ativo. Realize a compra para liberar seu acesso.")} className="w-full bg-black text-white font-black py-4 hover:bg-gray-900 transition uppercase tracking-wide">Entrar</button>
                </div>
                <div className="mt-8 text-center text-xs font-bold text-gray-400 uppercase">Ainda não tem acesso? <button onClick={() => {setShowLogin(false); setView('quiz');}} className="text-black border-b-2 border-yellow-400 hover:bg-yellow-50 ml-1">Começar agora</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalysisScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const steps = ["Conectando servidor seguro...", "Calculando metabolismo...", "Gerando PDF personalizado..."];
  useEffect(() => {
    const i = setInterval(() => setStep(s => (s < 2 ? s + 1 : s)), 1500);
    setTimeout(onComplete, 5000); 
    return () => clearInterval(i);
  }, []);
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-24 h-24 mb-8">
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-full h-full border-4 border-gray-800 border-t-yellow-400 rounded-full"/>
         <Zap className="absolute inset-0 m-auto text-yellow-400 fill-yellow-400" size={32}/>
      </div>
      <h2 className="text-xl font-black text-white uppercase tracking-wider">{steps[step]}</h2>
    </div>
  );
}