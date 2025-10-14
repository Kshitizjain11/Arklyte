import { create } from "zustand";
import { AuthSlice, createAuthSlice } from "./slices/auth-slice";

type StoreState = AuthSlice

export const useAppStore = create<StoreState>()((...a)=>({
    ...createAuthSlice(...a)
}))