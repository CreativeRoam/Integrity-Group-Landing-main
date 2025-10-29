import { clamp, lerp } from '@/glxp/utils/math'

export default function drawHexagon(ctx, x, y, radius, angle, steps, pr) {
  const progress = pr * steps

  ctx.beginPath()
  for (let i = 0; i < steps; i++) {
    const progress2 = clamp(progress - i, 0, 1)

    if (i === 0) {
      const x1 = x + radius * Math.cos(angle * i)
      const y1 = y + radius * Math.sin(angle * i)

      const x2 = lerp(x1, x + radius * Math.cos(angle * (i + 1)), progress2)
      const y2 = lerp(y1, y + radius * Math.sin(angle * (i + 1)), progress2)

      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      if (progress2 > 0) {
        ctx.lineCap = 'round'
      } else {
        ctx.lineCap = 'butt'
      }
      ctx.stroke()
    } else {
      const x1 = x + radius * Math.cos(angle * i)
      const y1 = y + radius * Math.sin(angle * i)

      const x2 = lerp(x + radius * Math.cos(angle * i), x + radius * Math.cos(angle * (i + 1)), progress2)
      const y2 = lerp(y + radius * Math.sin(angle * i), y + radius * Math.sin(angle * (i + 1)), progress2)

      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      if (progress2 > 0) {
        ctx.lineCap = 'round'
      } else {
        ctx.lineCap = 'butt'
      }
      ctx.stroke()
    }
  }
  ctx.closePath()
}
