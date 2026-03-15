import { useState } from "react";
import type { SyntheticEvent } from "react";
import { toast } from "sonner";

import { loginUser, saveAuthTokens } from "../../../entities/user/api/login";
import type { LoginPayload } from "../../../entities/user/model/types";

type UseLoginFormReturn = {
  email: string;
  password: string;
  rememberMe: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  toggleRememberMe: () => void;
  handleSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => Promise<void>;
};

type UseLoginFormOptions = {
  onSuccess?: (payload: LoginPayload) => void;
};

export const useLoginForm = ({ onSuccess }: UseLoginFormOptions = {}): UseLoginFormReturn => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleRememberMe = () => {
    setRememberMe((previous) => !previous);
  };

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    setErrorMessage(null);

    const payload: LoginPayload = {
      email,
      password,
      rememberMe,
    };

    try {
      setIsSubmitting(true);
      const tokens = await loginUser({
        email: payload.email,
        password: payload.password,
      });

      saveAuthTokens(tokens, payload.rememberMe);
      toast.success("Sign in Success", {
        description: "Login successful",
        className: "!rounded-md !border !border-emerald-700 !bg-emerald-800 !text-emerald-50",
        descriptionClassName: "!text-emerald-100",
      });
      onSuccess?.(payload);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        toast.error("Login gagal", {
          description: error.message,
        });
      } else {
        setErrorMessage("Terjadi kesalahan saat login");
        toast.error("Login gagal", {
          description: "Terjadi kesalahan saat login",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    rememberMe,
    isSubmitting,
    errorMessage,
    setEmail,
    setPassword,
    toggleRememberMe,
    handleSubmit,
  };
};
