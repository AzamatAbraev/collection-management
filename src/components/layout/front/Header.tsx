import { NavLink } from "react-router-dom"
import "./Header.scss"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header>
      <nav className="nav">
        <div className="container nav__container">
          <div className="nav__logo">
            <Link to="/">MyBox</Link>
          </div>
          <div className="nav__search">
            <input type="text" className="nav__search__tbx" placeholder="searching..." />
          </div>
          <ul className="nav__menu">
            <li className="nav__item">
              <NavLink to="/" className="nav__link">Home</NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/about" className="nav__link">About</NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/allcollections" className="nav__link">Collections</NavLink>
            </li>
            <li className="nav__item">
              <NavLink className="nav__btn" to="/login">Login</NavLink>
            </li>
            <li className="nav__item">
              <NavLink className="nav__btn" to="/register">Register</NavLink>
            </li>

          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header