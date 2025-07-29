import InfoCard from "@/components/InfoCard";
import { Users, CalendarCheck, Building2, Package } from "lucide-react";
import { UserTable } from "@/components/UserTable";
import { sampleUsers } from "@/common/data/mocData";
import { useNavigate } from "react-router";

function Home() {

  const navigate = useNavigate();

  const cards = [
    { title: "Patients", icon: Users, value: "120" },
    { title: "Clinics", icon: Building2, value: "12" },
    { title: "Modules", icon: Package, value: "5" },
    { title: "Appointments", icon: CalendarCheck, value: "328" },
  ];

  const handleSeeAllUsers = () => {
    console.log("Redirect to full Users page...");
    navigate("/users");
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <InfoCard
            key={card.title}
            title={card.title}
            Icon={card.icon}
            value={card.value}
          />
        ))}
      </div>

      {/* Users Preview Table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Latest Users</h2>
        <UserTable data={sampleUsers} />
      </div>
    </div>
  );
}

export default Home;
