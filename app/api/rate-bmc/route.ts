import type { BMCData } from '@/lib/bmc-schema';
import { RATING_PROMPT_TEMPLATE } from '@/lib/default-rating-criteria';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP } from '@/lib/rate-limiter';
import type { RatingCriteria } from '@/lib/rating-schema';
import { modelRatingSchema } from '@/lib/rating-schema';
import { generateObject } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { bmcData, ratingModel, criteria, bmcGenerationId } =
            await req.json();

        const ip = getClientIP(req);
        const { success, remaining } = await checkRateLimit(ip);

        if (!success) {
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please try again later.',
                    remaining,
                },
                {
                    status: 429,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }

        if (!bmcData || !ratingModel || !criteria) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const prompt = `${RATING_PROMPT_TEMPLATE(criteria as RatingCriteria)}

Here is the Business Model Canvas to evaluate:

${JSON.stringify(bmcData as BMCData, null, 2)}

Provide your rating based on the criteria above.`;

        const { object } = await generateObject({
            model: ratingModel,
            schema: modelRatingSchema,
            prompt,
        });

        // Save rating if bmcGenerationId is provided
        if (bmcGenerationId) {
            try {
                await prisma.bMCRating.create({
                    data: {
                        bmcGenerationId,
                        ratingModel:
                            typeof ratingModel === 'string'
                                ? ratingModel
                                : (ratingModel as any).modelId || 'unknown',
                        score: object.score,
                        explanation: object.explanation,
                        criteriaScores: object.criteriaScores,
                        strengths: object.strengths,
                        improvements: object.improvements,
                    },
                });
            } catch (error) {
                console.error('Failed to save rating:', error);
                // Continue to return the rating even if saving fails
            }
        }

        return NextResponse.json(object);
    } catch (error) {
        console.error('Rating generation error:', error);
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to generate rating',
            },
            { status: 500 }
        );
    }
}
