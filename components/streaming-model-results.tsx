"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bmcSchema, type BMCData } from "@/lib/bmc-schema";
import type { AllRatings, RatingCriteria } from "@/lib/rating-schema";
import { experimental_useObject as useObject } from '@ai-sdk/react';
import { ArrowLeft, CheckCircle2, Clock, Download, Loader2, SettingsIcon, SparklesIcon, Trophy, XCircle, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ModelResult } from "./bmc-arena";
import type { BusinessInfo } from "./business-info-form";
import { ModelRatingDisplay, RatingSummary } from './model-rating-display';
import { RatingCriteriaConfig } from './rating-criteria-config';
import { StreamingBMCCanvas } from "./streaming-bmc-canvas";

type Model = {
    id: string
    name: string
    model: string
}

type Props = {
    businessInfo: BusinessInfo
    models: Model[]
    results: ModelResult[]
    isGenerating: boolean
    isBlindMode: boolean
    selectedWinner: string | null
    ratingCriteria: RatingCriteria
    ratings: AllRatings
    isRating: boolean
    onUpdateResult: (modelId: string, update: Partial<ModelResult>) => void
    onAllComplete: () => void
    onSelectWinner: (modelId: string) => void
    onReset: () => void
    onGetRatings: () => void
    onUpdateCriteria: (criteria: RatingCriteria) => void
}

const BLIND_LABELS = ["Model A", "Model B", "Model C"]

