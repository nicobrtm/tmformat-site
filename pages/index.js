import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, CheckCircle, Clock, ShieldCheck, Star, Leaf, Flame, 
  ChevronRight, Download, Copy, Smartphone, Lock, Activity, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURAÇÃO ---
const DIET_DATABASE = {
  "Secar barriga (Urgente)": [['01', 'Ovos + Café', 'Frango + Salada', 'Sopa Detox'], ['02', 'Iogurte + Chia', 'Peixe + Brócolis', 'Omelete'], ['03', 'Abacate + Ovos', 'Carne Moída + Abobrinha', 'Caldo de Ossos'], ['04', 'Café com Óleo de Coco', 'Sobrecoxa Assada + Couve', 'Creme de Chuchu'], ['05', 'Queijo Coalho Grelhado', 'Lombo Suíno + Repolho', 'Salada de Atum'], ['06', 'Ovos Cozidos + Castanhas', 'Frango ao Curry + Couve-flor', 'Wrap de Alface'], ['07', 'Panqueca Low Carb', 'Peixe Assado + Espinafre', 'Sopa de Abóbora']],
  "Desinchar o corpo todo": [['01', 'Suco Verde', 'Peixe + Arroz', 'Sopa Abóbora'], ['02', 'Melão', 'Frango + Aspargos', 'Salada Pepino'], ['03', 'Mamão + Linhaça', 'Salmão + Batata Doce', 'Creme de Cenoura'], ['04', 'Chá de Hibisco + Torrada', 'Carne Magra + Chuchu', 'Omelete com Espinafre'], ['05', 'Abacaxi com Canela', 'Filé de Tilápia + Salada', 'Sopa de Legumes'], ['06', 'Melancia + Queijo Branco', 'Frango Desfiado + Purê', 'Salada Caprese'], ['07', 'Água de Coco + Castanhas', 'Peixe Assado + Tomate', 'Caldo Verde Light']],
  "Melhorar digestão": [['01', 'Mamão', 'Frango + Quiabo', 'Sopa Legumes'], ['02', 'Iogurte', 'Peixe + Purê', 'Creme Aipim'], ['03', 'Banana Cozida + Canela', 'Carne de Panela + Cenoura', 'Ovos Mexidos Leves'], ['04', 'Suco de Laranja Lima', 'Arroz Bem Cozido + Frango', 'Sopa de Canja'], ['05', 'Maçã Cozida', 'Peixe Grelhado + Purê Moranga', 'Caldo de Feijão (s/ grão)'], ['06', 'Pera Cozida', 'Frango Desfiado + Polenta', 'Creme de Espinafre'], ['07', 'Gelatina Natural', 'Peixe Assado + Batata', 'Sopa de Legumes']],
  "Perder peso na balança": [['01', 'Pão Integral', 'Arroz + Feijão', 'Sanduíche'], ['02', 'Tapioca', 'Macarrão Int.', 'Salada Frutas'], ['03', 'Cuscuz + Ovos', 'Batata Doce + Peixe', 'Iogurte + Granola'], ['04', 'Panqueca de Banana', 'Escondidinho de Batata', 'Wrap Integral'], ['05', 'Vitamina de Frutas', 'Strogonoff Light + Arroz', 'Omelete Recheado'], ['06', 'Pão com Ricota', 'Carne Assada + Mandioca', 'Sopa de Feijão'], ['07', 'Crepioca de Frango', 'Feijoada Light + Couve', 'Mingau de Aveia']]
};

