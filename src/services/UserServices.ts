import Axios from "@/axios/axios";
import type { RegistrationData } from "@/pages/Register";

export const sendRegistrationOtp = (email: string) => {
  return Axios.post("/api/users/send-otp", { email });
};

export const verifyRegistrationOtp = (data: {
  email: string;
  otp: string;
  password: string;
}) => {
  return Axios.post("/api/users/verify-otp", data);
};


export const registerUser = (data: {
  email: string;
  password: string;
  accountFor: string;
  fullName: string;
  mobile: string;
  countryCode: string;
  gender: string;
}) => {
  return Axios.post("/api/users/register", data);
};


export const completeUserProfile = (
  userId: string,
  data: Partial<RegistrationData>
) => {
  return Axios.put(`/api/users/${userId}/complete-profile`, data);
};
