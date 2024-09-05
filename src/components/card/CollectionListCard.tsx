import { Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import useCollection from "../../store/collections";
import CollectionType from "../../types/collection";
import convertTime from "../../utils/convertTime";

import "./style.scss";

const CollectionListCard = (collection: CollectionType) => {
  const { loading } = useCollection();
  const { t } = useTranslation()

  return (
    <Skeleton loading={loading} active>
      <div className="card my-3 shadow-sm">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between mb-2 gap-2">
            <h3 className="">{collection.name}</h3>
            <p className="text-muted">{t(collection.category)}</p>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-2 gap-2">
            <p className="description">{collection.description}</p>
            <p className="text-muted">{convertTime(collection.createdAt)}</p>
          </div>
          <p>{collection.itemCount}</p>
          <div className="d-flex">
            <Link to={`/collection/${collection._id}`} className="btn btn-primary">{t("See-More")}</Link>
          </div>
        </div>
      </div>
    </Skeleton>
  );
}

export default CollectionListCard;
