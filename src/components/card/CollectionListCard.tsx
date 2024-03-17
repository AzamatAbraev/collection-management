import { Link } from "react-router-dom";
import CollectionType from "../../types/collection";
import convertTime from "../../utils/convertTime";
import useCollection from "../../store/collections";
import { Skeleton } from "antd";

import "./style.scss";

const CollectionListCard = (collection: CollectionType) => {
  const { loading } = useCollection();
  return (
    <Skeleton loading={loading}>
      <div className="collection__card">
        <div className="collection__card__row">
          <h3>{collection.name}</h3>
          <p>{collection.category}</p>
        </div>
        <div className="collection__card__row">
          <p>{collection.description}</p>
          <p>{convertTime(collection.createdAt)}</p>
        </div>
        <div className="collection__card__footer">
          <Link to={`/collection/${collection._id}`} className="collection__card__btn">See Items</Link>
        </div>
      </div>

    </Skeleton>
  )
}

export default CollectionListCard