export function StreamingModelResults({
    businessInfo,
    models,
    results,
    isGenerating,
    isBlindMode,
    selectedWinner,
    ratingCriteria,
    ratings,
    isRating,
    onUpdateResult,
    onAllComplete,
    onSelectWinner,
    onReset,
    onGetRatings,
    onUpdateCriteria,
}: Props) {
    const [showCriteriaConfig, setShowCriteriaConfig] = useState(false)
    const completedCount = results.filter((r) => r.status === "complete" || r.status === "error").length
    const allComplete = completedCount === results.length && results.length > 0
    const hasRatings = ratings.length > 0

    useEffect(() => {
        if (allComplete) {
            onAllComplete()
        }
    }, [allComplete, onAllComplete])

    const getDisplayName = (model: Model, index: number) => {
        if (isBlindMode) return BLIND_LABELS[index]
        return model.name
    }

    const getRatingsForModel = (modelId: string) => {
        return ratings
            .filter((r) => r.targetModelId === modelId)
            .map((r) => {
                const raterIndex = models.findIndex((m) => m.id === r.ratingModelId)
                return {
                    raterName: getDisplayName(models[raterIndex], raterIndex),
                    rating: r.rating,
                }
            })
    }

    const handleExport = (model: Model, result: ModelResult) => {
        if (!result.data) return
        const exportData = {
            businessName: businessInfo.businessName,
            generatedBy: model.name,
            generatedAt: new Date().toISOString(),
            bmc: result.data,
        }
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `bmc-${businessInfo.businessName.toLowerCase().replace(/\s+/g, "-")}-${model.id}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Button variant="ghost" onClick={onReset} className="mb-2 -ml-2">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Start Over
                    </Button>
                    <h2 className="text-2xl font-bold">{businessInfo.businessName}</h2>
                    <p className="text-muted-foreground">
                        {isGenerating
                            ? `Generating... ${completedCount}/${results.length} models complete`
                            : isBlindMode
                                ? "All models finished! Vote for the best BMC below."
                                : `Winner selected! Revealing all model identities.`}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isGenerating && (
                        <Badge variant="secondary" className="animate-pulse bg-primary/20 text-primary">
                            <Zap className="w-3 h-3 mr-1" />
                            Live Streaming
                        </Badge>
                    )}
                    {!isGenerating && isBlindMode && (
                        <Badge variant="outline" className="border-amber-500/50 text-amber-500">
                            <Trophy className="w-3 h-3 mr-1" />
                            Blind Voting Mode
                        </Badge>
                    )}
                    {allComplete && !isGenerating && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCriteriaConfig(true)}
                            >
                                <SettingsIcon className="w-4 h-4 mr-2" />
                                Configure Criteria
                            </Button>
                            {!hasRatings ? (
                                <Button
                                    onClick={onGetRatings}
                                    disabled={isRating}
                                    size="sm"
                                    className="bg-linear-to-r"
                                >
                                    {isRating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Getting Ratings...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-4 h-4 mr-2" />
                                            Get AI Ratings
                                        </>
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    onClick={onGetRatings}
                                    disabled={isRating}
                                    variant="outline"
                                    size="sm"
                                >
                                    {isRating ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Re-rating...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-4 h-4 mr-2" />
                                            Re-rate
                                        </>
                                    )}
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>

            <RatingCriteriaConfig
                open={showCriteriaConfig}
                onOpenChange={setShowCriteriaConfig}
                currentCriteria={ratingCriteria}
                onSave={onUpdateCriteria}
            />

            {/* Model Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {models.map((model, index) => {
                    const result = results.find((r) => r.modelId === model.id)
                    const modelRatings = getRatingsForModel(model.id)
                    return (
                        <StreamingModelCard
                            key={model.id}
                            model={model}
                            displayName={getDisplayName(model, index)}
                            result={result}
                            businessInfo={businessInfo}
                            isBlindMode={isBlindMode}
                            isWinner={selectedWinner === model.id}
                            canVote={!isGenerating && isBlindMode && result?.status === "complete"}
                            ratings={modelRatings}
                            onUpdateResult={onUpdateResult}
                            onVote={() => onSelectWinner(model.id)}
                            onExport={() => handleExport(model, result!)}
                        />
                    )
                })}
            </div>

            {/* Results Tabs */}
            <Tabs defaultValue={models[0]?.id} className="w-full">
                <TabsList className="w-full justify-start bg-secondary/50 p-1 overflow-x-auto">
                    {models.map((model, index) => {
                        const result = results.find((r) => r.modelId === model.id)
                        const isWinner = selectedWinner === model.id
                        return (
                            <TabsTrigger
                                key={model.id}
                                value={model.id}
                                className={`data-[state=active]:bg-primary data-[state=active]:text-primary-foreground ${isWinner ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-background" : ""
                                    }`}
                            >
                                {isWinner && <Trophy className="w-3 h-3 mr-1 text-amber-500" />}
                                {getDisplayName(model, index)}
                                {result?.status === "loading" && <Loader2 className="w-3 h-3 ml-2 animate-spin" />}
                                {result?.status === "complete" && <CheckCircle2 className="w-3 h-3 ml-2 text-green-500" />}
                            </TabsTrigger>
                        )
                    })}
                </TabsList>

                {models.map((model, index) => {
                    const result = results.find((r) => r.modelId === model.id)
                    return (
                        <TabsContent key={model.id} value={model.id} className="mt-6">
                            {result?.status === "complete" && (
                                <div className="flex justify-end mb-4">
                                    <Button variant="outline" size="sm" onClick={() => handleExport(model, result)}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Export BMC
                                    </Button>
                                </div>
                            )}

                            {result?.status === "error" && (
                                <Card className="bg-destructive/10 border-destructive/30">
                                    <CardContent className="py-8 text-center">
                                        <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                                        <p className="text-destructive">{result.error}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {(result?.status === "loading" || result?.status === "complete") && (
                                <StreamingBMCCanvas
                                    data={result.data}
                                    modelName={getDisplayName(model, index)}
                                    isStreaming={result.status === "loading"}
                                    isBlindMode={isBlindMode}
                                />
                            )}

                            {!result && (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                                    <p className="text-muted-foreground">Initializing {getDisplayName(model, index)}...</p>
                                </div>
                            )}
                        </TabsContent>
                    )
                })}
            </Tabs>
        </div>
    )
}

function StreamingModelCard({
    model,
    displayName,
    result,
    businessInfo,
    isBlindMode,
    isWinner,
    canVote,
    ratings,
    onUpdateResult,
    onVote,
    onExport,
}: {
    model: Model
    displayName: string
    result: ModelResult | undefined
    businessInfo: BusinessInfo
    isBlindMode: boolean
    isWinner: boolean
    canVote: boolean
    ratings: Array<{ raterName: string; rating: any }>
    onUpdateResult: (modelId: string, update: Partial<ModelResult>) => void
    onVote: () => void
    onExport: () => void
}) {
    const hasStarted = useRef(false)
    const [showRatingDetails, setShowRatingDetails] = useState(false)

    const { object, isLoading, error, submit } = useObject({
        api: "/api/generate-bmc",
        schema: bmcSchema,
    })

    useEffect(() => {
        if (!hasStarted.current && result?.status === "loading") {
            hasStarted.current = true
            const generationId = crypto.randomUUID()
            onUpdateResult(model.id, { bmcGenerationId: generationId })
            submit({ businessInfo, model: model.model, id: generationId })
        }
    }, [result?.status, businessInfo, model.model, submit, model.id, onUpdateResult])

    useEffect(() => {
        if (object) {
            onUpdateResult(model.id, { data: object as Partial<BMCData> })
        }
    }, [object, model.id, onUpdateResult])

    useEffect(() => {
        if (!isLoading && hasStarted.current && !error) {
            onUpdateResult(model.id, { status: "complete", endTime: Date.now() })
        }
    }, [isLoading, error, model.id, onUpdateResult])

    useEffect(() => {
        if (error) {
            onUpdateResult(model.id, {
                status: "error",
                error: error.message || "Unknown error",
                endTime: Date.now(),
            })
        }
    }, [error, model.id, onUpdateResult])

    const duration = result?.startTime && result?.endTime ? ((result.endTime - result.startTime) / 1000).toFixed(1) : null

    const filledSections = object
        ? Object.values(object).filter(
            (v) => v && (typeof v === "string" ? v.length > 0 : Array.isArray(v) && v.length > 0),
        ).length
        : 0

    return (
        <Card
            className={`bg-card border-border transition-all ${isWinner
                ? "border-amber-500 shadow-lg shadow-amber-500/20 ring-2 ring-amber-500/50"
                : result?.status === "complete"
                    ? "border-primary/50 shadow-lg shadow-primary/10"
                    : result?.status === "error"
                        ? "border-destructive/30"
                        : isLoading
                            ? "border-primary/30"
                            : ""
                }`}
        >
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        {isWinner && <Trophy className="w-5 h-5 text-amber-500" />}
                        {displayName}
                    </CardTitle>
                    <StatusBadge status={result?.status || "idle"} isLoading={isLoading} isWinner={isWinner} />
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary font-medium">{filledSections}/12 sections</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 ease-out"
                                style={{ width: `${(filledSections / 12) * 100}%` }}
                            />
                        </div>
                    </div>
                )}
                {duration && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Completed in {duration}s
                    </div>
                )}
                {error && <p className="text-sm text-destructive">{error.message}</p>}

                {/* AI Ratings Display */}
                {result?.status === "complete" && ratings.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                        <RatingSummary ratings={ratings} isBlindMode={isBlindMode} />
                        {showRatingDetails && (
                            <div className="space-y-2 mt-2">
                                {ratings.map((r, i) => (
                                    <ModelRatingDisplay
                                        key={i}
                                        rating={r.rating}
                                        raterName={r.raterName}
                                        isBlindMode={isBlindMode}
                                    />
                                ))}
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowRatingDetails(!showRatingDetails)}
                            className="w-full h-7 text-xs"
                        >
                            {showRatingDetails ? "Hide Details" : "Show Rating Details"}
                        </Button>
                    </div>
                )}

                {result?.status === "complete" && (
                    <div className="flex gap-2 pt-2">
                        {canVote && (
                            <Button onClick={onVote} className="flex-1 bg-amber-500 hover:bg-amber-600 text-black">
                                <Trophy className="w-4 h-4 mr-2" />
                                Vote as Best
                            </Button>
                        )}
                        {!isBlindMode && (
                            <Button variant="outline" size="icon" onClick={onExport}>
                                <Download className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

function StatusBadge({
    status,
    isLoading,
    isWinner,
}: { status: ModelResult["status"]; isLoading: boolean; isWinner: boolean }) {
    if (isWinner) {
        return (
            <Badge className="bg-amber-500/20 text-amber-500 border-0">
                <Trophy className="w-3 h-3 mr-1" />
                Winner
            </Badge>
        )
    }

    if (isLoading || status === "loading") {
        return (
            <Badge variant="secondary" className="bg-primary/20 text-primary border-0">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Streaming
            </Badge>
        )
    }

    switch (status) {
        case "complete":
            return (
                <Badge className="bg-green-500/20 text-green-500 border-0">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done
                </Badge>
            )
        case "error":
            return (
                <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Error
                </Badge>
            )
        default:
            return null
    }
}
