"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Building2, Calendar, ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

type BMCItem = {
    id: string
    createdAt: string
    businessName: string
    productService: string
    model: string
    customerSegments: string
    valuePropositions: string
}

type BMCListResponse = {
    items: BMCItem[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export default function BMCListPage() {
    const [data, setData] = useState<BMCListResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [page, setPage] = useState(1)
    const limit = 12

    useEffect(() => {
        const fetchBMCs = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`/api/bmc?page=${page}&limit=${limit}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch BMCs')
                }
                const result = await response.json()
                setData(result)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchBMCs()
    }, [page])

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Arena
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-foreground">All BMCs</h1>
                            <p className="text-xs text-muted-foreground">Generated Business Model Canvases</p>
                        </div>
                    </div>
                    <div className="w-24" /> {/* Spacer for centering */}
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Stats */}
                {data && (
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Showing {((page - 1) * limit) + 1} - {Math.min(page * limit, data.total)} of {data.total} BMCs
                            </p>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading BMCs...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <Card className="bg-destructive/10 border-destructive/30">
                        <CardContent className="py-8 text-center">
                            <p className="text-destructive">{error}</p>
                        </CardContent>
                    </Card>
                )}

                {/* BMC Grid */}
                {!loading && !error && data && (
                    <>
                        {data.items.length === 0 ? (
                            <Card className="bg-card border-border">
                                <CardContent className="py-20 text-center">
                                    <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">No BMCs yet</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Start by generating your first Business Model Canvas
                                    </p>
                                    <Link href="/">
                                        <Button>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Generate BMC
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.items.map((bmc) => (
                                    <Card
                                        key={bmc.id}
                                        className="bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10"
                                    >
                                        <CardHeader>
                                            <div className="flex items-start justify-between mb-2">
                                                <CardTitle className="text-lg line-clamp-1">
                                                    {bmc.businessName}
                                                </CardTitle>
                                                <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
                                                    {bmc.model}
                                                </span>
                                            </div>
                                            <CardDescription className="line-clamp-2">
                                                {bmc.productService}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                                        Customer Segments
                                                    </p>
                                                    <p className="text-sm line-clamp-2">{bmc.customerSegments}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                                        Value Propositions
                                                    </p>
                                                    <p className="text-sm line-clamp-2">{bmc.valuePropositions}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t">
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(bmc.createdAt).toLocaleDateString()}
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/bmc/${bmc.id}`}>
                                                        View Details
                                                        <ArrowRight className="w-3 h-3 ml-1" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Bottom Pagination */}
                        {data.items.length > 0 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || loading}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground px-4">
                                    Page {page} of {data.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                                    disabled={page === data.totalPages || loading}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
