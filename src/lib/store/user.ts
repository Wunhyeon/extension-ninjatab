import { create } from "zustand";
import { UserEmailWithSubsriptionStatus } from "../type";

interface UserState {
  user: UserEmailWithSubsriptionStatus | null;
  //   setUser: (user: UserEmailWithSubsriptionStatus) => void;
}

export const useUser = create<UserState>()((_set) => ({
  user: null,
}));
