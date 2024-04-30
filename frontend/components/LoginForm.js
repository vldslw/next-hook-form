import SubmitButton from "@/components/SubmitButton";
import InputField from "@/components/InputField";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginForm() {
  const router = useRouter();
  const [step, setStep] = useState("email");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    trigger,
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    if (step === "email") {
      const result = await trigger("email");
      if (result) {
        setStep("password");
      }
    } else if (step === "password") {
      try {
        // мок успешного ответа от сервера на случай, если сервер не готов

        // const response = {
        //   ok: true,
        //   json: () =>
        //     new Promise((resolve) =>
        //       setTimeout(
        //         () =>
        //           resolve({
        //             token:
        //               "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzE0NDU0ODQ3LCJleHAiOjE3MTUwNTk2NDd9.uJR5dp3AbT7OTY0Ip66T-8aLIsDJ-bDgmGQVj9J1Wfs",
        //           }),
        //         1000
        //       )
        //     ),
        // };

        const response = await fetch("http://localhost:4000/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          if (responseData.message === "Validation failed") {
            setError("password", { message: "Ошибка валидации" });
            return;
          } else {
            setError("password", { message: responseData.message });
            return;
          }
        }
        if (responseData.token) {
          // в данном случае просто сохраняю получаемый с сервера токен в localStorage
          // и перехожу по роуту /logged с сообщением об успешном входе.
          // Защиту для роута прописывать не буду, так как это не требовалось в задании.
          // При выходе токен будет удаляться из localStorage
          localStorage.setItem("jwt", responseData.token);
          reset();
          router.push("/logged");
        } else {
          setError("password", {
            message: "Неверные данные или ошибка сервера",
          });
        }
      } catch (error) {
        setError("password", {
          message: `Произошла ошибка: ${error.message}`,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
      {step === "email" && (
        <>
          <h1 className="form__title">Войти</h1>
          <InputField
            type="email"
            label="Введите свою почту"
            register={register("email", {
              required: "Необходимо ввести почту",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Введите корректный формат почты",
              },
            })}
            errors={errors}
          />
        </>
      )}
      {step === "password" && (
        <>
          <h1 className="form__title">Добро пожаловать!</h1>
          <InputField
            type="password"
            label="Введите пароль"
            register={register("password", {
              required: "Необходимо ввести пароль",
            })}
            errors={errors}
          />
          <button className="form__back" onClick={() => setStep("email")}>
            &larr; Назад
          </button>
        </>
      )}
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
