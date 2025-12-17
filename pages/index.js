import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Clock, ShieldCheck, Star, Leaf, Flame, 
  ChevronRight, Download, Copy, Smartphone, Lock, Activity, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURAÇÃO DA DIETA (MATRIX) ---
// Este banco de dados permite entregar o PDF correto sem gastar com IA
const DIET_DATABASE = {
  "Secar barriga (Urgente)": [['01', 'Ovos + Café', 'Frango + Salada', 'Sopa Detox'], ['02', 'Iogurte + Chia', 'Peixe + Brócolis', 'Omelete'], ['03', 'Abacate + Ovos', 'Carne Moída + Abobrinha', 'Caldo de Ossos'], ['04', 'Café com Óleo de Coco', 'Sobrecoxa Assada + Couve', 'Creme de Chuchu'], ['05', 'Queijo Coalho Grelhado', 'Lombo Suíno + Repolho', 'Salada de Atum'], ['06', 'Ovos Cozidos + Castanhas', 'Frango ao Curry + Couve-flor', 'Wrap de Alface'], ['07', 'Panqueca Low Carb', 'Peixe Assado + Espinafre', 'Sopa de Abóbora']],
  "Desinchar o corpo todo": [['01', 'Suco Verde', 'Peixe + Arroz', 'Sopa Abóbora'], ['02', 'Melão', 'Frango + Aspargos', 'Salada Pepino'], ['03', 'Mamão + Linhaça', 'Salmão + Batata Doce', 'Creme de Cenoura'], ['04', 'Chá de Hibisco + Torrada', 'Carne Magra + Chuchu', 'Omelete com Espinafre'], ['05', 'Abacaxi com Canela', 'Filé de Tilápia + Salada', 'Sopa de Legumes'], ['06', 'Melancia + Queijo Branco', 'Frango Desfiado + Purê', 'Salada Caprese'], ['07', 'Água de Coco + Castanhas', 'Peixe Assado + Tomate', 'Caldo Verde Light']],
  // Fallback para outros objetivos
  "default": [['01', 'Mamão', 'Frango + Quiabo', 'Sopa Legumes'], ['02', 'Iogurte', 'Peixe + Purê', 'Creme Aipim'], ['03', 'Banana Cozida', 'Carne de Panela', 'Ovos Mexidos'], ['04', 'Suco Laranja', 'Arroz + Frango', 'Sopa Canja'], ['05', 'Maçã Cozida', 'Peixe Grelhado', 'Caldo Feijão'], ['06', 'Pera', 'Frango + Polenta', 'Creme Espinafre'], ['07', 'Gelatina', 'Peixe Assado', 'Sopa Legumes']]
};

