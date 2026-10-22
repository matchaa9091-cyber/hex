"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, CheckCircle, Loader2, Phone, Zap } from "lucide-react";
import Image from "next/image";

interface PaymentModalProps {
  applicationId: string;
  planAmount: number;
  planName: string;
  onVerified: () => void;
  onClose: () => void;
}

const PAYMENT_NUMBER = "0765040502";

export default function PaymentModal({
  applicationId,
  planAmount,
  planName,
  onVerified,
  onClose,
}: PaymentModalProps) {
  const [step, setStep] = useState<"choose" | "instructions" | "verify">("choose");
  const [method, setMethod] = useState<"mtn" | "airtel" | null>(null);
  const [payPhone, setPayPhone] = useState("");
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifiedSuccess, setVerifiedSuccess] = useState<string | null>(null);

  const handleChoose = (m: "mtn" | "airtel") => {
    setMethod(m);
    setStep("instructions");
  };

  // Instant automated verification via httpSMS
  const handleVerifyAutomatic = async () => {
    setError("");
    if (!payPhone.trim()) {
      setError("Please enter the phone number you used to send the payment.");
      return;
    }
    setLoading(true);

    try {
      // 1. Save phone & txId to application first
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: applicationId,
          payment_method: method,
          payment_phone: payPhone.trim(),
          transaction_id: txId.trim() || undefined,
          status: "pending_verification",
        }),
      });

      // 2. Call automatic verification endpoint (checks D1 and httpSMS API)
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          phone: payPhone.trim(),
          transactionId: txId.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok && data.verified) {
        setVerifiedSuccess(data.message || `Payment of UGX ${Number(data.amount || 20000).toLocaleString()} verified! Your profile is now live.`);
        setTimeout(() => {
          onVerified();
        }, 2200);
      } else {
        setError(data.message || "No payment of 20,000 UGX or above found for this number yet. If you just sent it, please wait 30 seconds and try again.");
      }
    } catch (err: any) {
      console.error("Automated verification error:", err);
      setError("Could not complete verification right now. You can try again or submit for admin review.");
    } finally {
      setLoading(false);
    }
  };

  // Fallback to manual admin review if SMS is delayed
  const handleSubmitManualReview = async () => {
    setError("");
    if (!payPhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: applicationId,
          payment_method: method,
          payment_phone: payPhone.trim(),
          transaction_id: txId.trim() || undefined,
          status: "pending_verification",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update application");
      }

      onVerified();
    } catch (err: any) {
      console.error("Verification submit error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Step 1 - Choose Method */}
        {step === "choose" && (
          <div className="text-center">
            <div className="text-4xl mb-3">📱</div>
            <h2 className="text-xl font-bold text-white mb-1">{planName} Plan - Payment</h2>
            <p className="text-gray-400 text-sm mb-1">
              Pay <span className="text-pink-400 font-bold">UGX {planAmount.toLocaleString()}</span> to activate your profile.
            </p>
            <p className="text-gray-500 text-xs mb-6">Your profile goes live in 5-10 minutes after confirmation.</p>
            <p className="text-gray-300 text-sm mb-4">Choose your payment method:</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleChoose("mtn")}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-yellow-400/40 bg-yellow-400/5 hover:bg-yellow-400/15 hover:border-yellow-400 transition-all overflow-hidden"
              >
                <div className="w-full aspect-video relative rounded-lg overflow-hidden mb-1">
                  <Image 
                    src="/assets/mtn-payment.jpg" 
                    alt="MTN MoMo" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <span className="text-yellow-400 font-bold text-xs uppercase tracking-wider">MTN MoMo</span>
              </button>
              <button
                onClick={() => handleChoose("airtel")}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-red-400/40 bg-red-400/5 hover:bg-red-400/15 hover:border-red-400 transition-all overflow-hidden"
              >
                <div className="w-full aspect-video relative rounded-lg overflow-hidden mb-1">
                  <Image 
                    src="/assets/airtel-payment.jpg" 
                    alt="Airtel Money" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <span className="text-red-400 font-bold text-xs uppercase tracking-wider">Airtel Money</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 2 - Instructions */}
        {step === "instructions" && method && (
          <div>
            <div className={`text-center mb-4 p-3 rounded-xl ${method === "mtn" ? "bg-yellow-400/10 border border-yellow-400/30" : "bg-red-400/10 border border-red-400/30"}`}>
              <p className="font-bold text-lg text-white">{method === "mtn" ? "MTN Mobile Money" : "Airtel Money"}</p>
              <p className="text-gray-300 text-sm">{planName} Plan – UGX {planAmount.toLocaleString()}</p>
            </div>

            <div className="space-y-3 mb-6 bg-gray-800/60 rounded-xl p-4">
              <p className="text-white font-semibold text-sm">Follow these steps:</p>
              {method === "mtn" ? (
                <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                  <li>Dial <span className="text-yellow-400 font-mono">*165#</span> on your MTN line</li>
                  <li>Select <strong>Send Money</strong></li>
                  <li>Send to number: <span className="text-yellow-400 font-bold">{PAYMENT_NUMBER}</span></li>
                  <li>Amount: <span className="text-white font-bold">UGX {planAmount.toLocaleString()}</span></li>
                  <li>Enter your PIN and confirm</li>
                  <li>Copy the <strong>Transaction ID</strong> from your SMS</li>
                </ol>
              ) : (
                <ol className="text-gray-300 text-sm space-y-2 list-decimal list-inside">
                  <li>Dial <span className="text-red-400 font-mono">*185#</span> on your Airtel line</li>
                  <li>Select <strong>Make Payments</strong></li>
                  <li>Send to number: <span className="text-red-400 font-bold">{PAYMENT_NUMBER}</span></li>
                  <li>Amount: <span className="text-white font-bold">UGX {planAmount.toLocaleString()}</span></li>
                  <li>Enter your PIN and confirm</li>
                  <li>Copy the <strong>Transaction ID</strong> from your SMS</li>
                </ol>
              )}
            </div>

            <Button className="w-full bg-pink-600 hover:bg-pink-700" onClick={() => setStep("verify")}>
              I've Made the Payment
            </Button>
            <button onClick={() => setStep("choose")} className="w-full mt-2 text-sm text-gray-400 hover:text-white transition-colors">
              Go back
            </button>
          </div>
        )}

        {/* Step 3 - Verify */}
        {step === "verify" && (
          <div>
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-semibold mb-2">
                <Zap className="h-3.5 w-3.5 fill-green-400" />
                Instant httpSMS Verification (20,000+ UGX)
              </div>
              <h2 className="text-xl font-bold text-white">Confirm Your Payment</h2>
              <p className="text-gray-400 text-xs mt-1">
                Enter the phone number you sent from. Our system automatically scans for the incoming SMS from MTN MoMo / Airtel Money.
              </p>
            </div>

            {verifiedSuccess ? (
              <div className="p-5 rounded-xl bg-green-500/20 border border-green-500/40 text-center animate-in fade-in zoom-in-95">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-green-300">Payment Verified!</h3>
                <p className="text-gray-200 text-sm mt-1">{verifiedSuccess}</p>
                <p className="text-gray-400 text-xs mt-3 flex items-center justify-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Redirecting you now...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300 text-sm flex items-center justify-between">
                    <span>Phone Number Used to Pay <span className="text-pink-400">*</span></span>
                    <span className="text-xs text-gray-500">e.g. 077... or 075...</span>
                  </Label>
                  <Input
                    value={payPhone}
                    onChange={(e) => setPayPhone(e.target.value)}
                    placeholder="e.g. 0771234567"
                    className="mt-1 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300 text-sm flex items-center justify-between">
                    <span>Transaction ID <span className="text-gray-500 font-normal">(from your SMS)</span></span>
                    <span className="text-xs text-gray-500">Optional</span>
                  </Label>
                  <Input
                    value={txId}
                    onChange={(e) => setTxId(e.target.value)}
                    placeholder="e.g. 18928374612 or MMT..."
                    className="mt-1 bg-gray-800 border-gray-600 text-white font-mono"
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300 text-xs leading-relaxed">
                    {error}
                  </div>
                )}

                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold shadow-lg shadow-green-600/30"
                  onClick={handleVerifyAutomatic}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Checking httpSMS Gateway...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2 fill-white" />
                      Verify Payment Instantly
                    </>
                  )}
                </Button>

                {error && (
                  <div className="pt-2 border-t border-gray-800 flex flex-col gap-2">
                    <p className="text-xs text-gray-400 text-center">
                      Network SMS delayed? You can submit your details for immediate manual review by admin:
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-gray-700 text-gray-300 hover:text-white"
                      onClick={handleSubmitManualReview}
                      disabled={loading}
                    >
                      Submit for Manual Admin Review
                    </Button>
                  </div>
                )}

                <button onClick={() => setStep("instructions")} className="w-full mt-1 text-sm text-gray-400 hover:text-white transition-colors">
                  Back to instructions
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}