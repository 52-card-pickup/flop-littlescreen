import { forwardRef } from "react";
import cn from "~/utils/cn";

export const FlopMenuButtonIcon = forwardRef<
  HTMLDivElement,
  { open: boolean } & React.ComponentPropsWithoutRef<"div">
>(function FlopMenuButtonIcon({ open, ...props }, ref) {
  return (
    <div {...props} style={{ position: "relative" }} ref={ref}>
      <svg
        className="h-full w-full absolute"
        viewBox="0 0 134 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          className={cn(
            "transition-all duration-300 delay-100 ease-out",
            open ? "opacity-80" : "opacity-100"
          )}
          x={open ? 15 : 10}
          y={open ? 20 : 10}
          width="124"
          height="236"
          rx="62"
          fill="black"
        />
        <rect
          x="1"
          y="1"
          width="126"
          height="238"
          rx="63"
          fill="black"
          stroke="black"
          stroke-width="2"
        />
        <rect
          x="5"
          y="5"
          width="118"
          height="230"
          rx="59"
          fill="white"
          stroke="#007357"
          stroke-width="6"
        />
      </svg>
      <svg
        className="h-full w-full absolute"
        viewBox="0 0 134 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="2"
          y={open ? 8 : 114}
          className="transition-all duration-100 ease-in-out"
          width="124"
          height="124"
          rx="62"
          fill="#007357"
        />
        <path
          transform={open ? "rotate(180 64 64) translate(0 -114)" : ""}
          className={cn(
            "transition-all duration-100",
            open ? "text-watercourse-800" : "text-[#338F79]"
          )}
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M62.3648 54.8023C63.2679 53.8992 64.7321 53.8992 65.6352 54.8023L88.7602 77.9273C89.6633 78.8304 89.6633 80.2946 88.7602 81.1977C87.8571 82.1008 86.3929 82.1008 85.4898 81.1977L64 59.7079L42.5102 81.1977C41.6071 82.1008 40.1429 82.1008 39.2398 81.1977C38.3367 80.2946 38.3367 78.8304 39.2398 77.9273L62.3648 54.8023Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
});
