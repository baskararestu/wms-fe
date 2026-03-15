import { useState } from "react";
import type { FormEvent } from "react";

import type { LoginPayload } from "../../../entities/user/model/types";

type UseLoginFormReturn = {
  email: string;
  password: string;
  rememberMe: boolean;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  toggleRememberMe: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const useLoginForm = (): UseLoginFormReturn => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const toggleRememberMe = () => {
    setRememberMe((previous) => !previous);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: LoginPayload = {
      email,
      password,
      rememberMe,
    };

    console.log("Login submit payload:", payload);
  };

  return {
    email,
    password,
    rememberMe,
    setEmail,
    setPassword,
    toggleRememberMe,
    handleSubmit,
  };
};
