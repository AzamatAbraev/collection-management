import { Link } from "react-router-dom";
import { Modal, message } from "antd";

import useCollection from "../../store/collections";
import CollectionType from "../../types/collection";
import convertTime from "../../utils/convertTime";
import request from "../../server";

import "./style.scss";

const UserCollectionCard = (collection: CollectionType) => {
  const { deleteCollection } = useCollection();

  const handleDeleteProcess = async (collectionId: string) => {
    try {
      await request.delete(`collections/by-collection/${collectionId}`);
      await deleteCollection(collectionId);
      message.success("Collection and all items deleted successfully.");
    } catch (error) {
      message.error("Failed to delete collection and items.");
    }
  };

  return (
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
        <button>Edit</button>
        <button onClick={() =>
          Modal.confirm({
            title: "Are you sure you want to delete this collection and all its items?",
            async onOk() {
              await handleDeleteProcess(collection._id);
            },
          })
        }>Delete</button>
        <Link to={`/collection/${collection._id}`} className="collection__card__btn">See Items</Link>
      </div>
    </div>
  );
};

export default UserCollectionCard;
