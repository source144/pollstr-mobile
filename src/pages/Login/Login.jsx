import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faUserTie,
  faEnvelope,
  faLock,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  authLogin,
  authResendVerification,
} from "../../store/actions/authActions";
import _ from "lodash";

const emailRegex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

const checkForm = (payload) => {
  if (!payload || typeof payload !== "object") return;

  const errors = {
    email: "",
    password: "",
  };

  // Trim the payload
  Object.keys(payload).forEach(function (key, index) {
    payload[key] = payload[key].trim();
  });

  if (!payload.email) errors.email = "An email is required";
  else if (!emailRegex.test(payload.email))
    errors.email = "Please enter a valid email";

  if (!payload.password) errors.password = "A password is required";

  return errors;
};

const Login = () => {
  const {
    auth,
    error,
    needsVerification,
    global_loading: auth_loading,
    loading: verification_loading,
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const getPayload = () => ({
    email,
    password,
  });

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent multiple requests
    if (auth_loading || verification_loading) return;

    let valid = true;
    const auth = getPayload();
    const _errors = checkForm(auth);
    Object.keys(_errors).forEach((key) => (valid = valid && !_errors[key]));

    if (valid) dispatch(authLogin(auth));

    setErrors(_errors);
  };
  const handleResendVerification = (e) => {
    e.preventDefault();

    // Prevent multiple requests
    if (auth_loading || verification_loading) return;

    // Shouldn't be called. (Do nothing)
    if (!needsVerification) return;

    // Resend Verification Email to User
    dispatch(authResendVerification(needsVerification));
  };

  // TODO : ProtectedRoute instead of this:
  if (!_.isEmpty(auth)) return <Redirect to="/" />;

  return (
    <>
      <div
        style={{
          display: "flex",
          minHeight: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="form-form-wrapper">
          <h1 className="form-title">Sign In</h1>
          <form onSubmit={handleSubmit} noValidate className="form-form">
            <div className="form-item">
              <label htmlFor="email">Email</label>
              <div className="form-item-wrapper">
                <input
                  className={`form-item__input ${
                    !!errors.email ? "form-item__input--err" : ""
                  }`}
                  type="text"
                  placeholder="e.g. serverus@hogwarts.edu"
                  name="email"
                  formNoValidate
                  onChange={handleEmail}
                />
                <span className="form-item__input-icon">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              {!!errors.email ? (
                <span className="form-item__error">{errors.email}</span>
              ) : null}
            </div>
            <div className="form-item">
              <label htmlFor="password">Password</label>
              <div className="form-item-wrapper">
                <input
                  className={`form-item__input ${
                    !!errors.password || !!errors.confirm
                      ? "form-item__input--err"
                      : ""
                  }`}
                  type="password"
                  // placeholder="e.g. CaputDraconis420"
                  placeholder="e.g. ••••••••••••"
                  name="password"
                  formNoValidate
                  onChange={handlePassword}
                />
                <span className="form-item__input-icon">
                  <FontAwesomeIcon icon={faLock} />
                </span>
              </div>
              {!!errors.password ? (
                <span className="form-item__error">{errors.password}</span>
              ) : null}
            </div>
            {!!error ? (
              <div className="form-item__error">
                {error}
                {needsVerification ? (
                  <span>
                    !{" "}
                    <a
                      href="#"
                      className="form-switch-action"
                      onClick={handleResendVerification}
                    >
                      Resend Here
                    </a>
                  </span>
                ) : undefined}
              </div>
            ) : null}
            <div className="form-item">
              <input
                className={`btn btn--tertiary form-item__submit ${
                  !!errors.confirm ? "form-item__input--err" : ""
                }`}
                type="submit"
                value="Sign In "
              />
            </div>
            <div className="form-switch">
              <p>
                Forgot you password?{" "}
                <Link to="/password/forgot" className="form-switch-action">
                  Reset Here
                </Link>
              </p>
            </div>
            <div className="form-switch">
              <p>
                Don't have an account?{" "}
                <Link to="/signup" className="form-switch-action">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
