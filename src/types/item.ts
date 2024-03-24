interface ItemType {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  userId: {
    _id: string;
    username: string;
  };
  tags: string[];
  collectionId: {
    _id: string;
    name: string;
  };
  photo: string;
  likes: string[];
  customValues: [
    {
      fieldName: string;
      fieldValue: string;
    },
  ];
}

export default ItemType;
