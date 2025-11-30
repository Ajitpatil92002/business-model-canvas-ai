import { prisma } from '@/lib/prisma';
import { checkListRateLimit, getClientIP } from '@/lib/rate-limiter';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
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

    try {
        const bmc = await prisma.bMCGeneration.findUnique({
            where: { id },
            include: {
                ratings: true,
            },
        });

        if (!bmc) {
            return NextResponse.json(
                { error: 'BMC not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(bmc);
    } catch (error) {
        console.error('Error fetching BMC:', error);
        return NextResponse.json(
            { error: 'Failed to fetch BMC' },
            { status: 500 }
        );
    }
}
