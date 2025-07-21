import { Card } from "../../../components/ui/card";
import { useUserFullName, useClinicName } from "../../../common/store/UserStore";

function Home() {
  const userFullName = useUserFullName();
  const clinicName = useClinicName();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome to {clinicName}
        </h1>
        {userFullName && (
          <p className="text-xl text-muted-foreground">
            Hello, {userFullName}! Ready to start your day?
          </p>
        )}
        <p className="text-lg text-muted-foreground">
          Your comprehensive healthcare management system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-2">Patient Management</h3>
          <p className="text-muted-foreground">
            Efficiently manage patient records, statuses, and treatment plans all in one place.
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-2">Medication Tracking</h3>
          <p className="text-muted-foreground">
            Monitor medication schedules, dosages, and patient compliance with automated reminders.
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-foreground mb-2">Activity Monitoring</h3>
          <p className="text-muted-foreground">
            Track patient activities,  and progress reports for comprehensive care.
          </p>
        </Card>
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-foreground mb-4">System Features</h2>
        <ul className="list-disc list-inside space-y-2 text-foreground">
          <li>🏥 Complete patient record management</li>
          <li>💊 Advanced medication tracking and alerts</li>
          <li>📊 Comprehensive reporting and analytics</li>
          <li>🔒 HIPAA-compliant security and privacy</li>
          <li>📱 Mobile-responsive design for all devices</li>
          <li>🌓 Automatic dark/light mode based on your preferences</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
