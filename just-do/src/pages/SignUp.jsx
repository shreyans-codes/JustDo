import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import SideImageComponent from "../components/SideImageComponent";
import { useDispatch, useSelector } from "react-redux";
import { registerAsync } from "../redux/authSlice";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { IS_PROD } from "../variables/modifiers";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const mfaEnableRef = useRef(null);
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkValues = () => {
    let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
    if (
      username === "" ||
      password === "" ||
      firstName === "" ||
      email === ""
    ) {
      toast.error("Please fill the details");
      return false;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a correct email");
      return false;
    }
    if (password != confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      return false;
    }
    return true;
  };
  const signUpToAccount = async (event) => {
    if (!checkValues()) {
      console.log("Here");
      return;
    }
    event.preventDefault();
    const userData = {
      email: email,
      username: username,
      password: password,
      firstName: firstName,
      lastName: lastName,
      mfaEnabled: mfaEnableRef.current.checked,
    };
    dispatch(registerAsync(userData)).then((res) => {
      console.log(res);
      if (authState.isError) {
        toast.error(authState.message);
        return;
      } else {
        if (mfaEnableRef.current.checked)
          navigate("/verify", {
            state: {
              username: username,
              password: password,
            },
          });
        else navigate("/signin");
      }
    });
  };

  const redirectToGitHub = () => {
    window.location.replace(
      IS_PROD
        ? "/api/oauth2/authorization/github"
        : "http://localhost:8080/oauth2/authorization/github"
    );
  };

  const redirectToGoogle = () => {
    window.location.replace(
      IS_PROD
        ? "/api/oauth2/authorization/google"
        : "http://localhost:8080/oauth2/authorization/google"
    );
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
        <article className="prose">
          <h1>SignUp to Just Do</h1>
        </article>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
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
        </div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type here"
              className="input input-bordered w-full"
            />
          </div>
        </div>
        <div className="">
          <label className="label cursor-pointer">
            <span className="label-text">Enable MFA?</span>
            <input
              ref={mfaEnableRef}
              type="checkbox"
              className="checkbox checkbox-primary"
            />
          </label>
        </div>
        <button className="btn btn-info mt-10" onClick={signUpToAccount}>
          SignUp
        </button>
        <span className="mx-auto mt-2">
          Already have an account?{" "}
          <a className="link-primary" href="/login">
            Log In
          </a>
        </span>
        <div className=" flex">
          <button
            className="mt-2 m-auto flex items-center bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={redirectToGoogle}
          >
            <FcGoogle size={20} className="mr-6" />
            <span>Continue with Google</span>
          </button>
          <button
            className="mt-2 m-auto flex items-center bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={redirectToGitHub}
          >
            <FaGithub size={20} className="mr-6" />
            <span>Continue with Github</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
