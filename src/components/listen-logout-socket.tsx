import socket from "@/lib/socket";
import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppContext } from "./app-provider";
import { handleErrorApi } from "@/lib/utils";
const UNAUTHENTICATED_PATH = ["/login", "logout", "refresh-token"];

export default function ListenLogoutSocket() {
  const pathName = usePathname();
  const router = useRouter();
  const { isPending, mutateAsync } = useLogoutMutation();
  const { setRole } = useAppContext();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
        setRole();
        router.push("/");
      } catch (error: any) {
        handleErrorApi({
          error,
        });
      }
    }
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [router, pathName, isPending, mutateAsync, socket]);
  return null;
}
