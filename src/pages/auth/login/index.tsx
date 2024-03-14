import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import LoginSchema from "../../../schemas/login";
import useAuth from "../../../store/auth";

import "./style.scss"

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate();

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
          <h2>Sign In</h2>
          <p>Do not have an account? <Link to="/register">Register</Link></p>
        </div>
        <form onSubmit={formik.handleSubmit} className="login__form">
          <div className="input__field">
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Email"
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
              placeholder="Password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <p className={`error-message ${formik.touched.password && formik.errors.password ? 'active' : ''}`}>
              {formik.touched.password && formik.errors.password ? formik.errors.password : null}
            </p>
          </div>


          <button type="submit" className="login__btn">Login</button>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;