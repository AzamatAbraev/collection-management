interface CollectionType {
  _id: string;
  createdAt: string;
  name: string;
  description: string;
  category: string;
  userId: {
    _id: string;
    username: string;
  };
  image?: string;
  itemCount: number;
  customFields?: [{ fieldType: string; fieldName: string }];
}

export default CollectionType;
