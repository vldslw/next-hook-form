"use client";

import Image from "next/image";

import { useState } from "react";
import { useForm } from "react-hook-form";
import hideIcon from "../public/icons/hide-eye.svg";
import showIcon from "../public/icons/show-eye.svg";

export default function Home() {
  const [step, setStep] = useState("email");
  const [visibility, setVisibility] = useState("password");

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

        console.log(responseData);

        reset();
      } catch (error) {
        setError("password", {
          message: "Ошибка соединения",
        });
      }
    }
  };

  const toggleInputVisibility = () => {
    if (visibility === "text") {
      setVisibility("password");
    } else {
      setVisibility("text");
    }
  };

  return (
    <main className="main">
      <form onSubmit={handleSubmit(onSubmit)} className="form" noValidate>
        {step === "email" && (
          <>
            <h1 className="form__title">Войти</h1>
            <div className="form__input-group">
              <input
                {...register("email", {
                  required: "Необходимо ввести почту",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Введите корректный формат почты",
                  },
                })}
                type="email"
                className={`form__input ${
                  errors.email ? "form__input_error" : ""
                }`}
                name="email"
                id="email"
              />
              {errors.email ? (
                <span className="form__error">{errors.email.message}</span>
              ) : (
                <label htmlFor="email" className="form__label">
                  Введите свою почту
                </label>
              )}
            </div>
          </>
        )}
        {step === "password" && (
          <>
            <h1 className="form__title">Добро пожаловать!</h1>
            <div className="form__input-group">
              <input
                {...register("password", {
                  required: "Необходимо ввести пароль",
                })}
                type={visibility}
                className={`form__input ${
                  errors.password ? "form__input_error" : ""
                }`}
                name="password"
                id="password"
              />
              <Image
                className="form__input-hidebutton"
                src={visibility === "password" ? hideIcon : showIcon}
                alt="Show / hide password button"
                onClick={() => toggleInputVisibility()}
                width={24}
                height={24}
              />
              {errors.password ? (
                <span className="form__error">{errors.password.message}</span>
              ) : (
                <label htmlFor="password" className="form__label">
                  Введите пароль
                </label>
              )}
            </div>
            <button className="form__back" onClick={() => setStep("email")}>
              &larr; Назад
            </button>
          </>
        )}
        <button disabled={isSubmitting} type="submit" className="form__button">
          Далее
        </button>
      </form>
    </main>
  );
}
