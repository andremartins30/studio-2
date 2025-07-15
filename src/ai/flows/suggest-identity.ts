// src/ai/flows/suggest-identity.ts
'use server';
/**
 * @fileOverview Um fluxo que sugere possíveis identidades alternativas com base em dados biométricos.
 *
 * - suggestIdentity - Uma função que sugere identidades alternativas.
 * - SuggestIdentityInput - O tipo de entrada para a função suggestIdentity.
 * - SuggestIdentityOutput - O tipo de retorno para a função suggestIdentity.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIdentityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "Uma foto da pessoa, como uma URI de dados que deve incluir um tipo MIME e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  employeeId: z.string().describe('A matrícula do funcionário.'),
  name: z.string().describe('O nome da pessoa.'),
});
export type SuggestIdentityInput = z.infer<typeof SuggestIdentityInputSchema>;

const SuggestIdentityOutputSchema = z.object({
  possibleIdentities: z
    .array(
      z.object({
        employeeId: z.string().describe('A matrícula da possível identidade.'),
        name: z.string().describe('O nome da possível identidade.'),
        confidence: z
          .number()
          .describe('O nível de confiança da identidade sugerida.'),
      })
    )
    .describe('Uma lista de possíveis identidades alternativas.'),
});
export type SuggestIdentityOutput = z.infer<typeof SuggestIdentityOutputSchema>;

export async function suggestIdentity(input: SuggestIdentityInput): Promise<SuggestIdentityOutput> {
  return suggestIdentityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIdentityPrompt',
  input: {schema: SuggestIdentityInputSchema},
  output: {schema: SuggestIdentityOutputSchema},
  prompt: `Com base nos dados biométricos e informações do funcionário fornecidas, sugira possíveis identidades alternativas.

  Foto: {{media url=photoDataUri}}
  Matrícula: {{{employeeId}}}
  Nome: {{{name}}}

  Retorne uma lista de possíveis identidades com sua matrícula, nome e um nível de confiança.
  Garanta que o nível de confiança reflita a probabilidade de a identidade sugerida estar correta.
  `,
});

const suggestIdentityFlow = ai.defineFlow(
  {
    name: 'suggestIdentityFlow',
    inputSchema: SuggestIdentityInputSchema,
    outputSchema: SuggestIdentityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
