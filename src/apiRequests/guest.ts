import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from "@/schemaValidations/auth.schema";
import {
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";

const guestApiRequest = {
  sLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/guest/auth/login", body),
  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    }
  ) =>
    http.post(
      "/guest/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    ),
  logout: () => http.post("/api/guest/auth/logout", null, { baseUrl: "" }),
};
export default guestApiRequest;
