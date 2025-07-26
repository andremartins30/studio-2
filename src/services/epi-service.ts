import { EpiItem, EpiItemSOAP, convertEpiItemSOAP } from '@/types/epi';
import { apiService, GrupoEpiSOAP } from '@/lib/api';

/**
 * Serviço para gerenciar o catálogo de EPIs via API SOAP
 */
export class EpiService {

    /**
     * Busca todos os grupos EPI via API SOAP
     * @returns Lista de grupos EPI
     */
    static async buscarGruposEpi(): Promise<GrupoEpiSOAP[]> {
        try {
            console.log('📦 Buscando grupos EPI via API SOAP...');

            const response = await apiService.getGruposEpi();

            if (!response.success || !response.gruposEPI) {
                console.warn('⚠️ Nenhum grupo EPI encontrado na API');
                return [];
            }

            // Garantir que seja array
            const grupos = Array.isArray(response.gruposEPI)
                ? response.gruposEPI
                : [response.gruposEPI];

            console.log(`✅ ${grupos.length} grupos EPI carregados da API SOAP`);
            return grupos;

        } catch (error) {
            console.error('❌ Erro ao buscar grupos EPI:', error);

            // Fallback para dados mock em caso de erro
            console.log('🔄 Usando dados mock de grupos EPI como fallback...');
            const dadosMock: GrupoEpiSOAP[] = [
                { CODGRUPOEPI: '001', NOME: 'CABEÇA', DESCRICAO: 'Equipamentos de proteção para cabeça' },
                { CODGRUPOEPI: '002', NOME: 'MÃOS', DESCRICAO: 'Equipamentos de proteção para mãos' },
                { CODGRUPOEPI: '003', NOME: 'PÉS', DESCRICAO: 'Equipamentos de proteção para pés' },
                { CODGRUPOEPI: '004', NOME: 'OLHOS', DESCRICAO: 'Equipamentos de proteção para olhos' },
                { CODGRUPOEPI: '005', NOME: 'RESPIRATÓRIO', DESCRICAO: 'Equipamentos de proteção respiratória' }
            ];

            return dadosMock;
        }
    }

    /**
     * Busca todos os itens do catálogo EPI via API SOAP
     * @param filtro - Filtro opcional para buscar por código ou nome
     * @param codGrupo - Código do grupo EPI para filtrar
     * @returns Lista de itens EPI
     */
    static async buscarCatalogoEpi(filtro?: string, codGrupo?: string): Promise<EpiItem[]> {
        try {
            console.log('🛡️ Buscando catálogo EPI via API SOAP...', { filtro, codGrupo });

            // Buscar dados da API SOAP com filtro de grupo se especificado
            const response = await apiService.getCatalogoEpi(codGrupo);

            if (!response.success || !response.catalogoEPI) {
                console.warn('⚠️ Nenhum item EPI encontrado na API');
                return [];
            }

            // Converter dados SOAP para formato do frontend
            const catalogoArray = Array.isArray(response.catalogoEPI)
                ? response.catalogoEPI
                : [response.catalogoEPI];

            let itensEpi: EpiItem[] = catalogoArray.map((epiSOAP: EpiItemSOAP) =>
                convertEpiItemSOAP(epiSOAP)
            );

            // Aplicar filtro de texto se fornecido
            if (filtro) {
                const filtroLowerCase = filtro.toLowerCase();
                itensEpi = itensEpi.filter(item =>
                    item.nome.toLowerCase().includes(filtroLowerCase) ||
                    item.codigoEpi.toLowerCase().includes(filtroLowerCase) ||
                    item.ca.toLowerCase().includes(filtroLowerCase)
                );
                console.log(`🔍 Filtro aplicado: ${itensEpi.length} itens EPI encontrados`);
            }

            console.log(`✅ ${itensEpi.length} itens EPI carregados da API SOAP`);
            return itensEpi;

        } catch (error) {
            console.error('❌ Erro ao buscar catálogo EPI:', error);

            // Fallback para dados mock em caso de erro
            console.log('🔄 Usando dados mock como fallback...');
            const dadosMock: EpiItem[] = [
                {
                    id: '999',
                    codigoEpi: '999',
                    idLote: '1',
                    ca: '123',
                    nome: 'Capacete de Segurança Teste',
                    codigoSecao: codGrupo || '1.01',
                    codigoFilial: 'F001',
                    dataAquisicao: '14/07/2025',
                    quantidade: 1,
                    quantidadeDisponivel: 15,
                    eficaz: true
                },
                {
                    id: '1001',
                    codigoEpi: '1001',
                    idLote: '2',
                    ca: '456',
                    nome: 'Óculos de Proteção',
                    codigoSecao: codGrupo || '1.01',
                    codigoFilial: 'F001',
                    dataAquisicao: '10/07/2025',
                    quantidade: 1,
                    quantidadeDisponivel: 25,
                    eficaz: true
                },
                {
                    id: '1002',
                    codigoEpi: '1002',
                    idLote: '3',
                    ca: '789',
                    nome: 'Luvas de Proteção',
                    codigoSecao: codGrupo || '1.02',
                    codigoFilial: 'F001',
                    dataAquisicao: '12/07/2025',
                    quantidade: 1,
                    quantidadeDisponivel: 50,
                    eficaz: true
                }
            ];

            if (filtro) {
                const filtroLowerCase = filtro.toLowerCase();
                return dadosMock.filter(item =>
                    item.nome.toLowerCase().includes(filtroLowerCase) ||
                    item.codigoEpi.toLowerCase().includes(filtroLowerCase) ||
                    item.ca.toLowerCase().includes(filtroLowerCase)
                );
            }

            return dadosMock;
        }
    }

