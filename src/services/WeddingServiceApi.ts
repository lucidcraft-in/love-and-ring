import axios from "@/axios/axios";

export interface WeddingService {
  _id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  priceRange?: string;
  location?: string;
  contactEmail?: string;
  contactPhone?: string;
  status: "Active" | "Inactive";
  order?: number;
  rating?: number;
  createdAt?: string;
}

export interface EnquiryRequestPayload {
  name: string;
  email: string;
  phone?: string;
  serviceId?: string;
  serviceTitle: string;
  serviceCategory: string;
  message?: string;
  eventDate?: string;
}

export const getPublicWeddingServices = async (): Promise<WeddingService[]> => {
  const response = await axios.get<WeddingService[]>("/api/cms/wedding-services/public");
  return response.data;
};

export const submitServiceEnquiry = async (
  payload: EnquiryRequestPayload
): Promise<{ success: boolean; ticketId: string; message: string }> => {
  const response = await axios.post("/api/cms/wedding-services/enquire", payload);
  return response.data;
};
