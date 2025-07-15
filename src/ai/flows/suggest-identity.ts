// src/ai/flows/suggest-identity.ts
'use server';
/**
 * @fileOverview A flow that suggests possible alternative identities based on biometric data.
 *
 * - suggestIdentity - A function that suggests alternative identities.
 * - SuggestIdentityInput - The input type for the suggestIdentity function.
 * - SuggestIdentityOutput - The return type for the suggestIdentity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIdentityInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  employeeId: z.string().describe('The employee ID of the person.'),
  name: z.string().describe('The name of the person.'),
});
export type SuggestIdentityInput = z.infer<typeof SuggestIdentityInputSchema>;

const SuggestIdentityOutputSchema = z.object({
  possibleIdentities: z
    .array(
      z.object({
        employeeId: z.string().describe('The employee ID of the possible identity.'),
        name: z.string().describe('The name of the possible identity.'),
        confidence: z
          .number()
          .describe('The confidence level of the suggested identity.'),
      })
    )
    .describe('A list of possible alternative identities.'),
});
export type SuggestIdentityOutput = z.infer<typeof SuggestIdentityOutputSchema>;

export async function suggestIdentity(input: SuggestIdentityInput): Promise<SuggestIdentityOutput> {
  return suggestIdentityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIdentityPrompt',
  input: {schema: SuggestIdentityInputSchema},
  output: {schema: SuggestIdentityOutputSchema},
  prompt: `Based on the provided biometric data and employee information, suggest possible alternative identities.

  Photo: {{media url=photoDataUri}}
  Employee ID: {{{employeeId}}}
  Name: {{{name}}}

  Return a list of possible identities with their employee ID, name, and a confidence level.
  Ensure the confidence level reflects the likelihood of the suggested identity being correct.
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
