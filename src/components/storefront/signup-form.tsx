"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@/i18n/navigation";
import { signup, type SignupState } from "@/lib/actions/auth";

function SubmitButton() {
  const t = useTranslations("Auth");
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t("creatingAccount") : t("createAccount")}
    </Button>
  );
}

export function SignupForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [state, formAction] = useFormState<SignupState, FormData>(async (prevState, formData) => {
    const result = await signup(prevState, formData);
    if (result.success) {
      setRedirecting(true);
      await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });
      router.push("/shop");
      router.refresh();
    }
    return result;
  }, {});

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-semibold">{t("signUpTitle")}</h1>
        <p className="text-sm text-muted-foreground">{t("signUpSubtitle")}</p>
      </div>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("fullName")}</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
        </div>
        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
        <SubmitButton />
        {redirecting && <p className="text-center text-xs text-muted-foreground">{t("signingYouIn")}</p>}
      </form>
      <p className="text-center text-sm text-muted-foreground">
        {t("alreadyHaveAccount")}{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          {t("haveAccountSignIn")}
        </Link>
      </p>
    </div>
  );
}
