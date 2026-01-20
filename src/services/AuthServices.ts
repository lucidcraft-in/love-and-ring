import Axios from "../axios/axios";

export const SendSignUpOtp=async(email:string)=>{
    const response= await Axios.post("/api/user/auth/signup/send-otp",{email});
    return response.data;
}

export const VerifySignUpOtp=async(email:string,otp:string)=>{
    const response= await Axios.post("/api/user/auth/signup/send-otp",{email,otp});
    return response.data;
}