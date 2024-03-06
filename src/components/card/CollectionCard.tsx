import { Link, useNavigate } from "react-router-dom"
import bookImg from "../../assets/book.webp"

import "./style.scss"

const CollectionCard = () => {
  const navigate = useNavigate();
  return (
    <div className="collection collection__row">
      <div className="collection__content">
        <Link to="/allcollections" className="collection__category">Books</Link>
        <h3 className="collection__name">My Old Books</h3>
        <p className="collection__desc">This is a short description for this collection</p>
        <button onClick={() => navigate("/collection/adsd")} className="collection__btn">See Items</button>
      </div>
      <div className="collection__image">
        <img src={bookImg} alt="Book" />
      </div>
    </div >
  )
}

export default CollectionCard