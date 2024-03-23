import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import LoginSchema from "../../../schemas/login";
import useAuth from "../../../store/auth";
import { useTranslation } from "react-i18next";


import "./style.scss"

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      await login(values, navigate);
    },
  });
  return (
    <section className="login-page">
      <div className="login__main">
        <div className="login__header">
          <h2>{t("Login")}</h2>
          <p>{t("Not-Registered")} <Link to="/register">{t("Register")}</Link></p>
        </div>
        <form onSubmit={formik.handleSubmit} className="login__form">
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


          <button type="submit" className="login__btn">{t("Login")}</button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;