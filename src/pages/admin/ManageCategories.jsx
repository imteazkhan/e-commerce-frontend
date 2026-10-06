import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useCategories } from '../../context/CategoryContext'
import { unwrap } from '../../utils/catalog'
import {
  CheckIcon, ChevronDownIcon, ChevronUpIcon, CloseIcon, EditIcon, ExternalIcon, GripIcon, PauseIcon, PlayIcon, TrashIcon,
} from '../../components/Icons'
import { Badge, Card, EmptyState, Field, Modal, PageHeader, btn, errorMessage, inputClass, useToast } from '../../components/admin/ui'

const DELETE_CHOICES = [
  { value: 'move', label: 'Move them to another category', hint: 'Products stay in the store under the new category.' },
  { value: 'detach', label: 'Keep them without a category', hint: 'Products stay in the store but are not listed under any menu item.' },
  { value: 'delete', label: 'Delete the products too', hint: 'Removes them from the store permanently. Past orders keep their line items.' },
]

function DeleteDialog({ category, categories, onClose, onDeleted }) {
  const notify = useToast()
  const others = categories.filter((c) => c.id !== category?.id)
  const [choice, setChoice] = useState('move')
  const [moveTo, setMoveTo] = useState('')
  const [deleting, setDeleting] = useState(false)
  const count = category?.products_count || 0

  useEffect(() => {
    setChoice(others.length ? 'move' : 'detach')
    setMoveTo(others[0]?.id ? String(others[0].id) : '')
  }, [category?.id])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      const params = count ? { products: choice, move_to: choice === 'move' ? moveTo : undefined } : {}
      await api.delete(`/categories/${category.id}`, { params })
      notify(`"${category.name}" deleted`)
      onDeleted()
      onClose()
    } catch (err) {
      notify(errorMessage(err), 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Modal
      open={Boolean(category)}
      onClose={onClose}
      title={`Delete "${category?.name}"?`}
      footer={
        <>
          <button onClick={onClose} className={btn.secondary}>Cancel</button>
          <button onClick={confirmDelete} disabled={deleting || (count > 0 && choice === 'move' && !moveTo)} className={`${btn.primary} !bg-red-700 hover:!bg-red-800`}>
            {deleting ? 'Deleting…' : 'Delete category'}
          </button>
        </>
      }
    >
      <p className="text-sm text-stone-600">
        This removes the category from the menu for good.{' '}
        <b className="font-medium text-stone-900">If you only want to hide it for a while, use Pause instead.</b>
      </p>

      {count > 0 ? (
        <fieldset className="mt-5">
          <legend className="mb-3 text-sm font-medium text-stone-900">
            It has {count} product{count === 1 ? '' : 's'}. What should happen to {count === 1 ? 'it' : 'them'}?
          </legend>
          <div className="space-y-2">
            {DELETE_CHOICES.filter((c) => c.value !== 'move' || others.length).map((c) => (
              <label
                key={c.value}
                className={`flex cursor-pointer gap-3 rounded-md border p-3 transition ${choice === c.value ? 'border-stone-900 bg-stone-50' : 'border-stone-200 hover:border-stone-400'}`}
              >
                <input type="radio" name="products" value={c.value} checked={choice === c.value} onChange={() => setChoice(c.value)} className="mt-0.5 h-4 w-4 accent-stone-900" />
                <span>
                  <span className={`block text-sm font-medium ${c.value === 'delete' ? 'text-red-700' : 'text-stone-900'}`}>{c.label}</span>
                  <span className="block text-xs text-stone-500">{c.hint}</span>
                  {c.value === 'move' && choice === 'move' && (
                    <Field label="Move to" className="mt-3">
                      <select value={moveTo} onChange={(e) => setMoveTo(e.target.value)} className={inputClass}>
                        {others.map((o) => (
                          <option key={o.id} value={o.id}>{o.name}{o.is_active === false ? ' (paused)' : ''}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        <p className="mt-3 text-sm text-stone-600">It has no products, so nothing else is affected.</p>
      )}
    </Modal>
  )
}

export default function ManageCategories() {
  const notify = useToast()
  const { categories, reload, setCategories } = useCategories()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [renaming, setRenaming] = useState(null) // { id, name }
  const [deleting, setDeleting] = useState(null) // category
  const [draggingId, setDraggingId] = useState(null)
  const dragStart = useRef(null) // order before the drag, to save or roll back

  // Fresh product counts every time the page opens.
  useEffect(() => { reload() }, [reload])

  const paused = categories.filter((c) => c.is_active === false).length

  // Updates the list (and the store menu) right away, then saves; rolls back if the save fails.
  const saveOrder = async (next, previous) => {
    setCategories(next)
    try {
      const res = await api.put('/categories/reorder', { ids: next.map((c) => c.id) })
      setCategories(unwrap(res) || next)
      notify('Menu order saved')
    } catch (err) {
      setCategories(previous)
      notify(errorMessage(err), 'error')
    }
  }

  const move = (index, step) => {
    const next = [...categories]
    const [item] = next.splice(index, 1)
    next.splice(index + step, 0, item)
    saveOrder(next, categories)
  }

  const handleDragStart = (e, c) => {
    dragStart.current = categories
    setDraggingId(c.id)
    e.dataTransfer.effectAllowed = 'move'
  }

  // Reorder live while hovering so the admin sees where the row will land.
  const handleDragOver = (e, target) => {
    if (draggingId === null) return
    e.preventDefault()
    if (target.id === draggingId) return
    const from = categories.findIndex((c) => c.id === draggingId)
    const to = categories.findIndex((c) => c.id === target.id)
    const next = [...categories]
    next.splice(to, 0, next.splice(from, 1)[0])
    setCategories(next)
  }

  const handleDragEnd = () => {
    const previous = dragStart.current
    setDraggingId(null)
    dragStart.current = null
    if (previous && previous.some((c, i) => c.id !== categories[i]?.id)) saveOrder(categories, previous)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/categories', { name: name.trim() })
      notify(`"${name.trim()}" added to the menu`)
      setName('')
      await reload()
    } catch (err) {
      notify(errorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleRename = async (e) => {
    e.preventDefault()
    try {
      await api.put(`/categories/${renaming.id}`, { name: renaming.name.trim() })
      notify('Category renamed')
      setRenaming(null)
      await reload()
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  const togglePause = async (c) => {
    const active = c.is_active === false
    try {
      await api.put(`/categories/${c.id}`, { is_active: active })
      notify(active ? `"${c.name}" is back in the store` : `"${c.name}" paused: hidden from the store, nothing deleted`)
      await reload()
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Categories"
        subtitle={`Active categories appear in the store's main menu and filters, in this order. Drag rows or use the arrows to rearrange.${paused ? ` ${paused} paused.` : ''}`}
      />

      <Card className="mb-6">
        <form onSubmit={handleAdd} className="flex flex-col gap-3 sm:flex-row">
          <input
            placeholder="New category name, e.g. Ethnic Wear"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputClass} flex-1`}
            required
          />
          <button disabled={saving || !name.trim()} className={btn.primary}>
            {saving ? 'Adding…' : 'Add category'}
          </button>
        </form>
      </Card>

      <Card bodyClass="">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-left text-xs uppercase tracking-wider text-stone-500">
              <tr>
                <th className="w-px px-2 py-3 font-medium"><span className="sr-only">Order</span></th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Link</th>
                <th className="px-4 py-3 text-right font-medium">Products</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((c, index) => {
                const isPaused = c.is_active === false
                return (
                  <tr
                    key={c.id}
                    draggable={renaming?.id !== c.id}
                    onDragStart={(e) => handleDragStart(e, c)}
                    onDragOver={(e) => handleDragOver(e, c)}
                    onDrop={(e) => e.preventDefault()}
                    onDragEnd={handleDragEnd}
                    className={`${draggingId === c.id ? 'bg-amber-50 opacity-60' : isPaused ? 'bg-stone-50/70' : 'hover:bg-stone-50'}`}
                  >
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-0.5">
                        <span className="cursor-grab px-1 text-stone-400 active:cursor-grabbing" title="Drag to reorder">
                          <GripIcon className="h-4 w-4" />
                        </span>
                        <button onClick={() => move(index, -1)} disabled={index === 0} className={`${btn.icon} !h-7 !w-7`} aria-label={`Move ${c.name} up`} title="Move up">
                          <ChevronUpIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => move(index, 1)} disabled={index === categories.length - 1} className={`${btn.icon} !h-7 !w-7`} aria-label={`Move ${c.name} down`} title="Move down">
                          <ChevronDownIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {renaming?.id === c.id ? (
                        <form onSubmit={handleRename} className="flex items-center gap-1">
                          <input autoFocus value={renaming.name} onChange={(e) => setRenaming({ ...renaming, name: e.target.value })} className={`${inputClass} py-1.5`} required />
                          <button className={btn.icon} aria-label="Save name"><CheckIcon className="h-4 w-4" /></button>
                          <button type="button" onClick={() => setRenaming(null)} className={btn.icon} aria-label="Cancel"><CloseIcon className="h-4 w-4" /></button>
                        </form>
                      ) : (
                        <span className={`font-medium ${isPaused ? 'text-stone-500' : 'text-stone-900'}`}>{c.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isPaused ? <Badge tone="stone">Paused</Badge> : <Badge tone="green">Active</Badge>}
                    </td>
                    <td className="hidden px-4 py-3 text-stone-500 md:table-cell">/products?category={c.slug}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{c.products_count ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePause(c)}
                          className={`${btn.secondary} !px-3 !py-1.5`}
                          title={isPaused ? 'Show in the store again' : 'Hide from the store without deleting anything'}
                        >
                          {isPaused ? <PlayIcon className="h-3.5 w-3.5" /> : <PauseIcon className="h-3.5 w-3.5" />}
                          {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        {!isPaused && (
                          <Link to={`/products?category=${c.slug}`} target="_blank" className={btn.icon} aria-label="View in store" title="View in store">
                            <ExternalIcon className="h-4 w-4" />
                          </Link>
                        )}
                        <button onClick={() => setRenaming({ id: c.id, name: c.name })} className={btn.icon} aria-label={`Rename ${c.name}`} title="Rename">
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleting(c)} className={`${btn.icon} hover:!text-red-700`} aria-label={`Delete ${c.name}`} title="Delete">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {categories.length === 0 && <EmptyState title="No categories yet">Add one above to show it in the menu.</EmptyState>}
      </Card>

      <p className="mt-4 text-xs text-stone-500">
        Pausing hides the category from the menu and its products from the store. Nothing is deleted: resume it any time to bring everything back.
      </p>

      <DeleteDialog category={deleting} categories={categories} onClose={() => setDeleting(null)} onDeleted={reload} />
    </div>
  )
}
