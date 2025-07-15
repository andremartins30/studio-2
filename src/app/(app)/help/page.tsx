import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Building } from "lucide-react";

const faqs = [
  {
    question: "Como eu cadastro um novo funcionário?",
    answer: "Navegue para a página 'Cadastro Biométrico' na barra lateral. Preencha o nome e a matrícula do funcionário, depois use o botão 'Capturar Foto' para tirar a foto. Finalmente, clique em 'Cadastrar Usuário' para salvar o novo perfil."
  },
  {
    question: "O que acontece se uma verificação de identidade falhar?",
    answer: "Se uma verificação falhar, o sistema negará o acesso e registrará a tentativa. A ferramenta 'Verificação de Identidade' mostrará o status 'Falha' e pode listar possíveis matrículas alternativas se a leitura facial for semelhante a outros usuários cadastrados."
  },
  {
    question: "Posso rastrear o histórico de um equipamento específico?",
    answer: "Sim, na página 'Gestão de Materiais', você pode usar a barra de busca para encontrar um equipamento por seu ID ou tipo. A página 'Histórico de Transações' também permite buscar para ver todos os registros relacionados a um item ou funcionário específico."
  },
  {
    question: "Como atualizo as chaves de API para integrações?",
    answer: "Vá para a página 'Configuração do Sistema'. Lá você pode atualizar as URLs dos endpoints e as chaves de autenticação. Clique em 'Salvar Configuração' para aplicar as mudanças."
  },
  {
    question: "É possível exportar os dados de transações?",
    answer: "Sim. Na página 'Histórico de Transações', você encontrará um botão 'Exportar'. Isso permite que você baixe a visualização atual do registro de transações como um arquivo CSV para relatórios e auditorias."
  }
];

export default function HelpPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Ajuda & Suporte"
        description="Encontre respostas para perguntas comuns e entre em contato com nossa equipe de suporte."
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Perguntas Frequentes</h2>
            <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
        <div>
             <h2 className="text-2xl font-semibold mb-4">Contato do Suporte</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Suporte Técnico</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Phone className="h-5 w-5 text-accent" />
                        <span className="text-muted-foreground">+55 (11) 98765-4321</span>
                    </div>
                     <div className="flex items-center gap-4">
                        <Mail className="h-5 w-5 text-accent" />
                        <span className="text-muted-foreground">suporte@epicontrol.com</span>
                    </div>
                     <div className="flex items-start gap-4">
                        <Building className="h-5 w-5 text-accent mt-1" />
                        <div className="text-muted-foreground">
                            <p>EPI Control HQ</p>
                            <p>Rua da Tecnologia, 123</p>
                             <p>São Paulo, SP, Brasil</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
