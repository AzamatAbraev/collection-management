import { useEffect, useState } from "react";
import CollectionListCard from "../../../components/card/CollectionListCard";
import useCollection from "../../../store/collections";
import request from "../../../server";
import CollectionType from "../../../types/collection";
import { useQuery } from "react-query";
import { categoryOptions } from "../../../constants";
import { useLocation, useNavigate } from "react-router-dom";

const AllCollections = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);

  const fetchCollections = async () => {
    const params = { search, category };
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
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Searching..." type="text" className="form-control" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: "200px" }} className="form-select">
            <option value="">All</option>
            {categoryOptions?.map((category) => category.value ? (
              <option key={category.value} value={category.value}>{category.label}</option>
            ) : "")}
          </select>
        </div>
        {isLoading ? (
          <p>Loading collections...</p>
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
