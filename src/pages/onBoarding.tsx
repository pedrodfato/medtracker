import { Logo } from '../components/logo'
import pill from '../assets/pill.webp'
import {LinkButton} from '../components/LinkButton'
import { GlassCard } from '../components/glassCard'

export function OnBoarding() {
    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-10">
            <GlassCard className="glass-strong flex w-full max-w-md flex-col items-center gap-6 p-8 text-center lg:max-w-lg lg:p-12">
                <Logo className="text-2xl" />
                <img className="w-[140px] drop-shadow-[0_30px_40px_rgba(47,158,91,0.35)] md:w-[180px]" src={pill} alt="Pill" />
                <div className="flex flex-col gap-3">
                    <h1 className="m-0 font-heading text-4xl font-semibold tracking-tight text-gray-900">Nunca esqueça seu remédio de novo</h1>
                    <p className="text-lg text-gray-600">Sua companhia pessoal para gerenciar seus remédios diários, feita para facilitar sua vida.</p>
                </div>
                <div className="flex w-full flex-col gap-3">
                    <LinkButton to="/register" variant="primary" className="w-full">
                        Criar Conta
                    </LinkButton>
                    <LinkButton to="/login" variant="secondary" className="w-full">
                        Eu já tenho uma conta
                    </LinkButton>
                </div>
            </GlassCard>
        </main>
    )
}
