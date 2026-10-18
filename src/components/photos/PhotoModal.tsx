import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoUrl: string;
  photoTitle?: string;
}

export function PhotoModal({ isOpen, onClose, photoUrl, photoTitle }: PhotoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border border-pink-500/30 overflow-hidden sm:rounded-2xl shadow-2xl shadow-pink-500/10 [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">
          {photoTitle || 'Photo viewer'}
        </DialogTitle>
        <div className="relative flex flex-col items-center justify-center p-2 sm:p-4 min-h-[50vh]">
          {/* Prominent Pink Circular Close Button in Top-Right Corner */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-50 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-pink-600 hover:bg-pink-700 active:scale-90 text-white shadow-xl shadow-pink-600/50 border-2 border-pink-400 transition-all cursor-pointer"
            title="Close image"
            aria-label="Close image"
          >
            <X className="h-6 w-6 stroke-[3]" />
          </button>

          <img
            src={photoUrl}
            alt={photoTitle || 'Photo'}
            className="w-full max-h-[80vh] object-contain rounded-lg"
          />

          {/* Bottom Pink Close Pill Button for quick thumb-reach on mobile */}
          <div className="mt-3 flex justify-center w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-6 py-2 rounded-full bg-pink-600 hover:bg-pink-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-600/40 border border-pink-400/40 transition-all cursor-pointer"
            >
              <X className="h-4 w-4 stroke-[2.5]" />
              Close Image
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
