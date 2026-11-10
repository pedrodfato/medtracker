import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { authClient } from "../lib/auth-client"
import { useNavigate, Link } from "react-router-dom"; // Dica: use Link no lugar de <a>
import pill1 from '../assets/pill-1.webp'
import { Logo } from '../components/logo'
import { Button } from '../components/button'
import { Lock, Mail } from "lucide-react"
import { GlassCard } from "../components/glassCard"
import { Field } from "../components/field"

export function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("")

        const { error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            if (error.status === 401) {
                setErrorMsg("Email ou senha incorretos.")
            } else {
                console.error("Erro ao fazer login:", error.status, error.code);
                setErrorMsg("Erro ao se conectar com o servidor. Tente novamente.")
            }
            return;
        }
        navigate("/dashboard");
    }

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <aside className="hidden flex-col justify-between p-12 lg:flex">
                <Logo className="self-start text-2xl" />
                <div className="flex flex-col gap-6">
                    <img src={pill1} alt="" className="w-40 drop-shadow-[0_30px_40px_rgba(47,158,91,0.35)]" />
                    <h2 className="m-0 max-w-md font-heading text-5xl font-semibold leading-tight tracking-tight text-gray-900">
                        Seu tratamento, no tempo certo.
                    </h2>
                    <p className="max-w-sm text-gray-600">Lembretes, histórico e adesão de cada remédio num só lugar.</p>
                </div>
                <p className="text-sm text-gray-500">MedTracker</p>
            </aside>

            <main className="flex items-center justify-center px-4 py-10">
                <GlassCard className="glass-strong w-full max-w-md p-8">
                    <div className="mb-5 flex justify-center lg:hidden"><Logo className="text-xl" /></div>
                    <h1 className="m-0 font-heading text-3xl font-semibold tracking-tight text-gray-900">Bem-vindo de volta!</h1>
                    <p className="mt-1 mb-6 text-sm text-gray-500">Entre para ver seus remédios de hoje.</p>

                    <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
                        <Field label="E-mail" htmlFor="email" icon={Mail}>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Endereço de Email"
                                required
                                className="pl-11"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            />
                        </Field>
                        <Field label="Senha" htmlFor="password" icon={Lock}>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Senha"
                                className="pl-11"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                        </Field>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                                <Checkbox
                                    checked={showPassword}
                                    onCheckedChange={(checked) => setShowPassword(checked === true)}
                                />
                                Mostrar senha
                            </label>
                            <Link to="/esqueci-senha" className="text-sm text-gray-600 underline-offset-4 hover:underline">
                                Esqueceu a senha?
                            </Link>
                        </div>

                        {errorMsg && <p className="text-center text-sm text-red-500">{errorMsg}</p>}
                        <Button type="submit" className="mt-2 w-full">
                            Login
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                            Não tem uma conta? <Link to="/register" className="font-semibold text-[#5c7d00]">Cadastre-se</Link>
                        </p>
                    </form>
                </GlassCard>
            </main>
        </div>
    )
}
