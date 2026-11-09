import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, Pill, Plus, TrendingUp, User } from "lucide-react";
import logo from "../assets/logo.webp";
import { buttonClasses } from "./buttonStyles";

const NAV = [
    { to: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
    { to: "/list", label: "Remédios", icon: Pill },
    { to: "/progress", label: "Progresso", icon: TrendingUp },
    { to: "/profile", label: "Perfil", icon: User },
];

export function Sidebar() {
    return (
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 p-5 lg:block">
            <div className="glass flex h-full flex-col gap-8 rounded-[28px] p-6">
                <img src={logo} alt="MedTracker" className="h-8 w-auto self-start" />
                <nav className="flex flex-col gap-1" aria-label="Navegação principal">
                    {NAV.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-[0_8px_20px_rgba(163,217,17,0.35)]"
                                        : "text-gray-600 hover:bg-white/60 hover:text-gray-900"
                                }`
                            }
                        >
                            <Icon className="size-[18px]" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
                <Link to="/add" className={buttonClasses("inverted", "mt-auto w-full")}>
                    <Plus className="size-[18px]" />
                    Adicionar remédio
                </Link>
            </div>
        </aside>
    );
}
