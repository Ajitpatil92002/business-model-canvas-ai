import { prisma } from '@/lib/prisma';
import { checkListRateLimit, getClientIP } from '@/lib/rate-limiter';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const ip = getClientIP(req);
    const { success, remaining } = await checkListRateLimit(ip);

    if (!success) {
        return NextResponse.json(
            {
                error: 'Rate limit exceeded. Please try again later.',
                remaining,
            },
            { status: 429 }
        );
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    if (page < 1 || limit < 1 || limit > 100) {
        return NextResponse.json(
            { error: 'Invalid pagination parameters' },
            { status: 400 }
        );
    }

    const skip = (page - 1) * limit;

    try {
        const [items, total] = await Promise.all([
            prisma.bMCGeneration.findMany({
                where: {
                    ipAddress: ip,
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    createdAt: true,
                    businessName: true,
                    productService: true,
                    model: true,
                    customerSegments: true,
                    valuePropositions: true,
                },
            }),
            prisma.bMCGeneration.count({
                where: {
                    ipAddress: ip,
                },
            }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            items,
            total,
            page,
            limit,
            totalPages,
        });
    } catch (error) {
        console.error('Error fetching BMC generations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch BMC generations' },
            { status: 500 }
        );
    }
}
