import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { z } from "zod"
import { authClient } from "../lib/auth-client"
import { useNavigate, Link } from "react-router-dom";
import pill1 from '../assets/pill-1.webp'
import { Logo } from '../components/logo'
import { Button } from '../components/button'
import { User, Lock, Mail } from "lucide-react"
import { GlassCard } from "../components/glassCard"
import { Field } from "../components/field"

const registerSchema = z
    .object({
        name: z.string().trim().min(1, "Informe seu nome."),
        email: z.email("Informe um email válido."),
        password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres."),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem.",
        path: ["confirmPassword"],
    });

export function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg("");

        const result = registerSchema.safeParse({ name, email, password, confirmPassword });

        if (!result.success) {
            setErrorMsg(result.error.issues[0].message);
            return;
        }

        const { error } = await authClient.signUp.email({
            name: result.data.name,
            email: result.data.email,
            password: result.data.password,
        });

        if (error) {
            console.log("Erro ao criar conta.", error.message);
            setErrorMsg(error.message ?? "Erro ao criar conta.");
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
                    <h1 className="m-0 font-heading text-3xl font-semibold tracking-tight text-gray-900">Crie sua conta</h1>
                    <p className="mt-1 mb-6 text-sm text-gray-500">Leva menos de um minuto.</p>

                    <form onSubmit={handleRegister} className="flex w-full flex-col gap-4">
                        <Field label="Nome" htmlFor="name" icon={User}>
                            <Input
                                id="name"
                                type="text"
                                required
                                placeholder="Nome"
                                className="pl-11"
                                value={name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                            />
                        </Field>
                        <Field label="E-mail" htmlFor="email" icon={Mail}>
                            <Input
                                id="email"
                                type="email"
                                required
                                placeholder="Endereço de Email"
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
                        <Field label="Confirmar senha" htmlFor="confirmPassword" icon={Lock}>
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Confirmar senha"
                                className="pl-11"
                                value={confirmPassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                            />
                        </Field>
                        <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                            <Checkbox
                                checked={showPassword}
                                onCheckedChange={(checked) => setShowPassword(checked === true)}
                            />
                            Mostrar senha
                        </label>

                        {errorMsg && <p className="text-center text-sm text-red-500">{errorMsg}</p>}
                        <Button type="submit" className="mt-2 w-full">
                            Cadastrar
                        </Button>
                        <p className="text-center text-sm text-gray-600">
                            Já tem uma conta? <Link to="/login" className="font-semibold text-[#5c7d00]">Entrar</Link>
                        </p>
                    </form>
                </GlassCard>
            </main>
        </div>
    )
}
