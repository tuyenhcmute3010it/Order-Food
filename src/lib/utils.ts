import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/components/ui/use-toast";
import { DishStatus, OrderStatus, TableStatus } from "@/constants/type";
import envConfig from "@/config";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import exp from "constants";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};
const isBrowser = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};
export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("accessToken", value);
};
export const setRefreshTokenToLocalStorage = (value: string) => {
  return isBrowser && localStorage.setItem("refreshToken", value);
};
export const removeTokenFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken");
  isBrowser && localStorage.removeItem("accessToken");
};
////
export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  // Khong nen dua logic lay access vs refresh token ra khoi cai function 'checkAndRefreshToken'
  // Vi de moi lan ma checkAndRefreshToken() duoc goi thi chung ta se co mot access va refresh token moi
  // tranh hien tuong bug no lay access va refresh token cu o lan dau roi goi cho cac lan goi tiep theo
  const accessToken = getAccessTokenFromLocalStorage();
  const RefreshToken = getRefreshTokenFromLocalStorage();
  // Chua dang nhap thi cung khong cho chay
  if (!accessToken || !RefreshToken) return;
  const decodedAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodedRefreshToken = jwt.decode(RefreshToken) as {
    exp: number;
    iat: number;
  };
  //Thoi diem het han cua token tinh theo epoch time(s)
  // Con khi cac ban dung cu phap new Date().getTime() thi no se tra ve epoch time (ms)
  const now = Math.round(new Date().getTime() / 1000);
  // Truong hop refresh token het han thi khong xu li nua

  if (decodedRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    param?.onError && param.onError();
    return;
  }
  // Vi du access token cua chung ta co thoi gian het han la 10s
  // thi minh se kiem tra con 1/3 thoi gian (3s) thi minh se cho refresh token lai
  // thoi gian con lai se tinh dua tren cong thuc :decodedAccessToken.exp - now
  // thoi gian het han cua access token dua tren cong thuc : decodedAccessToken - decodeAccessToken.iat
  if (
    decodedAccessToken.exp - now <
    (decodedAccessToken.exp - decodedAccessToken.iat) / 3
  ) {
    // goi api refresh token
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch (error) {
      param?.onError && param.onError();
    }
  }
};
///
export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getVietnameseOrderStatus = (
  status: (typeof OrderStatus)[keyof typeof OrderStatus]
) => {
  switch (status) {
    case OrderStatus.Delivered:
      return "Đã phục vụ";
    case OrderStatus.Paid:
      return "Đã thanh toán";
    case OrderStatus.Pending:
      return "Chờ xử lý";
    case OrderStatus.Processing:
      return "Đang nấu";
    default:
      return "Từ chối";
  }
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};
export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};
