"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { ModelRating } from "@/lib/rating-schema"
import { ChevronDown, ChevronUp, Lightbulb, Star, ThumbsUp } from "lucide-react"
import { useState } from "react"

type Props = {
    rating: ModelRating
    raterName: string
    isBlindMode?: boolean
}

export function ModelRatingDisplay({ rating, raterName, isBlindMode = false }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="border rounded-lg p-3 bg-secondary/10 space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">
                        {isBlindMode ? raterName : `Rated by ${raterName}`}
                    </span>
                    <StarRating score={rating.score} />
                </div>
                <Badge variant="secondary" className="text-xs">
                    {rating.score.toFixed(1)}/5
                </Badge>
            </div>

            <p className="text-sm text-muted-foreground italic">{rating.explanation}</p>

            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between h-8 text-xs">
                        {isOpen ? "Hide Details" : "Show Details"}
                        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-2">
                    {/* Criteria Scores */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground">Criteria Breakdown</p>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(rating.criteriaScores).map(([criterion, score]) => (
                                <div key={criterion} className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">{criterion}</span>
                                    <div className="flex items-center gap-1">
                                        <StarRating score={score} size="sm" />
                                        <span className="text-xs text-muted-foreground">({score})</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strengths */}
                    {rating.strengths.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                Strengths
                            </p>
                            <ul className="space-y-1 pl-4">
                                {rating.strengths.map((strength, i) => (
                                    <li key={i} className="text-xs text-muted-foreground list-disc">
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Improvements */}
                    {rating.improvements.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                Suggested Improvements
                            </p>
                            <ul className="space-y-1 pl-4">
                                {rating.improvements.map((improvement, i) => (
                                    <li key={i} className="text-xs text-muted-foreground list-disc">
                                        {improvement}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </div>
    )
}

function StarRating({ score, size = "md" }: { score: number; size?: "sm" | "md" }) {
    const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4"
    const fullStars = Math.floor(score)
    const hasHalfStar = score % 1 >= 0.5

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
                const isFull = i < fullStars
                const isHalf = i === fullStars && hasHalfStar

                return (
                    <Star
                        key={i}
                        className={`${sizeClass} ${isFull
                                ? "fill-amber-500 text-amber-500"
                                : isHalf
                                    ? "fill-amber-500/50 text-amber-500"
                                    : "fill-none text-muted-foreground/30"
                            }`}
                    />
                )
            })}
        </div>
    )
}

type RatingSummaryProps = {
    ratings: Array<{ raterName: string; rating: ModelRating }>
    isBlindMode?: boolean
}

export function RatingSummary({ ratings, isBlindMode = false }: RatingSummaryProps) {
    if (ratings.length === 0) {
        return (
            <div className="text-xs text-muted-foreground flex items-center gap-1">
                <span>⏳ Pending ratings...</span>
            </div>
        )
    }

    const avgScore = ratings.reduce((sum, r) => sum + r.rating.score, 0) / ratings.length

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Rated by:</span>
            {ratings.map((r, i) => (
                <div key={i} className="flex items-center gap-1">
                    <span className="text-xs font-medium">{r.raterName}</span>
                    <StarRating score={r.rating.score} size="sm" />
                    <span className="text-xs text-muted-foreground">({r.rating.score})</span>
                    {i < ratings.length - 1 && <span className="text-muted-foreground">,</span>}
                </div>
            ))}
            <Badge variant="secondary" className="text-xs ml-1">
                Avg: {avgScore.toFixed(1)}
            </Badge>
        </div>
    )
}
