import { create } from "zustand";

interface LoginFormState {
  email: string;
  password: string;
  actions: {
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
  };
}

const useLoginFormStore = create<LoginFormState>((set) => ({
  email: "",
  password: "",
  actions: {
    setEmail: (email) => set({ email }),
    setPassword: (password) => set({ password }),
  },
}));

export const useLoginFormFields = () => {
  const email = useLoginFormStore((state) => state.email);
  const password = useLoginFormStore((state) => state.password);
  return { email, password };
};

export const useLoginFormActions = () => {
  const { setEmail, setPassword } = useLoginFormStore((state) => state.actions);
  return { setEmail, setPassword };
};
