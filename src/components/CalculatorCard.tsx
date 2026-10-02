import { ReactNode } from 'react';

interface CalculatorCardProps {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  children: ReactNode;
}

export default function CalculatorCard({ title, subtitle, icon, color, children }: CalculatorCardProps) {
  return (
    <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden shadow-xl hover:shadow-2xl hover:border-gray-600/50 transition-all duration-300 group">
      {/* Card Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>
      
      {/* Card Content */}
      <div className="px-5 pb-5 pt-2">
        {children}
      </div>
    </div>
  );
}
