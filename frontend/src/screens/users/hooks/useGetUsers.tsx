import type { IUser } from "@/common/types/Users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type UsersByIdApi = Record<string, Omit<IUser, "id"> | Partial<IUser>>;

function toUserArray(raw: unknown): IUser[] {
  if (Array.isArray(raw)) return raw as IUser[];

  if (raw && typeof raw === "object") {
    return Object.entries(raw as Record<string, any>).map(([id, u]) => ({
      ...(u as IUser),
      id: Number.isNaN(Number(id)) ? (id as any) : Number(id),
    }));
  }

  return [];
}

async function fetchUsers(clinicId: string, userId: string): Promise<IUser[]> {
  const url = `${import.meta.env.VITE_API_URL_DEV}users/${clinicId}/${userId}/`;
  const { data } = await axios.get<IUser[]>(url, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });

  console.log("Fetched users data:", data);

  return data;
}

export function useUsers(clinicId: string, userId: string) {
  return useQuery<IUser[], Error>({
    queryKey: ["users", clinicId, userId],
    queryFn: () => fetchUsers(clinicId, userId),
    refetchOnWindowFocus: false,
    retry: false,
    enabled: Boolean(clinicId && userId),
  });
}
