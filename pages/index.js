import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Clock, ShieldCheck, Star, Leaf, Flame, 
  ChevronRight, Download, Copy, Smartphone, Lock, Activity, AlertCircle, Check, Zap, Menu, User
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
    ing: "• 1/2 abóbora cabotiá descascada\n• 1 pedaço de gengibre (3cm)\n• 1 cebola e 2 dentes de alho\n• Azeite e sal a gosto",
    prep: "1. Refogue a cebola e o alho no azeite.\n2. Adicione a abóbora em cubos e cubra com água.\n3. Cozinhe até amolecer bem.\n4. Bata no liquidificador com o gengibre.\n5. Volte para a panela, acerte o sal e sirva."
  },
  {
    title: "Suco Verde Desinchaço",
    ing: "• 1 folha de couve manteiga\n• 1 maçã pequena com casca\n• Suco de 1/2 limão\n• 1 pedaço pequeno de gengibre\n• 200ml de água gelada",
    prep: "1. Higienize bem as folhas e a maçã.\n2. Bata todos os ingredientes no liquidificador.\n3. Coe se preferir (mas sem coar tem mais fibras).\n4. Beba imediatamente em jejum."
  },
  {
    title: "Panqueca Low Carb (Sem Farinha)",
    ing: "• 1 banana madura amassada\n• 2 ovos inteiros\n• Canela a gosto",
    prep: "1. Amasse a banana e misture bem com os ovos batidos.\n2. Aqueça uma frigideira antiaderente untada com óleo de coco.\n3. Despeje a massa e doure dos dois lados.\n4. Sirva com um fio de mel se desejar."
  },
  {
    title: "Crepioca Fit",
    ing: "• 1 ovo\n• 2 colheres de sopa de goma de tapioca\n• 1 pitada de sal\n• Recheio: Queijo branco ou Frango",
    prep: "1. Misture o ovo e a tapioca com um garfo até ficar homogêneo.\n2. Despeje na frigideira quente como se fosse uma panqueca.\n3. Quando soltar do fundo, vire, coloque o recheio e dobre."
  },
  {
    title: "Molho de Salada Anti-inflamatório",
    ing: "• 3 colheres de azeite extra virgem\n• 1 colher de mostarda\n• Suco de 1/2 limão\n• Curcuma (açafrão) e pimenta do reino",
    prep: "1. Misture tudo vigorosamente com um garfo até emulsionar (ficar cremoso).\n2. Jogue sobre as folhas verdes na hora de comer."
  }
];

