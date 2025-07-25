import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Funcionario } from '@/interfaces/funcionario';

export interface ParametrosCancelamento {
    tipoAcao: 'fornecimento' | 'devolucao' | 'descarte' | 'cancelamento';
    aceitoSugestao: boolean;
    destino: 'riscos' | 'funcionarios' | 'qualquer' | 'local';
    gerarRelatorio: boolean;
    codColigada: number;
    codUsuario: string;
    consideraDtTransferenciaFilial: boolean;
}

interface CancelamentoContextType {
    parametros: ParametrosCancelamento;
    atualizarParametros: (params: Partial<ParametrosCancelamento>) => void;
    funcionariosSelecionados: Funcionario[];
    adicionarFuncionario: (func: Funcionario) => void;
    removerFuncionario: (chapa: string) => void;
}

const parametrosDefault: ParametrosCancelamento = {
    tipoAcao: 'cancelamento',
    aceitoSugestao: true,
    destino: 'funcionarios',
    gerarRelatorio: true,
    codColigada: 1,
    codUsuario: 'admin',
    consideraDtTransferenciaFilial: false,
};

const CancelamentoContext = createContext<CancelamentoContextType | undefined>(undefined);


export function CancelamentoProvider({ children }: { children: ReactNode }) {
    const [parametros, setParametros] = useState<ParametrosCancelamento>(parametrosDefault);
    const [funcionariosSelecionados, setFuncionariosSelecionados] = useState<Funcionario[]>([]);

    function atualizarParametros(params: Partial<ParametrosCancelamento>) {
        setParametros((prev) => ({ ...prev, ...params }));
    }

    function adicionarFuncionario(func: Funcionario) {
        setFuncionariosSelecionados((prev) => {
            if (prev.some(f => f.chapa === func.chapa)) return prev;
            return [...prev, func];
        });
    }

    function removerFuncionario(chapa: string) {
        setFuncionariosSelecionados((prev) => prev.filter(f => f.chapa !== chapa));
    }

    return (
        <CancelamentoContext.Provider value={{
            parametros,
            atualizarParametros,
            funcionariosSelecionados,
            adicionarFuncionario,
            removerFuncionario
        }}>
            {children}
        </CancelamentoContext.Provider>
    );
}

export function useCancelamento() {
    const ctx = useContext(CancelamentoContext);
    if (!ctx) throw new Error('useCancelamento deve ser usado dentro de CancelamentoProvider');
    return ctx;
}
