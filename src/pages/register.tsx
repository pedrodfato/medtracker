import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { z } from "zod"
import { authClient } from "../lib/auth-client"
import { useNavigate, Link } from "react-router-dom";
import pill1 from '../assets/pill-1.webp'
import logo2 from '../assets/logo2.webp'
import { Button } from '../components/button'

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
        <div className="flex flex-col bg-linear-to-b from-[#F2F3F8] to-[#FFFFFF] to-35% min-h-screen items-center justify-around w-full px-4">
            <img src={logo2} width={200} alt="Logo" />

            <div className="flex flex-col items-center justify-center w-full max-w-sm px-4">

                <div className="relative inline-block
                    after:content-[''] after:absolute after:-bottom-6 after:left-1/2 after:-translate-x-1/2
                    after:w-34 after:h-2 after:bg-black/80 after:rounded-full
                    after:blur-[19px] after:opacity-80">
                    <img src={pill1} width={130} alt="Pill" className="relative z-10 mb-5" />
                </div>
                <h1 className="text-black text-3xl font-regular mb-6 mt-15">Crie sua conta</h1>

                <form onSubmit={handleRegister} className="w-full flex flex-col gap-4">
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nome"
                        required
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Endereço de Email"
                        required
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Senha"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                    <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="Confirmar senha"
                        value={confirmPassword}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
                        <Checkbox
                            checked={showPassword}
                            onCheckedChange={(checked) => setShowPassword(checked === true)}
                        />
                        Mostrar senha
                    </label>

                    {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}
                    <Button type="submit" className="w-full mt-4">
                        Cadastrar
                    </Button>
                    <p className="mt-2 mb-10 text-sm">Já tem uma conta? <Link to="/login" className="text-[#ABD43A] font-bold">Entrar</Link></p>
                </form>
            </div>

        </div>
    )
}
