import { Zap } from "lucide-react"
import Link from 'next/link'

export function Header() {
    return (
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">BMC Arena</h1>
                        <p className="text-xs text-muted-foreground">AI Model Showdown</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/bmc"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1 rounded-md bg-secondary"
                    >
                        View All BMCs
                    </Link>

                </div>
            </div>
        </header>
    )
}