export default function App() {
  const [view, setView] = useState('landing');
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [pixData, setPixData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

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
    setQuizAnswers([...quizAnswers, answer]);
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setView('analyzing');
    }
  };

  const gerarPixReal = async () => {
    setPaymentLoading(true);
    try {
      const res = await fetch('/api/criar-pix', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'cliente@exemplo.com' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar pix');
      setPixData(data);
      setView('checkout');
      iniciarPolling(data.id);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar o Pix. Verifique a configuração.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const iniciarPolling = (id) => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/checar-status?id=${id}`);
        const data = await res.json();
        if (data.status === 'approved') {
          clearInterval(interval);
          setView('success');
        }
      } catch (e) { console.error("Erro no polling", e); }
    }, 3000);
  };

  const generatePDF = async () => {
    if (!window.jspdf) {
      await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload = r; document.body.appendChild(s); });
      await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js"; s.onload = r; document.body.appendChild(s); });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const userGoal = quizAnswers[0] || "Secar barriga (Urgente)";
    const selectedMenu = DIET_DATABASE[userGoal] || DIET_DATABASE["default"];

    doc.setFillColor(22, 163, 74); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255); doc.setFont('helvetica', 'bold'); doc.setFontSize(22); 
    doc.text("Protocolo TmFormat", 105, 20, null, null, "center");
    doc.setFontSize(14); doc.setFont('helvetica', 'normal');
    doc.text("Guia Oficial de 7 Dias", 105, 30, null, null, "center");

    doc.setTextColor(50); doc.setFontSize(12);
    doc.text(`Objetivo Selecionado: ${userGoal}`, 14, 55);
    doc.text("Este plano foi estrategicamente montado para acelerar seu metabolismo.", 14, 62);
    
    doc.autoTable({ startY: 70, head: [['Dia', 'Café da Manhã', 'Almoço', 'Jantar']], body: selectedMenu, theme: 'grid', headStyles: { fillColor: [22, 163, 74] }, styles: { cellPadding: 4, fontSize: 10 } });
    
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

    let yPos = 45; doc.setTextColor(0); 
    RECIPES_CONTENT.forEach((recipe) => {
        if (yPos > 250) { doc.addPage(); yPos = 30; }
        doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(22, 163, 74); doc.text(recipe.title, 14, yPos); yPos += 8;
        doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(0); doc.text("Ingredientes:", 14, yPos); yPos += 5;
        doc.setFont('helvetica', 'normal'); const splitIng = doc.splitTextToSize(recipe.ing, 180); doc.text(splitIng, 14, yPos); yPos += splitIng.length * 5 + 3;
        doc.setFont('helvetica', 'bold'); doc.text("Modo de Preparo:", 14, yPos); yPos += 5;
        doc.setFont('helvetica', 'normal'); const splitPrep = doc.splitTextToSize(recipe.prep, 180); doc.text(splitPrep, 14, yPos); yPos += splitPrep.length * 5 + 15;
    });
    doc.save("Dieta_TmFormat_Premium.pdf");
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-green-100 overflow-x-hidden">
      
      {/* HEADER CORPORATIVO (NOVO) */}
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
            <button className="text-sm font-bold text-gray-900 flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-full transition">
              <User size={18} /> Área de Membros
            </button>
          </div>
        </div>
      )}

      <AnimatePresence mode='wait'>
        
        {/* 1. LANDING PAGE REDESENHADA */}
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }} className="relative">
            
            {/* HERO SECTION PROFISSIONAL */}
            <div className="max-w-6xl mx-auto px-4 pt-16 pb-24 text-center md:text-left md:flex items-center gap-12">
              <div className="md:w-1/2">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-green-200 uppercase tracking-wide">
                  <Check size={14}/> Protocolo Clínico Atualizado 2025
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-[1.1] text-gray-900">
                  Reative o seu <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Metabolismo Natural</span> em 7 Dias.
                </h1>
                <p className="text-gray-500 mb-10 leading-relaxed text-lg md:pr-10">
                  A única plataforma que utiliza <strong>bio-dados</strong> para gerar um plano alimentar anti-inflamatório compatível com a sua rotina, idade e objetivos. Sem remédios, apenas ciência nutricional.
                </p>
                <div className="flex flex-col md:flex-row gap-4">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setView('quiz')} className="bg-gray-900 text-white text-lg font-bold py-4 px-10 rounded-xl shadow-xl flex items-center justify-center gap-3 hover:bg-black transition-all">
                    Iniciar Diagnóstico Gratuito <ArrowRight size={20} />
                  </motion.button>
                  <div className="flex items-center gap-2 justify-center text-sm font-medium text-gray-500 py-4">
                    <ShieldCheck size={18} className="text-green-600"/> Garantia de Satisfação
                  </div>
                </div>
              </div>
              
              {/* IMAGEM HERO ILUSTRATIVA (ABSTRATA) */}
              <div className="hidden md:block md:w-1/2 relative">
                 <div className="bg-gradient-to-tr from-green-100 to-emerald-50 rounded-[3rem] p-8 relative z-0">
                    <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop" className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500" alt="Prato Saudável" />
                    {/* Floating Badge */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-4">
                       <div className="bg-green-100 p-3 rounded-full text-green-700"><Activity/></div>
                       <div>
                         <p className="text-xs text-gray-400 uppercase font-bold">Resultado Médio</p>
                         <p className="text-xl font-extrabold text-gray-900">-2.4kg <span className="text-sm font-normal text-gray-500">/ semana</span></p>
                       </div>
                    </motion.div>
                 </div>
              </div>
            </div>

            {/* FAIXA DE AUTORIDADE (MÍDIA) */}
            <div className="border-y border-gray-100 bg-gray-50 py-10">
              <div className="max-w-6xl mx-auto px-4 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Metodologia baseada em estudos de:</p>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale">
                   {/* Logos simulados com texto para não quebrar links */}
                   <h3 className="text-xl font-serif font-bold">Vogue</h3>
                   <h3 className="text-xl font-serif font-bold">Healthline</h3>
                   <h3 className="text-xl font-serif font-bold">BoaForma</h3>
                   <h3 className="text-xl font-serif font-bold">Women's Health</h3>
                </div>
              </div>
            </div>

            {/* PROVA SOCIAL REALISTA */}
            <div className="max-w-2xl mx-auto px-4 py-20">
               <h3 className="text-2xl font-bold text-center mb-10">O que nossas alunas estão dizendo</h3>
               <div className="space-y-6">
                  {[
                    { name: "Ana P.", text: "Gente o chá seca msm?? to precisando kkk", time: "há 2 min", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces" },
                    { name: "Bruna Souza", text: "Comecei segunda, hj ja fechei o short jeans q nao entrava 😍 obrigada!!", time: "há 8 min", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces" },
                    { name: "Carla_Fitness", text: "Eu tinha mto medo de ser golpe mas chegou certinho no email, ufa 🙏 a dieta é top", time: "há 15 min", img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=100&h=100&fit=crop&crop=faces" }
                  ].map((c, i) => (
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

        {/* 2. QUIZ (Mantido o design clean) */}
        {view === 'quiz' && (
          <motion.div key="quiz" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} className="max-w-lg mx-auto bg-white min-h-screen flex flex-col shadow-2xl">
            <div className="w-full bg-gray-100 h-1.5"><motion.div initial={{ width: 0 }} animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }} className="bg-green-500 h-full rounded-r-full"></motion.div></div>
            <div className="flex-1 p-8 flex flex-col justify-center">
              <span className="text-green-600 font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2"><Activity size={12}/> Etapa {currentQuestion + 1}</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{QUIZ_QUESTIONS[currentQuestion].question}</h2>
              <p className="text-gray-500 mb-8 text-sm">{QUIZ_QUESTIONS[currentQuestion].subtitle}</p>
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((opt, i) => (
                  <motion.button key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} onClick={() => handleAnswer(opt.text)} className="w-full text-left p-4 border border-gray-200 rounded-2xl font-medium text-gray-700 flex items-center gap-4 hover:border-green-500 hover:bg-green-50 transition-all">
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
        {view === 'analyzing' && <AnalysisScreen onComplete={gerarPixReal} />}

        {/* 4. CHECKOUT REAL (LOCK SCREEN STYLE) */}
        {view === 'checkout' && pixData && (
          <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 p-6 opacity-30 blur-sm pointer-events-none bg-white">
                <h1 className="text-2xl font-bold text-gray-300 mb-4">Seu Protocolo Personalizado</h1>
                <div className="space-y-4">{[1,2,3].map(i => (<div key={i} className="p-4 border rounded-xl bg-gray-50"><div className="h-4 w-32 bg-gray-200 rounded mb-2"></div><div className="h-3 w-full bg-gray-100 rounded mb-1"></div></div>))}</div>
            </div>
            <div className="z-10 flex-1 flex items-center justify-center p-4">
                <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-gray-900 text-white p-4 text-center">
                        <div className="flex justify-center items-center gap-2 mb-1"><Lock size={20} className="text-green-400" /><span className="font-bold uppercase tracking-widest text-sm">Acesso Restrito</span></div>
                        <p className="text-xs text-gray-400">Seu plano foi gerado e está aguardando liberação.</p>
                    </div>
                    <div className="p-8">
                        <div className="text-center mb-8"><h2 className="text-2xl font-bold text-gray-800 mb-2">Desbloqueie seu Protocolo</h2><p className="text-gray-500 text-sm">O acesso completo ao cardápio de 7 dias + receitas está pronto.</p></div>
                        <div className="flex justify-center items-baseline gap-2 mb-8"><span className="text-gray-400 line-through text-lg">R$ 47,00</span><span className="text-4xl font-extrabold text-green-600">R$ 24,90</span></div>
                        <div className="bg-green-50 rounded-2xl p-6 border border-green-100 mb-6 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-green-200 text-green-800 text-[10px] px-2 py-1 rounded-bl-lg font-bold">SSL SEGURO</div>
                            <div className="bg-white/80 p-2 rounded mb-3 text-[10px] text-gray-500 flex items-center justify-center gap-1 border border-gray-100"><ShieldCheck size={12} className="text-green-600"/><span>Beneficiário: TmFormat / Representante Autorizado</span></div>
                            <p className="text-sm font-bold text-green-800 mb-3">Pague via Pix para liberar agora</p>
                            <div className="bg-white p-2 rounded-lg inline-block shadow-sm mb-3"><img src={pixData.qr_code_base64 ? `data:image/jpeg;base64,${pixData.qr_code_base64}` : 'https://placehold.co/200x200?text=QR+Code'} alt="QR Code Pix" className="w-40 h-40 mix-blend-multiply"/></div>
                            <button onClick={() => navigator.clipboard.writeText(pixData.qr_code)} className="w-full bg-white border border-green-200 text-green-700 py-3 rounded-xl font-bold text-xs flex justify-center gap-2 hover:bg-green-100 transition-colors"><Copy size={14}/> COPIAR CÓDIGO PIX</button>
                        </div>
                        <div className="text-center"><div className="flex justify-center items-center gap-2 text-green-600 text-sm animate-pulse font-medium"><div className="w-2 h-2 bg-green-600 rounded-full"></div> Aguardando confirmação do banco...</div></div>
                    </div>
                </motion.div>
            </div>
          </motion.div>
        )}

        {/* 5. SUCESSO */}
        {view === 'success' && (
          <motion.div key="success" initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center">
             <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} className="text-green-600" /></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Compra Confirmada!</h2>
                <button onClick={generatePDF} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg mt-6 flex justify-center gap-2 hover:bg-green-700"><Download size={20}/> BAIXAR PROTOCOLO</button>
             </div>
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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-24 h-24 mb-8">
         <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-full h-full border-4 border-gray-100 border-t-green-500 rounded-full"/>
         <Leaf className="absolute inset-0 m-auto text-green-500" size={24}/>
      </div>
      <h2 className="text-xl font-bold text-gray-800">{steps[step]}</h2>
    </div>
  );
}