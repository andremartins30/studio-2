import React, { useContext, useEffect, useState } from 'react';
import { Funcionario } from '@/interfaces/funcionario';
import { FuncionarioService } from '@/services/funcionario-service';
import { useCancelamento } from '@/contexts/cancelamento-context';

// Componente reutilizável simples para grid (pode ser evoluído depois)
function DataGrid({ data, onRemove }: { data: Funcionario[]; onRemove: (chapa: string) => void }) {
    return (
        <table className="min-w-full text-sm border">
            <thead>
                <tr className="bg-gray-100">
                    <th className="p-2">Chapa</th>
                    <th className="p-2">Nome</th>
                    <th className="p-2">Cód. Função</th>
                    <th className="p-2">Cód. Seção</th>
                    <th className="p-2">Ações</th>
                </tr>
            </thead>
            <tbody>
                {data.map(func => (
                    <tr key={func.chapa} className="border-t">
                        <td className="p-2">{func.chapa}</td>
                        <td className="p-2">{func.nome}</td>
                        <td className="p-2">{func.codigoFuncao}</td>
                        <td className="p-2">{func.codigoSecao}</td>
                        <td className="p-2">
                            <button className="text-red-600 hover:underline" onClick={() => onRemove(func.chapa)}>
                                Remover
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const SelecaoFuncionarios: React.FC = () => {
    const { funcionariosSelecionados, adicionarFuncionario, removerFuncionario } = useCancelamento();
    const [busca, setBusca] = useState('');
    const [resultados, setResultados] = useState<Funcionario[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const pageSize = 5;

    // Busca funcionários com debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(true);
            FuncionarioService.buscarFuncionarios(busca).then(res => {
                setResultados(res);
                setTotalPaginas(Math.ceil(res.length / pageSize));
                setLoading(false);
            });
        }, 400);
        return () => clearTimeout(timeout);
    }, [busca]);

    // Paginação
    const pagedResults = resultados.slice((pagina - 1) * pageSize, pagina * pageSize);

    return (
        <section className="p-4">
            <h2 className="text-lg font-semibold mb-2">Seleção de Funcionários</h2>
            <div className="mb-3 flex gap-2 items-center">
                <input
                    className="border rounded px-2 py-1"
                    placeholder="Buscar por nome ou chapa..."
                    value={busca}
                    onChange={e => { setBusca(e.target.value); setPagina(1); }}
                />
                {loading && <span className="text-xs text-gray-500">Buscando...</span>}
            </div>
            <DataGrid
                data={funcionariosSelecionados}
                onRemove={removerFuncionario}
            />
            <div className="mt-4">
                <h3 className="font-medium mb-1">Adicionar Funcionário</h3>
                <table className="min-w-full text-xs border">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="p-1">Chapa</th>
                            <th className="p-1">Nome</th>
                            <th className="p-1">Cód. Função</th>
                            <th className="p-1">Cód. Seção</th>
                            <th className="p-1">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagedResults.map(func => (
                            <tr key={func.chapa} className="border-t">
                                <td className="p-1">{func.chapa}</td>
                                <td className="p-1">{func.nome}</td>
                                <td className="p-1">{func.codigoFuncao}</td>
                                <td className="p-1">{func.codigoSecao}</td>
                                <td className="p-1">
                                    <button
                                        className="text-blue-600 hover:underline"
                                        onClick={() => adicionarFuncionario(func)}
                                        disabled={funcionariosSelecionados.some((f: Funcionario) => f.chapa === func.chapa)}
                                    >
                                        Adicionar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex gap-2 mt-2">
                    <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setPagina(p => Math.max(1, p - 1))}
                        disabled={pagina === 1}
                    >Anterior</button>
                    <span>Página {pagina} de {totalPaginas}</span>
                    <button
                        className="px-2 py-1 border rounded"
                        onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                        disabled={pagina === totalPaginas}
                    >Próxima</button>
                </div>
            </div>
        </section>
    );
};

export default SelecaoFuncionarios;
