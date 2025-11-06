import "@styles/dashboard.css";

import Icon from "@components/common/Icon";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Define the validation schema with Zod
const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  onSwitch?: () => void;
};

export default function RegisterForm(props: RegisterFormProps = {}) {
  const { onSwitch } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const startGoogleRegistration = () => {
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
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const emailError = errors.email?.message;
  const passwordError = errors.password?.message;
  const confirmPasswordError = errors.confirmPassword?.message;

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Registration failed");
      }

      setSubmitSuccess(true);
      reset();

      // API issues the redirect; mirror it client-side when using fetch
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
      <button type="button" className="register-oauth-button" onClick={startGoogleRegistration} disabled={isSubmitting}>
        <span className="register-oauth-icon" aria-hidden="true">
          <Icon name="google" size={20} strokeWidth={0} />
        </span>
        <span>Continua con Google</span>
      </button>

      <div className="register-divider" role="presentation">
        <span className="register-divider__line" aria-hidden="true" />
        <span className="register-divider__label">Oppure usa la tua email universitaria</span>
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

      <div className="register-field">
        <label htmlFor="confirmPassword" className="register-label">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className={`register-input${errors.confirmPassword ? "register-input--error" : ""}`}
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        <p
          className={`register-feedback${confirmPasswordError ? "register-feedback--error" : ""}`}
          role={confirmPasswordError ? "alert" : undefined}
          aria-live="polite"
        >
          {confirmPasswordError ?? " "}
        </p>
      </div>

      {submitError && <div className="register-alert register-alert--error">{submitError}</div>}

      {submitSuccess && (
        <div className="register-alert register-alert--success">Registration successful! Redirecting to sign in...</div>
      )}

      <button type="submit" disabled={isSubmitting} className="register-submit">
        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      <p className="register-footer">
        Hai già un account?{" "}
        {onSwitch ? (
          <button type="button" onClick={onSwitch} className="register-link">
            Accedi
          </button>
        ) : (
          <a href="/login#signin" className="register-link">
            Accedi
          </a>
        )}
      </p>
    </form>
  );
}
