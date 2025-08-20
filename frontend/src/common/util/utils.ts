// Takes the fileds from snake_case or kebab-case and converts them to camelCase

import {
  Boxes,
  CalendarCheck,
  CircleUser,
  DollarSign,
  FileQuestionMark,
  FileText,
  PersonStanding,
  Pill,
  UserSquare2,
  type LucideIcon,
} from "lucide-react";
import type { IUser } from "../types/Users";

export function recursiveFactorSnakeCaseToCamelCase<T = any>(obj: T): T | T[] {
  if (Array.isArray(obj)) {
    return obj.map((item) => recursiveFactorSnakeCaseToCamelCase(item));
  }

  if (typeof obj === "object" && obj !== null) {
    const result: any = {};

    for (const key in obj) {
      const newKey = isSnakeCase(key) ? factorToCamelCase(key) : key;
      result[newKey] = recursiveFactorSnakeCaseToCamelCase(obj[key]);
    }

    return result;
  }

  return obj;
}

function factorToCamelCase(str: string) {
  // First handle snake_case or kebab-case
  const fromSnakeOrKebab = str.replace(/([-][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("", "")
  );

  // Then handle PascalCase - convert first letter to lowercase if it's uppercase
  return fromSnakeOrKebab.charAt(0).toLowerCase() + fromSnakeOrKebab.slice(1);
}
function isSnakeCase(str: string): boolean {
  return str.includes("_") && /^[a-z0-9]+$/i.test(str);
}

function usersTableColumns(data: IUser) {}

export function getModuleIconByName(moduleName: String): LucideIcon {
  switch (moduleName) {
    case "Questionnaires":
      return FileQuestionMark;
    case "Medications":
      return Pill;
    case "appointments":
      return CalendarCheck;
    case "Activities":
      return PersonStanding;
    case "File Share":
      return FileText;
    default:
      return CircleUser;
  }
}
