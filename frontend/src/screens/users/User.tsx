import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Calendar,
  Clock,
  Building,
  Shield,
} from "lucide-react";
import type { IUser } from "@/common/types/Users";
import { sampleUsers } from "@/common/data/mocData";


function User() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const user = useMemo(() => {
    if (!userId) return null;
    return sampleUsers.find((u) => u.id === parseInt(userId, 10));
  }, [userId]);

  const getStatusVariant = (status: IUser["status"]) => {
    switch (status) {
      case "Active":
        return "default" as const;
      case "Inactive":
        return "secondary" as const;
      case "Pending":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  if (!user) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/users")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <UserIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">User not found</h3>
              <p className="text-muted-foreground">
                The user you're looking for doesn't exist.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/users")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <div className="flex items-center gap-2">
          <UserIcon className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{user.name}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    {user.email}
                  </CardDescription>
                </div>
                <Badge
                  variant={getStatusVariant(user.status)}
                  className="text-sm"
                >
                  {user.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Basic Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Role</p>
                        <p className="text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Department</p>
                        <p className="text-muted-foreground">
                          {user.department}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timeline Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Join Date</p>
                        <p className="text-muted-foreground">
                          {new Date(user.joinDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Last Login</p>
                        <p className="text-muted-foreground">
                          {user.lastLogin}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage this user's account and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Button variant="outline" className="justify-start" asChild>
                  <a href={`mailto:${user.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </a>
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Edit Permissions
                </Button>
                <Button variant="outline" className="justify-start">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="destructive"
                  className="justify-start"
                  disabled={user.status === "Inactive"}
                >
                  <UserIcon className="mr-2 h-4 w-4" />
                  {user.status === "Active"
                    ? "Deactivate User"
                    : "User Inactive"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User Stats Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant={getStatusVariant(user.status)}>
                    {user.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">User ID</span>
                  <span className="text-sm text-muted-foreground">
                    #{user.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Days Active</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.floor(
                      (new Date().getTime() -
                        new Date(user.joinDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default User;
