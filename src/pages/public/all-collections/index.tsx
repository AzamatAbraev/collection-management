import { useEffect } from "react";
import CollectionListCard from "../../../components/card/CollectionListCard";
import useCollection from "../../../store/collections";
import request from "../../../server";
import CollectionType from "../../../types/collection";
import { useQuery } from "react-query";

import "./style.scss";

const fetchCollections = async () => {
  const { data } = await request.get('/collections');
  return data;
};

const AllCollections = () => {

  const { data: collections } = useQuery('collections', fetchCollections);

  const { setCollections } = useCollection();

  useEffect(() => {
    if (collections) {
      setCollections(collections);
    }
  }, [collections, setCollections]);

  return (
    <section id="allcollections" className="allcollections">
      <div className="container allcollections__container">
        <div className="allcollections__header">
        </div>
        <div className="allcollections__row">
          {collections?.map((collection: CollectionType) => <CollectionListCard key={collection._id} {...collection} />)}
        </div>
      </div>
    </section>
  )
}

export default AllCollections