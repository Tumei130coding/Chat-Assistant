import { useState, useEffect } from 'react'

export default function TitleBar() {
  const [pinned, setPinned] = useState(true)
  const [attached, setAttached] = useState(true)

  useEffect(() => {
    window.api.getAlwaysOnTop().then(setPinned)
    window.api.getAttachWeChat().then(setAttached)
  }, [])

  const togglePin = async () => {
    const result = await window.api.toggleAlwaysOnTop()
    setPinned(result)
  }

  return (
    <div className="flex items-center justify-between h-10 px-3 bg-white border-b border-gray-200 select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-gray-700">快捷回复</span>
      </div>
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={async () => {
            const result = await window.api.toggleAttachWeChat()
            setAttached(result)
          }}
          className={`w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-sm ${
            attached ? 'text-green-500' : 'text-gray-400'
          }`}
          title={attached ? '取消跟随微信' : '跟随微信显示'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>
        <button
          onClick={togglePin}
          className={`w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-sm ${
            pinned ? 'text-blue-500' : 'text-gray-400'
          }`}
          title={pinned ? '取消置顶' : '置顶窗口'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 17v5" />
            <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1 1 1 0 0 1 1 1z" />
          </svg>
        </button>
        <button
          onClick={() => window.api.minimize()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500"
          title="最小化"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect y="5" width="12" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <button
          onClick={() => window.api.close()}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-gray-500 hover:text-red-500"
          title="关闭"
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
