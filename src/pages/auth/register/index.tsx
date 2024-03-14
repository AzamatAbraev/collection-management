import { Link, useNavigate } from "react-router-dom";

import "./style.scss"
import useAuth from "../../../store/auth";
import { useFormik } from "formik";
import RegisterSchema from "../../../schemas/register";

const RegisterPage = () => {

  const { register } = useAuth();
  const navigate = useNavigate()

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
      <div className="login__main">
        <div className="login__header">
          <h2>Sign Up</h2>
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
        <form onSubmit={formik.handleSubmit} className="login__form">
          <div className="input__field">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Username"
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


          <button type="submit" className="login__btn">Register</button>
        </form>
      </div>
    </section>
  );
};

export default RegisterPage;