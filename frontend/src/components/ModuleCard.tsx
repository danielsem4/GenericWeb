import { motion } from "framer-motion";
import { Layers, CheckCircle, XCircle } from "lucide-react";
import React from "react";

/**
 * ModuleCard component displays a single module's information.
 */

export type ModuleCardProps = {
  module: {
    id: string;
    name: string;
    category: string;
    status: "active" | "inactive";
    description?: string;
  };
  onClick: () => void;
};

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.01, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full min-w-70 min-h-30 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl transition shadow-sm bg-card hover:shadow-lg p-5 flex flex-col gap-2 cursor-pointer"
      tabIndex={0}
      aria-label={`View module ${module.name}`}
    >
      <div className="flex items-center gap-2 mb-1">
        <Layers className="w-5 h-5 text-primary" />
        <span className="font-semibold text-lg">{module.name}</span>
        {module.status === "active" ? (
          <CheckCircle
            className="w-4 h-4 text-green-500 ml-auto"
            aria-label="Active"
          />
        ) : (
          <XCircle
            className="w-4 h-4 text-red-500 ml-auto"
            aria-label="Inactive"
          />
        )}
      </div>
      <div className="text-sm text-muted-foreground mb-1">
        {module.category}
      </div>
      <div className="text-sm line-clamp-2">{module.description}</div>
    </motion.button>
  );
};
