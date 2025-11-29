"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import type { ModelResult } from "./bmc-arena"
import type { BusinessInfo } from "./business-info-form"
import { BMCCanvas } from "./bmc-canvas"

type Props = {
  businessInfo: BusinessInfo
  results: ModelResult[]
  isGenerating: boolean
  onReset: () => void
}

export function ModelResults({ businessInfo, results, isGenerating, onReset }: Props) {
  const completedCount = results.filter((r) => r.status === "complete").length

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
              : `All ${results.length} models have finished generating`}
          </p>
        </div>
      </div>

      {/* Model Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((result) => (
          <ModelStatusCard key={result.modelId} result={result} />
        ))}
      </div>

      {/* Results Tabs */}
      <Tabs defaultValue={results[0]?.modelId} className="w-full">
        <TabsList className="w-full justify-start bg-secondary/50 p-1 overflow-x-auto">
          {results.map((result) => (
            <TabsTrigger
              key={result.modelId}
              value={result.modelId}
              disabled={result.status === "loading"}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {result.modelName}
              {result.status === "loading" && <Loader2 className="w-3 h-3 ml-2 animate-spin" />}
            </TabsTrigger>
          ))}
        </TabsList>

        {results.map((result) => (
          <TabsContent key={result.modelId} value={result.modelId} className="mt-6">
            {result.status === "loading" && (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">{result.modelName} is analyzing your business...</p>
              </div>
            )}

            {result.status === "error" && (
              <Card className="bg-destructive/10 border-destructive/30">
                <CardContent className="py-8 text-center">
                  <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                  <p className="text-destructive">{result.error}</p>
                </CardContent>
              </Card>
            )}

            {result.status === "complete" && result.data && (
              <BMCCanvas data={result.data} modelName={result.modelName} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ModelStatusCard({ result }: { result: ModelResult }) {
  const duration = result.startTime && result.endTime ? ((result.endTime - result.startTime) / 1000).toFixed(1) : null

  return (
    <Card
      className={`bg-card border-border transition-all ${
        result.status === "complete" ? "border-primary/30" : result.status === "error" ? "border-destructive/30" : ""
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{result.modelName}</CardTitle>
          <StatusBadge status={result.status} />
        </div>
      </CardHeader>
      <CardContent>
        {result.status === "loading" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </div>
        )}
        {duration && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            {duration}s
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: ModelResult["status"] }) {
  switch (status) {
    case "loading":
      return (
        <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Running
        </Badge>
      )
    case "complete":
      return (
        <Badge className="bg-primary/20 text-primary border-0">
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
