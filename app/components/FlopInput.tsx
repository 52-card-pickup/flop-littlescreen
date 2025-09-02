import cn from "~/utils/cn";

export type ButtonColor = "gray" | "blue" | "green" | "watercourse" | "red";

export default function FlopInput(props: {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  color?: ButtonColor;
  className?: string;
  inputClassName?: string;
}) {
  const { bg, bgBase, border, text } = colorClassNames(
    props.color || "gray",
    "outline"
  );
  return (
    <div
      aria-label="FlopInput"
      className={props.className}
      style={{ display: "flex" }}
    >
      <div className="relative inline-block w-full group disabled:opacity-50">
        <span
          className={cn(
            "relative z-10 overflow-hidden leading-tight",
            "transition-colors duration-300 ease-out border-2 rounded-md",
            "grid",
            border,
            text
          )}
        >
          <span
            className={cn("absolute inset-0 w-full h-full px-5 py-4", bgBase)}
          ></span>
          <span
            className={cn(
              "absolute left-0 w-96 h-96 -ml-2 transition-all duration-300 origin-top-right -rotate-90",
              "-translate-x-full translate-y-14 group-hover:-rotate-180 ease",
              props.disabled ? "" : "group-hover:-rotate-180",
              bg
            )}
          ></span>
          <input
            className={cn(
              "relative truncate w-full h-full px-5 py-4 bg-transparent",
              "border-transparent focus:border-transparent focus:ring-0 placeholder:group-hover:text-zinc-200",
              props.inputClassName || ""
            )}
            readOnly={props.readonly}
            disabled={props.disabled}
            name={props.name}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange?.(e.target.value)}
          />
        </span>
        <span
          className={cn(
            "absolute bottom-0 right-0 w-full h-14 -mb-1 -mr-1 transition-all duration-200 ease-linear",
            "rounded-md group-hover:mb-0 group-hover:mr-0",
            bg
          )}
        ></span>
      </div>
    </div>
  );
}

function colorClassNames(which: ButtonColor, variant: "solid" | "outline") {
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
