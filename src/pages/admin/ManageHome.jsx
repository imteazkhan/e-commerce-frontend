import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { useCategories } from '../../context/CategoryContext'
import { unwrap } from '../../utils/catalog'
import {
  AlertIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, ExternalIcon, EyeIcon, EyeOffIcon, ImageIcon, PlusIcon, TrashIcon, UploadIcon,
} from '../../components/Icons'
import { Badge, Card, EmptyState, Field, Modal, PageHeader, Tabs, btn, errorMessage, inputClass, useToast } from '../../components/admin/ui'

// Each section of the storefront home page, and the text fields its images carry.
const SECTIONS = [
  {
    value: 'hero',
    label: 'Hero slider',
    hint: 'Large rotating slides at the top of the home page.',
    fields: ['eyebrow', 'title', 'text', 'cta', 'link'],
  },
  {
    value: 'tile',
    label: 'Category tiles',
    hint: 'Tall image tiles under the slider. Each one links to a category.',
    fields: ['title', 'link'],
  },
  {
    value: 'lifestyle',
    label: 'Lifestyle gallery',
    hint: 'Photo row near the bottom of the page.',
    fields: [],
  },
  {
    value: 'editorial',
    label: 'Editorial',
    hint: 'Wide banners with a heading at the end of the page.',
    fields: ['title', 'link'],
  },
]

const FIELD_LABELS = {
  eyebrow: { label: 'Small heading', placeholder: 'e.g. New Arrival' },
  title: { label: 'Title', placeholder: 'e.g. Panjabi Collection' },
  text: { label: 'Description', placeholder: 'One short line under the title' },
  cta: { label: 'Button text', placeholder: 'e.g. Shop Panjabi' },
  link: { label: 'Link', placeholder: '/products?category=panjabi' },
}

const EMPTY = { image: '', eyebrow: '', title: '', text: '', cta: '', link: '', alt: '', is_active: true }

function ImagePicker({ value, onChange }) {
  const notify = useToast()
  const fileInput = useRef(null)
  const [uploading, setUploading] = useState(false)

  const upload = async (file) => {
    if (!file) return
    const body = new FormData()
    body.append('image', file)
    setUploading(true)
    try {
      const res = await api.post('/home-banners/upload', body, { headers: { 'Content-Type': 'multipart/form-data' } })
      onChange(res.data.url)
    } catch (err) {
      notify(errorMessage(err), 'error')
    } finally {
      setUploading(false)
      fileInput.current.value = ''
    }
  }

  return (
    <div>
      <div className="flex aspect-[16/9] items-center justify-center overflow-hidden rounded-md border border-dashed border-stone-300 bg-stone-50">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs text-stone-400">
            <ImageIcon className="h-8 w-8" />
            No image yet
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => fileInput.current.click()} disabled={uploading} className={`${btn.secondary} shrink-0`}>
          <UploadIcon className="h-4 w-4" />
          {uploading ? 'Uploading…' : 'Upload image'}
        </button>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="…or paste an image URL"
          className={`${inputClass} flex-1`}
        />
      </div>
      <p className="mt-1 text-xs text-stone-500">JPG, PNG, WebP or GIF, up to 5 MB.</p>
      <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files[0])} />
    </div>
  )
}

