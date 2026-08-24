import axios from "@/axios/axios";

export interface ExploreItem {
  _id: string;
  title: string;
  description?: string;
  coupleName?: string;
  weddingDate?: string;
  successStoryId?: string | { _id: string; coupleName?: string; date?: string; story?: string };
  type: "image" | "video";
  imageUrl?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  thumbnailUrl?: string;
  status: "Active" | "Inactive";
  order?: number;
  createdAt?: string;
}

export const getPublicExploreItems = async (): Promise<ExploreItem[]> => {
  const response = await axios.get<ExploreItem[]>("/api/cms/explore/public");
  return response.data;
};
