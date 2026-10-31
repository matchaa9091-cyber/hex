"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Lock, Loader2, X, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasscodeModal({ isOpen, onClose }: PasscodeModalProps) {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");

    const clean = passcode.trim();
    if (!clean) {
      setError("Please enter your passcode.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profiles/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: clean }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.profile) {
        setError(data.error || "Incorrect passcode. Please try again.");
        setLoading(false);
        return;
      }

      // Store authenticated session
      try {
        localStorage.setItem(
          "hx_edit_session",
          JSON.stringify({
            profileId: data.profile.id,
            passcode: clean,
            name: data.profile.name,
            timestamp: Date.now(),
          })
        );
      } catch {
        // localStorage might be disabled
      }

      onClose();
      // Navigate to the user's profile with manage parameter
      const targetSlug = data.profile.slug || data.profile.id;
      router.push(`/profile/${targetSlug}?manage=true`);
    } catch (err: any) {
      setError(err?.message || "Failed to verify passcode. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-pink-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl shadow-pink-950/50">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/50 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <KeyRound className="h-7 w-7 text-pink-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Edit My Profile
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">
            Enter the secret passcode you set when submitting your application to manage and edit your profile.
          </p>
        </div>

        {/* Passcode Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-pink-400" /> Your Secret Passcode
            </label>
            <Input
              type="text"
              autoFocus
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter your passcode..."
              className="bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 focus:border-pink-500 text-base py-5 tracking-wide rounded-xl"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs leading-relaxed animate-in fade-in">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:opacity-95 text-white font-bold py-5 text-sm rounded-xl shadow-lg shadow-pink-600/30 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Verifying Passcode...
              </>
            ) : (
              <>
                Verify &amp; Edit Profile <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Help link */}
          <div className="pt-3 border-t border-gray-800/80 text-center text-xs text-gray-400">
            Forgot your passcode?{" "}
            <a
              href="https://wa.me/256727240143?text=Hello%20Hex%20Escorts%20Support,%20I%20forgot%20my%20profile%20edit%20passcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 hover:text-pink-300 font-medium underline inline-flex items-center gap-1"
            >
              Contact Support on WhatsApp
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
