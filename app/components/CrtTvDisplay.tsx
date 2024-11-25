import { useRef, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

export function CrtTvDisplay(props: {
  rotateMs?: number;
  children: React.ReactNode[] | React.ReactNode;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [glitching, setGlitching] = useState(false);

  // Generate CRT noise effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function snow() {
      const w = ctx!.canvas.width;
      const h = ctx!.canvas.height;
      const d = ctx!.createImageData(w, h);
      const b = new Uint32Array(d.data.buffer);
      const len = b.length;

      for (let i = 0; i < len; i++) {
        b[i] = ((255 * Math.random()) | 0) << 24;
      }

      ctx!.putImageData(d, 0, 0);
    }

    let frame: number;
    function animate() {
      snow();
      frame = requestAnimationFrame(animate);
    }

    // Start animation after a delay
    setTimeout(() => {
      setIsOn(true);
      animate();
    }, 1000);

    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Random glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance to glitch
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, []);

  // Cycle through screens
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % [props.children].flat().length);
    }, props.rotateMs || 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto aspect-video">
      {/* TV Frame */}
      <div className="absolute inset-0 bg-watercourse-950 rounded-lg p-1 shadow-2xl shadow-black/80">
        {/* Screen */}
        <div className="relative w-full h-full animate-tvOn">
          <div className="screen relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-b from-[#85908c] to-[#323431]">
            {/* Screen Content */}
            <div className="overlay relative w-full h-full select-none bg-zinc-900">
              <div className="w-full h-full animate-glitchLayer3">
                {[props.children].flat().map((child, idx) => (
                  <Transition
                    key={idx}
                    as="div"
                    show={currentScreen === idx}
                    enter="transition-opacity duration-1000"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-1000"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    className="absolute inset-0"
                    style={{ willChange: "transform" }}
                  >
                    {child}
                  </Transition>
                ))}
              </div>

              {/* Scanlines Effect */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full bg-scanline opacity-[0.15]" />
                <div
                  className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))]"
                  style={{ backgroundSize: "100% 2px, 3px 100%" }}
                />
              </div>

              {/* Noise Canvas */}
              <canvas
                ref={canvasRef}
                className="picture absolute inset-0 pointer-events-none w-full h-full opacity-[0.06]"
              />

              {/* Vignette Effect */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 100%)",
                }}
              />

              {/* Glitch Layers */}
              {glitching && (
                <>
                  <div
                    className="absolute inset-0 bg-[#00ffff] mix-blend-screen animate-glitchLayer1 opacity-[0.11]"
                    style={{ left: "2px" }}
                  />
                  <div
                    className="absolute inset-0 bg-[#ff00ff] mix-blend-screen animate-glitchLayer2 opacity-[0.11]"
                    style={{ left: "-2px" }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
