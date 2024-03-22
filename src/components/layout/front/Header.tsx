import { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import useAuth from "../../../store/auth";
import { AutoComplete } from "antd";
import request from "../../../server";
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
    <header className="bg-primary text-white fixed-top">
      <nav className="container d-flex justify-content-between align-items-center py-2">
        <Link to="/" className="navbar-brand text-white fs-3">MyBox</Link>
        <div className="flex-grow-1 px-3">
          <AutoComplete
            className="w-100"
            options={options}
            onSelect={onSelect}
            allowClear
            onSearch={fetchSearchResults}
            placeholder="Search..."
          />
        </div>
        <ul className="nav">
          <li className="nav-item">
            <NavLink to="/" className={({ isActive }) => "nav-link" + (isActive ? " text-danger" : " text-white")}>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/about" className={({ isActive }) => "nav-link" + (isActive ? " text-danger" : " text-white")}>About</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/allcollections" className="nav-link text-white">Collections</NavLink>
          </li>
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              <li className="nav-item">
                <NavLink className="btn btn-light" to="/user/dashboard">{user?.name}</NavLink>
              </li>
              <li className="nav-item">
                <button className="btn btn-light" onClick={() => logout(navigate)}>Logout</button>
              </li>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <li className="nav-item">
                <NavLink className="btn btn-light" to="/login">Login</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="btn btn-light" to="/register">Register</NavLink>
              </li>
            </div>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
