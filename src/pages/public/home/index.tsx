import React from "react"
import { List } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { Fragment } from 'react';
import { useQuery } from 'react-query';
import { getLargestCollections } from '../../../api/collections';
import HomeCarousel from '../../../components/carousel';
import LoadingPage from '../../loading';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CollectionType from '../../../types/collection';

import booksImage from "../../../assets/books-category.webp"
import artsImage from "../../../assets/art-category.webp"
import sportsImage from "../../../assets/sports-category.avif"
import coinsImage from "../../../assets/coins-category.webp"
import othersImage from "../../../assets/other-category.webp";
import backgroundImage from "../../../assets/home-image.jpg"

interface CategoryNameType {
  [key: string]: string;
}

import './style.scss';

const HomePage = () => {
  const { t } = useTranslation();
  const { data: largestCollections, isLoading } = useQuery('largestCollections', getLargestCollections);


  const IconText = ({ icon, text }: { icon: React.FC, text: string }) => (
    <span>
      {React.createElement(icon)}
      {text}
    </span>
  );

  const categoryImages: CategoryNameType = {
    Books: booksImage,
    Coins: coinsImage,
    Arts: artsImage,
    Sports: sportsImage,
    Others: othersImage
  }

  return (
    <Fragment>
      {isLoading ? <LoadingPage /> : <section id="latest">
        <div className="container">
          <div className="home home-main">
            <div className="home-image">
              <img src={backgroundImage} alt="Collections Image" />
            </div>
            <div className="home-content">
              <h2>{t("Explore our collections")}</h2>
              <p>{t("Delve into our meticulously curated collections that span from vintage classics to modern marvels")}</p>
              <Link to="/allcollections">{t("Collections")}</Link>
            </div>
          </div>
          <h1 className="fs-1 m-3 fst-bold">{t("Latest-Items")}</h1>
          <HomeCarousel />
          <h1 className="fs-1 m-3 fst-bold">{t("Collections")}</h1>
          <List
            itemLayout="vertical"
            size="large"
            className="collection-list"
            dataSource={largestCollections}
            renderItem={(collection: CollectionType) => (
              <List.Item
                className="collection-list-item"
                key={collection._id}
                actions={[
                  <IconText icon={StarFilled} text={collection.itemCount.toString()} key="list-vertical-star-o" />,
                ]}
                extra={<img className="collection-list-image" alt="Collection" src={categoryImages[collection.category] || categoryImages.Others} />}
              >
                <List.Item.Meta
                  title={<Link className="fs-4" to={`/collection/${collection._id}`}>{collection.name}</Link>}
                  description={<div>
                    <p className="fs-5">{collection.description}</p>
                    <p className="collection-list-username fs-6 text-muted">By {collection.userId?.username || 'Unknown'}</p>
                  </div>
                  }

                />
              </List.Item>
            )}
          />
        </div>
      </section>}
    </Fragment>
  );
};

export default HomePage;
