import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ShieldBan, ShieldCheck } from "lucide-react";

/**
 *
 */

interface ModuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: boolean;
}

function ModuleCard({
  icon: Icon,
  title,
  description,
  isActive,
}: ModuleCardProps) {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between p-0 gap-4">
        <div className="flex gap-2 items-center">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors group-hover:opacity-90 gap-2`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold">{title}</span>
        </div>
        {isActive ? (
          <ShieldCheck className="h-5 w-5 text-green-500" aria-hidden="true" />
        ) : (
          <ShieldBan className="h-5 w-5 text-red-500" aria-hidden="true" />
        )}
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground font-semibold">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default ModuleCard;
