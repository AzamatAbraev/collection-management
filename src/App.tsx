import { BrowserRouter, Route, Routes } from "react-router-dom"

import AdminLayout from "./components/layout/admin"
import FrontLayout from "./components/layout/front"
import AdminCollections from "./pages/admin/collections"
import AdminDashboard from "./pages/admin/dashboard"
import AdminUsers from "./pages/admin/users"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import NotFoundPage from "./pages/not-found"
import AllCollections from "./pages/public/all-collections"
import ContactPage from "./pages/public/contact"
import HomePage from "./pages/public/home"
import CollectionPage from "./pages/user/collection"
import UserDashboard from "./pages/user/dashboard"
import ItemPage from "./pages/user/item"

import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"

import AdminItems from "./pages/admin/items"
import AccountPage from "./pages/auth/account"
import useAuth from "./store/auth"

function App() {
  const { isAuthenticated, role } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/allcollections" element={<AllCollections />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/user/dashboard" element={isAuthenticated ? <UserDashboard /> : <NotFoundPage />} />
          <Route path="/collection/:collectionId" element={<CollectionPage />} />
          <Route path="/collection/:collectionId/:itemId/" element={<ItemPage />} />
        </Route>
        <Route path="/admin" element={isAuthenticated && role === "admin" ? <AdminLayout /> : <NotFoundPage />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/collections" element={<AdminCollections />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/items" element={<AdminItems />} />
        </Route>

        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
