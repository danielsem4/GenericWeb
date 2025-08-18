import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import type { IUserModule } from "@/common/types/Users";
import { motion } from "framer-motion";
import { Users, Building2, Package } from "lucide-react";

export function TitleIconCard({ module }: { module: IUserModule }) {
  const Icon = Users;
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/modules/${module.module_id}`} className="focus:outline-none">
        <Card
          tabIndex={0}
          className={cn(
            "group relative h-full cursor-pointer rounded-2xl border bg-card transition-shadow focus-visible:ring-2 focus-visible:ring-ring",
            "hover:shadow-lg"
          )}
        >
          <CardHeader className="flex flex-row items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60">
              {Icon && <Icon className="h-6 w-6" aria-hidden />}
            </div>
            <div className="flex flex-1 flex-col">
              <CardTitle className="line-clamp-1 text-base font-semibold leading-tight">
                {module.moduleName}
              </CardTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant={module.status === "active" ? "default" : "secondary"}
                  className={cn(
                    module.status === "active"
                      ? "bg-emerald-600 hover:bg-emerald-600 text-white"
                      : "bg-muted text-foreground"
                  )}
                >
                  {module.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {module.description}
            </p>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
