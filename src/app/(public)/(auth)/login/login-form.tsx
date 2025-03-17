"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/queries/useAuth";
import { toast } from "@/components/ui/use-toast";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppContext } from "@/components/app-provider";
import envConfig from "@/config";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { boolean } from "zod";
const getOauthGoogleUrl = () => {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
    client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
  };
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
};

const googleOauthUrl = getOauthGoogleUrl();

export default function LoginForm() {
  const t = useTranslations("Login");
  const errorMessageT = useTranslations("ErrorMessage");
  const loginMutation = useLoginMutation();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const { role, setRole } = useAppContext();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) {
      return;
    }
    try {
      const result = await loginMutation.mutateAsync(data);
      setRole(result.payload.data.account.role); // Đúng rồi!
      setIsAuth(true); // Cập nhật trạng thái
      router.push("/");
      toast({
        description: result.payload.message,
      });
    } catch (error: any) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>
          Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={form.handleSubmit(onSubmit, (err) => {
              console.warn(err);
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        {...field}
                      />
                      <FormMessage>
                        {Boolean(errors.email?.message) &&
                          errorMessageT(errors.email?.message as any)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
                      <FormMessage>
                        {Boolean(errors.password?.message) &&
                          errorMessageT(errors.password?.message as any)}
                      </FormMessage>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t("title")}
              </Button>
              <Link href={googleOauthUrl}>
                <Button variant="outline" className="w-full" type="button">
                  Đăng nhập bằng Google
                </Button>
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
