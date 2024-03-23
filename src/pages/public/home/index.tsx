import { Fragment } from "react/jsx-runtime";
import { useQuery } from "react-query";

import { getCollections } from "../../../api/collections";

import HomeCarousel from "../../../components/carousel";
import LoadingPage from "../../loading";
import CollectionListCard from "../../../components/card/CollectionListCard";
import CollectionType from "../../../types/collection";

import "./style.scss";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation()
  const { data: collections, isLoading } = useQuery("collections", getCollections)

  return (
    <Fragment>
      {isLoading ? <LoadingPage /> : <section id="latest">
        <div className="container">
          <h1 className="home__title">{t("Latest-Items")}</h1>
          <HomeCarousel />
          <h1 className="home__title">{t("Collections")}</h1>
          <div className="collections__row">
            {collections?.map((collection: CollectionType) => <CollectionListCard key={collection._id} {...collection} />)}
          </div>
        </div>
      </section>}
    </Fragment>
  )
}

export default HomePage;