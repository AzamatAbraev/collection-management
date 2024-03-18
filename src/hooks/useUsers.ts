import { useQuery } from "react-query";
import request from "../server";

interface User {
  _id: string;
  username: string;
}

const useUsers = () => {
  const { data, isLoading, isError } = useQuery("users", async () => {
    const { data } = await request.get("users");
    return data;
  });

  const getUserById = (userId: string): string => {
    const user = data?.find((user: User) => user._id === userId);
    return user?.username || "Loading...";
  };

  return { getUserById, isLoading, isError };
};

export default useUsers;
