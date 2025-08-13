import { useState } from "react";
import { useMedications } from "./hooks/useGetPatientMedications";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Trash2, Send, Loader2 } from "lucide-react";

function Medications() {
  const { data: medications, isLoading, error } = useMedications();
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data for when API doesn't return data
  const dummyMedications = [
    {
      id: "1",
      medName: "Aspirin",
      medForm: "Tablet",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Smith",
      frequency: "Daily",
      frequency_data: {},
      start_date: "2024-01-01",
      end_date: null,
      dosage: "100mg",
    },
    {
      id: "2",
      medName: "Ibuprofen",
      medForm: "Capsule",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Johnson",
      frequency: "Twice daily",
      frequency_data: {},
      start_date: "2024-01-15",
      end_date: "2024-02-15",
      dosage: "200mg",
    },
    {
      id: "3",
      medName: "Metformin",
      medForm: "Tablet",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Brown",
      frequency: "Three times daily",
      frequency_data: {},
      start_date: "2024-01-10",
      end_date: null,
      dosage: "500mg",
    },
    {
      id: "4",
      medName: "Lisinopril",
      medForm: "Tablet",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Davis",
      frequency: "Once daily",
      frequency_data: {},
      start_date: "2024-01-05",
      end_date: null,
      dosage: "10mg",
    },
    {
      id: "5",
      medName: "Akamol",
      medForm: "Capsule",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Wilson",
      frequency: "Once daily",
      frequency_data: {},
      start_date: "2024-01-20",
      end_date: "2024-03-20",
      dosage: "20mg",
    },
    {
      id: "6",
      medName: "Akamol",
      medForm: "Capsule",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Wilson",
      frequency: "Once daily",
      frequency_data: {},
      start_date: "2024-01-20",
      end_date: "2024-03-20",
      dosage: "20mg",
    },
    {
      id: "7",
      medName: "Akamol",
      medForm: "Capsule",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Wilson",
      frequency: "Once daily",
      frequency_data: {},
      start_date: "2024-01-20",
      end_date: "2024-03-20",
      dosage: "20mg",
    },
    {
      id: "8",
      medName: "Akamol",
      medForm: "Capsule",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Wilson",
      frequency: "Once daily",
      frequency_data: {},
      start_date: "2024-01-20",
      end_date: "2024-03-20",
      dosage: "20mg",
    },
    {
      id: "9",
      medName: "Akamol",
      medForm: "Capsule",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Wilson",
      frequency: "Once daily",
      frequency_data: {},
      start_date: "2024-01-20",
      end_date: "2024-03-20",
      dosage: "20mg",
    },
    {
      id: "105",
      medName: "Akamol",
      medForm: "Capsule",
      medUnitOfMeasurement: "mg",
      doctor: "Dr. Wilson",
      frequency: "Once daily",
      frequency_data: {},
      start_date: "2024-01-20",
      end_date: "2024-03-20",
      dosage: "20mg",
    },
  ];

  const medicationsToShow = dummyMedications;

  // Filter medications based on search term
  const filteredMedications = medicationsToShow.filter(
    (medication) =>
      medication.medName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medication.medForm.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    console.log("Delete medication with id:", id);
  };

  const handleSend = (id: string) => {
    console.log("Send medication with id:", id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading medications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive">
            Error loading medications
          </h2>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Clinic Medications</h1>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search medications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedications.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm
                ? "No medications found matching your search."
                : "No medications available."}
            </p>
          </div>
        ) : (
          filteredMedications.map((medication) => (
            <Card
              key={medication.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{medication.medName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Form</p>
                  <p className="font-medium">{medication.medForm}</p>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(medication.id)}
                    className="hover:bg-green-50 hover:border-green-200"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(medication.id)}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Medications;
