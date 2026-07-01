import { useState, useRef, useEffect } from 'react'

function normalizeOption(option) {
  if (typeof option === 'string') {
    return {
      id: option,
      label: option,
      category: 'その他',
      popular: false,
    }
  }

  return {
    id: option.id || option.label,
    label: option.label || option.id || '',
    category: option.category || 'その他',
    popular: Boolean(option.popular),
    keywords: Array.isArray(option.keywords) ? option.keywords : [],
  }
}

export default function MultiSelectTags({ label, description, icon, bgColor, selected, options, onToggle, onCustomAdd, placeholder = 'キーワードで検索...', hasError = false, errorMessage = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [customValue, setCustomValue] = useState('')
  const containerRef = useRef(null)
  const safeSelected = Array.isArray(selected) ? selected : []
  const normalizedOptions = (Array.isArray(options) ? options : []).map(normalizeOption)
  const searchKeyword = searchValue.toLowerCase()

  const filteredOptions = normalizedOptions
    .filter((item) => !safeSelected.includes(item.label))
    .filter((item) => {
      if (!searchKeyword) return true
      const haystacks = [item.label, item.category, ...(item.keywords || [])].join(' ').toLowerCase()
      return haystacks.includes(searchKeyword)
    })

  const popularOptions = filteredOptions.filter((item) => item.popular).slice(0, 8)
  const groupedOptions = filteredOptions.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

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
    <div className={`rounded-xl border bg-white p-4 ${hasError ? 'border-rose-400' : 'border-slate-200'}`}>
      <div className="flex-1">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {safeSelected.length > 0 ? (
            safeSelected.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onToggle(item)}
                className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 transition hover:border-blue-300 hover:bg-blue-100"
              >
                {item}
                <span className="text-[10px] text-blue-700">×</span>
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-500">未選択</p>
          )}
        </div>

        {safeSelected.length > 0 && <p className="mt-2 text-[11px] font-medium text-slate-500">{safeSelected.length}件選択中</p>}

        <div ref={containerRef} className="relative mt-3">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 hover:border-slate-400"
          >
            <span className="flex items-center justify-between">
              <span className={isOpen ? 'text-slate-500' : safeSelected.length === 0 ? 'text-slate-400' : 'text-slate-700'}>{safeSelected.length > 0 ? `${safeSelected.length}件選択済み` : placeholder}</span>
              <svg className={`h-4 w-4 transition ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
          </button>

          {isOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xl">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="検索..."
                className="w-full border-b border-slate-200 rounded-t-lg bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:bg-slate-50"
              />

              <div className="max-h-80 overflow-y-auto p-2">
                {popularOptions.length > 0 && !searchKeyword && (
                  <div className="mb-3">
                    <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">よく選ばれる候補</p>
                    <div className="flex flex-wrap gap-2 px-2">
                      {popularOptions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            onToggle(item.label)
                            setSearchValue('')
                          }}
                          className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-800 transition hover:bg-sky-100"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {filteredOptions.length > 0 ? (
                  Object.entries(groupedOptions).map(([category, items]) => (
                    <div key={category} className="mb-3 last:mb-0">
                      <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{category}</p>
                      <div className="grid gap-1">
                        {items.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                              onToggle(item.label)
                              setSearchValue('')
                            }}
                            className="block w-full rounded-md px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                          >
                            <span className="block font-medium text-slate-800">{item.label}</span>
                            <span className="mt-0.5 block text-xs text-slate-500">{item.category}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="px-3 py-2 text-xs text-slate-500">一致する候補がありません</p>
                )}
              </div>

              <div className="border-t border-slate-200 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                    placeholder="その他を追加..."
                    className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {hasError && errorMessage && <p className="mt-2 text-xs text-rose-600">{errorMessage}</p>}
      </div>
    </div>
  )
}
