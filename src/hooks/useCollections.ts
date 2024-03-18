import { useQuery } from "react-query";
import request from "../server";
import CollectionType from "../types/collection";

const useCollections = () => {
  const { data, isLoading, isError } = useQuery("collections", async () => {
    const { data } = await request.get("collections");
    return data;
  });

  const getCollectionById = (collectionId: string): string => {
    const collection = data?.find(
      (collection: CollectionType) => collection._id === collectionId,
    );
    return collection?.name || "Loading...";
  };

  return { getCollectionById, isLoading, isError };
};

export default useCollections;
