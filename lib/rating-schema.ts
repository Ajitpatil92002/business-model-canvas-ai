import { z } from 'zod';

export const ratingCriterionSchema = z.object({
    name: z.string(),
    description: z.string(),
    weight: z.number().min(0).max(1).default(1),
});

export const ratingCriteriaSchema = z.array(ratingCriterionSchema);

export const modelRatingSchema = z.object({
    score: z
        .number()
        .min(1)
        .max(5)
        .describe('Overall rating score from 1 to 5'),
    explanation: z
        .string()
        .describe('Brief explanation of the rating (2-3 sentences)'),
    criteriaScores: z
        .record(z.number().min(1).max(5))
        .describe('Scores for each criterion'),
    strengths: z.array(z.string()).describe('Key strengths identified'),
    improvements: z.array(z.string()).describe('Suggested improvements'),
});

export const crossModelRatingSchema = z.object({
    targetModelId: z.string().describe('The model being rated'),
    ratingModelId: z.string().describe('The model providing the rating'),
    rating: modelRatingSchema,
    criteriaUsed: ratingCriteriaSchema,
    timestamp: z.number(),
});

export const allRatingsSchema = z.array(crossModelRatingSchema);

export type RatingCriterion = z.infer<typeof ratingCriterionSchema>;
export type RatingCriteria = z.infer<typeof ratingCriteriaSchema>;
export type ModelRating = z.infer<typeof modelRatingSchema>;
export type CrossModelRating = z.infer<typeof crossModelRatingSchema>;
export type AllRatings = z.infer<typeof allRatingsSchema>;
