import request from "../server";

const getLatestItems = async () => {
  const { data } = await request.get("items/latest");
  return data;
};

const getSingleItem = async (itemId: string) => {
  const { data } = await request.get(`items/${itemId}`);
  return data;
};

export { getLatestItems, getSingleItem };
