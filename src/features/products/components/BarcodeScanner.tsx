import { useEffect, useRef } from "react"
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode"

interface Props {
  onScan: (code: string) => void
}

export function BarcodeScanner({ onScan }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onScanRef = useRef(onScan)

  useEffect(() => {
    onScanRef.current = onScan
  })

  useEffect(() => {
    if (!containerRef.current) return

    const scanner = new Html5Qrcode(containerRef.current.id, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
      ],
      verbose: false,
    })
    let hasScanned = false
    let isRunning = false
    let cancelled = false

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          if (hasScanned || cancelled) return
          hasScanned = true
          isRunning = false
          scanner.stop().catch(() => {})
          onScanRef.current(decodedText)
        },
        () => {}
      )
      .then(() => {
        if (cancelled) {
          scanner.stop().catch(() => {})
        } else {
          isRunning = true
        }
      })
      .catch(console.error)

    return () => {
      cancelled = true
      if (isRunning) {
        scanner.stop().catch(() => {})
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      id="barcode-reader"
      className="w-full overflow-hidden rounded-lg"
    />
  )
}
