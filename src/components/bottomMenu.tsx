import { Link, useLocation } from 'react-router-dom';
import { House, Pill, TrendingUpDown, User } from 'lucide-react';

export function Menu() {
    const location = useLocation();

    return (
        <div className="fixed bottom-0 w-full bg-white flex justify-around items-center pt-4 pb-6 px-4 rounded-t-[32px] shadow-[0_-8px_30px_rgba(0,0,0,0.06)] z-50">
            
            <Link to="/dashboard" className="flex flex-col items-center gap-1">
                <House 
                    size={24} 
                    className={location.pathname === '/dashboard' ? "text-[#ABD43A]" : "text-gray-400"} 
                />
                <span className={`text-[10px] font-medium ${location.pathname === '/dashboard' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Home
                </span>
            </Link>

            <Link to="/list" className="flex flex-col items-center gap-1">
                <Pill 
                    size={24} 
                    className={location.pathname === '/list' ? "text-[#ABD43A]" : "text-gray-400"} 
                />
                <span className={`text-[10px] font-medium ${location.pathname === '/list' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Lista
                </span>
            </Link>

            <Link to="/progress" className="flex flex-col items-center gap-1">
                <TrendingUpDown 
                    size={24} 
                    className={location.pathname === '/progress' ? "text-[#ABD43A]" : "text-gray-400"} 
                />
                <span className={`text-[10px] font-medium ${location.pathname === '/progress' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Progresso
                </span>
            </Link>

            <Link to="/profile" className="flex flex-col items-center gap-1">
                <User 
                    size={24} 
                    className={location.pathname === '/profile' ? "text-[#ABD43A]" : "text-gray-400"} 
                />
                <span className={`text-[10px] font-medium ${location.pathname === '/profile' ? 'text-gray-900' : 'text-gray-400'}`}>
                    Perfil
                </span>
            </Link>
            
        </div>
    );
}