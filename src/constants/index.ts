import { SelectProps } from "antd";

export const USER_DATA = "USER_DATA";
export const TOKEN = "TOKEN";
export const USER_ROLE = "ROLE";

export const categoryOptions: SelectProps["options"] = [
  {
    label: "Books",
    value: "Books",
  },
  {
    label: "Coins",
    value: "Coins",
  },
  {
    label: "Art",
    value: "Art",
  },
  {
    label: "Sports",
    value: "Sports",
  },
  {
    label: "Other",
    value: "Other",
  },
];
