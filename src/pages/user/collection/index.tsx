import { Fragment, useEffect } from "react";
import ItemCard from "../../../components/card/ItemCard";
import useItems from "../../../store/items";
import "./style.scss";
import { useParams } from "react-router-dom";

const CollectionPage = () => {
  const { collectionId } = useParams();

  const { collectionItems, getItemsByCollection } = useItems();

  useEffect(() => {
    getItemsByCollection(collectionId || "")
  }, [getItemsByCollection, collectionId])
  return (
    <Fragment>
      {collectionItems.length > 0 ? <div className="collectionitems__row">
        {collectionItems?.map((item) =>
          <ItemCard key={item._id} {...item} />
        )}

      </div> : <p>No Item Found</p>}
    </Fragment>
  )
}

export default CollectionPage