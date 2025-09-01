"use client"

import { Badge } from "@/components/ui/badge"

type SocialStatus = "Interested" | "Neutral" | "Uncomfortable"

export default function StatusBadge({
  label,
  confidence,
}: {
  label: SocialStatus
  confidence: number // 0..1
}) {
  const pct = Math.round(confidence * 100)
  const { color, tone } = (() => {
    switch (label) {
      case "Interested":
        return { color: "bg-teal-600", tone: "text-white" }
      case "Neutral":
        return { color: "bg-muted", tone: "text-foreground" }
      case "Uncomfortable":
        return { color: "bg-red-600", tone: "text-white" }
      default:
        return { color: "bg-muted", tone: "text-foreground" }
    }
  })()

  return (
    <div className="rounded-md border bg-background/70 p-2 backdrop-blur">
      <div className="flex items-center gap-2">
        <Badge className={`${color} ${tone} font-medium`}>{label}</Badge>
        <span className="text-xs text-muted-foreground">Confidence {pct}%</span>
      </div>
      <div className="mt-2 h-1.5 w-44 overflow-hidden rounded bg-muted">
        <div className={`${color} h-full`} style={{ width: `${pct}%`, transition: "width 300ms ease" }} />
      </div>
    </div>
  )
}
