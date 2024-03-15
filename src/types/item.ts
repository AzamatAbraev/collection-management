interface ItemType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  userId: string;
  tags: string[];
  collectionId: string;
}

export default ItemType;
