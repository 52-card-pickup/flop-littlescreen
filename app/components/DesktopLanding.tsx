import { useRef, useState } from "react";
import FlopBrandLogoText from "./FlopBrandLogoText";
import { useBigScreenUrl } from "~/hooks/useBigScreenUrl";
import { CrtTvDisplay } from "./CrtTvDisplay";
import { FlopQRCode } from "./FlopQRCode";

export default function DesktopLanding() {
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const howItWorksSectionRef = useRef<HTMLDivElement>(null);

  const bigScreen = useBigScreenUrl();
  const bigScreenUrl = bigScreen.url.toString();

  function LittleScreenLink() {
    return (
      <a
        href="https://flop.party"
        className="text-watercourse-800 font-medium hover:underline"
        onClick={(e) => {
          e.preventDefault();
          setShowMobileWarning(true);
        }}
      >
        flop.party
      </a>
    );
  }

  function BigScreenLink() {
    return (
      <a
        href={bigScreenUrl}
        target="_blank"
        rel="noreferrer"
        className="text-watercourse-800 font-medium hover:underline"
      >
        {bigScreen.displayUrl}
      </a>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mystic-50 to-watercourse-50">
      {/* Hero Section */}
      <header className="container mx-auto px-8 py-16 grid grid-cols-2 gap-16 min-h-screen">
        <div className="flex flex-col justify-center relative">
          <div className="w-48 mb-8 top-12">
            <FlopBrandLogoText className="w-full h-auto opacity-90" />
          </div>
          <h1 className="text-5xl font-bold text-watercourse-900 mb-6">
            it's poker night, reinvented
          </h1>
          <p className="text-2xl text-watercourse-800 mb-12 max-w-96">
            host an amazing night of fun with just your phones and a TV.
          </p>
          <div className="flex gap-4">
            <a href={bigScreenUrl} target="_blank" rel="noreferrer">
              <button className="border-2 border-transparent bg-watercourse-600 text-white px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-700 transition-colors">
                Go to Big Screen
              </button>
            </a>
            <button
              className="border-2 border-watercourse-600 text-watercourse-600 px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-50 transition-colors"
              onClick={() =>
                howItWorksSectionRef.current?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <LandingCtrDisplay />
        </div>
      </header>

      {/* How It Works */}
      <section className="bg-white/50 py-24" ref={howItWorksSectionRef}>
        <div className="container mx-auto px-8">
          <h2 className="text-4xl font-bold text-center text-watercourse-900 mb-16">
            how it works
          </h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-watercourse-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold uppercase text-watercourse-800 mb-2">
                Get Friends Together
              </h3>
              <p className="text-watercourse-700">
                Invite your friends over for a poker night. All they need is
                their phones!
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-watercourse-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold uppercase text-watercourse-800 mb-2">
                Connect the Big Screen
              </h3>
              <p className="text-watercourse-700">
                Open <BigScreenLink /> on your TV, projector, or monitor
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-watercourse-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold uppercase text-watercourse-800 mb-2">
                Join the Game
              </h3>
              <p className="text-watercourse-700">
                Now everyone can join the game on their phones at{" "}
                <LittleScreenLink />!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold text-watercourse-900 mb-8">
                why flop poker?
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-watercourse-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-watercourse-800 mb-2">
                      no setup required
                    </h3>
                    <p className="text-watercourse-700">
                      Forget about dealing cards or managing chips. Just grab
                      your phones and start playing!
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-watercourse-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-watercourse-800 mb-2">
                      beautiful big screen experience
                    </h3>
                    <p className="text-watercourse-700">
                      Watch the action unfold on your TV with our stunning
                      visual design
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-watercourse-600 rounded-full flex-shrink-0 mt-1"></div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-watercourse-800 mb-2">
                      perfect for any group
                    </h3>
                    <p className="text-watercourse-700">
                      Whether you're poker pros or first-time players, Flop
                      makes it easy and fun
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-watercourse-600 to-watercourse-800 transform rotate-3 rounded-lg"></div>
                <div className="relative bg-white p-8 rounded-lg shadow-xl">
                  <h3 className="text-2xl font-bold text-watercourse-900 mb-6">
                    ready to play?
                  </h3>
                  <p className="text-watercourse-700 mb-4">
                    Open <LittleScreenLink /> on your phone to get started, or
                    scan the QR code when you're ready to play!
                  </p>
                  <FlopQRCode className="w-48 mx-auto mb-4" />
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowMobileWarning(true)}
                      className="bg-watercourse-600 text-white px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-700 transition-colors"
                    >
                      Open Mobile Version
                    </button>
                    <button
                      className="border-2 border-watercourse-600 text-watercourse-600 px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-50 transition-colors"
                      onClick={() =>
                        howItWorksSectionRef.current?.scrollIntoView({
                          behavior: "smooth",
                        })
                      }
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Warning Modal */}
      {showMobileWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h3 className="text-2xl font-bold uppercase text-watercourse-900 mb-4">
              ⚠️ Designed for Mobile
            </h3>
            <p className="text-watercourse-700 mb-6">
              This game is designed for mobile devices in portrait orientation.
              The experience might not be optimal on a desktop browser.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "/game")}
                className="bg-watercourse-600 text-white px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-700 transition-colors"
              >
                Continue Anyway
              </button>
              <button
                onClick={() => setShowMobileWarning(false)}
                className="border-2 border-watercourse-600 text-watercourse-600 px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LandingCtrDisplay() {
  return (
    <CrtTvDisplay rotateMs={6_000}>
      {/* <div className="flex items-center justify-center h-full">
        <FlopBrandLogoText className="w-48 mix-blend-screen animate-bobUpDown" />
      </div> */}
      <div className="flex items-center justify-center h-full bg-zinc-900">
        <img
          src="/assets/landing/screenshots/big-screen-preview.png"
          alt="TV Screen Preview"
          className="w-full h-full object-contain"
        />
      </div>
      {/* <div className="flex items-center justify-center h-full bg-white">
        <img
          src="/assets/landing/screenshots/mobile-home-screenshot.png"
          alt="Mobile App Preview"
          className="w-2/3 h-full object-cover transition-all duration-1000 ease-out transform object-[0%_50%]"
        />
      </div> */}
      <div className="flex items-center justify-center h-full p-2">
        <div className="border-8 border-black rounded-[1rem] p-1 bg-watercourse-900 shadow-xl shadow-black/60 h-full">
          <img
            src="/assets/landing/screenshots/mobile-home-screenshot.png"
            alt="Mobile App Preview"
            className="w-full h-full rounded-[0.25rem]"
          />
        </div>
      </div>
      <div className="flex items-center justify-center h-full bg-zinc-900">
        <img
          src="/assets/landing/screenshots/big-screen-e2e-preview.png"
          alt="TV Screen Preview"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex items-center justify-center h-full p-2">
        <div className="border-8 border-black rounded-[1rem] p-1 bg-watercourse-900 shadow-xl shadow-black/60 h-full">
          <img
            src="/assets/landing/screenshots/mobile-active-hand-screenshot.png"
            alt="Mobile App Preview"
            className="w-full h-full rounded-[0.25rem]"
          />
        </div>
      </div>
    </CrtTvDisplay>
  );
}
