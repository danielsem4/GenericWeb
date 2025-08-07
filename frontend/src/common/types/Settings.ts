export interface IProfileData {
  name: string;
  email: string;
}

export interface ILanguage {
  value: string;
  label: string;
  dir: "ltr" | "rtl";
}

export type ITheme = "light" | "dark" | "system";

export interface IThemeContextType {
  theme: ITheme;
  setTheme: (theme: ITheme) => void;
  resolvedTheme: "light" | "dark";
}

export interface ISettingsContextType {
  profile: IProfileData;
  setProfile: React.Dispatch<React.SetStateAction<IProfileData>>;
  language: string;
  setLanguage: (language: string) => void;
  isSaving: boolean;
  handleSave: () => Promise<void>;
}
