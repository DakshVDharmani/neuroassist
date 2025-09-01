"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Camera, Circle, CircleStop, FileText, MapPin, Mic, ShieldCheck } from "lucide-react"
import ConsentModal from "./consent-modal"
import SafetyBanner from "./safety-banner"
import StatusBadge from "./status-badge"

// Color system (3-5 colors):
// - Primary: teal-600
// - Neutrals: bg-background / text-foreground / text-muted-foreground
// - Accent: red-600 (alerts)

type SocialStatus = "Interested" | "Neutral" | "Uncomfortable"

export default function MainPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<number | null>(null)

  const [consentOpen, setConsentOpen] = useState(true)
  const [overlayEnabled, setOverlayEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [status, setStatus] = useState<SocialStatus>("Neutral")
  const [confidence, setConfidence] = useState(0.62)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [captions, setCaptions] = useState<string>("")
  const [locationGranted, setLocationGranted] = useState(false)

  // Acquire webcam after consent
  useEffect(() => {
    if (consentOpen) return
    let active = true
    ;(async () => {
      try {
        console.log("[v0] Requesting media...")
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
          audio: true,
        })
        if (!active) return
        mediaStreamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (e) {
        console.log("[v0] Media error:", e)
      }
    })()
    return () => {
      active = false
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop())
        mediaStreamRef.current = null
      }
    }
  }, [consentOpen])

  // Mock AR status cycle until MediaPipe wired
  useEffect(() => {
    if (!overlayEnabled) return
    const id = window.setInterval(() => {
      setStatus((p) => (p === "Neutral" ? "Interested" : p === "Interested" ? "Uncomfortable" : "Neutral"))
      setConfidence((c) => Math.min(0.95, Math.max(0.35, c + (Math.random() * 0.12 - 0.06))))
    }, 3000)
    return () => window.clearInterval(id)
  }, [overlayEnabled])

  // Mock captions while recording
  useEffect(() => {
    if (!isRecording) return
    const phrases = [
      "Listening…",
      "They might be engaged. Tone steady.",
      "Possible hesitation detected.",
      "Note: brief eye aversion.",
    ]
    let i = 0
    const id = window.setInterval(() => {
      setCaptions((c) => (c + " " + phrases[i % phrases.length]).trim())
      i++
    }, 1800)
    return () => window.clearInterval(id)
  }, [isRecording])

  const startTimer = () => {
    const t0 = Date.now()
    timerRef.current = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - t0) / 1000))
    }, 250) as unknown as number
  }
  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const startRecording = useCallback(() => {
    if (!mediaStreamRef.current) return
    setCaptions("")
    setPreviewUrl(null)
    chunksRef.current = []
    try {
      const mr = new MediaRecorder(mediaStreamRef.current, { mimeType: "video/webm;codecs=vp9,opus" })
      recorderRef.current = mr
      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setPreviewUrl(url)
        console.log("[v0] Recorded blob bytes:", blob.size)
      }
      mr.start(1000)
      setIsRecording(true)
      setElapsed(0)
      startTimer()
    } catch (e) {
      console.log("[v0] Failed to start recording:", e)
    }
  }, [])

  const stopRecording = useCallback(() => {
    recorderRef.current?.stop()
    setIsRecording(false)
    stopTimer()
  }, [])

  const toggleRecording = useCallback(() => {
    if (isRecording) stopRecording()
    else startRecording()
  }, [isRecording, startRecording, stopRecording])

  const timeText = useMemo(() => {
    const mm = String(Math.floor(elapsed / 60)).padStart(2, "0")
    const ss = String(elapsed % 60).padStart(2, "0")
    return `${mm}:${ss}`
  }, [elapsed])

  const handleAllowLocation = () => {
    if (!("geolocation" in navigator)) return
    navigator.geolocation.getCurrentPosition(
      () => setLocationGranted(true),
      () => setLocationGranted(false),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 },
    )
  }

  return (
    <>
      <ConsentModal open={consentOpen} onAccept={() => setConsentOpen(false)} />
      <div className="space-y-6">
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-pretty text-2xl font-semibold tracking-tight">Social Cues Assist</h1>
            <p className="text-pretty text-sm text-muted-foreground">
              Real-time cues, recording, captions, and clinician-ready summaries. Privacy-first and consent-centric.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="flex items-center gap-2" onClick={handleAllowLocation}>
              <MapPin className="size-4" />
              Enable Location
            </Button>
            <Button variant="default" className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Privacy & Ethics
            </Button>
          </div>
        </header>

        <SafetyBanner locationGranted={locationGranted} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-balance">Live Session</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch id="overlay" checked={overlayEnabled} onCheckedChange={setOverlayEnabled} />
                <Label htmlFor="overlay" className="text-sm">
                  Overlays
                </Label>
              </div>
              <Separator orientation="vertical" className="mx-1 h-6" />
              <div className="flex items-center gap-2">
                <Mic className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Captions {isRecording ? "On" : "Off"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative overflow-hidden rounded-lg border bg-muted/10">
              {/* Video */}
              <video ref={videoRef} muted playsInline className="block aspect-video w-full bg-black object-cover" />

              {/* AR Overlay (placeholder) */}
              {overlayEnabled && (
                <div className="pointer-events-none absolute inset-0">
                  <div className="pointer-events-auto absolute left-3 top-3">
                    <StatusBadge label={status} confidence={confidence} />
                  </div>
                  <div className="absolute inset-0">
                    <div className="absolute left-1/2 top-1/2 h-40 w-64 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-white/40"></div>
                  </div>
                </div>
              )}

              {/* Controls overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    {isRecording ? <CircleStop className="size-5" /> : <Camera className="size-5" />}
                    {isRecording ? "Stop" : "Record"}
                  </Button>
                  <Badge variant="secondary" className="ml-1">
                    <span className="flex items-center gap-1">
                      <Circle className={`size-3 ${isRecording ? "text-red-600" : "text-muted-foreground"}`} />
                      <span className="font-mono text-xs">{timeText}</span>
                    </span>
                  </Badge>
                </div>
                <div>
                  <Button variant="secondary" size="sm">
                    Bookmark
                  </Button>
                </div>
              </div>
            </div>

            {/* Captions */}
            <div className="rounded-md border bg-background p-3">
              <div className="mb-1 text-xs font-medium text-muted-foreground">Live Captions</div>
              <p className="min-h-10 text-pretty text-sm leading-6">{captions || "…"}</p>
            </div>

            {/* Summary CTA + Preview */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <Button className="flex items-center gap-2">
                  <FileText className="size-4" />
                  Create Clinician Summary
                </Button>
                <p className="text-xs text-muted-foreground">Uses transcript + cues to generate a brief summary.</p>
              </div>
              {previewUrl && (
                <div className="w-full md:w-72">
                  <div className="mb-1 text-xs text-muted-foreground">Last Recording</div>
                  <video src={previewUrl} className="w-full rounded-md border" controls />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <footer className="text-xs text-muted-foreground">
          Always obtain consent before recording or analyzing others. This tool provides assistive cues, not diagnoses.
        </footer>
      </div>
    </>
  )
}
