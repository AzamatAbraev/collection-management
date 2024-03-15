interface CollectionType {
  _id: string;
  createdAt: string;
  name: string;
  description: string;
  category: string;
  userId: string;
  image?: string;
  customFields?: [{ fieldType: string; fieldName: string }];
}

export default CollectionType;
