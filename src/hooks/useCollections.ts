import { useQuery } from "react-query";
import CollectionType from "../types/collection";
import { getCollections } from "../api/collections";

const useCollections = () => {
  const { data, isLoading, isError } = useQuery("collections", getCollections);

  const getCollectionById = (collectionId: string): string => {
    const collection = data?.find(
      (collection: CollectionType) => collection._id === collectionId,
    );
    return collection?.name || "Loading...";
  };

  return { getCollectionById, isLoading, isError };
};

export default useCollections;
