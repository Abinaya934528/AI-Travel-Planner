import { useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PACKING_CATEGORIES } from '../data/packingDefaults'
import { usePacking } from '../hooks/usePacking'
import { useToast } from '../hooks/useToast'
import type { PackingCategory } from '../types'

export function PackingPage() {
  const { items, togglePacked, addItem, removeItem, resetList, completion } = usePacking()
  const [label, setLabel] = useState('')
  const [category, setCategory] = useState<PackingCategory>('Travel essentials')
  const [confirmReset, setConfirmReset] = useState(false)
  const { pushToast } = useToast()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-ocean">Before you go</p>
      <h1 className="font-display text-5xl">Packing checklist</h1>
      <p className="mt-3 text-ink-soft">Progress is saved in this browser. {completion}% packed.</p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-sand-deep">
        <div className="h-full bg-ocean" style={{ width: `${completion}%` }} />
      </div>
      <form
        className="mt-6 flex flex-col gap-3 rounded-3xl bg-white p-4 ring-1 ring-sand-deep/70 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault()
          if (!label.trim()) return
          addItem(label, category)
          setLabel('')
          pushToast('success', 'Item added to your checklist.')
        }}
      >
        <label className="sr-only" htmlFor="pack-item">
          Custom item
        </label>
        <input
          id="pack-item"
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          placeholder="Add a custom item"
          className="flex-1 rounded-xl border border-sand-deep px-3 py-2"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value as PackingCategory)}
          className="rounded-xl border border-sand-deep px-3 py-2"
        >
          {PACKING_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-full bg-ocean px-4 py-2 text-white">
          Add item
        </button>
      </form>
      <div className="mt-8 grid gap-6">
        {PACKING_CATEGORIES.map((group) => (
          <section key={group} className="rounded-3xl bg-white p-5 ring-1 ring-sand-deep/70">
            <h2 className="font-display text-3xl">{group}</h2>
            <ul className="mt-3 space-y-2">
              {items
                .filter((item) => item.category === group)
                .map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={item.packed} onChange={() => togglePacked(item.id)} />
                      <span className={item.packed ? 'text-ink-soft line-through' : ''}>{item.label}</span>
                    </label>
                    <button type="button" className="text-sm text-coral" onClick={() => removeItem(item.id)}>
                      Remove
                    </button>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
      <button type="button" className="mt-6 rounded-full border border-sand-deep px-4 py-2" onClick={() => setConfirmReset(true)}>
        Reset to default list
      </button>
      <ConfirmDialog
        open={confirmReset}
        title="Reset packing list?"
        description="Custom items and packed status will be replaced with the default checklist."
        confirmLabel="Reset list"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          resetList()
          setConfirmReset(false)
          pushToast('success', 'Packing list reset.')
        }}
      />
    </div>
  )
}
