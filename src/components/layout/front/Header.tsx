import { Fragment, useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { AutoComplete, Switch } from "antd";

import useAuth from "../../../store/auth";
import request from "../../../server";
import ItemType from "../../../types/item";
import CollectionType from "../../../types/collection";
import { useTranslation } from "react-i18next";
import i18n from 'i18next';

import menuIcon from "../../../assets/menu-icon.svg";

import "./Header.scss"
import useScreenSize from "../../../utils/getScreenSize";
import useTheme from "../../../store/theme";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";


const Header = () => {
  const [options, setOptions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { role, isAuthenticated, user, language, setLanguage, logout } = useAuth();
  const { theme, toggleTheme } = useTheme()

  const screenSize = useScreenSize();

  const fetchSearchResults = async (searchText: string) => {
    if (!searchText.trim()) {
      setOptions([]);
      return;
    }
    const { data } = await request.get(`/search?query=${searchText}`);
    setOptions(
      data.map((searchItem: ItemType | CollectionType) => {
        const isItemType = "tags" in searchItem;
        return {
          value: searchItem.name,
          label: (
            <div onClick={() => {
              if (isItemType) {
                navigate(`/collection/${searchItem.collectionId}/${searchItem._id}`);
              } else {
                navigate(`/collection/${searchItem._id}`);
              }
            }}>
              {isItemType ? `Item: ${searchItem.name}` : `Collection: ${searchItem.name}`}
            </div>
          ),
        };
      })
    );
  };

  const onSelect = () => {
    setOptions([])
  };

  const switchLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
    setLanguage(event.target.value);
    localStorage.setItem('LANGUAGE', event.target.value);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.classList.add(savedTheme);
    }
  }, []);

  useEffect(() => {
    const themeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';
    const removeClass = theme === 'dark' ? 'light-theme' : 'dark-theme';
    document.body.classList.remove(removeClass);
    document.body.classList.add(themeClass);

    localStorage.setItem('theme', theme);
  }, [theme]);

  const renderNavLinks = () => (
    <Fragment>
      <li className="nav-item">
        <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " text-danger" : " text-white")}>{t('Home')}</NavLink>
      </li>
      <li className="nav-item">
        <NavLink to="/allcollections" className={({ isActive }) => "nav-link" + (isActive ? " text-danger" : " text-white")}>{t('Collections')}</NavLink>
      </li>
      <li className="menu-selector">
        <select value={language} onChange={switchLanguage} className="form-select form-select-sm">
          <option value="en">EN</option>
          <option value="uz">UZ</option>
          <option value="ru">RU</option>
        </select>
      </li>
      <li className="nav-item">
        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className="theme-switch"
        />
      </li>
      {isAuthenticated ? (
        <div className="d-flex align-items-center gap-2 menu-links">
          <li className="nav-item">
            <NavLink style={{ textTransform: "capitalize" }} className="btn btn-light" to="/user/dashboard">{user?.name}</NavLink>
          </li>
          {role === "admin" ? <li className="nav-item">
            <Link to="/admin/dashboard" className="btn btn-light" >Dashboard</Link>
          </li> : <li className="nav-item">
            <button className="btn btn-light" onClick={() => logout(navigate)}>{t('Logout')}</button>
          </li>}
        </div>
      ) : (
        <div className="d-flex align-items-center gap-2 menu-links">
          <li className="nav-item">
            <NavLink className="btn btn-light" to="/login">{t('Login')}</NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="btn btn-light" to="/register">{t('Register')}</NavLink>
          </li>
        </div>
      )}
    </Fragment>
  );

  return (
    <header className="main-header text-white fixed-top">
      <nav className="container-manual d-flex justify-content-between align-items-center py-2">
        <Link to="/" className="navbar-brand text-white fs-3">MyBox</Link>
        <div className="flex-grow-1 px-3">
          <AutoComplete
            className="w-100"
            options={options}
            onSelect={onSelect}
            allowClear
            onSearch={fetchSearchResults}
            placeholder={t("Search")}
          />
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          <img src={menuIcon} alt="Menu" />
        </button>
        {screenSize > 768 ? (
          <ul className="nav">{renderNavLinks()}</ul>
        ) : (
          isMenuOpen && (
            <div className="mobile-nav">
              <ul className="nav flex-column">{renderNavLinks()}</ul>
            </div>
          )
        )}
      </nav>
    </header>
  );
};

export default Header;
