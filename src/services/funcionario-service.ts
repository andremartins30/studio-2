import { Funcionario } from '@/interfaces/funcionario';
import { Employee, ColaboradorSOAP, convertColaboradorSOAP } from '@/types/epi';
import { apiService } from '@/lib/api';

// Service para busca de funcionários via API SOAP
export class FuncionarioService {

    /**
     * Busca todos os funcionários via API SOAP
     * @param filtro - Filtro opcional para buscar por nome ou chapa
     * @returns Lista de funcionários
     */
    static async buscarFuncionarios(filtro?: string): Promise<Funcionario[]> {
        try {
            console.log('🔍 Buscando funcionários via API SOAP...', { filtro });

            // Buscar dados da API SOAP
            const response = await apiService.getColaboradores();

            if (!response.success || !response.colaboradores) {
                console.warn('⚠️ Nenhum colaborador encontrado na API');
                return [];
            }

            // Converter dados SOAP para formato do frontend
            let funcionarios: Funcionario[] = response.colaboradores.map((colaborador: ColaboradorSOAP) => ({
                chapa: colaborador.CHAPA,
                nome: colaborador.NOME,
                codigoFuncao: colaborador.CODFUNCAO,
                codigoSecao: colaborador.CODSECAO,
                id: parseInt(colaborador.CHAPA) || 0,
                ativo: colaborador.ATIVO === true || colaborador.ATIVO === 'true' || colaborador.ATIVO === '1'
            }));

            // Aplicar filtro se fornecido
            if (filtro) {
                const filtroLowerCase = filtro.toLowerCase();
                funcionarios = funcionarios.filter(funcionario =>
                    funcionario.nome.toLowerCase().includes(filtroLowerCase) ||
                    funcionario.chapa.includes(filtro)
                );
                console.log(`🔍 Filtro aplicado: ${funcionarios.length} funcionários encontrados`);
            }

            console.log(`✅ ${funcionarios.length} funcionários carregados da API SOAP`);
            return funcionarios;

        } catch (error) {
            console.error('❌ Erro ao buscar funcionários:', error);

            // Fallback para dados mock em caso de erro
            console.log('🔄 Usando dados mock como fallback...');
            const dadosMock = [
                { chapa: '00005', nome: 'LAERCI PEREIRA', codigoFuncao: '01263', codigoSecao: '1.01.01.0', id: 5, ativo: true },
                { chapa: '00006', nome: 'ANA SILVA', codigoFuncao: '01264', codigoSecao: '1.01.01.1', id: 6, ativo: true },
                { chapa: '00007', nome: 'JOÃO SOUZA', codigoFuncao: '01265', codigoSecao: '1.01.01.2', id: 7, ativo: true }
            ];

            if (filtro) {
                const filtroLowerCase = filtro.toLowerCase();
                return dadosMock.filter(f =>
                    f.nome.toLowerCase().includes(filtroLowerCase) ||
                    f.chapa.includes(filtro)
                );
            }

            return dadosMock;
        }
    }

    /**
     * Busca funcionários no formato Employee (compatível com o wizard)
     * @param filtro - Filtro opcional para buscar por nome ou matrícula
     * @returns Lista de funcionários no formato Employee
     */
    static async buscarEmployees(filtro?: string): Promise<Employee[]> {
        try {
            console.log('🔍 Buscando employees via API SOAP...', { filtro });

            const response = await apiService.getColaboradores();

            if (!response.success || !response.colaboradores) {
                console.warn('⚠️ Nenhum colaborador encontrado na API');
                return [];
            }

            // Converter dados SOAP para formato Employee
            let employees: Employee[] = response.colaboradores.map(convertColaboradorSOAP);

            // Aplicar filtro se fornecido
            if (filtro) {
                const filtroLowerCase = filtro.toLowerCase();
                employees = employees.filter(employee =>
                    employee.nome.toLowerCase().includes(filtroLowerCase) ||
                    employee.matricula.includes(filtro)
                );
            }

            console.log(`✅ ${employees.length} employees carregados da API SOAP`);
            return employees;

        } catch (error) {
            console.error('❌ Erro ao buscar employees:', error);

            // Fallback para dados mock
            const dadosMock: Employee[] = [
                { id: '00005', matricula: '00005', nome: 'LAERCI PEREIRA', codigoFuncao: '01263', codigoSecao: '1.01.01.0' },
                { id: '00006', matricula: '00006', nome: 'ANA SILVA', codigoFuncao: '01264', codigoSecao: '1.01.01.1' },
                { id: '00007', matricula: '00007', nome: 'JOÃO SOUZA', codigoFuncao: '01265', codigoSecao: '1.01.01.2' }
            ];

            if (filtro) {
                const filtroLowerCase = filtro.toLowerCase();
                return dadosMock.filter(employee =>
                    employee.nome.toLowerCase().includes(filtroLowerCase) ||
                    employee.matricula.includes(filtro)
                );
            }

            return dadosMock;
        }
    }

    /**
     * Busca um funcionário específico por chapa/matrícula
     * @param chapa - Chapa/matrícula do funcionário
     * @returns Funcionário encontrado ou null
     */
    static async buscarFuncionarioPorChapa(chapa: string): Promise<Funcionario | null> {
        try {
            const funcionarios = await this.buscarFuncionarios();
            return funcionarios.find(f => f.chapa === chapa) || null;
        } catch (error) {
            console.error('❌ Erro ao buscar funcionário por chapa:', error);
            return null;
        }
    }
}
