import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import useAuth from "../../../store/auth";
import { AutoComplete } from "antd";
import request from "../../../server";

import "./Header.scss";
import ItemType from "../../../types/item";
import CollectionType from "../../../types/collection";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [options, setOptions] = useState([]);


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

  return (
    <header>
      <nav className="nav">
        <div className="container nav__container">
          <div className="nav__logo">
            <Link to="/">MyBox</Link>
          </div>
          <div className="nav__search">
            <AutoComplete
              style={{ width: "100%" }}
              options={options}
              onSelect={onSelect}
              allowClear
              onSearch={fetchSearchResults}
              placeholder="Search..."
            />
          </div>
          <ul className="nav__menu">
            <li className="nav__item">
              <NavLink to="/" className="nav__link home__link">Home</NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/about" className="nav__link about__link">About</NavLink>
            </li>
            <li className="nav__item">
              <NavLink to="/allcollections" className="nav__link">Collections</NavLink>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav__item">
                  <NavLink className="nav__btn" to="/user/dashboard">{user?.name}</NavLink>
                </li>
                <li className="nav__item">
                  <button className="nav__btn" onClick={() => logout(navigate)}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav__item">
                  <NavLink className="nav__btn" to="/login">Login</NavLink>
                </li>
                <li className="nav__item">
                  <NavLink className="nav__btn" to="/register">Register</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
