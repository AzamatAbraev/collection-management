import { useEffect, useState } from "react";
import CollectionListCard from "../../../components/card/CollectionListCard";
import useCollection from "../../../store/collections";
import request from "../../../server";
import CollectionType from "../../../types/collection";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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

  const { setCollections } = useCollection();

  useEffect(() => {
    if (collections) {
      setCollections(collections);
    }
  }, [collections, setCollections]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    navigate({ search: params.toString() }, { replace: true });
  }, [search, category, navigate]);

  return (
    <section id="allcollections">
      <div className="container py-5">
        <div className="d-flex gap-3 mb-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search")} type="text" className="form-control" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "200px" }} className="form-select">
            <option value="">{t("All")}</option>
            <option value="Books">{t("Books")}</option>
            <option value="Coins">{t("Coins")}</option>
            <option value="Art">{t("Art")}</option>
            <option value="Sports">{t("Sports")}</option>
            <option value="Other">{t("Other")}</option>
          </select>
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="row">
            {collections.map((collection: CollectionType) => (
              <div key={collection._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                <CollectionListCard {...collection} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllCollections;
