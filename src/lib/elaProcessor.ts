/**
 * Error Level Analysis (ELA) Browser Engine
 * Calculates the difference between an original image and a re-compressed JPEG version.
 * High difference areas indicate recent edits, generative splicing, or modified compression blocks.
 */

export interface ElaResult {
  elaDataUrl: string
  averageErrorDelta: number
  maxErrorDelta: number
  hotspotCount: number
}

export function computeClientEla(
  imageElement: HTMLImageElement,
  scale: number = 18,
  quality: number = 0.75
): Promise<ElaResult> {
  return new Promise((resolve, reject) => {
    try {
      const width = imageElement.naturalWidth || imageElement.width || 600
      const height = imageElement.naturalHeight || imageElement.height || 400

      // Canvas 1: Original
      const origCanvas = document.createElement('canvas')
      origCanvas.width = width
      origCanvas.height = height
      const origCtx = origCanvas.getContext('2d')
      if (!origCtx) return reject(new Error('Canvas 2D context unavailable'))
      origCtx.drawImage(imageElement, 0, 0, width, height)
      const origImgData = origCtx.getImageData(0, 0, width, height)

      // Re-compress to lossy JPEG
      const jpegDataUrl = origCanvas.toDataURL('image/jpeg', quality)

      // Canvas 2: Re-load JPEG
      const compressedImg = new Image()
      compressedImg.crossOrigin = 'anonymous'
      compressedImg.onload = () => {
        const compCanvas = document.createElement('canvas')
        compCanvas.width = width
        compCanvas.height = height
        const compCtx = compCanvas.getContext('2d')
        if (!compCtx) return reject(new Error('Canvas 2D context unavailable'))
        compCtx.drawImage(compressedImg, 0, 0, width, height)
        const compImgData = compCtx.getImageData(0, 0, width, height)

        // Canvas 3: ELA Difference Canvas
        const diffCanvas = document.createElement('canvas')
        diffCanvas.width = width
        diffCanvas.height = height
        const diffCtx = diffCanvas.getContext('2d')
        if (!diffCtx) return reject(new Error('Canvas 2D context unavailable'))
        const diffImgData = diffCtx.createImageData(width, height)

        let totalDelta = 0
        let maxDelta = 0
        let hotspotCount = 0
        const len = origImgData.data.length

        for (let i = 0; i < len; i += 4) {
          const rDiff = Math.abs(origImgData.data[i] - compImgData.data[i])
          const gDiff = Math.abs(origImgData.data[i + 1] - compImgData.data[i + 1])
          const bDiff = Math.abs(origImgData.data[i + 2] - compImgData.data[i + 2])

          const avgPixelDiff = (rDiff + gDiff + bDiff) / 3
          totalDelta += avgPixelDiff

          if (avgPixelDiff > maxDelta) {
            maxDelta = avgPixelDiff
          }

          // Amplify difference for visualization
          const amplifiedR = Math.min(255, rDiff * scale)
          const amplifiedG = Math.min(255, gDiff * scale)
          const amplifiedB = Math.min(255, bDiff * scale)

          // Colorize hotspots (spectral glow: cyan/magenta for manipulation)
          if (avgPixelDiff * scale > 120) {
            hotspotCount++
            diffImgData.data[i] = Math.min(255, amplifiedR + 60) // Extra red/magenta alert
            diffImgData.data[i + 1] = amplifiedG
            diffImgData.data[i + 2] = Math.min(255, amplifiedB + 80) // High blue/cyan
          } else {
            diffImgData.data[i] = amplifiedR
            diffImgData.data[i + 1] = amplifiedG
            diffImgData.data[i + 2] = amplifiedB
          }
          diffImgData.data[i + 3] = 255 // Full alpha
        }

        diffCtx.putImageData(diffImgData, 0, 0)

        const elaDataUrl = diffCanvas.toDataURL('image/png')
        const pixelCount = len / 4
        const averageErrorDelta = Number((totalDelta / pixelCount).toFixed(2))

        resolve({
          elaDataUrl,
          averageErrorDelta,
          maxErrorDelta: maxDelta,
          hotspotCount
        })
      }

      compressedImg.onerror = () => {
        reject(new Error('Failed to re-read compressed JPEG canvas'))
      }

      compressedImg.src = jpegDataUrl
    } catch (err) {
      reject(err)
    }
  })
}
