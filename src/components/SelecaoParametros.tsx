import React from 'react';
import { useCancelamento } from '@/contexts/cancelamento-context';

export default function SelecaoParametros() {
    const { parametros, atualizarParametros } = useCancelamento();

    return (
        <section className="p-6 max-w-xl mx-auto bg-white rounded shadow flex flex-col gap-6">
            <h2 className="text-lg font-semibold">Seleção de Parâmetros</h2>
            <div>
                <label className="font-medium block mb-2">Tipo de Ação:</label>
                <div className="flex flex-col gap-2">
                    <label><input type="radio" name="tipoAcao" value="fornecimento" checked={parametros.tipoAcao === 'fornecimento'} onChange={() => atualizarParametros({ tipoAcao: 'fornecimento' })} /> Fornecimento</label>
                    <label><input type="radio" name="tipoAcao" value="devolucao" checked={parametros.tipoAcao === 'devolucao'} onChange={() => atualizarParametros({ tipoAcao: 'devolucao' })} /> Devolução</label>
                    <label><input type="radio" name="tipoAcao" value="descarte" checked={parametros.tipoAcao === 'descarte'} onChange={() => atualizarParametros({ tipoAcao: 'descarte' })} /> Descarte</label>
                    <label><input type="radio" name="tipoAcao" value="cancelamento" checked={parametros.tipoAcao === 'cancelamento'} onChange={() => atualizarParametros({ tipoAcao: 'cancelamento' })} /> Cancelamento</label>
                </div>
                <label className="flex items-center gap-2 mt-2">
                    <input type="checkbox" checked={parametros.aceitoSugestao} onChange={e => atualizarParametros({ aceitoSugestao: e.target.checked })} />
                    Aceito sugestão na ação
                </label>
            </div>
            <div>
                <label className="font-medium block mb-2">Destino:</label>
                <div className="flex flex-col gap-2">
                    <label><input type="radio" name="destino" value="riscos" checked={parametros.destino === 'riscos'} onChange={() => atualizarParametros({ destino: 'riscos' })} /> Apenas Funcionários de Acordo com a Exposição a Riscos</label>
                    <label><input type="radio" name="destino" value="funcionarios" checked={parametros.destino === 'funcionarios'} onChange={() => atualizarParametros({ destino: 'funcionarios' })} /> Apenas Funcionários</label>
                    <label><input type="radio" name="destino" value="qualquer" checked={parametros.destino === 'qualquer'} onChange={() => atualizarParametros({ destino: 'qualquer' })} /> Qualquer Pessoa</label>
                    <label><input type="radio" name="destino" value="local" checked={parametros.destino === 'local'} onChange={() => atualizarParametros({ destino: 'local' })} /> Local de Trabalho</label>
                </div>
            </div>
            <div>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={parametros.gerarRelatorio} onChange={e => atualizarParametros({ gerarRelatorio: e.target.checked })} />
                    Gerar Relatório no final do processo
                </label>
            </div>
        </section>
    );
}
