import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import api from '../services/api'
import { unwrap } from '../utils/catalog'
import { useAuth } from './AuthContext'

const CategoryContext = createContext()

// Menu categories come from the API so admins can add/remove them without a deploy.
// `categories` includes paused ones for staff (the API only returns them to staff);
// the storefront uses `activeCategories`.
export const CategoryProvider = ({ children }) => {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(
    () =>
      api
        .get('/categories', { params: { all: 1 } })
        .then((res) => setCategories(unwrap(res) || []))
        .catch(() => {})
        .finally(() => setLoading(false)),
    []
  )

  useEffect(() => {
    reload()
    // Pick up changes made elsewhere (another tab, another admin) when the user comes back.
    window.addEventListener('focus', reload)
    return () => window.removeEventListener('focus', reload)
  }, [reload, user?.id])

  const activeCategories = categories.filter((c) => c.is_active !== false)

  return (
    <CategoryContext.Provider value={{ categories, activeCategories, loading, reload, setCategories }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategories = () => useContext(CategoryContext)
