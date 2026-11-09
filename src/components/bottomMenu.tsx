import { Link, useLocation } from 'react-router-dom';
import { House, Pill, TrendingUpDown, User } from 'lucide-react';

export function Menu() {
    const location = useLocation();

    return (
        <div className="glass-strong fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-[28px] px-4 py-3">
            
            <Link to="/dashboard" className="flex flex-col items-center gap-1">
                <House 
                    size={24} 
                    className={location.pathname === '/dashboard' ? "text-primary" : "text-gray-400"} 
                />
                <span className={`text-[10px] font-medium ${location.pathname === '/dashboard' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Home
                </span>
            </Link>

            <Link to="/list" className="flex flex-col items-center gap-1">
                <Pill 
                    size={24} 
                    className={location.pathname === '/list' ? "text-primary" : "text-gray-400"} 
                />
                <span className={`text-[10px] font-medium ${location.pathname === '/list' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Lista
                </span>
            </Link>

            <Link to="/progress" className="flex flex-col items-center gap-1">
                <TrendingUpDown 
                    size={24} 
                    className={location.pathname === '/progress' ? "text-primary" : "text-gray-400"} 
                />
                <span className={`text-[10px] font-medium ${location.pathname === '/progress' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Progresso
                </span>
            </Link>

            <Link to="/profile" className="flex flex-col items-center gap-1">
                <User 
                    size={24} 
                    className={location.pathname === '/profile' ? "text-primary" : "text-gray-400"} 
                />
                <span className={`text-[10px] font-medium ${location.pathname === '/profile' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Perfil
                </span>
            </Link>
            
        </div>
    );
}