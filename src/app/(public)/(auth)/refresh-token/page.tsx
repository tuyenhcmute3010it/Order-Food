"use client";
import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

export default function RefreshTokenPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");
  const ref = useRef<any>(null);

  useEffect(() => {
    if (
      ref.current ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage())
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          route.push(redirectPathname || "/");
        },
      });
    }
  }, [route, refreshTokenFromUrl, redirectPathname]);

  return <div>Refresh token ..........</div>;
}
