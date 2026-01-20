import Axios from "@/axios/axios";
import type { RegistrationData } from "@/pages/Register";

export const registerUser = async (data: RegistrationData) => {
  const payload = {
    accountFor: data.accountFor,
    fullName: data.fullName,
    email: data.email,
    mobile: data.countryCode + data.mobile,
    gender: data.gender,

    dateOfBirth: data.dob,
    branch: data.city,

    religion: data.religion,
    caste: data.caste,
    motherTongue: data.motherTongue,

    height: data.height,
    weight: data.weight,
    maritalStatus: data.maritalStatus,
    bodyType: data.bodyType,

    education: data.education,
    profession: data.profession,

    interests: data.interests,
    traits: data.traits,
    diets: data.diets,
  };

  const response = await Axios.post("/api/users", payload);
  return response.data;
}

export const loginUser = async (email: string, password: string) => {
  const response = await Axios.post("/api/users/login", {
    email,
    password,
  });
  return response.data;
};
