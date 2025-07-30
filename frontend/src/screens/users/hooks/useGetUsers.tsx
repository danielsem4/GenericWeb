import type { IUser } from "@/common/types/Users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function getUsers(clinicId: string, patientId: string): Promise<IUser[]> {
  console.log("Fetching users for clinicId:", clinicId, "and patientId:", patientId);
  
  const { data } = await axios.get(`users/${clinicId}/${patientId}/`, {
    withCredentials: true});
  console.log("Fetched users data:", data);
  
  return data;
}

export const useGetUsers = (clinicId: string, patientId: string) =>
  useQuery({
    queryKey: ["users", clinicId, patientId],
    queryFn: () => getUsers(clinicId, patientId),
    refetchOnWindowFocus: false,
    retry: false,
  });