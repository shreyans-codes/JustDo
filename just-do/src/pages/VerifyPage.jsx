import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { verifyMFACodeAsync } from "../redux/authSlice";
import toast from "react-hot-toast";

const VerifyPage = () => {
  const location = useLocation();
  const recievedData = location.state;
  const authState = useSelector((state) => state.auth);
  const [code, setCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(recievedData.username);
  const verifyMFACode = async (event) => {
    event.preventDefault();
    dispatch(
      verifyMFACodeAsync({
        username: recievedData.username,
        password: recievedData.password,
        code: code,
      })
    ).then(() => {
      if (authState.isError) {
        toast.error(authState.message);
        return;
      } else navigate("/");
    });
  };
  return (
    <div className="w-max m-auto mt-20">
      {authState?.message?.substr(0, 4) == "data" ? (
        <img src={authState.message} alt="QR Code" />
      ) : null}
      <div className="form-control w-full m-auto max-w-xs">
        <label className="label">
          <span className="label-text">Enter current OTP Code</span>
        </label>
        <input
          type="text"
          placeholder="Type here"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <label className="label"></label>
        <button className="btn btn-info" onClick={verifyMFACode}>
          Verify Code
        </button>
      </div>
    </div>
  );
};

export default VerifyPage;
