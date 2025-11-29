import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP } from '@/lib/rate-limiter';
import { streamObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 60;

export const bmcSchema = z.object({
    customer_segments: z
        .string()
        .describe(
            'Who are the most important customers? Be specific with demographics, behaviors, and needs.'
        ),
    value_propositions: z
        .string()
        .describe(
            'What value do we deliver to the customer? What problems are we solving?'
        ),
    channels: z
        .string()
        .describe(
            'How do we reach our customer segments? Through which channels do they want to be reached?'
        ),
    customer_relationships: z
        .string()
        .describe(
            'What type of relationship does each customer segment expect? How do we establish and maintain them?'
        ),
    revenue_streams: z
        .string()
        .describe(
            'For what value are customers willing to pay? How would they prefer to pay?'
        ),
    key_resources: z
        .string()
        .describe('What key resources do our value propositions require?'),
    key_activities: z
        .string()
        .describe('What key activities do our value propositions require?'),
    key_partnerships: z
        .string()
        .describe(
            'Who are our key partners and suppliers? Which key resources are we acquiring from partners?'
        ),
    cost_structure: z
        .string()
        .describe(
            'What are the most important costs inherent in our business model?'
        ),
    competitor_analysis: z
        .string()
        .describe(
            'Who are the main competitors? What are their strengths and weaknesses? Use real company names.'
        ),
    market_insights: z
        .string()
        .describe(
            'What are the current market trends, size, and growth opportunities?'
        ),
    search_queries_used: z
        .array(z.string())
        .describe(
            'List the search queries you would use to research this business'
        ),
});

export async function POST(req: Request) {
    const { businessInfo, model, id } = await req.json();

    const ip = getClientIP(req);
    const { success, remaining } = await checkRateLimit(ip);

    if (!success) {
        return new Response(
            JSON.stringify({
                error: 'Rate limit exceeded. Please try again later.',
                remaining,
            }),
            {
                status: 429,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }

    // Create initial record
    let bmcGenerationId: string;
    try {
        const record = await prisma.bMCGeneration.create({
            data: {
                id: id || undefined, // Use provided ID if available
                // Input
                businessName: businessInfo.businessName,
                productService: businessInfo.productService,
                problemSolution: businessInfo.problemSolution,
                customerAcquisition: businessInfo.customerAcquisition,
                revenueModel: businessInfo.revenueModel,
                keyResourcesInput: businessInfo.keyResources,

                // Meta
                model:
                    typeof model === 'string'
                        ? model
                        : (model as any).modelId || 'unknown',
                ipAddress: ip,

                // Output (Initialize with empty strings)
                customerSegments: '',
                valuePropositions: '',
                channels: '',
                customerRelationships: '',
                revenueStreams: '',
                keyResources: '',
                keyActivities: '',
                keyPartnerships: '',
                costStructure: '',
                competitorAnalysis: '',
                marketInsights: '',
                searchQueriesUsed: [],
            },
        });
        bmcGenerationId = record.id;
    } catch (error) {
        console.error('Failed to create BMC generation record:', error);
        return new Response(JSON.stringify({ error: 'Database error' }), {
            status: 500,
        });
    }

    const prompt = `You are an expert business strategist. Generate a deeply analyzed, accurate, and actionable Business Model Canvas (BMC) for the following business:

## Business Information
- **Business Name**: ${businessInfo.businessName}
- **Product/Service**: ${businessInfo.productService}
- **Problem & Solution**: ${businessInfo.problemSolution}
${
    businessInfo.customerAcquisition
        ? `- **Customer Acquisition**: ${businessInfo.customerAcquisition}`
        : ''
}
${
    businessInfo.revenueModel
        ? `- **Revenue Model**: ${businessInfo.revenueModel}`
        : ''
}
${
    businessInfo.keyResources
        ? `- **Key Resources**: ${businessInfo.keyResources}`
        : ''
}

## Requirements
1. Analyze the market, competitors, customer needs, pricing benchmarks, and relevant trends.
2. Your analysis must be specific, not generic. Use real competitor names, realistic market data, and validated insights.
3. For each section, provide actionable, founder-ready insights that can be immediately implemented.
4. Consider the current market landscape in 2024-2025 and emerging trends.
5. Be comprehensive but concise - focus on the most impactful insights.
6. Format each section with bullet points using markdown for readability.`;

    const result = streamObject({
        model,
        schema: bmcSchema,
        prompt,
        maxOutputTokens: 4000,
        temperature: 0.7,
        onFinish: async ({ object }) => {
            if (!object) return;

            try {
                await prisma.bMCGeneration.update({
                    where: { id: bmcGenerationId },
                    data: {
                        // Output
                        customerSegments: object.customer_segments,
                        valuePropositions: object.value_propositions,
                        channels: object.channels,
                        customerRelationships: object.customer_relationships,
                        revenueStreams: object.revenue_streams,
                        keyResources: object.key_resources,
                        keyActivities: object.key_activities,
                        keyPartnerships: object.key_partnerships,
                        costStructure: object.cost_structure,
                        competitorAnalysis: object.competitor_analysis,
                        marketInsights: object.market_insights,
                        searchQueriesUsed: object.search_queries_used,
                    },
                });
            } catch (error) {
                console.error('Failed to update BMC generation:', error);
            }
        },
    });

    return result.toTextStreamResponse({
        headers: {
            'x-bmc-generation-id': bmcGenerationId,
        },
    });
}
