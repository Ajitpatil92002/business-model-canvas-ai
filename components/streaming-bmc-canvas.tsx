"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { BMCData } from "@/lib/bmc-schema"
import {
    Activity,
    DollarSign,
    Gift,
    Handshake,
    Heart,
    Lightbulb,
    Loader2,
    MessageSquare,
    Search,
    Target,
    TrendingDown,
    Users,
    Wrench,
} from "lucide-react"
import type React from "react"
import { Streamdown } from "streamdown"

type Props = {
    data: Partial<BMCData> | null
    modelName: string
    isStreaming: boolean
    isBlindMode?: boolean
}

export function StreamingBMCCanvas({ data, modelName, isStreaming, isBlindMode = false }: Props) {
    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Waiting for {modelName} to start...</p>
            </div>
        )
    }

    return (
        <div className="space-y-5">
            {/* Row 1: 3 Sections - Key Partners, Key Activities, Key Resources */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InsightCard
                    data={data}
                    sectionKey="key_partnerships"
                    title="Key Partners"
                    icon={Handshake}
                    isStreaming={isStreaming}
                />
                <InsightCard
                    data={data}
                    sectionKey="key_activities"
                    title="Key Activities"
                    icon={Activity}
                    isStreaming={isStreaming}
                />
                <InsightCard
                    data={data}
                    sectionKey="key_resources"
                    title="Key Resources"
                    icon={Wrench}
                    isStreaming={isStreaming}
                />
            </div>

            {/* Row 2: 3 Sections - Value Propositions, Customer Relationships, Channels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InsightCard
                    data={data}
                    sectionKey="value_propositions"
                    title="Value Propositions"
                    icon={Gift}
                    isStreaming={isStreaming}
                    highlight
                />
                <InsightCard
                    data={data}
                    sectionKey="customer_relationships"
                    title="Customer Relationships"
                    icon={Heart}
                    isStreaming={isStreaming}
                />
                <InsightCard
                    data={data}
                    sectionKey="channels"
                    title="Channels"
                    icon={MessageSquare}
                    isStreaming={isStreaming}
                />
            </div>

            {/* Row 3: 3 Sections - Customer Segments, Competitor Analysis, Market Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InsightCard
                    data={data}
                    sectionKey="customer_segments"
                    title="Customer Segments"
                    icon={Users}
                    isStreaming={isStreaming}
                />
                <InsightCard
                    data={data}
                    sectionKey="competitor_analysis"
                    title="Competitor Analysis"
                    icon={Target}
                    isStreaming={isStreaming}
                />
                <InsightCard
                    data={data}
                    sectionKey="market_insights"
                    title="Market Insights"
                    icon={Lightbulb}
                    isStreaming={isStreaming}
                />
            </div>

            {/* Row 4: 2 Sections - Cost Structure, Revenue Streams */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InsightCard
                    data={data}
                    sectionKey="cost_structure"
                    title="Cost Structure"
                    icon={TrendingDown}
                    isStreaming={isStreaming}
                />
                <InsightCard
                    data={data}
                    sectionKey="revenue_streams"
                    title="Revenue Streams"
                    icon={DollarSign}
                    isStreaming={isStreaming}
                    highlight
                />
            </div>

            {/* Row 5: 1 Section - Research Queries */}
            {!isBlindMode && data.search_queries_used && data.search_queries_used.length > 0 && (
                <Card className="bg-secondary/20 border-border">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            Research Queries Used by {modelName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {data.search_queries_used.map((query, i) => (
                                <Badge key={i} variant="secondary" className="text-xs bg-secondary/50">
                                    {query}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}



function InsightCard({
    data,
    sectionKey,
    title,
    icon: Icon,
    isStreaming,
    highlight = false,
}: {
    data: Partial<BMCData>
    sectionKey: keyof BMCData
    title: string
    icon: React.ElementType
    isStreaming: boolean
    highlight?: boolean
}) {
    const content = data[sectionKey]
    const hasContent = typeof content === "string" && content.length > 0

    return (
        <Card className={`bg-card border-border transition-all duration-300 ${highlight ? "border-primary/30 bg-primary/5" : ""} ${hasContent && isStreaming ? "ring-1 ring-primary/20" : ""}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="min-h-[120px]">
                {hasContent ? (
                    <div className="text-sm prose prose-sm prose-invert max-w-none leading-relaxed">
                        <Streamdown isAnimating={isStreaming}>{content}</Streamdown>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[100px]">
                        {isStreaming ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Analyzing...</span>
                            </div>
                        ) : (
                            <span className="text-sm text-muted-foreground">No data</span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