function BannerEditor({ editing, section, onClose, onSaved }) {
  const notify = useToast()
  const { categories } = useCategories()
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const config = SECTIONS.find((s) => s.value === section)
  const isNew = editing === 'new'

  useEffect(() => {
    if (!editing) return
    setForm(isNew ? EMPTY : Object.fromEntries(Object.keys(EMPTY).map((k) => [k, editing[k] ?? EMPTY[k]])))
  }, [editing, isNew])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isNew) await api.post('/home-banners', { ...form, section })
      else await api.put(`/home-banners/${editing.id}`, form)
      notify(isNew ? 'Image added to the home page' : 'Image updated')
      onSaved()
      onClose()
    } catch (err) {
      notify(errorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={Boolean(editing)}
      onClose={onClose}
      title={`${isNew ? 'Add image to' : 'Edit image in'} ${config.label.toLowerCase()}`}
      wide
      footer={
        <>
          <button type="button" onClick={onClose} className={btn.secondary}>Cancel</button>
          <button type="submit" form="banner-form" disabled={saving || !form.image.trim()} className={btn.primary}>
            {saving ? 'Saving…' : isNew ? 'Add image' : 'Save changes'}
          </button>
        </>
      }
    >
      <form id="banner-form" onSubmit={save} className="grid gap-5 md:grid-cols-2">
        <ImagePicker value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} />

        <div className="space-y-4">
          {config.fields.map((key) => (
            <Field key={key} label={FIELD_LABELS[key].label} hint={key === 'link' ? 'Pick a category or type any store link.' : undefined}>
              {key === 'text' ? (
                <textarea value={form[key]} onChange={set(key)} rows={2} placeholder={FIELD_LABELS[key].placeholder} className={inputClass} />
              ) : (
                <input
                  value={form[key]}
                  onChange={set(key)}
                  placeholder={FIELD_LABELS[key].placeholder}
                  list={key === 'link' ? 'category-links' : undefined}
                  className={inputClass}
                />
              )}
            </Field>
          ))}
          <Field label="Image description" hint="Read out by screen readers and shown if the image fails to load.">
            <input value={form.alt} onChange={set('alt')} placeholder="e.g. Model in embroidered panjabi" className={inputClass} />
          </Field>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              className="h-4 w-4 accent-stone-900"
            />
            Show on the home page
          </label>
        </div>

        <datalist id="category-links">
          {categories.map((c) => (
            <option key={c.id} value={`/products?category=${c.slug}`}>{c.name}</option>
          ))}
        </datalist>
      </form>
    </Modal>
  )
}

// Name of the category a store link points at, if it's missing or paused (so the store drops that link).
const deadCategory = (link, categories) => {
  const slug = new URLSearchParams((link || '').split('?')[1]).get('category')
  if (!slug) return null
  const match = categories.find((c) => c.slug === slug)
  if (!match) return { slug, reason: 'deleted' }
  return match.is_active === false ? { slug: match.name, reason: 'paused' } : null
}

