"use client";

import authApiRequest from "@/apiRequests/auth";
import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/lib/utils";
import jwt from "jsonwebtoken";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Nhung page sau se khong check refresh token
const UNAUTHENTICATED_PATH = ["/login", "logout", "refresh-token"];

export default function RefreshToken() {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(pathName);
    if (UNAUTHENTICATED_PATH.includes(pathName)) return;
    let interval: any = null;
    //Phai goi lan dau tien vi interval se chay sau thoi gian time out
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    // Time out interval phai be hon thoi gian het han cua access token
    // vi du thoi gian het han access token la 10s thi 1s minh se cho check 1 lan
    const TIMEOUT = 1000;
    interval = setInterval(
      () =>
        checkAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            router.push("/login");
          },
        }),
      TIMEOUT
    );
    return () => {
      clearInterval(interval);
    };
  }, [pathName, router]);

  return null;
}
