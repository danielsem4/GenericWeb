import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";

/**
 * Simple card component that displays an icon, title, and description.
 */

interface FieldCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FieldCard({ icon: Icon, title, description }: FieldCardProps) {
  return (
    <Card>
      <CardHeader className="flex items-center p-0 gap-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-blue-500 transition-colors group-hover:opacity-90`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="text-lg font-bold">{title}</span>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground font-semibold">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export default FieldCard;