export default function ManageHome() {
  const notify = useToast()
  const { categories, loading: categoriesLoading } = useCategories()
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState('hero')
  const [editing, setEditing] = useState(null) // 'new' or a banner
  const [removing, setRemoving] = useState(null) // banner

  const reload = useCallback(
    () =>
      api
        .get('/home-banners', { params: { all: 1 } })
        .then((res) => setBanners(unwrap(res) || []))
        .catch((err) => notify(errorMessage(err), 'error'))
        .finally(() => setLoading(false)),
    [notify]
  )

  useEffect(() => { reload() }, [reload])

  const config = SECTIONS.find((s) => s.value === section)
  const items = banners.filter((b) => b.section === section)
  const visible = items.filter((b) => b.is_active).length

  // Moves an image one step, updating the screen first and rolling back if the save fails.
  const move = async (index, step) => {
    const next = [...items]
    next.splice(index + step, 0, next.splice(index, 1)[0])
    const previous = banners
    setBanners([...banners.filter((b) => b.section !== section), ...next])
    try {
      await api.put('/home-banners/reorder', { section, ids: next.map((b) => b.id) })
    } catch (err) {
      setBanners(previous)
      notify(errorMessage(err), 'error')
    }
  }

  const toggle = async (b) => {
    try {
      await api.put(`/home-banners/${b.id}`, { is_active: !b.is_active })
      notify(b.is_active ? 'Hidden from the home page' : 'Showing on the home page')
      await reload()
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  const remove = async () => {
    try {
      await api.delete(`/home-banners/${removing.id}`)
      notify('Image removed')
      setRemoving(null)
      await reload()
    } catch (err) {
      notify(errorMessage(err), 'error')
    }
  }

  return (
    <div className="max-w-6xl">
      <PageHeader
        title="Home page"
        subtitle="Choose which images appear on the store's home page and in what order."
        actions={
          <div className="flex gap-2">
            <Link to="/" target="_blank" className={btn.secondary}>
              <ExternalIcon className="h-4 w-4" /> View home page
            </Link>
            <button onClick={() => setEditing('new')} className={btn.primary}>
              <PlusIcon className="h-4 w-4" /> Add image
            </button>
          </div>
        }
      />

      <Tabs
        value={section}
        onChange={setSection}
        tabs={SECTIONS.map((s) => ({ value: s.value, label: s.label, count: banners.filter((b) => b.section === s.value && b.is_active).length }))}
      />

      <p className="mb-4 mt-4 text-sm text-stone-500">
        {config.hint} {!loading && `${visible} of ${items.length} showing.`}
      </p>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-stone-200" />)}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <EmptyState title="No images in this section">
            This section is hidden on the home page until you add an image.
          </EmptyState>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b, index) => (
            <article key={b.id} className={`overflow-hidden rounded-lg border bg-white ${b.is_active ? 'border-stone-200' : 'border-dashed border-stone-300'}`}>
              <div className="relative aspect-[4/3] bg-stone-100">
                <img src={b.image} alt={b.alt || ''} className={`h-full w-full object-cover ${b.is_active ? '' : 'opacity-40 grayscale'}`} />
                <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">#{index + 1}</span>
                <span className="absolute right-2 top-2">
                  {b.is_active ? <Badge tone="green">Showing</Badge> : <Badge tone="stone">Hidden</Badge>}
                </span>
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-stone-900">{b.title || b.alt || 'Untitled image'}</p>
                <p className="truncate text-xs text-stone-500">{b.link || (b.eyebrow ?? '') || ' '}</p>
                {(() => {
                  const dead = !categoriesLoading && deadCategory(b.link, categories)
                  return dead && (
                    <p className="mt-2 flex items-start gap-1.5 rounded bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
                      <AlertIcon className="mt-px h-3.5 w-3.5 shrink-0" />
                      Links to category "{dead.slug}", which is {dead.reason}. The image still shows, without a link. Edit to pick another category.
                    </p>
                  )
                })()}
                <div className="mt-3 flex items-center justify-between gap-1 border-t border-stone-100 pt-3">
                  <div className="flex gap-1">
                    <button onClick={() => move(index, -1)} disabled={index === 0} className={btn.icon} aria-label="Move earlier" title="Move earlier">
                      <ChevronLeftIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => move(index, 1)} disabled={index === items.length - 1} className={btn.icon} aria-label="Move later" title="Move later">
                      <ChevronRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggle(b)} className={`${btn.secondary} !px-3 !py-1.5`}>
                      {b.is_active ? <EyeOffIcon className="h-3.5 w-3.5" /> : <EyeIcon className="h-3.5 w-3.5" />}
                      {b.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => setEditing(b)} className={btn.icon} aria-label="Edit" title="Edit">
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => setRemoving(b)} className={`${btn.icon} hover:!text-red-700`} aria-label="Delete" title="Delete">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-stone-500">
        Hidden images stay saved here; show them again any time.
      </p>

      <BannerEditor editing={editing} section={section} onClose={() => setEditing(null)} onSaved={reload} />

      <Modal
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        title="Delete this image?"
        footer={
          <>
            <button onClick={() => setRemoving(null)} className={btn.secondary}>Cancel</button>
            <button onClick={remove} className={`${btn.primary} !bg-red-700 hover:!bg-red-800`}>Delete image</button>
          </>
        }
      >
        <p className="text-sm text-stone-600">
          This removes it from the home page for good.{' '}
          <b className="font-medium text-stone-900">If you only want to take it down for a while, use Hide instead.</b>
        </p>
      </Modal>
    </div>
  )
}
