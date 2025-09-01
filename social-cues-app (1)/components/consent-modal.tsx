"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function ConsentModal({
  open,
  onAccept,
}: {
  open: boolean
  onAccept: () => void
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = ""
      }
    }
  }, [open])

  if (!open) return null
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    >
      <div className="w-full max-w-lg rounded-lg bg-background p-5 shadow-xl">
        <h2 className="text-balance text-lg font-semibold">Consent & Privacy</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This app uses your camera and microphone to provide real-time cues. Recording stores audio/video for review.
          By proceeding, you confirm that all participants are aware and consent to being recorded and analyzed.
        </p>
        <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground">
          <li>Data is for assistive insights only, not medical diagnosis.</li>
          <li>You may stop recording at any time.</li>
          <li>Summaries may use AI; verify before clinical use.</li>
        </ul>
        <div className="mt-4 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Cancel
          </Button>
          <Button onClick={onAccept}>I Have Consent</Button>
        </div>
      </div>
    </div>
  )
}
