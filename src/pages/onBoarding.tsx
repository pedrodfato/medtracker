import logo from '../assets/logo.webp'
import pill from '../assets/pill.webp'
import {LinkButton} from '../components/LinkButton'

export function OnBoarding() {
    return (
        <main className="flex flex-col min-h-screen items-center justify-around bg-linear-to-b from-[#EFF7D0] to-[#EFF3F6] to-65% px-8">
            <img src={logo} width={250} alt="Logo" />
            <div className="flex flex-col items-center text-center max-w-md mb-15">
             <img className="drop-shadow-[0_25px_25px_rgba(0,0,0,0.25)] mb-5" src={pill}  width={230} alt="Pill" />
            <h1 className="text-black text-4xl font-regular">Nunca esqueça seu remédio denovo</h1>
            <p className="text-black text-lg font-regular">Sua companhia pessoal para gerenciar seus remédios diarios, feito para facilitar sua vida</p>
            <LinkButton to="/login" variant="primary" className="w-full mt-10">
                Criar Conta
            </LinkButton>
            <LinkButton to="/register" variant="secondary" className="w-full mt-3">
                Eu já tenho uma conta
            </LinkButton>
            </div>
        </main>
    )
}