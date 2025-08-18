import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  title: string;
  value: string | number;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconColor?: string;
  onClick?: () => void;
}

function InfoCard({
  title,
  value,
  Icon,
  iconColor = "text-blue-500",
  onClick,
}: InfoCardProps) {
  return (
    <Card
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      className={cn(
        "relative flex cursor-pointer select-none flex-col justify-between gap-6 rounded-2xl border border-white/20",
        "bg-white/30 dark:bg-black/50 backdrop-blur-md p-6 shadow-md",
        "hover:shadow-xl hover:scale-[1.02] active:scale-[.98]",
        "transition-all duration-200 ease-out"
      )}
    >
      <CardHeader className="flex items-center justify-between p-0">
        <span className="text-lg font-semibold">{title}</span>
        <Icon className={cn("h-8 w-8", iconColor)} />
      </CardHeader>

      <CardContent className="flex items-center justify-between p-0 text-4xl font-bold">
        {value}
        <ArrowRight className="h-6 w-6 flex-shrink-0 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

export default InfoCard;
