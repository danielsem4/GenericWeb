import { useState, useCallback } from "react";
import type { IModule } from "../../../common/types/User";

export function useModules(all: IModule[]) {
  const [assigned, setAssigned] = useState<IModule[]>(() =>
    all.filter((m) => m.name)
  );
  const [available, setAvailable] = useState<IModule[]>(() =>
    all.filter((m) => !assigned.find((a) => a.id === m.id))
  );

  const add = useCallback((mod: IModule) => {
    setAvailable((a) => a.filter((x) => x.id !== mod.id));
    setAssigned((a) => [...a, mod]);
  }, []);

  const remove = useCallback((mod: IModule) => {
    setAssigned((a) => a.filter((x) => x.id !== mod.id));
    setAvailable((a) => [...a, mod]);
  }, []);

  return { assigned, available, add, remove };
}
