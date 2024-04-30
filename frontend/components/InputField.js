import Image from "next/image";
import { useState } from "react";
import hideIcon from "../public/icons/hide-eye.svg";
import showIcon from "../public/icons/show-eye.svg";

export default function InputField({ type, register, errors, label }) {
  const [visibility, setVisibility] = useState(type);

  const toggleInputVisibility = () => {
    if (visibility === "text") {
      setVisibility("password");
    } else {
      setVisibility("text");
    }
  };

  return (
    <div className="input-field">
      <input
        {...register}
        type={visibility}
        className={`input-field__input ${
          errors[type] ? "input-field__input_error" : ""
        }`}
        name={type}
        id={type}
      />
      {type === "password" && (
        <Image
          className="input-field__input-hidebutton"
          src={visibility === "password" ? hideIcon : showIcon}
          alt="Show / hide password button"
          onClick={() => toggleInputVisibility()}
          width={24}
          height={24}
        />
      )}
      {errors[type] ? (
        <span className="input-field__error">{errors[type].message}</span>
      ) : (
        <label htmlFor={type} className="input-field__label">
          {label}
        </label>
      )}
    </div>
  );
}
