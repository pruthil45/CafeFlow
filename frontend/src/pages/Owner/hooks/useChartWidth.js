import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook to reliably measure a chart container's width.
 * Resolves the infamous Recharts ResponsiveContainer 0-width bug in flex/grid mobile layouts.
 */
export function useChartWidth(defaultWidth = 340) {
  const containerRef = useRef(null)
  const [width, setWidth] = useState(defaultWidth)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth || containerRef.current.getBoundingClientRect().width
        if (w > 0) {
          setWidth(Math.floor(w))
        }
      }
    }

    updateWidth()
    const t1 = setTimeout(updateWidth, 50)
    const t2 = setTimeout(updateWidth, 200)

    let ro = null
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(() => updateWidth())
      ro.observe(containerRef.current)
    }

    window.addEventListener('resize', updateWidth)
    window.addEventListener('orientationchange', updateWidth)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      if (ro) ro.disconnect()
      window.removeEventListener('resize', updateWidth)
      window.removeEventListener('orientationchange', updateWidth)
    }
  }, [])

  return [containerRef, width]
}
