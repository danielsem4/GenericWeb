import type { IModule } from "@/common/types/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import React, { memo, type MouseEvent } from "react";

export interface ModuleCardProps {
  module: IModule;
  onAdd?: (m: IModule) => void;
  onRemove?: (m: IModule) => void;
}

export const ModuleCard = memo(function ModuleCard({
  module,
  onAdd,
  onRemove,
}: ModuleCardProps) {
  const handleAdd = (e: MouseEvent) => {
    e.stopPropagation();
    onAdd?.(module);
  };
  const handleRemove = (e: MouseEvent) => {
    e.stopPropagation();
    onRemove?.(module);
  };

  return (
    <Card className="flex justify-between items-center p-4">
      <CardHeader>
        <CardTitle>{module.name}</CardTitle>
      </CardHeader>
      <CardContent>
        {onAdd && (
          <Button size="sm" onClick={handleAdd}>
            +
          </Button>
        )}
        {onRemove && (
          <Button variant="ghost" size="sm" onClick={handleRemove}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
});
