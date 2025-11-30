"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building2, Calendar, Loader2, Star } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Streamdown } from 'streamdown'

type BMCDetail = {
    id: string
    createdAt: string
    businessName: string
    productService: string
    problemSolution: string
    customerAcquisition: string | null
    revenueModel: string | null
    keyResourcesInput: string | null
    model: string
    customerSegments: string
    valuePropositions: string
    channels: string
    customerRelationships: string
    revenueStreams: string
    keyResources: string
    keyActivities: string
    keyPartnerships: string
    costStructure: string
    competitorAnalysis: string
    marketInsights: string
    searchQueriesUsed: string[]
    ratings: Array<{
        id: string
        ratingModel: string
        score: number
        explanation: string
        strengths: string[]
        improvements: string[]
    }>
}

export default function BMCDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [bmc, setBmc] = useState<BMCDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBMC = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`/api/bmc/${id}`)
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('BMC not found')
                    }
                    throw new Error('Failed to fetch BMC')
                }
                const result = await response.json()
                setBmc(result)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchBMC()
        }
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading BMC...</p>
                </div>
            </div>
        )
    }

    if (error || !bmc) {
        return (
            <div className="min-h-screen bg-background">
                <header className="border-b border-border bg-card/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-4">
                        <Link href="/bmc">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to List
                            </Button>
                        </Link>
                    </div>
                </header>
                <div className="container mx-auto px-4 py-20">
                    <Card className="bg-destructive/10 border-destructive/30">
                        <CardContent className="py-8 text-center">
                            <p className="text-destructive">{error || 'BMC not found'}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const avgRating = bmc.ratings.length > 0
        ? bmc.ratings.reduce((sum, r) => sum + r.score, 0) / bmc.ratings.length
        : null

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/bmc">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to List
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                            {bmc.model}
                        </span>
                        {avgRating && (
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-500 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                {avgRating.toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Business Info */}
                <div className="mb-8">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{bmc.businessName}</h1>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Generated on {new Date(bmc.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    <Card className="bg-card border-border">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="w-5 h-5" />
                                Business Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Product/Service</p>
                                <p className="text-sm">{bmc.productService}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">Problem & Solution</p>
                                <p className="text-sm">{bmc.problemSolution}</p>
                            </div>
                            {bmc.customerAcquisition && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Customer Acquisition</p>
                                    <p className="text-sm">{bmc.customerAcquisition}</p>
                                </div>
                            )}
                            {bmc.revenueModel && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Revenue Model</p>
                                    <p className="text-sm">{bmc.revenueModel}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Business Model Canvas */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Business Model Canvas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <BMCSection title="Customer Segments" content={bmc.customerSegments} />
                        <BMCSection title="Value Propositions" content={bmc.valuePropositions} />
                        <BMCSection title="Channels" content={bmc.channels} />
                        <BMCSection title="Customer Relationships" content={bmc.customerRelationships} />
                        <BMCSection title="Revenue Streams" content={bmc.revenueStreams} />
                        <BMCSection title="Key Resources" content={bmc.keyResources} />
                        <BMCSection title="Key Activities" content={bmc.keyActivities} />
                        <BMCSection title="Key Partnerships" content={bmc.keyPartnerships} />
                        <BMCSection title="Cost Structure" content={bmc.costStructure} />
                    </div>
                </div>

                {/* Market Analysis */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Market Analysis</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BMCSection title="Competitor Analysis" content={bmc.competitorAnalysis} />
                        <BMCSection title="Market Insights" content={bmc.marketInsights} />
                    </div>
                </div>

                {/* Search Queries */}
                {bmc.searchQueriesUsed.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Research Queries</h2>
                        <Card className="bg-card border-border">
                            <CardContent className="pt-6">
                                <div className="flex flex-wrap gap-2">
                                    {bmc.searchQueriesUsed.map((query, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                                        >
                                            {query}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Ratings */}
                {bmc.ratings.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">AI Ratings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bmc.ratings.map((rating) => (
                                <Card key={rating.id} className="bg-card border-border">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{rating.ratingModel}</CardTitle>
                                            <div className="flex items-center gap-1 text-amber-500">
                                                <Star className="w-5 h-5 fill-current" />
                                                <span className="font-bold">{rating.score.toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <CardDescription>{rating.explanation}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {rating.strengths.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-green-500 mb-2">Strengths</p>
                                                <ul className="text-sm space-y-1">
                                                    {rating.strengths.map((strength, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="text-green-500">✓</span>
                                                            <span>{strength}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {rating.improvements.length > 0 && (
                                            <div>
                                                <p className="text-sm font-medium text-amber-500 mb-2">Improvements</p>
                                                <ul className="text-sm space-y-1">
                                                    {rating.improvements.map((improvement, idx) => (
                                                        <li key={idx} className="flex items-start gap-2">
                                                            <span className="text-amber-500">→</span>
                                                            <span>{improvement}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function BMCSection({ title, content }: { title: string; content: string }) {
    return (
        <Card className="bg-card border-border">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Streamdown>{content}</Streamdown>
            </CardContent>
        </Card>
    )
}
