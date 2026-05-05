import { useState } from "react"
import { isSameDay } from "date-fns"


export default function ProgressTracker() {
  
  const totalDias = 30
  const [daysTaken, setDaysTaken] = useState(0)
  const [medicationTaken, setMedicationTaken] = useState<Date | null>(null)
  
  const jaTomouHoje = medicationTaken ? isSameDay(new Date(), medicationTaken) : false;
  const endTreatment = daysTaken >= totalDias
  
  // SVG
  const raio = 80;
  const circunferencia = 2 * Math.PI * raio;
  const porcentagem = (daysTaken / totalDias) * 100;
  const offset = circunferencia - (porcentagem / 100) * circunferencia;
  
  const registrarDose = async () => {
      if (!jaTomouHoje && !endTreatment) {
        setDaysTaken((prev) => prev + 1);
        setMedicationTaken(new Date());
      }
    };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-[#0d0f18] rounded-2xl w-full max-w-sm mx-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black text-white">
          <div className="relative flex items-center justify-center w-64 h-64">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="128" cy="128" r={raio}
                stroke="#1a1c29" strokeWidth="16" fill="transparent"
              />
              <circle
                cx="128" cy="128" r={raio}
                stroke="#fbbf24" 
                strokeWidth="16"
                fill="transparent"
                strokeLinecap="round"
                strokeDasharray={circunferencia}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
  
            <div className="absolute flex flex-col items-center">
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">
                Progresso
              </span>
              <span className="text-5xl font-black tracking-tighter">
                {daysTaken}
                <span className="text-2xl text-gray-500">/{totalDias}</span>
              </span>
              <span className="text-amber-400 font-bold mt-1">Dias</span>
            </div>
          </div>
    
          <div className="mt-8 w-full">
            <button
              onClick={registrarDose}
              disabled={jaTomouHoje || endTreatment}
              className={`
                w-full py-4 text-xl font-black uppercase tracking-wide border-4 border-black transition-all
                ${endTreatment
                  ? 'bg-green-500 text-black opacity-100 cursor-not-allowed shadow-none'
                  : jaTomouHoje
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed shadow-none translate-y-1 translate-x-1'
                    : 'bg-amber-400 text-black active:translate-y-1 active:translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none'
                }
              `}
            >
              {endTreatment 
                ? 'Concluído 🏆' 
                : jaTomouHoje 
                  ? 'Remédio Tomado' 
                  : 'Tomar Dose'}
            </button>
          </div>
    
        </div>
      );
}