import { QueryFunctionContext } from "react-query";
import request from "../server";

type MyQueryKey = [string, string];

const getCollections = async () => {
  const { data } = await request.get("collections");
  return data;
};

const getUserCollections = async ({
  queryKey,
}: QueryFunctionContext<MyQueryKey>) => {
  const [, category] = queryKey;
  const params = { category };
  const { data } = await request.get("collections/user", { params });
  return data;
};

export { getCollections, getUserCollections };
