import { MouseEventHandler } from "react";
import cn from "~/utils/cn";

export type ButtonColor = "gray" | "blue" | "green" | "watercourse" | "red";
export type ButtonVariant = "solid" | "outline";

export default function FlopButton(props: {
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: React.ReactNode;
  color?: ButtonColor;
  variant?: ButtonVariant;
  slim?: boolean;
  className?: string;
}) {
  const { bg, bgBase, border, text } = colorClassNames(
    props.color || "gray",
    props.variant || "outline"
  );
  return (
    <div className={props.className} style={{ display: "flex" }}>
      <button
        className="relative inline-block text-lg w-full group disabled:opacity-50"
        type={props.type || "button"}
        disabled={props.disabled}
        onClick={props.onClick}
      >
        <span
          className={cn(
            "relative z-10 block overflow-hidden font-medium leading-tight",
            "transition-colors duration-300 ease-out border-2 rounded-md",
            props.slim ? "" : "px-6 py-3",
            border,
            text
          )}
        >
          <span
            className={cn("absolute inset-0 w-full h-full px-5 py-3", bgBase)}
          ></span>
          <span
            className={cn(
              "absolute left-0 w-96 h-96 -ml-2 transition-all duration-300 origin-top-right -rotate-90",
              "-translate-x-full translate-y-12 group-hover:-rotate-180 ease",
              props.disabled ? "" : "group-hover:-rotate-180",
              bg
            )}
          ></span>
          <span className="relative truncate">{props.children}</span>
        </span>
        <span
          className={cn(
            "absolute bottom-0 right-0 w-full h-12 -mb-1 -mr-1 transition-all duration-200 ease-linear",
            "rounded-md group-hover:mb-0 group-hover:mr-0",
            bg
          )}
        ></span>
      </button>
    </div>
  );
}

function colorClassNames(which: ButtonColor, variant: ButtonVariant) {
  switch (which) {
    case "gray":
      return {
        bg:
          variant === "outline"
            ? "bg-gray-900"
            : "bg-black group-hover:bg-gray-50",
        bgBase: variant === "outline" ? "bg-gray-50" : "bg-gray-900",
        border: "border-gray-900",
        text:
          variant === "outline"
            ? "text-gray-800 group-hover:text-white"
            : "text-gray-50 group-hover:text-black",
      };
    case "blue":
      return {
        bg:
          variant === "outline"
            ? "bg-blue-900"
            : "bg-black group-hover:bg-blue-50",
        bgBase: variant === "outline" ? "bg-gray-50" : "bg-blue-900",
        border: "border-blue-900",
        text:
          variant === "outline"
            ? "text-gray-800 group-hover:text-white"
            : "text-blue-50 group-hover:text-blue-900",
      };
    case "green":
      return {
        bg:
          variant === "outline"
            ? "bg-green-800"
            : "bg-black group-hover:bg-green-50",
        bgBase: variant === "outline" ? "bg-gray-50" : "bg-green-800",
        border: "border-green-800",
        text:
          variant === "outline"
            ? "text-gray-800"
            : "text-green-50 group-hover:text-green-800",
      };
    case "watercourse":
      return {
        bg:
          variant === "outline"
            ? "bg-watercourse-600"
            : "bg-black group-hover:bg-watercourse-50",
        bgBase: variant === "outline" ? "bg-gray-50" : "bg-watercourse-600",
        border: "border-black group-hover:border-watercourse-900",
        text:
          variant === "outline"
            ? "text-gray-800 group-hover:text-white"
            : "text-watercourse-50 group-hover:text-watercourse-900",
      };
    case "red":
      return {
        bg:
          variant === "outline"
            ? "bg-red-900"
            : "bg-black group-hover:bg-red-50",
        bgBase: variant === "outline" ? "bg-gray-50" : "bg-red-900",
        border: "border-red-900",
        text:
          variant === "outline"
            ? "text-gray-800 group-hover:text-white"
            : "text-red-50 group-hover:text-red-900",
      };
  }
}
