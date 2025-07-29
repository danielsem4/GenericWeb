import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * InfoCard – accepts props to render a title + icon on the first row and a body
 * text + arrow icon on the second row. Uses shadcn/ui Card.
 */

interface InfoCardProps {
  title: string;
  value: string | number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  onClick?: () => void;
}

function InfoCard({ title, value, Icon, onClick }: InfoCardProps) {
  return (
    <Card
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "relative flex cursor-pointer select-none flex-col justify-between gap-4 rounded-lg border bg-primary p-5 text-primary-foreground shadow transition-all duration-150 ease-out",
        "hover:shadow-lg active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      )}
    >
      <CardHeader className="flex items-center justify-between p-0">
        <span className="text-lg font-medium leading-tight">{title}</span>
        <Icon className="h-6 w-6 opacity-80" />
      </CardHeader>

      <CardContent className="flex items-center justify-between p-0 text-3xl font-semibold">
        {value}
        <ArrowRight className="h-5 w-5 flex-shrink-0 opacity-70" />
      </CardContent>
    </Card>
  );
}

export default InfoCard;