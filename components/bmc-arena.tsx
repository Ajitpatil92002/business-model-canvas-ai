"use client"

import type { BMCData } from "@/lib/bmc-schema"
import { DEFAULT_RATING_CRITERIA } from "@/lib/default-rating-criteria"
import type { AllRatings, RatingCriteria } from "@/lib/rating-schema"
import { useCallback, useState } from "react"
import { toast } from 'sonner'
import { BusinessInfoForm, type BusinessInfo } from "./business-info-form"
import { Header } from "./header"
import { HowItWorks } from "./how-it-works"
import { StreamingModelResults } from "./streaming-model-results"
import { WinnerModal } from "./winner-modal"

export type { BMCData }

export type ModelResult = {
    modelId: string
    modelName: string
    modelKey: string
    status: "idle" | "loading" | "complete" | "error"
    data: Partial<BMCData> | null
    error?: string
    startTime?: number
    endTime?: number
    bmcGenerationId?: string
}

const MODELS = [
    { id: "openai", name: "GPT-4o", model: "openai/gpt-4o" },
    { id: "anthropic", name: "Claude Sonnet", model: "anthropic/claude-sonnet-4-20250514" },
    { id: "gemini", name: "Gemini 2.0", model: "google/gemini-2.0-flash" },
]

export function BMCArena() {
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null)
    const [results, setResults] = useState<ModelResult[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isBlindMode, setIsBlindMode] = useState(true)
    const [selectedWinner, setSelectedWinner] = useState<string | null>(null)
    const [showWinnerModal, setShowWinnerModal] = useState(false)
    const [ratingCriteria, setRatingCriteria] = useState<RatingCriteria>(DEFAULT_RATING_CRITERIA)
    const [ratings, setRatings] = useState<AllRatings>([])
    const [isRating, setIsRating] = useState(false)

    const handleSubmit = async (info: BusinessInfo) => {
        setBusinessInfo(info)
        setIsGenerating(true)
        setIsBlindMode(true)
        setSelectedWinner(null)

        const initialResults: ModelResult[] = MODELS.map((m) => ({
            modelId: m.id,
            modelName: m.name,
            modelKey: m.model,
            status: "loading",
            data: null,
            startTime: Date.now(),
        }))
        setResults(initialResults)
    }

    const updateModelResult = useCallback((modelId: string, update: Partial<ModelResult>) => {
        setResults((prev) => prev.map((r) => (r.modelId === modelId ? { ...r, ...update } : r)))
    }, [])

    const handleAllComplete = useCallback(() => {
        setIsGenerating(false)
    }, [])

    const handleReset = () => {
        setBusinessInfo(null)
        setResults([])
        setIsGenerating(false)
        setIsBlindMode(true)
        setSelectedWinner(null)
        setShowWinnerModal(false)
        setRatings([])
        setIsRating(false)
    }

    const handleGetRatings = async () => {
        setIsRating(true)
        const newRatings: AllRatings = []

        try {
            // Each model rates the other two models
            for (const targetModel of MODELS) {
                const targetResult = results.find((r) => r.modelId === targetModel.id)
                if (!targetResult?.data) continue

                // Get ratings from other models
                const ratingModels = MODELS.filter((m) => m.id !== targetModel.id)

                for (const ratingModel of ratingModels) {
                    try {
                        const response = await fetch("/api/rate-bmc", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                bmcData: targetResult.data,
                                ratingModel: ratingModel.model,
                                criteria: ratingCriteria,
                                bmcGenerationId: targetResult.bmcGenerationId,
                            }),
                        })

                        if (response.ok) {
                            const rating = await response.json()
                            newRatings.push({
                                targetModelId: targetModel.id,
                                ratingModelId: ratingModel.id,
                                rating,
                                criteriaUsed: ratingCriteria,
                                timestamp: Date.now(),
                            })
                        }
                    } catch (error) {
                        console.error(`Error rating ${targetModel.id} by ${ratingModel.id}:`, error)
                        toast.error(`Error rating ${targetModel.id} by ${ratingModel.id}: ${error}`)
                    }
                }
            }

            setRatings(newRatings)
        } finally {
            setIsRating(false)
        }
    }

    const handleUpdateCriteria = (newCriteria: RatingCriteria) => {
        setRatingCriteria(newCriteria)
    }

    const handleSelectWinner = (modelId: string) => {
        setSelectedWinner(modelId)
        setIsBlindMode(false)
        setShowWinnerModal(true)
    }

    const handleCloseWinnerModal = () => {
        setShowWinnerModal(false)
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <div className="flex-1 container mx-auto px-4 py-8">
                {!businessInfo ? (
                    <>
                        <HowItWorks />
                        <BusinessInfoForm onSubmit={handleSubmit} />
                    </>
                ) : (
                    <StreamingModelResults
                        businessInfo={businessInfo}
                        models={MODELS}
                        results={results}
                        isGenerating={isGenerating}
                        isBlindMode={isBlindMode}
                        selectedWinner={selectedWinner}
                        ratingCriteria={ratingCriteria}
                        ratings={ratings}
                        isRating={isRating}
                        onUpdateResult={updateModelResult}
                        onAllComplete={handleAllComplete}
                        onSelectWinner={handleSelectWinner}
                        onReset={handleReset}
                        onGetRatings={handleGetRatings}
                        onUpdateCriteria={handleUpdateCriteria}
                    />
                )}
            </div>

            {showWinnerModal && selectedWinner && (
                <WinnerModal winnerModel={MODELS.find((m) => m.id === selectedWinner)} onClose={handleCloseWinnerModal} />
            )}
        </div>
    )
}
