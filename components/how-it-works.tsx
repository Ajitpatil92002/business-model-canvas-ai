import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Lightbulb, Sparkles, Trophy, Zap } from "lucide-react"

export function HowItWorks() {
    return (
        <div className="mb-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">How It Works</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Compare AI models side-by-side in a blind test to see which generates the best Business Model Canvas
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                <StepCard
                    number={1}
                    icon={Lightbulb}
                    title="Enter Your Business"
                    description="Describe your business idea, product, and target market"
                    color="blue"
                />
                <StepCard
                    number={2}
                    icon={Zap}
                    title="AI Models Generate"
                    description="3 leading AI models create Business Model Canvases simultaneously"
                    color="purple"
                />
                <StepCard
                    number={3}
                    icon={Trophy}
                    title="Blind Voting"
                    description="Vote for the best BMC without knowing which AI created it"
                    color="amber"
                />
                <StepCard
                    number={4}
                    icon={Sparkles}
                    title="Get AI Ratings"
                    description="See how each AI model rates the others' outputs"
                    color="green"
                />
            </div>
        </div>
    )
}

function StepCard({
    number,
    icon: Icon,
    title,
    description,
    color,
}: {
    number: number
    icon: React.ElementType
    title: string
    description: string
    color: "blue" | "purple" | "amber" | "green"
}) {
    const colorClasses = {
        blue: "bg-blue-500/20 text-blue-500 border-blue-500/30",
        purple: "bg-purple-500/20 text-purple-500 border-purple-500/30",
        amber: "bg-amber-500/20 text-amber-500 border-amber-500/30",
        green: "bg-green-500/20 text-green-500 border-green-500/30",
    }

    return (
        <Card className="bg-card border-border relative overflow-hidden group hover:border-primary/50 transition-all">
            <div className="absolute top-0 right-0 w-20 h-20 -mr-10 -mt-10 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-all" />
            <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3 border`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-muted-foreground/30">{number}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/30" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{description}</CardDescription>
            </CardContent>
        </Card>
    )
}
