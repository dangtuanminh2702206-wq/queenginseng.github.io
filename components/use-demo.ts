"use client";
import { useSyncExternalStore } from "react";
import { currentUser, getSnapshot, subscribeDemo } from "@/lib/demo-store";
const serverSnapshot = () => "";
export function useDemo() { const snapshot = useSyncExternalStore(subscribeDemo, getSnapshot, serverSnapshot); const hydrated = snapshot !== ""; return { hydrated, user: hydrated ? currentUser() : null }; }