export default function App() {
  const [view, setView] = useState('landing');
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600);
  const [pixData, setPixData] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  // Quiz Logic
  const QUIZ_QUESTIONS = [
    { id: 1, question: "Qual seu objetivo principal?", subtitle: "Base do cardápio.", options: [{text: "Secar barriga (Urgente)", icon: "🔥"}, {text: "Desinchar o corpo todo", icon: "💧"}, {text: "Melhorar digestão", icon: "🍃"}, {text: "Perder peso na balança", icon: "⚖️"}] },
    { id: 2, question: "Como é sua energia à tarde?", subtitle: "Nível de glicose.", options: [{text: "Muito baixa", icon: "😴"}, {text: "Normal", icon: "😐"}, {text: "Tenho picos", icon: "⚡"}] },
    { id: 3, question: "Sente a barriga estufada?", subtitle: "Inflamação intestinal.", options: [{text: "Sempre", icon: "🎈"}, {text: "Às vezes", icon: "🤔"}, {text: "Nunca", icon: "😌"}] }
  ];

  const handleAnswer = (answer) => {
    setQuizAnswers([...quizAnswers, answer]);
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) setCurrentQuestion(currentQuestion + 1);
    else setView('analyzing');
  };

  // --- LÓGICA DE PAGAMENTO REAL ---
  const gerarPix = async () => {
    setLoadingPayment(true);
    try {
      const res = await fetch('/api/criar-pix', { method: 'POST' });
      const data = await res.json();
      setPixData(data);
      setView('checkout');
      iniciarVerificacao(data.id);
    } catch (error) {
      alert("Erro ao gerar Pix. Tente novamente.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const iniciarVerificacao = (id) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/checar-status?id=${id}`);
      const data = await res.json();
      if (data.status === 'approved') {
        clearInterval(interval);
        setView('success');
      }
    }, 3000);
  };

  // --- LÓGICA DE PDF ---
  const generatePDF = async () => {
    if (!window.jspdf) {
        await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"; s.onload = r; document.body.appendChild(s); });
        await new Promise(r => { const s = document.createElement('script'); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js"; s.onload = r; document.body.appendChild(s); });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const userGoal = quizAnswers[0] || "Secar barriga (Urgente)";
    const selectedMenu = DIET_DATABASE[userGoal] || DIET_DATABASE["Secar barriga (Urgente)"];

    doc.setFillColor(22, 163, 74); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255); doc.setFontSize(22); doc.text("Protocolo TmFormat", 105, 25, null, null, "center");
    doc.setTextColor(50); doc.setFontSize(12); doc.text(`Objetivo: ${userGoal}`, 14, 50);
    
    doc.autoTable({ startY: 60, head: [['Dia', 'Café', 'Almoço', 'Jantar']], body: selectedMenu, theme: 'grid', headStyles: { fillColor: [22, 163, 74] } });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setDrawColor(255, 165, 0); doc.rect(14, finalY, 182, 30);
    doc.setTextColor(255, 140, 0); doc.text("BÔNUS: Chá Secreto", 20, finalY + 10);
    doc.setTextColor(0); doc.setFontSize(10); doc.text("Ferver 500ml água + gengibre + canela.", 20, finalY + 20);
    
    doc.save("Dieta_TmFormat.pdf");
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="bg-gray-900 text-white text-center text-xs py-2 px-4 sticky top-0 z-50">Oferta encerra em: {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div>

      {view === 'landing' && (
        <div className="max-w-md mx-auto bg-white min-h-screen p-6 text-center pt-10">
           <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold mb-6">🔥 Método Validado</div>
           <h1 className="text-4xl font-extrabold mb-6">Desinche até <span className="text-green-600">3kg em 7 dias</span>.</h1>
           <button onClick={() => setView('quiz')} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg mb-4 flex items-center justify-center gap-2">Iniciar Análise <ArrowRight/></button>
           <div className="flex justify-center gap-1 text-yellow-400"><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/></div>
           <p className="text-xs text-gray-500 mt-2">4.9/5 por 12k+ alunas</p>
        </div>
      )}

      {view === 'quiz' && (
        <div className="max-w-md mx-auto bg-white min-h-screen p-6">
          <div className="w-full bg-gray-200 h-1.5 mb-8"><div className="bg-green-600 h-full" style={{width: `${((currentQuestion+1)/3)*100}%`}}></div></div>
          <h2 className="text-2xl font-bold mb-6">{QUIZ_QUESTIONS[currentQuestion].question}</h2>
          <div className="space-y-3">
            {QUIZ_QUESTIONS[currentQuestion].options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.text)} className="w-full p-4 border rounded-xl hover:bg-green-50 text-left flex gap-3 text-lg items-center">
                <span>{opt.icon}</span> <span className="font-bold text-gray-700">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'analyzing' && <AnalysisScreen onComplete={gerarPix} />}

      {view === 'checkout' && pixData && (
        <div className="max-w-md mx-auto bg-white min-h-screen p-6 text-center">
           <h2 className="text-xl font-bold mb-2">Resumo do Pedido</h2>
           <div className="flex justify-between border-b pb-4 mb-4"><span className="text-gray-500">Protocolo VIP</span> <span className="font-bold text-green-600">R$ 1,00</span></div>
           <div className="bg-gray-50 p-6 rounded-xl border mb-6">
             <img src={`data:image/jpeg;base64,${pixData.qr_code_base64}`} alt="Pix" className="mx-auto w-48 mb-4"/>
             <button onClick={() => navigator.clipboard.writeText(pixData.qr_code)} className="bg-white border w-full py-2 rounded text-xs font-bold text-green-600 flex justify-center gap-2"><Copy size={14}/> Copiar Código</button>
           </div>
           <div className="flex justify-center items-center gap-2 text-green-600 text-sm animate-pulse"><Activity size={16}/> Aguardando pagamento...</div>
        </div>
      )}

      {view === 'success' && (
        <div className="max-w-md mx-auto bg-green-50 min-h-screen p-6 text-center flex flex-col justify-center">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} className="text-green-600"/></div>
           <h2 className="text-2xl font-bold mb-2">Compra Aprovada!</h2>
           <button onClick={generatePDF} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg flex justify-center gap-2 mt-8"><Download/> BAIXAR PDF AGORA</button>
        </div>
      )}
    </div>
  );
}

function AnalysisScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const steps = ["Conectando...", "Calculando metabolismo...", "Gerando PDF..."];
  useEffect(() => {
    const i = setInterval(() => setStep(s => (s < 2 ? s + 1 : s)), 1500);
    setTimeout(onComplete, 4500);
    return () => clearInterval(i);
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold">{steps[step]}</h2>
    </div>
  );
}