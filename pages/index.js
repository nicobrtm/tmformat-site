import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, CheckCircle, Clock, ShieldCheck, Star, Leaf, Flame, 
  ChevronRight, Download, Copy, Smartphone, Lock, Activity, AlertCircle, Check, Zap, Menu, User, X, Mail, Send, FileText
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
  },
  {
    title: "Panqueca Low Carb de Banana",
    time: "10 min",
    temp: "Fogo Baixo",
    portions: "2 panquecas",
    ing: "• 1 banana madura amassada\n• 2 ovos inteiros\n• 1 colher (chá) de canela em pó\n• Óleo de coco para untar",
    prep: "1. Num prato fundo, amasse bem a banana com um garfo.\n2. Adicione os ovos e bata bem com um garfo até misturar tudo.\n3. Misture a canela.\n4. Aqueça uma frigideira antiaderente untada com um pouco de óleo de coco em fogo baixo.\n5. Despeje pequenas porções da massa e deixe dourar (cerca de 2 min de cada lado)."
  },
  {
    title: "Crepioca Fit de Frango",
    time: "15 min",
    temp: "Fogo Médio",
    portions: "1 unidade",
    ing: "• 1 ovo\n• 2 colheres (sopa) de goma de tapioca\n• 1 pitada de sal\n• 1 colher (sopa) de requeijão light (na massa)\n• Recheio: 3 colheres de frango desfiado temperado",
    prep: "1. Numa tigela, misture o ovo, a tapioca, o sal e o requeijão. Bata bem até ficar liso.\n2. Aqueça uma frigideira antiaderente levemente untada.\n3. Despeje a massa e espalhe girando a frigideira.\n4. Quando a massa soltar do fundo e firmar, vire.\n5. Coloque o frango em metade da massa, dobre ao meio e deixe dourar mais um pouco."
  },
  {
    title: "Molho de Salada Anti-inflamatório",
    time: "2 min",
    temp: "Ambiente",
    portions: "4 porções",
    ing: "• 3 colheres (sopa) de azeite extra virgem\n• 1 colher (sopa) de mostarda amarela\n• Suco de 1/2 limão\n• 1 colher (café) de cúrcuma (açafrão)\n• Pimenta do reino a gosto",
    prep: "1. Coloque todos os ingredientes num pote de vidro pequeno com tampa.\n2. Feche o pote e chacoalhe vigorosamente até o molho ficar cremoso e emulsionado.\n3. Sirva sobre saladas verdes ou legumes cozidos."
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
  
  // Estado para recuperar o objetivo da dieta mesmo após refresh
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

    // Recupera o objetivo salvo para o PDF não quebrar
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
    // Se for a primeira pergunta (Objetivo), salva no localStorage
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
    
    // Usa o objetivo salvo ou o atual
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
    doc.setFillColor(22, 163, 74); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); 
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
      headStyles: { fillColor: [22, 163, 74] },
      styles: { cellPadding: 4, fontSize: 10 }
    });
    
    let finalY = doc.lastAutoTable.finalY + 15;
    doc.setDrawColor(255, 165, 0); doc.setLineWidth(1.5); doc.rect(14, finalY, 182, 35);
    doc.setTextColor(255, 140, 0); doc.setFont('helvetica', 'bold'); doc.setFontSize(14); 
    doc.text("BÔNUS: Chá Secreto (Jejum)", 20, finalY + 10);
    doc.setTextColor(0); doc.setFont('helvetica', 'normal'); doc.setFontSize(10); 
    doc.text("Ingredientes: 500ml água, 1 pau de canela, 3 rodelas de gengibre.", 20, finalY + 20);
    doc.text("Preparo: Ferva a água com especiarias por 5 min. Adicione 1/2 limão no final.", 20, finalY + 26);

    doc.addPage();
    doc.setFillColor(22, 163, 74); doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255); doc.setFontSize(18); doc.setFont('helvetica', 'bold');
    doc.text("Guia de Receitas Práticas", 105, 20, null, null, "center");

    let yPos = 45; 
    
    RECIPES_CONTENT.forEach((recipe) => {
        if (yPos > 250) { doc.addPage(); yPos = 30; }

        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 163, 74);
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
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-green-100 overflow-x-hidden">
      
      {/* HEADER CORPORATIVO */}
      {view === 'landing' && (
        <div className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900 tracking-tight">
              <Leaf size={24} className="fill-green-600 text-green-600"/>
              <span>TmFormat<span className="text-green-600">.</span></span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-500">
              <span className="hover:text-green-600 cursor-pointer transition">O Método</span>
              <span className="hover:text-green-600 cursor-pointer transition">Resultados</span>
              <span className="hover:text-green-600 cursor-pointer transition">Ciência</span>
            </div>
            <button 
              onClick={() => setShowLogin(true)} 
              className="text-sm font-bold text-gray-900 flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-full transition"
            >
              <User size={18} /> Área de Membros
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode='wait'>
        
        {/* 1. LANDING PAGE */}
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }} className="relative">
            <div className="max-w-6xl mx-auto px-4 pt-10 md:pt-16 pb-24 text-center md:text-left md:flex items-center gap-12">
              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-green-200 uppercase tracking-wide">
                  <Check size={14}/> Protocolo Clínico Atualizado 2025
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-gray-900">
                  O Plano Nutricional Específico para o <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500"><span className="underline decoration-green-400 decoration-4 underline-offset-4">SEU</span> Metabolismo</span>.
                </h1>
                <p className="text-gray-500 mb-10 leading-relaxed text-lg md:pr-10">
                  A única plataforma que utiliza <strong>bio-dados</strong> para gerar um plano alimentar anti-inflamatório compatível com a sua rotina, idade e objetivos. Sem remédios, apenas ciência nutricional.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setView('quiz')} className="bg-gray-900 text-white text-lg font-bold py-4 px-10 rounded-xl shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all">
                    Iniciar Análise de Perfil <ArrowRight size={20} />
                  </motion.button>
                  <div className="flex items-center gap-2 justify-center text-sm font-medium text-gray-500 py-4">
                    <ShieldCheck size={18} className="text-green-600"/> Garantia de Satisfação
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 relative mt-12 md:mt-0">
                 <div className="bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[3rem] p-6 md:p-8 relative z-0">
                    <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop" className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500 w-full" alt="Prato Saudável" />
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute -bottom-6 -left-0 md:-left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4">
                       <div className="bg-green-100 p-3 rounded-full text-green-700"><Activity/></div>
                       <div>
                         <p className="text-xs text-gray-400 uppercase font-bold">Resultado Médio</p>
                         <p className="text-xl font-extrabold text-gray-900">-2.4kg <span className="text-sm font-normal text-gray-500">/ semana</span></p>
                       </div>
                    </motion.div>
                 </div>
              </div>
            </div>

            <div className="border-y border-gray-100 bg-gray-50 py-10">
              <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Metodologia baseada em estudos de:</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
                   <h3 className="text-xl font-serif font-bold">Vogue</h3><h3 className="text-xl font-serif font-bold">Healthline</h3><h3 className="text-xl font-serif font-bold">BoaForma</h3><h3 className="text-xl font-serif font-bold">Women's Health</h3>
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-20">
               <h3 className="text-2xl font-bold text-center mb-10">O que nossas alunas estão dizendo</h3>
               <div className="space-y-6">
                  {REAL_COMMENTS.map((c, i) => (
                    <div key={i} className="flex gap-4 items-start border-b border-gray-100 pb-6 last:border-0">
                       <img src={c.img} className="w-12 h-12 rounded-full object-cover" alt={c.name} />
                       <div>
                         <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1">{c.name} <span className="text-xs font-normal text-gray-400">• {c.time}</span></h4>
                         <p className="text-gray-600 mt-1">{c.text}</p>
                         <div className="flex gap-4 mt-2 text-xs text-gray-400 font-bold cursor-pointer"><span>Curtir</span><span>Responder</span></div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}

        {/* 2. QUIZ */}
        {view === 'quiz' && (
          <motion.div key="quiz" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="max-w-lg mx-auto bg-white min-h-screen flex flex-col shadow-2xl">
            <div className="w-full bg-gray-100 h-1.5"><motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }} className="bg-green-500 h-full rounded-r-full"></motion.div></div>
            <div className="flex-1 p-8 flex flex-col justify-center">
              <span className="text-green-600 font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2"><Activity size={12}/> Etapa {currentQuestion + 1}</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{QUIZ_QUESTIONS[currentQuestion].question}</h2>
              <p className="text-gray-500 mb-8 text-sm">{QUIZ_QUESTIONS[currentQuestion].subtitle}</p>
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((opt, i) => (
                  <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => handleAnswer(opt.text)} className="w-full text-left p-4 border border-gray-200 rounded-2xl font-medium text-gray-700 flex items-center gap-4 hover:border-green-500 hover:bg-green-50 transition-all active:scale-95">
                    <span className={`text-2xl bg-gray-50 w-12 h-12 flex items-center justify-center rounded-2xl ${opt.color} bg-opacity-10`}>{opt.icon}</span>
                    <span className="flex-1 font-semibold">{opt.text}</span>
                    <ChevronRight className="text-gray-300" size={18}/>
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
            <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Mail size={40} className="text-green-600"/></div>
                <h2 className="text-2xl font-bold mb-2">Onde devemos enviar seu plano?</h2>
                <p className="text-gray-500 mb-6">Seu protocolo foi gerado com sucesso! Digite seu melhor e-mail para receber a cópia de segurança.</p>
                <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    className="w-full border border-gray-300 rounded-xl p-4 mb-4 text-lg focus:ring-2 focus:ring-green-500 outline-none"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                />
                <button onClick={submitEmailAndPay} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition active:scale-95">IR PARA O PAGAMENTO</button>
                <p className="text-xs text-gray-400 mt-4 flex justify-center gap-1"><Lock size={12}/> Seus dados estão seguros e não enviaremos spam.</p>
            </motion.div>
        )}

        {/* 5. CHECKOUT REAL (COM PREVIEW NA CAIXA) */}
        {view === 'checkout' && pixData && (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">
            
            {/* BACKGROUND: DOCUMENTO REALISTA COM BLUR */}
            <div className="absolute inset-0 pt-16 px-4 pointer-events-none flex flex-col items-center bg-gray-100">
                <div className="w-full max-w-lg bg-white shadow-xl border border-gray-200 h-full rounded-t-xl p-6 relative scale-95 origin-top opacity-50 blur-[2px]">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                       <div className="flex items-center gap-2 text-green-700">
                          <Leaf size={20}/>
                          <span className="font-bold">TmFormat</span>
                       </div>
                       <span className="text-xs text-gray-400">{new Date().toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Protocolo: {savedGoal || quizAnswers[0] || "Personalizado"}</h1>
                    <p className="text-sm text-gray-500 mb-6">Plano alimentar oficial de 7 dias para reativação metabólica.</p>
                    
                    {/* CONTEÚDO REAL DA DIETA (PARA DAR VONTADE) */}
                    <div className="space-y-4"> 
                        {(() => {
                            const userGoal = savedGoal || quizAnswers[0] || "Secar barriga (Urgente)";
                            const selectedMenu = DIET_DATABASE[userGoal] || DIET_DATABASE["default"];
                            return selectedMenu.slice(0, 5).map((day, i) => (
                               <div key={i} className="flex gap-3 text-xs border-b border-gray-100 pb-2">
                                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center font-bold text-green-600 shrink-0">0{day[0]}</div>
                                  <div className="flex-1 space-y-1">
                                     <p className="font-bold text-gray-800">Café: {day[1]}</p>
                                     <p className="text-gray-600">Almoço: {day[2]}</p>
                                     <p className="text-gray-600">Jantar: {day[3]}</p>
                                  </div>
                               </div>
                            ));
                        })()}
                    </div>
                </div>
            </div>

            {/* FOREGROUND: LOCK MODAL */}
            <div className="z-10 flex-1 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-900 text-white p-4 text-center">
                        <div className="flex justify-center items-center gap-2 mb-1"><Lock size={20} className="text-green-400" /><span className="font-bold uppercase tracking-widest text-sm">Acesso Restrito</span></div>
                        <p className="text-xs text-gray-400">Seu plano foi gerado e está aguardando liberação.</p>
                    </div>
                    
                    {/* --- NOVA PRÉVIA DO PDF DENTRO DO MODAL --- */}
                    <div className="px-8 pt-6 pb-2">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm relative overflow-hidden group">
                           <div className="absolute top-0 right-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg uppercase">Pronto</div>
                           <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                              <FileText size={24} className="text-red-500" />
                           </div>
                           <div className="text-left flex-1 min-w-0">
                              <p className="text-xs text-gray-400 font-medium mb-0.5">Arquivo PDF • 2.4MB</p>
                              <h3 className="font-bold text-gray-800 text-sm truncate">Protocolo: {savedGoal || quizAnswers[0] || "Personalizado"}</h3>
                              <p className="text-[10px] text-green-600 flex items-center gap-1 mt-1"><CheckCircle size={10}/> Verificado e Personalizado</p>
                           </div>
                        </div>
                    </div>
                    {/* ------------------------------------------ */}

                    <div className="p-8 pt-4">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Desbloqueie seu Protocolo</h2>
                            <div className="flex justify-center items-baseline gap-2"><span className="text-gray-400 line-through text-lg">R$ 47,00</span><span className="text-4xl font-extrabold text-green-600">R$ 24,90</span></div>
                        </div>

                        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 mb-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-200 text-green-800 text-[10px] px-2 py-1 rounded-bl-lg font-bold">SSL SEGURO</div>
                            <div className="bg-white/80 p-2 rounded mb-3 text-[10px] text-gray-500 flex items-center justify-center gap-1 border border-gray-100"><ShieldCheck size={12} className="text-green-600"/><span>Beneficiário: Nicolas Durgante / Repr. Autorizado</span></div>
                            <p className="text-sm font-bold text-green-800 mb-3">Pague via Pix para liberar agora</p>
                            <div className="bg-white p-2 rounded-lg inline-block shadow-sm mb-3"><img src={pixData.qr_code_base64 ? `data:image/jpeg;base64,${pixData.qr_code_base64}` : 'https://placehold.co/200x200?text=QR+Code'} alt="QR Code Pix" className="w-40 h-40 mix-blend-multiply"/></div>
                            <button onClick={() => navigator.clipboard.writeText(pixData.qr_code)} className="w-full bg-white border border-green-200 text-green-700 py-3 rounded-xl font-bold text-xs flex justify-center gap-2 hover:bg-green-100 transition-colors active:scale-95"><Copy size={14}/> COPIAR CÓDIGO PIX</button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg"><ShieldCheck size={16} className="text-green-500"/> Compra Segura</div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg"><Zap size={16} className="text-yellow-500"/> Acesso Imediato</div>
                        </div>

                        <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700 border border-yellow-100 text-center">
                            <strong>Importante:</strong> Se sair desta tela, retorne para confirmar o recebimento do seu acesso.
                        </div>

                        <div className="text-center mt-4"><div className="flex justify-center items-center gap-2 text-green-600 text-sm animate-pulse font-medium"><div className="w-2 h-2 bg-green-600 rounded-full"></div> Aguardando confirmação do banco...</div></div>
                    </div>
                </motion.div>
            </div>
          </motion.div>
        )}

        {/* 6. SUCESSO */}
        {view === 'success' && (
          <motion.div key="success" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="max-w-md mx-auto min-h-screen flex flex-col justify-center p-6 text-center">
             <div className="bg-white rounded-[2.5rem] shadow-2xl p-8">
                <CheckCircle size={60} className="text-green-600 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold mb-2">Tudo Pronto!</h2>
                <p className="text-gray-500 mb-6">Uma cópia também foi enviada para <strong>{userEmail}</strong>.</p>
                <div className={`text-xs mb-6 bg-gray-50 p-2 rounded ${emailStatus === 'error' ? 'text-red-500' : 'text-gray-400'}`}>
                   {emailStatus === 'sending' && "Enviando e-mail automaticamente..."}
                   {emailStatus === 'success' && "✅ E-mail enviado com sucesso!"}
                   {emailStatus === 'error' && "⚠️ Erro ao enviar e-mail. Baixe abaixo."}
                </div>
                <button onClick={downloadManualPDF} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center gap-2 hover:bg-green-700 transition active:scale-95">
                    BAIXAR AGORA <Download/>
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      <AnimatePresence>
        {showLogin && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-6 relative">
                <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
                <div className="text-center mb-6"><h2 className="text-xl font-bold text-gray-900">Área do Aluno</h2><p className="text-sm text-gray-500">Digite seus dados para entrar.</p></div>
                <div className="space-y-4">
                  <AnimatePresence>{loginError && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-xs flex items-start gap-2"><AlertCircle size={14} className="shrink-0 mt-0.5" /><span>{loginError}</span></motion.div>)}</AnimatePresence>
                  <div><label className="block text-xs font-bold text-gray-700 uppercase mb-1">E-mail</label><input type="email" placeholder="seu@email.com" className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-green-500"/></div>
                  <div><label className="block text-xs font-bold text-gray-700 uppercase mb-1">Senha</label><input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-green-500"/></div>
                  <button onClick={() => setLoginError("Você ainda não possui um plano ativo. Realize a compra para liberar seu acesso.")} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition active:scale-95">Entrar na Plataforma</button>
                </div>
                <div className="mt-6 text-center text-xs text-gray-400">Ainda não é aluno? <button onClick={() => {setShowLogin(false); setView('quiz');}} className="text-green-600 font-bold hover:underline">Fazer análise gratuita</button></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalysisScreen({ onComplete }) {
  useEffect(() => { setTimeout(onComplete, 3000); }, []);
  return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div></div>;
}