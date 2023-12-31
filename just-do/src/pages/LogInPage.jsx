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
    <div
      style={{
        height: "100vh",
        position: "relative",
        backgroundImage: `url("https://source.unsplash.com/random?wallpapers")`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        display: "flex",
      }}
    >
      {/* <SideImageComponent /> */}
      <div className="p-5 form-control bg-blend-darken rounded-xl bg-stone-800 bg-opacity-60 w-full max-w-lg m-auto">
        <article className="prose text-center">
          <h1>Log in to your account</h1>
        </article>
        <div>
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <input
            type="text"
            value={username}
            style={{
              maxWidth: "none",
            }}
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
          style={{
            maxWidth: "none",
          }}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type here"
          className="input input-bordered"
        />
        <div className="flex w-full justify-center">
          <ReCAPTCHA
            className="mt-4 p-0 w-full "
            theme="dark"
            style={{
              textAlign: "center",
              overflow: "hidden",
              width: "302px",
              height: "76px",
              borderRadius: "3px",
            }}
            sitekey={
              IS_HOSTED
                ? "6Lct5ScpAAAAAHVISfRd2LvEjihktk2OMT1ZmO4z"
                : "6LeNoxgpAAAAAD0m0CTHEgxFI4C1mcIqbBHzncWB"
            }
            onChange={verifyRecaptcha}
          />
        </div>
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
  );
};

export default LogInPage;
