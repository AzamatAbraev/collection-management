import { Link, useNavigate } from "react-router-dom"
import bookImg from "../../assets/book.webp"

import "./style.scss"
import CollectionType from "../../types/collection";

const CollectionCard = (collection: CollectionType) => {
  const navigate = useNavigate();
  return (
    <div className="collection collection__row">
      <div className="collection__content">
        <Link to="/allcollections" className="collection__category">{collection?.category}</Link>
        <h3 className="collection__name">{collection?.name}</h3>
        <p className="collection__desc">{collection?.description}</p>
        <button onClick={() => navigate(`/collection/${collection._id}`)} className="collection__btn">See Items</button>
      </div>
      <div className="collection__image">
        <img src={bookImg} alt="Book" />
      </div>
    </div >
  )
}

export default CollectionCard