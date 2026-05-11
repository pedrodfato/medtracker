import { Input } from "@/components/ui/input"
import { useState } from "react"
import { authClient } from "../lib/auth-client"
import { useNavigate, Link } from "react-router-dom"; // Dica: use Link no lugar de <a>
import pill1 from '../assets/pill-1.webp'
import logo2 from '../assets/logo2.webp'
import { Button } from '../components/button'

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("")

        const { data, error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            console.log("Erro ao se conectar com o servidor.", error.message);
            setErrorMsg("Erro ao se conectar com o servidor.")
            return;
        }
        navigate("/dashboard");
    }

    return (
        <div className="flex flex-col bg-linear-to-b from-[#F2F3F8] to-[#FFFFFF] to-35% min-h-screen items-center justify-around w-full px-4">
            <img src={logo2} width={200} alt="Logo" />
            
            <div className="flex flex-col items-center justify-center w-full max-w-sm px-4">
                
                <div className="relative inline-block 
                    after:content-[''] after:absolute after:-bottom-6 after:left-1/2 after:-translate-x-1/2
                    after:w-34 after:h-2 after:bg-black/80 after:rounded-full
                    after:blur-[19px] after:opacity-80">
                    <img src={pill1} width={130} alt="Pill" className="relative z-10 mb-5" />
                </div>
                <h1 className="text-black text-3xl font-regular mb-6 mt-15">Bem-vindo de volta!</h1>
              
                <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
                    <Input
                        id="email"
                        type="email"
                        placeholder="Endereço de Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        id="password"
                        type="password"
                        required
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    <div className="flex items-center">
                        <Link to="/esqueci-senha" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                            Esqueceu a senha?
                        </Link>
                    </div>

                    {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
                    <Button type="submit" className="w-full mt-4">
                        Login
                    </Button>
                    <p className="mt-2 mb-10 text-sm">Não tem uma conta? <Link to="/register" className="text-[#ABD43A] font-bold">Cadastre-se</Link></p>
                </form>
            </div>

     
        </div>
    )
}