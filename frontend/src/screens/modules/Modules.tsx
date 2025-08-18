import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilter, CheckCircle, XCircle } from "lucide-react";
import { ModuleCard } from "@/components/ModuleCard";
import { useNavigate } from "react-router-dom";
import ModuleSkeleton from "@/components/skeletons/ModuleCard";

export type Module = {
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive";
  description?: string;
};

const MOCK_MODULES: Module[] = [
  {
    id: "1",
    name: "Users",
    category: "Core",
    status: "active",
    description: "Manage users",
  },
  {
    id: "2",
    name: "Medications",
    category: "Health",
    status: "inactive",
    description: "Track medications",
  },
  {
    id: "3",
    name: "Settings",
    category: "Core",
    status: "active",
    description: "App settings",
  },
  {
    id: "4",
    name: "Reports",
    category: "Analytics",
    status: "inactive",
    description: "View reports",
  },
  {
    id: "5",
    name: "Appointments",
    category: "Health",
    status: "active",
    description: "Manage appointments",
  },
  {
    id: "6",
    name: "Billing",
    category: "Finance",
    status: "active",
    description: "Billing and invoices",
  },
  {
    id: "7",
    name: "Notifications",
    category: "Core",
    status: "inactive",
    description: "User notifications",
  },
  {
    id: "8",
    name: "Inventory",
    category: "Logistics",
    status: "active",
    description: "Manage inventory",
  },
];

const SORT_OPTIONS = [
  { value: "name", label: "Alphabetical" },
  { value: "category", label: "Category" },
  { value: "status", label: "Status" },
];

type SortKey = "name" | "category" | "status";
type StatusTab = "all" | "active" | "inactive";

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("name");
  const [status, setStatus] = useState<StatusTab>("all");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const navigate = useNavigate();

  // loading
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setModules(MOCK_MODULES);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 150);
    return () => clearTimeout(handler);
  }, [search]);

  // Filtered, sorted modules
  const visibleModules = useMemo(() => {
    let filtered = modules;
    if (status !== "all")
      filtered = filtered.filter((m) => m.status === status);
    if (debouncedSearch)
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          m.category.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    filtered = [...filtered].sort((a, b) => {
      if (sort === "name" || sort === "category")
        return a[sort].localeCompare(b[sort]);
      if (sort === "status") return a.status.localeCompare(b.status);
      return 0;
    });
    return filtered;
  }, [modules, debouncedSearch, sort, status]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          Modules
          <span className="text-base font-medium text-muted-foreground">
            ({visibleModules.length})
          </span>
        </h1>
        <div className="flex flex-col md:flex-row gap-2 md:gap-4 w-full md:w-auto">
          <Input
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
            aria-label="Search modules"
          />
          <SortSelect sort={sort} setSort={setSort} />
        </div>
      </div>
      <Tabs
        value={status}
        onValueChange={(v) => setStatus(v as StatusTab)}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Active
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Inactive
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <ModuleGrid>
        {loading ? (
          Array.from({ length: 12 }).map((_, i) => <ModuleSkeleton key={i} />)
        ) : visibleModules.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No modules found.
          </div>
        ) : (
          visibleModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              onClick={() => navigate(`/modules/${module.name}`)}
            />
          ))
        )}
      </ModuleGrid>
    </div>
  );
}

function SortSelect({
  sort,
  setSort,
}: {
  sort: SortKey;
  setSort: (s: SortKey) => void;
}) {
  return (
    <div className="relative">
      <select
        className="pl-8 pr-4 py-2 rounded-md border bg-background text-sm focus-visible:ring-2 focus-visible:ring-ring transition"
        value={sort}
        onChange={(e) => setSort(e.target.value as SortKey)}
        aria-label="Sort modules"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ListFilter className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function ModuleGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-9"
      role="list"
    >
      {children}
    </div>
  );
}
