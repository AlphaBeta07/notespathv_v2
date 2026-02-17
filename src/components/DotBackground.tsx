import { useEffect, useRef } from 'react'

export function DotBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let time = 0

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', resize)
        resize()

        // Configuration
        const spacing = 25 // Space between dots
        const dotBaseSize = 1.2
        // const waveHeight = 100 // Amplitude of the z-axis wave (visualized as size/opacity or offset)

        // Colors
        const dotColor = '#3B82F6' // Tailwind Blue-500

        const render = () => {
            time += 0.015
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const cols = Math.ceil(canvas.width / spacing)
            const rows = Math.ceil(canvas.height / spacing)

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * spacing
                    const y = j * spacing

                    // Calculate "Wave" effect
                    // We want a wave that moves diagonally or horizontally
                    // Using sine waves based on position and time

                    // Complex wave pattern to mimic the "mountain/wave" shape in reference
                    // Complex wave pattern to mimic the "mountain/wave" shape in reference
                    // This creates a "hump" that moves

                    // const wave1 = Math.sin(x * 0.003 + time)
                    // const wave2 = Math.cos(y * 0.005 + time)
                    // const wave3 = Math.sin((x + y) * 0.002 + time * 0.5)

                    // Combine waves to create the "z" value (height)
                    // const noise = wave1 + wave2 + wave3

                    // Only draw dots that are "high" enough in the wave to create the shape effect
                    // Or vary their size/opacity based on height

                    // Let's try to mimic the reference:
                    // It looks like a grid where dots are shifted or sized based on a specific curve.
                    // The reference has a distinct "A" shape or a wave crest.

                    // Let's keep it simple but elegant: A flowing field of dots.

                    const sizeOffset = (Math.sin(x * 0.01 + time) + Math.cos(y * 0.01 + time)) * 0.5
                    const radius = Math.max(0.1, dotBaseSize + sizeOffset)

                    const opacity = Math.max(0.1, (1 + Math.sin(x * 0.005 + y * 0.005 + time)) / 2)

                    ctx.fillStyle = dotColor
                    ctx.globalAlpha = opacity * 0.6 // Base transparency

                    ctx.beginPath()
                    ctx.arc(x, y, radius, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        return () => {
            window.removeEventListener('resize', resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 bg-[#FDFBF7] pointer-events-none"
        />
    )
}
