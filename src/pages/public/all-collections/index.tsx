import { Card, Col, Input, Row, Select, Spin, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

import request from "../../../server";
import CollectionType from "../../../types/collection";

import artsImage from "../../../assets/art-category.webp";
import booksImage from "../../../assets/books-category.webp";
import coinsImage from "../../../assets/coins-category.webp";
import othersImage from "../../../assets/other-category.webp";
import sportsImage from "../../../assets/sports-category.avif";

interface CategoryNameType {
  [key: string]: string;
}
const { Option } = Select;

import { Helmet } from "react-helmet";
import "./style.scss";

const AllCollections = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const { t } = useTranslation();

  const initialSearch = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const fetchCollections = async () => {
    const params = { query: search, category };
    const { data } = await request.get('/collections', { params });
    return data;
  };

  const { data: collections, isLoading } = useQuery(['collections', location.search], fetchCollections);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    navigate({ search: params?.toString() }, { replace: true });
  }, [search, category, navigate]);

  const categoryImages: CategoryNameType = {
    Books: booksImage,
    Coins: coinsImage,
    Arts: artsImage,
    Sports: sportsImage,
    Others: othersImage
  }

  return (
    <section id="allcollections" style={{ padding: "2rem 0" }}>
      <Helmet>
        <title>Collections</title>
      </Helmet>
      <div className="container">
        <Row gutter={[16, 16]} className="mb-3">
          <Col span={12}>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("Search")}
            />
          </Col>
          <Col span={12}>
            <Select
              value={category}
              onChange={(value) => setCategory(value)}
              style={{ width: "100%" }}
              placeholder={t("Select a category")}
            >
              <Option value="">{t("All")}</Option>
              <Option value="Books">{t("Books")}</Option>
              <Option value="Coins">{t("Coins")}</Option>
              <Option value="Art">{t("Art")}</Option>
              <Option value="Sports">{t("Sports")}</Option>
              <Option value="Other">{t("Other")}</Option>
            </Select>
          </Col>
        </Row>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {collections?.map((collection: CollectionType) => (
              <Col key={collection._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  className="allcollections-card"
                  hoverable
                  cover={<img style={{ width: "100%", "height": "200px" }} alt="Category" src={categoryImages[collection.category] || categoryImages["Others"]} />}
                  onClick={() => navigate(`/collection/${collection._id}`)}
                >
                  <Card.Meta title={collection.name} description={
                    <Tooltip title={collection.description}>
                      <div style={{ minHeight: "66px" }} className="ant-card-meta-description">
                        {collection.description}
                      </div>
                    </Tooltip>
                  } />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </section>
  );
};

export default AllCollections;