    /**
     * Busca EPIs específicos de um grupo
     * @param codGrupo - Código do grupo EPI
     * @param filtro - Filtro opcional de texto
     * @returns Lista de itens EPI do grupo
     */
    static async buscarEpisPorGrupo(codGrupo: string, filtro?: string): Promise<EpiItem[]> {
        return this.buscarCatalogoEpi(filtro, codGrupo);
    }

    /**
     * Busca um item EPI específico por código
     * @param codigoEpi - Código do item EPI
     * @returns Item EPI encontrado ou null
     */
    static async buscarEpiPorCodigo(codigoEpi: string): Promise<EpiItem | null> {
        try {
            const itens = await this.buscarCatalogoEpi();
            return itens.find(item => item.codigoEpi === codigoEpi) || null;
        } catch (error) {
            console.error('❌ Erro ao buscar EPI por código:', error);
            return null;
        }
    }

    /**
     * Busca itens EPI disponíveis (com quantidade > 0)
     * @param filtro - Filtro opcional
     * @param codGrupo - Código do grupo opcional
     * @returns Lista de itens EPI disponíveis
     */
    static async buscarEpisDisponiveis(filtro?: string, codGrupo?: string): Promise<EpiItem[]> {
        try {
            const itens = await this.buscarCatalogoEpi(filtro, codGrupo);
            return itens.filter(item => item.quantidadeDisponivel > 0 && item.eficaz);
        } catch (error) {
            console.error('❌ Erro ao buscar EPIs disponíveis:', error);
            return [];
        }
    }

    /**
     * Busca grupos/seções únicos do catálogo
     * @returns Lista de códigos de grupos únicos
     */
    static async buscarGruposUnicosFromCatalogo(): Promise<string[]> {
        try {
            const itens = await this.buscarCatalogoEpi();
            const grupos = [...new Set(itens.map(item => item.codigoSecao))];
            return grupos.filter(grupo => grupo && grupo.trim() !== '');
        } catch (error) {
            console.error('❌ Erro ao buscar grupos únicos do catálogo:', error);
            return [];
        }
    }

    /**
     * Busca um grupo EPI específico por código
     * @param codGrupo - Código do grupo EPI
     * @returns Grupo EPI encontrado ou null
     */
    static async buscarGrupoPorCodigo(codGrupo: string): Promise<GrupoEpiSOAP | null> {
        try {
            const grupos = await this.buscarGruposEpi();
            return grupos.find(grupo => grupo.CODGRUPOEPI === codGrupo) || null;
        } catch (error) {
            console.error('❌ Erro ao buscar grupo por código:', error);
            return null;
        }
    }
} 