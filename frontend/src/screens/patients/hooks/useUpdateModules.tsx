import type { IUser, IUserModule } from "@/common/types/Users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 *
 * @param clinicId
 * @param patientId
 * @param moduleId
 * @returns
 */

async function updatePatientModule(
  clinicId: number,
  patientId: number,
  moduleId: number
): Promise<IUserModule[]> {
  const url = `${
    import.meta.env.VITE_API_URL_DEV
  }clinics/${clinicId}/patients/${patientId}/modules/${moduleId}/toggle`;

  const { data } = await axios.post<IUserModule[]>(url, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });

  return data;
}

export function useUpdatePatientModule(
  clinicId: number,
  patientId: number,
  moduleId: number,
  enabled: boolean = true
) {
  return useQuery<IUserModule[], Error>({
    queryKey: ["user", clinicId, patientId, moduleId],
    queryFn: () => updatePatientModule(clinicId, patientId, moduleId),
    enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
