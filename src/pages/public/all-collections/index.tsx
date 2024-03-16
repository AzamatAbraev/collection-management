import { useEffect } from "react";
import CollectionListCard from "../../../components/card/CollectionListCard";
import useCollection from "../../../store/collections";
import "./style.scss";

const AllCollections = () => {
  const { collections, getAllCollections } = useCollection();

  useEffect(() => {
    getAllCollections()
  }, [getAllCollections])

  return (
    <section id="allcollections" className="allcollections">
      <div className="container allcollections__container">
        <div className="allcollections__header">

        </div>
        <div className="allcollections__row">
          {collections?.map((collection) => <CollectionListCard key={collection._id} {...collection} />)}
        </div>
      </div>
    </section>
  )
}

export default AllCollections