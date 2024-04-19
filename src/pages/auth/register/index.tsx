import { Link, useNavigate } from "react-router-dom";

import "./style.scss"
import useAuth from "../../../store/auth";
import { useFormik } from "formik";
import RegisterSchema from "../../../schemas/register";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

const RegisterPage = () => {

  const { register } = useAuth();
  const navigate = useNavigate()
  const { t } = useTranslation()

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: ""
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      await register(values, navigate);
    }
  })

  return (
    <section className="login-page">
      <Helmet>
        <title>Register</title>
        <meta name="Register" content="Registration to use all features of our website" />
      </Helmet>
      <div className="login__main">
        <div className="login__header">
          <h2>{t("Register")}</h2>
          <p>{t("Already-Registered")} <Link to="/login">{t("Login")}</Link></p>
        </div>
        <form onSubmit={formik.handleSubmit} className="login__form">
          <div className="input__field">
            <input
              type="text"
              id="username"
              name="username"
              placeholder={t("Username")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            <p className={`error-message ${formik.touched.username && formik.errors.username ? 'active' : ''}`}>
              {formik.touched.username && formik.errors.username ? formik.errors.username : null}
            </p>
          </div>
          <div className="input__field">
            <input
              type="text"
              id="email"
              name="email"
              placeholder={t("Email")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            <p className={`error-message ${formik.touched.email && formik.errors.email ? 'active' : ''}`}>
              {formik.touched.email && formik.errors.email ? formik.errors.email : null}
            </p>
          </div>

          <div className="input__field">
            <input
              type="password"
              id="password"
              name="password"
              placeholder={t("Password")}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <p className={`error-message ${formik.touched.password && formik.errors.password ? 'active' : ''}`}>
              {formik.touched.password && formik.errors.password ? formik.errors.password : null}
            </p>
          </div>


          <button type="submit" className="login__btn">{t("Register")}</button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;