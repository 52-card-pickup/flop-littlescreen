import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import DesktopLanding from "~/components/DesktopLanding";
import { useDeviceType } from "~/hooks/useDeviceType";

export default function Home() {
  const navigate = useNavigate();
  const { isDesktopOrLandscape, isLoading } = useDeviceType();

  // Redirect mobile/portrait users to the game
  useEffect(() => {
    if (!isLoading && !isDesktopOrLandscape) {
      navigate("/");
    }
  }, [isDesktopOrLandscape, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-mystic-50">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-watercourse-600"></div>
      </div>
    );
  }

  return <DesktopLanding />;
}
