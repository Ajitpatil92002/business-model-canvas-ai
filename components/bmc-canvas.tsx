"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, DollarSign, Gift, Handshake, Heart, MessageSquare, TrendingDown, Users, Wrench } from "lucide-react"
import type { BMCData } from "./bmc-arena"
import { StreamingBMCCanvas } from "./streaming-bmc-canvas"

type Props = {
    data: BMCData
    modelName: string
}

const BMC_SECTIONS = [
    { key: "key_partnerships", title: "Key Partnerships", icon: Handshake, color: "chart-1" },
    { key: "key_activities", title: "Key Activities", icon: Activity, color: "chart-2" },
    { key: "key_resources", title: "Key Resources", icon: Wrench, color: "chart-3" },
    { key: "value_propositions", title: "Value Propositions", icon: Gift, color: "chart-4" },
    { key: "customer_relationships", title: "Customer Relationships", icon: Heart, color: "chart-5" },
    { key: "channels", title: "Channels", icon: MessageSquare, color: "chart-1" },
    { key: "customer_segments", title: "Customer Segments", icon: Users, color: "chart-2" },
    { key: "cost_structure", title: "Cost Structure", icon: TrendingDown, color: "chart-3" },
    { key: "revenue_streams", title: "Revenue Streams", icon: DollarSign, color: "chart-4" },
]

export function BMCCanvas({ data, modelName }: Props) {
    return <StreamingBMCCanvas data={data} modelName={modelName} />
}

function BMCSection({
    data,
    sectionKey,
    title,
    icon: Icon,
    className = "",
}: {
    data: BMCData
    sectionKey: keyof BMCData
    title: string
    icon: React.ElementType
    className?: string
}) {
    const content = data[sectionKey]

    return (
        <Card className={`bg-card border-border ${className}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[120px]">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {typeof content === "string" ? content : JSON.stringify(content)}
                    </p>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
