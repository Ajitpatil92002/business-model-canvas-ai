"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BUSINESS_IDEAS } from "@/lib/business-ideas"
import { ArrowRight, Building2, ChevronLeft, ChevronRight, DollarSign, Lightbulb, Puzzle, Sparkles, Users } from "lucide-react"
import { useState } from "react"

export type BusinessInfo = {
    businessName: string
    productService: string
    problemSolution: string
    customerAcquisition?: string
    revenueModel?: string
    keyResources?: string
}

type Props = {
    onSubmit: (info: BusinessInfo) => void
}

const STEPS = [
    {
        id: "basic",
        title: "Business Basics",
        icon: Building2,
        description: "Tell us about your business",
    },
    {
        id: "value",
        title: "Value Proposition",
        icon: Lightbulb,
        description: "What problem do you solve?",
    },
    {
        id: "customers",
        title: "Customer Acquisition",
        icon: Users,
        description: "How do you reach customers? (Optional)",
    },
    {
        id: "revenue",
        title: "Revenue & Costs",
        icon: DollarSign,
        description: "How do you make money? (Optional)",
    },
    {
        id: "resources",
        title: "Key Resources",
        icon: Puzzle,
        description: "What do you need to run? (Optional)",
    },
]

export function BusinessInfoForm({ onSubmit }: Props) {
    const [step, setStep] = useState(0)
    const [showSuggestions, setShowSuggestions] = useState(true)
    const [formData, setFormData] = useState<BusinessInfo>({
        businessName: "",
        productService: "",
        problemSolution: "",
        customerAcquisition: "",
        revenueModel: "",
        keyResources: "",
    })

    const handleChange = (field: keyof BusinessInfo, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        setShowSuggestions(false)
    }

    const handleSelectIdea = (idea: BusinessInfo) => {
        setFormData(idea)
        setShowSuggestions(false)
        setStep(0)
    }

    const canProceed = () => {
        if (step === 0) return formData.businessName.trim() && formData.productService.trim()
        if (step === 1) return formData.problemSolution.trim()
        return true // Optional steps can always proceed
    }

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(step + 1)
        } else {
            onSubmit(formData)
        }
    }

    const handleBack = () => {
        if (step > 0) setStep(step - 1)
    }

    const currentStep = STEPS[step]
    const StepIcon = currentStep.icon

    return (
        <div className="max-w-4xl mx-auto">


            <div className="mx-auto mb-10">
                {/* Progress indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {STEPS.map((s, i) => {
                            const Icon = s.icon
                            return (
                                <div key={s.id} className={`flex items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                                    <button
                                        onClick={() => i < step && setStep(i)}
                                        disabled={i > step}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${i === step
                                            ? "bg-primary text-primary-foreground"
                                            : i < step
                                                ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                                                : "bg-secondary text-muted-foreground"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </button>
                                    {i < STEPS.length - 1 && (
                                        <div
                                            className={`flex-1 h-1 mx-2 rounded-full transition-all ${i < step ? "bg-primary/50" : "bg-secondary"
                                                }`}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                        Step {step + 1} of {STEPS.length}
                    </p>
                </div>

                <Card className="bg-card border-border">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                            <StepIcon className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">{currentStep.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {step === 0 && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="businessName">Business Name *</Label>
                                    <Input
                                        id="businessName"
                                        placeholder="e.g., TechFlow Solutions"
                                        value={formData.businessName}
                                        onChange={(e) => handleChange("businessName", e.target.value)}
                                        className="bg-input border-border"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="productService">What is your product or service, and who is it for? *</Label>
                                    <Textarea
                                        id="productService"
                                        placeholder="e.g., AI-powered project management tool for remote teams that helps coordinate work across time zones"
                                        value={formData.productService}
                                        onChange={(e) => handleChange("productService", e.target.value)}
                                        className="bg-input border-border min-h-[120px]"
                                    />
                                </div>
                            </>
                        )}

                        {step === 1 && (
                            <div className="space-y-2">
                                <Label htmlFor="problemSolution">
                                    What problem are you solving, and how is your solution different or better? *
                                </Label>
                                <Textarea
                                    id="problemSolution"
                                    placeholder="e.g., Remote teams struggle with async communication and task handoffs. Our AI automatically prioritizes tasks based on team availability and deadlines, reducing coordination overhead by 40%."
                                    value={formData.problemSolution}
                                    onChange={(e) => handleChange("problemSolution", e.target.value)}
                                    className="bg-input border-border min-h-[160px]"
                                />
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-2">
                                <Label htmlFor="customerAcquisition">How do you find, reach, and interact with your customers?</Label>
                                <Textarea
                                    id="customerAcquisition"
                                    placeholder="e.g., Content marketing through engineering blogs, partnerships with remote work consultants, free tier for small teams, enterprise sales for large organizations"
                                    value={formData.customerAcquisition}
                                    onChange={(e) => handleChange("customerAcquisition", e.target.value)}
                                    className="bg-input border-border min-h-[160px]"
                                />
                                <p className="text-xs text-muted-foreground">Leave blank to let AI analyze and suggest channels</p>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-2">
                                <Label htmlFor="revenueModel">How do you make money, and what are your major costs?</Label>
                                <Textarea
                                    id="revenueModel"
                                    placeholder="e.g., SaaS subscription model - $15/user/month for teams, $49/user/month for enterprise. Main costs: cloud infrastructure, AI compute, customer support, marketing"
                                    value={formData.revenueModel}
                                    onChange={(e) => handleChange("revenueModel", e.target.value)}
                                    className="bg-input border-border min-h-[160px]"
                                />
                                <p className="text-xs text-muted-foreground">Leave blank to let AI suggest revenue models</p>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-2">
                                <Label htmlFor="keyResources">What are the most important things, people, and partners needed?</Label>
                                <Textarea
                                    id="keyResources"
                                    placeholder="e.g., Engineering team with AI/ML expertise, cloud infrastructure partnerships, integrations with Slack/Teams/Notion, customer success team"
                                    value={formData.keyResources}
                                    onChange={(e) => handleChange("keyResources", e.target.value)}
                                    className="bg-input border-border min-h-[160px]"
                                />
                                <p className="text-xs text-muted-foreground">Leave blank to let AI identify key resources</p>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-4">
                            <Button variant="ghost" onClick={handleBack} disabled={step === 0} className="text-muted-foreground">
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button onClick={handleNext} disabled={!canProceed()} className="bg-primary hover:bg-primary/90">
                                {step === STEPS.length - 1 ? (
                                    <>
                                        Generate BMC
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Skip to generation */}
                {step >= 2 && (
                    <p className="text-center mt-4 text-sm text-muted-foreground">
                        <button onClick={() => onSubmit(formData)} className="text-primary hover:underline">
                            Skip remaining steps and generate now →
                        </button>
                    </p>
                )}
            </div>
            {/* Business Idea Suggestions */}
            {showSuggestions && (
                <Card className="mb-8 bg-linear-to-br border-primary/20">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <CardTitle>Try an Example Business Idea</CardTitle>
                        </div>
                        <CardDescription>
                            Click any example below to auto-fill the form and see how it works
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {BUSINESS_IDEAS.map((idea, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSelectIdea(idea)}
                                    className="text-left p-4 rounded-lg border border-border bg-card hover:bg-accent/10 hover:border-primary/50 transition-all"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{idea.emoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                                                {idea.businessName}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">{idea.category}</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
