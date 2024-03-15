import { Fragment } from "react/jsx-runtime";
import "./style.scss";
import HomeCarousel from "../../../components/carousel";
import CollectionCard from "../../../components/card/CollectionCard";
import useCollection from "../../../store/collections";
import { useEffect } from "react";

const HomePage = () => {
  const { collections, getAllCollections } = useCollection();

  useEffect(() => {
    getAllCollections()
  }, [getAllCollections])

  console.log(collections);


  return (
    <Fragment>
      <section id="latest">
        <div className="container">
          <HomeCarousel />
          {collections?.map((collection) => <CollectionCard key={collection._id} {...collection} />)}
        </div>
      </section>
      <section id="largest"></section>
      <section id="categories"></section>
    </Fragment>
  )
}

export default HomePage;