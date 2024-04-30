"use client";

import Link from "next/link";

export default function Logged() {
  return (
    <main className="main">
      <div className="logged">
        <h1 className="logged__title">Вы успешно вошли!</h1>
        <Link
          className="logged__button"
          href="/"
          onClick={() => localStorage.removeItem("jwt")}
        >
          Выйти
        </Link>
      </div>
    </main>
  );
}
