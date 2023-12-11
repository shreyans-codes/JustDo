import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import LogInPage from "./pages/LogInPage";
import SignUp from "./pages/SignUp";
import VerifyPage from "./pages/VerifyPage";
import { useSelector } from "react-redux";
import FetcherPage from "./pages/FetcherPage";

const RouterInterface = () => {
  const user = useSelector((state) => state.auth.user);
  const RequireAuth = ({ children }) => {
    console.log("User: ", user);
    if (user === null) {
      return <Navigate to={"/signin"} />;
    } else {
      return children;
    }
  };
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="login" element={<LogInPage />} />
            <Route path="signin" element={<LogInPage />} />
            <Route
              index
              element={
                <RequireAuth>
                  <App />
                </RequireAuth>
              }
            />
            <Route path="fetch" element={<FetcherPage />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="verify" element={<VerifyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default RouterInterface;
