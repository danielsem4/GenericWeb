import type { IUser } from "@/common/types/Users";
import { useQuery } from "@tanstack/react-query";

// async function getUsers(clinicId: string, patientId: string): Promise<IUser[]> {
//   const { data } = await apiClient.get(`/getUsers/${clinicId}/${patientId}/`);
//   return data;
// }

// export const useGetUsers = (clinicId: string, patientId: string) =>
//   useQuery({
//     queryKey: ["users", clinicId, patientId],
//     queryFn: () => getUsers(clinicId, patientId),
//     refetchOnWindowFocus: false,
//     retry: false,
//   });