import Axios from "../axios/axios";

export const loginUserApi = async (email: string, password: string) => {
  const response = await Axios.post("/api/user/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const SendSignUpOtp = async (email: string) => {
  const response = await Axios.post("/api/user/auth/signup/send-otp", { email });
  return response.data;
};

export const VerifySignUpOtp = async (email: string, otp: string) => {
  const response = await Axios.post("/api/user/auth/signup/verify-otp", { email, otp });
  return response.data;
};

// 1. Fixed payload key to 'mobile'
export const sendLoginOtp = async (phone: string) => {
  const response = await Axios.post("/api/user/auth/phone/send-otp", { 
    mobile: phone 
  });
  return response.data;
};

// 2. Fixed endpoint path to '/phone/verify-otp' and payload key to 'mobile'
export const verifyLoginOtp = async (phone: string, otp: string) => {
  const response = await Axios.post("/api/user/auth/phone/verify-otp", { 
    mobile: phone, 
    otp 
  });
  return response.data;
};

export const sendForgotPasswordOtp = async (email: string) => {
  return Axios.post("/api/user/auth/forgot-password/send-otp", {
    email,
  });
};

export const verifyForgotPasswordOtp = async (email: string, otp: string) => {
  return Axios.post("/api/user/auth/forgot-password/verify-otp", {
    email,
    otp,
  });
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  return Axios.post("/api/user/auth/forgot-password/reset", {
    email,
    otp,
    password: newPassword,
    confirmPassword: newPassword,
  });
};