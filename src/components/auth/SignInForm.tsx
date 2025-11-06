import "@styles/dashboard.css";

import Icon from "@components/common/Icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

type SignInFormProps = {
  onSwitch?: () => void;
};

export default function SignInForm(props: SignInFormProps = {}) {
  const { onSwitch } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const startGoogleSignIn = () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/api/auth/signin";

    const providerInput = document.createElement("input");
    providerInput.type = "hidden";
    providerInput.name = "provider";
    providerInput.value = "google";

    form.appendChild(providerInput);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await fetch("/api/auth/signin", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Sign-in failed");
      }

      if (response.redirected) {
        window.location.href = response.url;
        return;
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="register-form">
      <button type="button" className="register-oauth-button" onClick={startGoogleSignIn} disabled={isSubmitting}>
        <span className="register-oauth-icon" aria-hidden="true">
          <Icon name="google" size={20} strokeWidth={0} />
        </span>
        <span>Continua con Google</span>
      </button>

      <div className="register-divider" role="presentation">
        <span className="register-divider__line" aria-hidden="true" />
        <span className="register-divider__label">Oppure usa le credenziali del team</span>
        <span className="register-divider__line" aria-hidden="true" />
      </div>
      <div className="register-field">
        <label htmlFor="email" className="register-label">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className={`register-input${errors.email ? "register-input--error" : ""}`}
          placeholder="you@example.com"
          disabled={isSubmitting}
        />
        <p
          className={`register-feedback${emailError ? "register-feedback--error" : ""}`}
          role={emailError ? "alert" : undefined}
          aria-live="polite"
        >
          {emailError ?? " "}
        </p>
      </div>

      <div className="register-field">
        <label htmlFor="password" className="register-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className={`register-input${errors.password ? "register-input--error" : ""}`}
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        <p
          className={`register-feedback${passwordError ? "register-feedback--error" : ""}`}
          role={passwordError ? "alert" : undefined}
          aria-live="polite"
        >
          {passwordError ?? " "}
        </p>
      </div>

      {submitError && <div className="register-alert register-alert--error">{submitError}</div>}

      <button type="submit" disabled={isSubmitting} className="register-submit">
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>

      <p className="register-footer">
        Non hai un account?{" "}
        {onSwitch ? (
          <button type="button" onClick={onSwitch} className="register-link">
            Crea il team
          </button>
        ) : (
          <a href="/login#register" className="register-link">
            Crea il team
          </a>
        )}
      </p>
    </form>
  );
}
