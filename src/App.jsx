import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'

import AdminDashboard from './pages/admin/AdminDashboard'
import ManageProducts from './pages/admin/ManageProducts'
import ManageOrders from './pages/admin/ManageOrders'
import ManageUsers from './pages/admin/ManageUsers'
import ManageCategories from './pages/admin/ManageCategories'
import ManageHome from './pages/admin/ManageHome'

import ManageStock from './pages/manager/ManageStock'

import MyOrders from './pages/customer/MyOrders'
import Profile from './pages/customer/Profile'

export default function App() {
  const { pathname } = useLocation()
  const inPanel = /^\/(admin|manager)(\/|$)/.test(pathname)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={['customer']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Staff panels share one layout; pages read { base, isAdmin } from the outlet context. */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="stock" element={<ManageStock />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="home" element={<ManageHome />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={['manager', 'admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="stock" element={<ManageStock />} />
            <Route path="home" element={<ManageHome />} />
          </Route>

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute roles={['customer']}>
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute roles={['customer']}>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!inPanel && <Footer />}
    </div>
  )
}