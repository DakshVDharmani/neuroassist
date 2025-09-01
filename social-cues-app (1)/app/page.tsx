import { Suspense } from "react"
import MainPage from "@/components/main-page"

export default function Page() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading…</div>}>
        <MainPage />
      </Suspense>
    </main>
  )
}