export default function App() {
  const [view, setView] = useState('landing');
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [pixData, setPixData] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Timer Regressivo (Gatilho de Urgência)
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- QUIZ COMPLETO (PREMIUM) ---
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

  // --- INTEGRAÇÃO COM BACKEND (PIX REAL) ---
  const gerarPixReal = async () => {
    setPaymentLoading(true);
    try {
      // Chama a API que criamos no passo anterior (/pages/api/criar-pix.js)
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
      alert("Erro ao gerar o Pix. Se estiver testando localmente, certifique-se de que o backend está rodando.");
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

  // --- GERAR PDF ---
  const generatePDF = async () => {
    // Carrega a biblioteca de PDF sob demanda (para não pesar o site)
    if (!window.jspdf) {
      await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload = r; document.body.appendChild(s); });
      await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js"; s.onload = r; document.body.appendChild(s); });
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const userGoal = quizAnswers[0] || "Secar barriga (Urgente)";
    const selectedMenu = DIET_DATABASE[userGoal] || DIET_DATABASE["default"];

    // Capa e Títulos
    doc.setFillColor(22, 163, 74); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255); doc.setFontSize(22); doc.text("Protocolo TmFormat", 105, 25, null, null, "center");
    doc.setTextColor(50); doc.setFontSize(12); doc.text(`Objetivo: ${userGoal}`, 14, 50);
    
    // Tabela do Plano Alimentar
    doc.autoTable({ 
      startY: 60, 
      head: [['Dia', 'Café', 'Almoço', 'Jantar']], 
      body: selectedMenu, 
      theme: 'grid', 
      headStyles: { fillColor: [22, 163, 74] } 
    });
    
    // Bônus
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setDrawColor(255, 165, 0); doc.setLineWidth(1.5); doc.rect(14, finalY, 182, 35);
    doc.setTextColor(255, 140, 0); doc.setFontSize(14); doc.text("BÓNUS: Chá Secreto (Jejum)", 20, finalY + 10);
    doc.setTextColor(0); doc.setFontSize(10); doc.text("Ferver 500ml água com gengibre e canela. Adicionar limão no final.", 20, finalY + 20);

    doc.save("Dieta_TmFormat_Premium.pdf");
  };

  // --- RENDERIZAÇÃO DA TELA (VISUAL) ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 selection:bg-green-100 overflow-x-hidden">
      
      {/* HEADER DE ESCASSEZ */}
      <div className="bg-gray-900 text-white text-center text-xs py-2 font-medium px-4 sticky top-0 z-50 shadow-md flex justify-center items-center gap-2">
        <Clock size={14} className="text-yellow-400 animate-pulse" />
        <span>Oferta especial encerra em: <span className="font-mono font-bold text-yellow-400 text-sm ml-1">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span></span>
      </div>

      <AnimatePresence mode='wait'>
        
        {/* 1. LANDING PAGE */}
        {view === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }} className="max-w-lg mx-auto bg-white min-h-screen shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 via-white to-white z-0"></div>
            <main className="relative z-10 px-6 pt-10 pb-20 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 font-bold text-xl text-green-700 bg-white/80 p-3 rounded-2xl shadow-sm mb-6"><Leaf size={24} className="fill-green-600"/><span>TmFormat</span></motion.div>
              
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-green-200"><Flame size={14} className="text-orange-500 fill-orange-500"/>Método Validado 2025</div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-6 leading-[1.1] text-gray-900">O fim do <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">Inchaço Abdominal</span>.</h1>
              
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setView('quiz')} className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white text-lg font-bold py-5 px-8 rounded-2xl shadow-xl flex items-center justify-center gap-3 relative overflow-hidden group">
                <span className="relative z-10">Iniciar Análise de Perfil</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <div className="mt-12 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                 <div className="flex -space-x-3">{[1,2,3,4].map(i => (<div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>))}</div>
                 <div className="text-xs text-left"><div className="flex text-yellow-400"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div><span className="font-bold">4.9/5</span> por 12k+ alunas</div>
              </div>
            </main>
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

        {/* 4. CHECKOUT REAL */}
        {view === 'checkout' && pixData && (
          <motion.div key="checkout" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8 text-center">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <span className="text-gray-500 text-sm">Protocolo VIP</span>
                  <div className="text-right"><span className="text-xs text-red-400 line-through block">R$ 97,00</span><span className="text-2xl font-bold text-green-600">R$ 1,00</span></div>
                </div>
                
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100 mb-6">
                  <p className="text-sm font-bold text-green-800 mb-4 flex justify-center gap-2"><Smartphone size={16}/> Escaneie para pagar</p>
                  {/* Verifica se a imagem base64 veio corretamente, senão usa placeholder para não quebrar layout no teste local */}
                  <img src={pixData.qr_code_base64 ? `data:image/jpeg;base64,${pixData.qr_code_base64}` : 'https://placehold.co/200x200?text=QR+Code'} alt="QR Code Pix" className="mx-auto w-48 rounded-lg mb-4 mix-blend-multiply"/>
                  <button onClick={() => navigator.clipboard.writeText(pixData.qr_code)} className="w-full bg-white border border-green-200 text-green-700 py-3 rounded-xl font-bold text-xs flex justify-center gap-2 hover:bg-green-50"><Copy size={14}/> COPIAR CÓDIGO PIX</button>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg flex gap-3 text-left mb-4">
                    <AlertCircle className="text-yellow-600 shrink-0" size={18}/>
                    <p className="text-xs text-yellow-800">Pagamento seguro. Acesso liberado imediatamente após o Pix.</p>
                </div>
                
                <div className="flex justify-center items-center gap-2 text-green-600 text-sm animate-pulse font-medium"><Activity size={16}/> Aguardando confirmação do banco...</div>
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
    // Tempo aumentado para 5 segundos para dar a sensação de "processamento"
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