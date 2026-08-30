import Axios from "@/axios/axios";
import type { RegistrationData } from "@/pages/Register";

export const sendRegistrationOtp = async (
  email: string,
  mobile?: string,
  countryCode?: string,
  alternateMobile?: string
) => {
  const response = await Axios.post("/api/users/send-otp", {
    email,
    mobile,
    countryCode,
    alternateMobile,
  });
  return response.data;
};


export const verifyRegistrationOtp = (data: {
  email: string;
  otp: string;
  password: string;
  accountFor?: string;
  fullName?: string;
  mobile?: string;
  alternateMobile?: string;
  countryCode?: string;
  gender?: string;
  createdBy?: string;
  createdByModel?: string;
}) => {
  return Axios.post("/api/users/verify-otp", data);
};

export const verifyRegistrationOtpOnly = (data: {
  email: string;
  otp: string;
}) => {
  return Axios.post("/api/users/verify-otp-only", data);
};

export const registerFullUserApi = (formData: FormData) => {
  return Axios.post("/api/users/register-full", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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
  data: Record<string, any>
) => {
  return Axios.put(`/api/users/${userId}/complete-profile`, data);
};
