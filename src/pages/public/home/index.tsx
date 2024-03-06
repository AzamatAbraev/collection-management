import { Fragment } from "react/jsx-runtime";
import "./style.scss";
import HomeCarousel from "../../../components/carousel";
import CollectionCard from "../../../components/card/CollectionCard";

const HomePage = () => {
  return (
    <Fragment>
      <section id="latest">
        <div className="container">
          <HomeCarousel />
          <CollectionCard />
        </div>
      </section>
      <section id="largest"></section>
      <section id="categories"></section>
    </Fragment>
  )
}

export default HomePage;