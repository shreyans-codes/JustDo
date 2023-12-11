import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SideImageComponent from "../components/SideImageComponent";
import { loginAsync } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";
import toast from "react-hot-toast";
import { IS_HOSTED } from "../variables/modifiers";

const LogInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  const [isVerified, setIsVerified] = useState(false);

  const loginToAccount = async (event) => {
    if (username === "") {
      toast.error("Please enter a username");
      return;
    }
    if (password === "") {
      toast.error("Please enter a password");
      return;
    }
    event.preventDefault();
    dispatch(loginAsync({ username: username, password: password })).then(
      () => {
        if (authState.isError) {
          toast.error(authState.message);
        } else {
          if (authState.mfaEnabled) {
            navigate("/verify", {
              state: { username: username, password: password },
            });
          } else {
            navigate("/");
          }
        }
      }
    );
  };

  const verifyRecaptcha = () => {
    setIsVerified(!isVerified);
  };

  return (
    <div style={{ height: "100vh" }}>
      <div className="grid" style={{ gridTemplateColumns: "7fr 5fr" }}>
        <SideImageComponent />
        <div className="form-control w-full max-w-lg m-auto">
          <article className="prose">
            <h1>Log in to your account</h1>
          </article>
          <div>
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <ReCAPTCHA
            className="mt-4 p-0 "
            theme="dark"
            sitekey={
              IS_HOSTED
                ? "6Lct5ScpAAAAAHVISfRd2LvEjihktk2OMT1ZmO4z"
                : "6LeNoxgpAAAAAD0m0CTHEgxFI4C1mcIqbBHzncWB"
            }
            onChange={verifyRecaptcha}
          />
          <button
            disabled={!isVerified}
            className="btn btn-info mt-10"
            onClick={loginToAccount}
          >
            Log In
          </button>
          {/* 
           // TODO: Have a Forgot Password button 
          */}
          <span className="mx-auto mt-2">
            {"Don't have an account? "}
            <a className="link-primary" href="/signup">
              Sign Up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
