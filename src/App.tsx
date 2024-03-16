import { BrowserRouter, Route, Routes } from "react-router-dom"

import FrontLayout from "./components/layout/front"
import HomePage from "./pages/public/home"
import LoginPage from "./pages/auth/login"
import RegisterPage from "./pages/auth/register"
import AboutPage from "./pages/public/about"
import AllCollections from "./pages/public/all-collections"
import ContactPage from "./pages/public/contact"
import AdminDashboard from "./pages/admin/dashboard"
import AdminLayout from "./components/layout/admin"
import AdminCollections from "./pages/admin/collections"
import AdminUsers from "./pages/admin/users"
import UserDashboard from "./pages/user/dashboard"
import CollectionPage from "./pages/user/collection"
import ItemPage from "./pages/user/item"
import NotFoundPage from "./pages/not-found"

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import useAuth from "./store/auth"
import AccountPage from "./pages/auth/account"

function App() {
  const { isAuthenticated, role } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<FrontLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/collections" element={<AdminCollections />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>

        <Route path="*" element={<NotFoundPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
