import { useState } from "react";

function ToggleButtons() {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <button
        onClick={toggleVisibility}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-150 ease-in-out"
      >
        Toggle Buttons
      </button>
      <div
        className={`grid grid-cols-2 gap-4 ${
          isVisible ? "animate-fadeIn" : "animate-fadeOut"
        }`}
      >
        <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-150 ease-in-out">
          Button 1
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-150 ease-in-out">
          Button 2
        </button>
      </div>
    </div>
  );
}

export default ToggleButtons;
