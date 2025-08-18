import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

/**
 * Skeleton component for a module card.
 * @returns A skeleton placeholder for a module card.
 */

function ModuleSkeleton() {
  return (
    <Card className="p-5 w-70 h-30 flex flex-col gap-2 animate-pulse">
      <Skeleton className="h-5 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/4 mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  );
}

export default ModuleSkeleton;
