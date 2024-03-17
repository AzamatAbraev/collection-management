import { Fragment } from "react/jsx-runtime";

import HomeCarousel from "../../../components/carousel";
import LoadingPage from "../../loading";
import CollectionListCard from "../../../components/card/CollectionListCard";

import "./style.scss";
import request from "../../../server";
import { useQuery } from "react-query";
import CollectionType from "../../../types/collection";

const HomePage = () => {

  const fetchCollections = async () => {
    const { data } = await request.get("collections");
    return data;
  }

  const { data: collections, isLoading } = useQuery("allCollections", fetchCollections)

  return (
    <Fragment>
      {isLoading ? <LoadingPage /> : <section id="latest">
        <div className="container">
          <h1 className="home__title">Latest Items</h1>
          <HomeCarousel />
          <h1 className="home__title">Collections</h1>
          <div className="collections__row">
            {collections?.map((collection: CollectionType) => <CollectionListCard key={collection._id} {...collection} />)}
          </div>
        </div>
      </section>}
    </Fragment>
  )
}

export default HomePage;