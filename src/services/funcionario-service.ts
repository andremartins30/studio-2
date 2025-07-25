import { Funcionario } from '@/interfaces/funcionario';

// Service mockado para busca de funcionários
export class FuncionarioService {
    // Método mockado - substituir por chamada real da API futuramente
    static async buscarFuncionarios(filtro?: string): Promise<Funcionario[]> {
        // Mock data - remover quando integrar com API real
        const todos = [
            { chapa: '00005', nome: 'LAERCI PEREIRA', codigoFuncao: '01263', codigoSecao: '1.01.01.0' },
            { chapa: '00006', nome: 'ANA SILVA', codigoFuncao: '01264', codigoSecao: '1.01.01.1' },
            { chapa: '00007', nome: 'JOÃO SOUZA', codigoFuncao: '01265', codigoSecao: '1.01.01.2' }
        ];
        if (filtro) {
            return todos.filter(f =>
                f.nome.toLowerCase().includes(filtro.toLowerCase()) ||
                f.chapa.includes(filtro)
            );
        }
        return todos;
    }
}
