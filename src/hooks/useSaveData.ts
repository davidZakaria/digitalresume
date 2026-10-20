import { useEffect, useState } from 'react'

type NetworkInformationLike = {
  saveData?: boolean
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
}

function readSaveData(): boolean {
  if (typeof navigator === 'undefined') return false
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
  return Boolean(conn?.saveData)
}

/** True when the user agent reports Save-Data (or the flag changes). */
export function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(readSaveData)

  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection
    if (!conn?.addEventListener) return

    const update = () => setSaveData(Boolean(conn.saveData))
    update()
    conn.addEventListener('change', update)
    return () => conn.removeEventListener?.('change', update)
  }, [])

  return saveData
}
