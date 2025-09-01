"use client"

import { AlertTriangle, ShieldCheck } from "lucide-react"

export default function SafetyBanner({ locationGranted }: { locationGranted: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="flex items-center gap-2">
        {locationGranted ? (
          <>
            <ShieldCheck className="size-4 text-teal-600" />
            <span className="text-sm">Safety check ready. Location permission granted.</span>
          </>
        ) : (
          <>
            <AlertTriangle className="size-4 text-red-600" />
            <span className="text-sm">Location is off. Enable it to use geofence and alerts.</span>
          </>
        )}
      </div>
      <div className="text-xs text-muted-foreground">Alerts send minimal info with explicit confirmation.</div>
    </div>
  )
}
