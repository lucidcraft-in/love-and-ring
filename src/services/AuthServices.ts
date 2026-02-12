import Axios from "../axios/axios";

export const loginUserApi = async (email: string, password: string) => {
  const response = await Axios.post("/api/user/auth/login", {
    email,
    password,
  });
  return response.data;
}
export const SendSignUpOtp=async(email:string)=>{
    const response= await Axios.post("/api/user/auth/signup/send-otp",{email});
    return response.data;
}

export const VerifySignUpOtp=async(email:string,otp:string)=>{
    const response= await Axios.post("/api/user/auth/signup/send-otp",{email,otp});
    return response.data;
}

export const sendLoginOtp = async (phone: string) => {
  const response = await Axios.post("/api/user/auth/login/send-otp", { phone });
  return response.data;
};

export const verifyLoginOtp = async (phone: string, otp: string) => {
  const response = await Axios.post("/api/user/auth/login/verify-otp", { phone, otp });
  return response.data;
};