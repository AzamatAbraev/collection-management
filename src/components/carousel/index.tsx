
import Slider from "react-slick";
import ItemCard from "../card/ItemCard";

import "./style.scss"

function Responsive() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="slider-container container">
      <Slider {...settings}>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
        <div className="slide-wrapper">
          <ItemCard />
        </div>
      </Slider>
    </div>
  );
}

export default Responsive;
