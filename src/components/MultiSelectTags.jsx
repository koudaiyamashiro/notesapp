import { useState, useRef, useEffect } from 'react'

export default function MultiSelectTags({ label, description, icon, bgColor, selected, options, onToggle, onCustomAdd, placeholder = 'キーワードで検索...' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [customValue, setCustomValue] = useState('')
  const containerRef = useRef(null)

  const filteredOptions = options
    .filter((item) => !selected.includes(item) && item.toLowerCase().includes(searchValue.toLowerCase()))
    .filter((item) => !item.startsWith('その他'))

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAddCustom = () => {
    if (customValue.trim()) {
      onCustomAdd(customValue.trim())
      setCustomValue('')
      setSearchValue('')
    }
  }

  return (
    <div className={`rounded-2xl border ${bgColor} p-6 shadow-sm`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-800">{label}</h3>
          <p className="mt-1 text-sm text-slate-600">{description}</p>

          {/* 選択済みタグ */}
          <div className="mt-4 flex flex-wrap gap-2">
            {selected.length > 0 ? (
              selected.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onToggle(item)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    bgColor.includes('blue')
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : bgColor.includes('purple')
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : bgColor.includes('orange')
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-slate-700 text-white hover:bg-slate-800'
                  }`}
                >
                  {item}
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs">×</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-slate-500">未選択</p>
            )}
          </div>

          {/* 選択数表示 */}
          {selected.length > 0 && <p className="mt-3 text-xs font-semibold text-slate-600">{selected.length}件選択中</p>}

          {/* ドロップダウン */}
          <div ref={containerRef} className="relative mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-left text-sm text-slate-700 shadow-sm transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100 hover:border-slate-400"
            >
              <span className="flex items-center justify-between">
                <span className={isOpen ? 'text-slate-500' : selected.length === 0 ? 'text-slate-400' : 'text-slate-700'}>{selected.length > 0 ? `${selected.length}件選択済み` : placeholder}</span>
                <svg className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-slate-300 bg-white shadow-xl">
                {/* 検索欄 */}
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="検索..."
                  className="w-full border-b border-slate-200 rounded-t-lg bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:bg-sky-50"
                />

                {/* オプションリスト */}
                <div className="max-h-56 overflow-y-auto p-2">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          onToggle(item)
                          setSearchValue('')
                        }}
                        className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-sky-100"
                      >
                        {item}
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-2 text-xs text-slate-500">一致する候補がありません</p>
                  )}
                </div>

                {/* その他を追加 */}
                <div className="border-t border-slate-200 p-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                      placeholder="その他を追加..."
                      className="flex-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustom}
                      className="rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                    >
                      追加
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
