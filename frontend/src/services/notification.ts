import { PUBLIC_VAPID_KEY } from "@/config";
import { api } from "@/lib/api";

export async function subscribeToNotifications(): Promise<void> {
  const publicKey = PUBLIC_VAPID_KEY || "";

  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: publicKey,
    });

    await api.post("/subscribe", { subscription });
  }
}
