"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sparkles, Trophy, X } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

type Props = {
    winnerModel?: { id: string; name: string; model: string }
    onClose: () => void
}

// Confetti particle type
type Particle = {
    id: number
    x: number
    y: number
    rotation: number
    color: string
    size: number
    speedX: number
    speedY: number
    rotationSpeed: number
}

export function WinnerModal({ winnerModel, onClose }: Props) {
    const [particles, setParticles] = useState<Particle[]>([])

    // Generate confetti particles
    const generateConfetti = useCallback(() => {
        const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8"]
        const newParticles: Particle[] = []

        for (let i = 0; i < 150; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: -20 - Math.random() * 20,
                rotation: Math.random() * 360,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 10 + 5,
                speedX: (Math.random() - 0.5) * 3,
                speedY: Math.random() * 3 + 2,
                rotationSpeed: (Math.random() - 0.5) * 10,
            })
        }
        setParticles(newParticles)
    }, [])

    // Animate confetti
    useEffect(() => {
        generateConfetti()

        const interval = setInterval(() => {
            setParticles((prev) =>
                prev
                    .map((p) => ({
                        ...p,
                        y: p.y + p.speedY,
                        x: p.x + p.speedX,
                        rotation: p.rotation + p.rotationSpeed,
                    }))
                    .filter((p) => p.y < 120),
            )
        }, 50)

        return () => clearInterval(interval)
    }, [generateConfetti])

    if (!winnerModel) return null

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md overflow-hidden">
                {/* Confetti overlay */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {particles.map((particle) => (
                        <div
                            key={particle.id}
                            className="absolute"
                            style={{
                                left: `${particle.x}%`,
                                top: `${particle.y}%`,
                                width: particle.size,
                                height: particle.size,
                                backgroundColor: particle.color,
                                transform: `rotate(${particle.rotation}deg)`,
                                borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                            }}
                        />
                    ))}
                </div>

                <DialogHeader className="relative z-10">
                    <div className="flex flex-col items-center text-center py-6">
                        <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-full bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center animate-bounce">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>
                            <Sparkles className="w-6 h-6 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                            <Sparkles className="w-5 h-5 text-amber-400 absolute -bottom-1 -left-1 animate-pulse delay-300" />
                        </div>

                        <DialogTitle className="text-2xl font-bold mb-2">Winner Revealed!</DialogTitle>

                        <div className="relative">
                            <div className="absolute inset-0 bg-linear-to-r from-amber-400/20 via-amber-500/20 to-amber-400/20 blur-xl" />
                            <h3 className="relative text-4xl font-black bg-linear-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent py-2">
                                {winnerModel.name}
                            </h3>
                        </div>

                        <DialogDescription className="mt-4 text-muted-foreground">
                            You selected this as the best Business Model Canvas generation!
                        </DialogDescription>

                        <p className="text-xs text-muted-foreground mt-2 font-mono">Model: {winnerModel.model}</p>
                    </div>
                </DialogHeader>

                <div className="flex justify-center relative z-10 pb-4">
                    <Button onClick={onClose} size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                        Continue
                    </Button>
                </div>

                <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 z-20">
                    <X className="w-4 h-4" />
                </Button>
            </DialogContent>
        </Dialog>
    )
}
