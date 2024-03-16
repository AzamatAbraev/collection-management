import { useEffect } from "react";
import { Fragment } from "react/jsx-runtime";

import HomeCarousel from "../../../components/carousel";
import useCollection from "../../../store/collections";
import LoadingPage from "../../loading";
import CollectionListCard from "../../../components/card/CollectionListCard";

import "./style.scss";

const HomePage = () => {
  const { collections, loading, getAllCollections } = useCollection();

  useEffect(() => {
    getAllCollections()
  }, [getAllCollections])

  return (
    <Fragment>
      {loading ? <LoadingPage /> : <section id="latest">
        <div className="container">
          <h1 className="home__title">Latest Items</h1>
          <HomeCarousel />
          <h1 className="home__title">Collections</h1>
          <div className="collections__row">
            {collections?.map((collection) => <CollectionListCard key={collection._id} {...collection} />)}
          </div>
        </div>
      </section>}
    </Fragment>
  )
}

export default HomePage;