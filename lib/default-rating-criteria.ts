import type { RatingCriteria } from './rating-schema';

export const DEFAULT_RATING_CRITERIA: RatingCriteria = [
    {
        name: 'Completeness',
        description:
            'How thorough and detailed is the Business Model Canvas? Are all sections well-developed?',
        weight: 1,
    },
    {
        name: 'Business Viability',
        description:
            'How realistic and actionable are the suggestions? Would this BMC work in the real world?',
        weight: 1,
    },
    {
        name: 'Clarity',
        description:
            'How clear and well-structured is the content? Is it easy to understand?',
        weight: 1,
    },
    {
        name: 'Innovation',
        description:
            'How creative and unique are the insights? Does it offer fresh perspectives?',
        weight: 1,
    },
    {
        name: 'Coherence',
        description:
            'How well do all sections align with each other? Is there a consistent narrative?',
        weight: 1,
    },
];

export const RATING_PROMPT_TEMPLATE = (criteria: RatingCriteria) => `
You are an expert business consultant evaluating a Business Model Canvas (BMC).

Rate the BMC based on these criteria:
${criteria.map(c => `- **${c.name}**: ${c.description}`).join('\n')}

Provide:
1. An overall score from 1-5 stars
2. Individual scores for each criterion (1-5)
3. A brief explanation (2-3 sentences) of your overall rating
4. Key strengths (2-3 points)
5. Suggested improvements (2-3 points)

Be objective and constructive in your evaluation.
`;
