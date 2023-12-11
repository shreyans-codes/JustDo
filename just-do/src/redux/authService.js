import axios from "axios";
import { IS_PROD } from "../variables/modifiers";

export const BASE_AUTH_URL = IS_PROD
  ? "/auth/auth"
  : "http://localhost:8081/auth";
export const BASE_APPLICATION_URL = IS_PROD
  ? "/api/todo"
  : "http://localhost:8080/todo";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_AUTH_URL}/register`, {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mfaEnabled: userData.mfaEnabled,
      application: "Just Do",
    });
    console.log(response.data.user.userId);
    await createApplicationAccount({
      userId: response.data.user.userId,
      username: userData.username,
      name: response.data.user.firstName + response.data.user.lastName,
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

const createApplicationAccount = async (userData) => {
  await axios.post(`${BASE_APPLICATION_URL}/create`, {
    userId: userData.userId,
    username: userData.username,
    name: userData.name,
  });
};

export const loginToAccount = async (userData) => {
  try {
    const response = await axios.post(`${BASE_AUTH_URL}/login`, {
      username: userData.username,
      password: userData.password,
      application: "Just Do",
    });
    const jwt_token = response.data["jwt"];
    let mfaEnabled = false;
    if (jwt_token === "") mfaEnabled = true;
    else {
      localStorage.setItem("token", jwt_token);
    }
    return [response.data, mfaEnabled];
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchAccount = async () => {
  try {
    const response = await axios.get(`${BASE_APPLICATION_URL}/userDetails`, {
      withCredentials: true,
    });
    console.log("Fetch response: ", response);
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
};

export const logout = async () => {
  let logoutLocation = "";
  if (IS_PROD) {
    logoutLocation = "/api/logout";
    await axios.post(logoutLocation, { withCredentials: true });
  } else {
    logoutLocation = "http://localhost:8080/logout";
    await axios.post(logoutLocation, { withCredentials: true });
    window.location.replace(logoutLocation);
  }
  localStorage.removeItem("token");
};

export const verifyCode = async (userData) => {
  const response = await axios.post(`${BASE_AUTH_URL}/verify`, {
    username: userData.username,
    password: userData.password,
    code: userData.code,
  });
  const jwt_token = response.data["jwt"];
  localStorage.setItem("token", jwt_token);
  return response;
};
