import * as Yup from "yup";

const RegisterSchema = Yup.object({
  username: Yup.string()
    .required("Please provide your name")
    .min(3, "Username should be at least 2 characters long")
    .max(30, "Username cannot be more than 30 characters long"),
  email: Yup.string()
    .email()
    .matches(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide valid email",
    )
    .required("Please enter valid email"),
  password: Yup.string()
    .required("Please enter valid password")
    .min(6, "password should be at least six character long"),
});

export default RegisterSchema;
