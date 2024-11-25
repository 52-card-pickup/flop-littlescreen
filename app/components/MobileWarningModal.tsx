import { DesktopModal } from "./DesktopModal";

export function MobileWarningModal({
  show,
  onClose,
  onContinue,
}: {
  show: boolean;
  onClose: () => void;
  onContinue: () => void;
}) {
  return (
    <DesktopModal show={show} onClose={onClose}>
      <h3 className="text-2xl font-bold uppercase text-watercourse-900 mb-4">
        ⚠️ Designed for Mobile
      </h3>
      <p className="text-watercourse-700 mb-6">
        This game is designed for mobile devices in portrait orientation. The
        experience might not be optimal on a desktop browser.
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onContinue}
          className="bg-watercourse-600 text-white px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-700 transition-colors"
        >
          Continue Anyway
        </button>
        <button
          onClick={onClose}
          className="border-2 border-watercourse-600 text-watercourse-600 px-6 py-3 rounded-lg font-semibold uppercase hover:bg-watercourse-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    </DesktopModal>
  );
}
