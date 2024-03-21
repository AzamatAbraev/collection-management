import React from 'react';
import CollectionType from "../../types/collection"
import ItemType from "../../types/item"

type SearchResultProps = {
  search: CollectionType | ItemType;
};

function isCollectionType(search: CollectionType | ItemType): search is CollectionType {
  return (search as CollectionType).description !== undefined;
}

const SearchResultCard: React.FC<SearchResultProps> = ({ search }) => {
  return (
    <div>
      <h3>{search.name}</h3>
      {isCollectionType(search) ? (
        <p>{search.description}</p>
      ) : (
        <p>{search.tags.join(", ")}</p>
      )}
    </div>
  );
};

export default SearchResultCard;
