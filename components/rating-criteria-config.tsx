"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DEFAULT_RATING_CRITERIA } from "@/lib/default-rating-criteria"
import type { RatingCriteria, RatingCriterion } from "@/lib/rating-schema"
import { Plus, RotateCcw, Trash2 } from "lucide-react"
import { useState } from "react"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentCriteria: RatingCriteria
    onSave: (criteria: RatingCriteria) => void
}

export function RatingCriteriaConfig({ open, onOpenChange, currentCriteria, onSave }: Props) {
    const [criteria, setCriteria] = useState<RatingCriteria>(currentCriteria)

    const handleUpdate = (index: number, field: keyof RatingCriterion, value: string | number) => {
        const updated = [...criteria]
        updated[index] = { ...updated[index], [field]: value }
        setCriteria(updated)
    }

    const handleAdd = () => {
        setCriteria([...criteria, { name: "New Criterion", description: "", weight: 1 }])
    }

    const handleRemove = (index: number) => {
        setCriteria(criteria.filter((_, i) => i !== index))
    }

    const handleReset = () => {
        setCriteria(DEFAULT_RATING_CRITERIA)
    }

    const handleSave = () => {
        onSave(criteria)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Configure Rating Criteria</DialogTitle>
                    <DialogDescription>
                        Customize the criteria that AI models will use to rate each other's Business Model Canvas outputs.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {criteria.map((criterion, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3 bg-secondary/20">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">Criterion {index + 1}</Label>
                                {criteria.length > 1 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemove(index)}
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`name-${index}`} className="text-xs">
                                    Name
                                </Label>
                                <Input
                                    id={`name-${index}`}
                                    value={criterion.name}
                                    onChange={(e) => handleUpdate(index, "name", e.target.value)}
                                    placeholder="e.g., Completeness"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`description-${index}`} className="text-xs">
                                    Description
                                </Label>
                                <Textarea
                                    id={`description-${index}`}
                                    value={criterion.description}
                                    onChange={(e) => handleUpdate(index, "description", e.target.value)}
                                    placeholder="Describe what this criterion evaluates..."
                                    rows={2}
                                />
                            </div>
                        </div>
                    ))}

                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleAdd} className="flex-1">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Criterion
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset to Default
                        </Button>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Criteria</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
