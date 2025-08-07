import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface Medication {
  id: string;
  medForm: string;
  medName: string;
  medUnitOfMeasurement: string;
  doctor: string;
  frequency: string;
  frequency_data: Record<string, any>;
  start_date: string;
  end_date: string | null;
  dosage: string | null;
}

async function fetchMedications(): Promise<Medication[]> {
  const url = `${import.meta.env.VITE_API_URL_DEV}medications/patient/1/5/`;

  console.log("Fetching medications from API (Axios)...", url);

  const { data } = await axios.get<Medication[]>(url, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });

  console.log("Fetched medications data:", data);

  return data;
}

export function useMedications() {
  return useQuery<Medication[], Error>({
    queryKey: ["medications"],
    queryFn: fetchMedications,
  });
}
