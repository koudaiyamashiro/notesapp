import { animate, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function CountUpNumber({ value, decimals = 0, duration = 1.1, prefix = '', suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px -15% 0px' })
  const prefersReducedMotion = useReducedMotion()
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0)

  useEffect(() => {
    if (!inView || prefersReducedMotion) {
      setDisplay(value)
      return
    }

    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => {
        const multiplier = 10 ** decimals
        setDisplay(Math.round(latest * multiplier) / multiplier)
      },
    })

    return () => controls.stop()
  }, [inView, value, duration, decimals, prefersReducedMotion])

  return (
    <span ref={ref}>
      {prefix}
      {Number(display).toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
