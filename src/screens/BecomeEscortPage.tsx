"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Loader2, ChevronRight, Crown, Phone, Star, Zap, X, Sparkles } from "lucide-react";
import PaymentModal from "@/components/escort-apply/PaymentModal";

type Screen = "plan" | "form" | "success";
type Plan = "ordinary_week" | "vip_week" | "monthly";

interface PlanConfig {
  id: Plan;
  label: string;
  title: string;
  price: number;
  priceLabel: string;
  color: string;
  borderColor: string;
  btnClass: string;
  btnTextColor: string;
  accentColor: string;
  badge?: string;
}

const PLANS: PlanConfig[] = [
  {
    id: "ordinary_week",
    label: "Ordinary – Weekly",
    title: "Ordinary Week",
    price: 20000,
    priceLabel: "20,000 shs / week",
    color: "#22c55e",
    borderColor: "#22c55e50",
    btnClass: "bg-[#22c55e] hover:bg-[#16a34a] text-black shadow-md shadow-green-600/20",
    btnTextColor: "text-black",
    accentColor: "text-[#22c55e]",
  },
  {
    id: "vip_week",
    label: "VIP – Weekly",
    title: "VIP Week",
    price: 40000,
    priceLabel: "40,000 shs / week",
    color: "#E8B93D",
    borderColor: "#E8B93D40",
    btnClass: "bg-[#E8B93D] hover:bg-[#d4a533] text-black",
    btnTextColor: "text-black",
    accentColor: "text-[#E8B93D]",
    badge: "VIP",
  },
  {
    id: "monthly",
    label: "Full Month – Premium",
    title: "Full Month",
    price: 60000,
    priceLabel: "60,000 shs / month",
    color: "#F2367B",
    borderColor: "#F2367B40",
    btnClass: "bg-gradient-to-r from-[#F2367B] to-[#E8B93D] hover:opacity-90 text-[#1B0510]",
    btnTextColor: "text-[#1B0510]",
    accentColor: "text-[#F2367B]",
    badge: "Best Value",
  },
];

const BecomeEscortPage = () => {
  const [screen, setScreen] = useState<Screen>("plan");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("monthly");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{ amount: number; name: string }>({
    amount: 60000,
    name: "Full Month",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // VIP Boost modal state
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [boostName, setBoostName] = useState("");
  const [boostPhone, setBoostPhone] = useState("");
  const [boostLoading, setBoostLoading] = useState(false);
  const [boostError, setBoostError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    body_type: "",
    complexion: "",
    location: "",
    phone: "",
    whatsapp: "",
    short_bio: "",
    description: "",
    services: "Dating, Companionship",
    profileImage: "",
    images: [] as string[],
    videos: [] as string[],
  });

  const [showForm, setShowForm] = useState(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("escort_application_draft");
    if (savedDraft) {
      try {
        const { form: savedForm, plan: savedPlan, showForm: savedShowForm } = JSON.parse(savedDraft);
        if (savedForm) setForm(savedForm);
        if (savedPlan) setSelectedPlan(savedPlan);
        if (savedShowForm) setShowForm(savedShowForm);
      } catch (err) {
        console.error("Failed to load draft:", err);
      }
    }
  }, []);

  // Save to localStorage whenever form or plan changes
  useEffect(() => {
    if (screen === "success") return;
    const hasContent = form.name || form.phone || form.profileImage || form.images.length > 0;
    if (hasContent) {
      localStorage.setItem("escort_application_draft", JSON.stringify({ form, plan: selectedPlan, showForm }));
    }
  }, [form, selectedPlan, showForm, screen]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File, folder: string = "profile-images"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "gallery") => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        const url = await uploadFile(file, "profile-images");
        setForm((prev) => {
          if (type === "profile") {
            return { ...prev, profileImage: url, images: [url, ...prev.images.filter(i => i !== prev.profileImage)] };
          }
          return { ...prev, images: [...prev.images, url] };
        });
      }
    } catch (err: any) {
      setError(`Upload failed: ${err.message || "Try again."}`);
    }
    setUploading(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    setError("");
    try {
      for (const file of Array.from(files)) {
        if (file.size > 100 * 1024 * 1024) { setError("Video too large (max 100MB)."); continue; }
        const url = await uploadFile(file, "profile-images");
        setForm((prev) => ({ ...prev, videos: [...prev.videos, url] }));
      }
    } catch (err: any) {
      setError(`Video upload failed: ${err.message || "Try again."}`);
    }
    setUploading(false);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSubmitForm = async () => {
    setError("");
    if (!form.name.trim() || !form.phone.trim() || !form.location) {
      setError("Name, phone number, and location are required.");
      return;
    }
    if (!form.profileImage) {
      setError("Profile image is required.");
      return;
    }
    if (form.phone.trim().length < 9) {
      setError("Please enter a valid phone number.");
      return;
    }

    const planConfig = PLANS.find(p => p.id === selectedPlan)!;
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        age: form.age ? parseInt(form.age) : 20,
        height: form.height.trim() || null,
        body_type: form.body_type || null,
        complexion: form.complexion || null,
        location: form.location,
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim() || form.phone.trim(),
        short_bio: form.short_bio.trim() || null,
        description: form.description.trim() || null,
        services: form.services.split(",").map(s => s.trim()).filter(Boolean),
        status: "pending_payment",
        plan: selectedPlan,
        amount: planConfig.price,
        profile_image: form.profileImage,
        images: form.images,
        videos: form.videos,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || "Failed to submit application");

      setPaymentDetails({
        amount: planConfig.price,
        name: planConfig.label,
      });
      setApplicationId(data.id);
      setShowPaymentModal(true);
    } catch (err: any) {
      setError(`Failed to submit: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVipBoostSubmit = async () => {
    setBoostError("");
    if (!boostName.trim() || !boostPhone.trim()) {
      setBoostError("Please enter both your profile name and phone number.");
      return;
    }
    if (boostPhone.trim().length < 9) {
      setBoostError("Please enter a valid phone number (at least 9 digits).");
      return;
    }

    setBoostLoading(true);
    try {
      const payload = {
        name: boostName.trim(),
        phone: boostPhone.trim(),
        whatsapp: boostPhone.trim(),
        location: "Existing Profile",
        status: "pending_payment",
        plan: "vip_boost",
        amount: 10000,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.id) throw new Error(data.error || "Failed to submit boost request");

      setPaymentDetails({
        amount: 10000,
        name: "VIP Week Renewal Boost",
      });
      setApplicationId(data.id);
      setShowBoostModal(false);
      setShowPaymentModal(true);
    } catch (err: any) {
      setBoostError(`Failed to submit: ${err.message || "Please try again."}`);
    } finally {
      setBoostLoading(false);
    }
  };

  const handlePaymentVerified = () => {
    localStorage.removeItem("escort_application_draft");
    setShowPaymentModal(false);
    setScreen("success");
  };

  const planConfig = PLANS.find(p => p.id === selectedPlan)!;

  // ── SUCCESS SCREEN ─────────────────────────────────────────────────────────
  if (screen === "success") {
    return (
      <div className="container mx-auto px-4 py-12 lg:pl-72">
        <div className="lg:hidden h-16" />
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">🎉 Application Submitted!</h1>
          <p className="text-gray-300 mb-2">
            Your payment is being verified. Once confirmed, your profile will go live in{" "}
            <strong className="text-pink-400">5-10 minutes</strong>.
          </p>
          <p className="text-gray-400 text-sm mb-8">You'll receive a WhatsApp message when your profile is updated.</p>
          <Button className="bg-pink-600 hover:bg-pink-700 w-full" onClick={() => (window.location.href = "/")}>
            Go Back to Homepage
          </Button>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-300 font-medium mb-4">Chat with Support on WhatsApp for help</p>
            <a
              href="https://wa.me/256727240143"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-max mx-auto px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 transition-all font-bold"
            >
              <Phone className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN PAGE ──────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-6 lg:pl-72">
      <div className="lg:hidden h-16" />

      {showPaymentModal && applicationId && (
        <PaymentModal
          applicationId={applicationId}
          planAmount={paymentDetails.amount}
          planName={paymentDetails.name}
          onVerified={handlePaymentVerified}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      {/* VIP Boost Modal for Existing Listings */}
      {showBoostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-gray-900 border-2 border-yellow-400/60 rounded-2xl p-6 shadow-2xl shadow-yellow-500/10">
            <button
              onClick={() => setShowBoostModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 border border-yellow-400/50 flex items-center justify-center mx-auto mb-3">
                <Crown className="h-6 w-6 text-yellow-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Add VIP Week Renewal Boost</h2>
              <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                For profiles already listed on Escorts UG (Full Month Plan). Enter your profile details below to boost your listing to VIP for 7 days.
              </p>
            </div>

            {/* Price Badge */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/30 mb-4">
              <span className="text-xs font-semibold text-yellow-200 flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-yellow-400" /> 7 Days VIP Placement
              </span>
              <span className="text-base font-extrabold text-yellow-400">UGX 10,000</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-200 text-xs font-medium">Your Profile Name *</Label>
                <Input
                  value={boostName}
                  onChange={(e) => setBoostName(e.target.value)}
                  placeholder="e.g. Sandra"
                  className="mt-1.5 bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-400"
                />
              </div>

              <div>
                <Label className="text-gray-200 text-xs font-medium">Phone Number on That Profile *</Label>
                <Input
                  value={boostPhone}
                  onChange={(e) => setBoostPhone(e.target.value)}
                  placeholder="e.g. 0771234567"
                  className="mt-1.5 bg-gray-800/90 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-400"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-gray-800/60 border border-gray-700/50 text-[11px] text-gray-300 space-y-1">
                <div className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                  <Sparkles className="h-3.5 w-3.5" /> What happens next:
                </div>
                <p>1. Complete payment (UGX 10,000 via MTN MoMo or Airtel Money).</p>
                <p>2. Admin will verify and activate your VIP placement within 5-10 minutes.</p>
              </div>

              {boostError && (
                <div className="p-2.5 rounded-lg bg-red-900/30 border border-red-500/40 text-red-400 text-xs">
                  {boostError}
                </div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-extrabold py-5 text-sm shadow-lg shadow-yellow-500/20"
                onClick={handleVipBoostSubmit}
                disabled={boostLoading}
              >
                {boostLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Proceed to Payment (UGX 10,000)</>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Get your profile seen this week</h1>
          <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
            Pick a plan below and your profile goes live shortly after payment verification.
          </p>
        </div>

        {/* ── Plan Cards ── */}
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          {/* Card 1 — Ordinary Week (20k) — GREEN */}
          <div className="bg-[#0f1a13] border border-[#22c55e]/50 rounded-[18px] p-6 flex flex-col justify-between relative">
            <div>
              <div className="text-xs font-semibold text-[#22c55e] mb-1.5">Weekly plan</div>
              <h2 className="text-xl font-bold text-white mb-3">Ordinary Week</h2>
              <div className="text-3xl font-extrabold text-[#22c55e] mb-4">
                20,000 <span className="text-sm font-normal text-gray-400">shs / week</span>
              </div>
              <ul className="space-y-2 mb-5">
                {[
                  "Listed for 7 days",
                  "Searchable by location & category",
                  "Standard placement",
                  "Profile photo + gallery",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#B8A5AD]">
                    <CheckCircle className="h-4 w-4 text-[#22c55e] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan("ordinary_week")}
              className="w-full text-center bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-md shadow-green-600/20"
            >
              Get Ordinary Week
            </button>
          </div>

          {/* Card 2 — VIP Week (40k) */}
          <div className="bg-[#171215] border border-[#E8B93D]/40 rounded-[18px] p-6 flex flex-col justify-between relative">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="text-xs font-semibold text-[#E8B93D]">Weekly plan</div>
                <span className="text-[10px] font-bold bg-[#E8B93D] text-black px-1.5 py-0.5 rounded-full">VIP</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-3">VIP Week</h2>
              <div className="text-3xl font-extrabold text-[#E8B93D] mb-4">
                40,000 <span className="text-sm font-normal text-gray-400">shs / week</span>
              </div>
              <ul className="space-y-2 mb-5">
                {[
                  "Listed for 7 days",
                  "VIP badge on your profile",
                  "Top placement in listings",
                  "More eyes on your ad",
                  "Profile photo + gallery",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#B8A5AD]">
                    <Crown className="h-4 w-4 text-[#E8B93D] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => handleSelectPlan("vip_week")}
              className="w-full text-center bg-[#E8B93D] hover:bg-[#d4a533] text-black font-bold text-sm py-3.5 px-4 rounded-xl transition-all"
            >
              Get VIP Week
            </button>
          </div>

          {/* Card 3 — Full Month (60k) — Best Value + GLOW */}
          <div
            className="rounded-[18px] p-6 flex flex-col justify-between relative overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #1e0d16 0%, #171215 60%)",
              border: "2px solid rgba(242,54,123,0.7)",
              boxShadow: "0 0 32px 6px rgba(242,54,123,0.22), 0 0 64px 12px rgba(232,185,61,0.10)",
            }}
          >
            {/* Best Value ribbon */}
            <div className="absolute top-3 right-3 text-[10px] font-bold bg-gradient-to-r from-[#F2367B] to-[#E8B93D] text-[#1B0510] px-2.5 py-1 rounded-full shadow">
              Best Value
            </div>
            <div>
              <div className="text-xs font-semibold text-[#F2367B] mb-1.5">Monthly plan</div>
              <h2 className="text-xl font-bold text-white mb-3">Full Month</h2>
              <div className="text-3xl font-extrabold text-[#F2367B] mb-4">
                60,000 <span className="text-sm font-normal text-gray-400">shs / month</span>
              </div>

              {/* 4-week breakdown */}
              <div className="flex gap-1 mb-4">
                <div className="flex-1 text-center py-1.5 px-1 rounded-lg bg-[#E8B93D] text-[#1B0510] font-bold text-[10px]">
                  Week 1<span className="block font-normal">VIP</span>
                </div>
                {[2, 3, 4].map(w => (
                  <div key={w} className="flex-1 text-center py-1.5 px-1 rounded-lg bg-[#F2367B]/25 text-white font-semibold text-[10px]">
                    Week {w}<span className="block text-gray-300 font-normal">Ordinary</span>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 mb-4">
                {[
                  "Listed for full 30 days",
                  "Week 1 runs as VIP (top placement + badge)",
                  "Weeks 2–4 as standard ordinary listing",
                  "Profile photo, gallery & video clips",
                  "Searchable by location & category",
                ].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#B8A5AD]">
                    <Star className="h-4 w-4 text-[#F2367B] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* VIP Week Renewal Boost — gold button */}
              <div
                className="rounded-xl p-3 mb-1"
                style={{
                  background: "linear-gradient(135deg, rgba(232,185,61,0.13) 0%, rgba(232,185,61,0.06) 100%)",
                  border: "1.5px solid rgba(232,185,61,0.55)",
                  boxShadow: "0 0 14px 2px rgba(232,185,61,0.13)",
                }}
              >
                {/* Price row */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-[#E8B93D] shrink-0" />
                    <span className="text-sm font-bold text-[#E8B93D]">VIP Week Renewal Boost</span>
                  </div>
                  <span
                    className="text-base font-extrabold text-[#E8B93D] tracking-tight"
                    style={{ textShadow: "0 0 8px rgba(232,185,61,0.6)" }}
                  >
                    10,000 shs
                  </span>
                </div>

                {/* How it works */}
                <p className="text-[11px] text-gray-300 leading-snug mb-2.5">
                  Already on the Full Month plan? Boost <strong className="text-white">any ordinary week (2, 3 or 4)</strong> to VIP status — top placement + VIP badge — for just <strong className="text-[#E8B93D]">10,000 shs per week</strong>. Pay only for the weeks you want the extra visibility.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setBoostError("");
                    setBoostName("");
                    setBoostPhone("");
                    setShowBoostModal(true);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg font-bold text-sm text-black transition-all hover:opacity-90 cursor-pointer shadow-md"
                  style={{
                    background: "linear-gradient(90deg, #E8B93D 0%, #f5d060 100%)",
                    boxShadow: "0 2px 14px 2px rgba(232,185,61,0.35)",
                  }}
                >
                  <Zap className="h-4 w-4" />
                  Add VIP Boost — 10,000 shs / week
                </button>
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan("monthly")}
              className="w-full text-center font-bold text-sm py-3.5 px-4 rounded-xl transition-all mt-4"
              style={{
                background: "linear-gradient(90deg, #F2367B 0%, #E8B93D 100%)",
                boxShadow: "0 4px 18px 2px rgba(242,54,123,0.35)",
                color: "#1B0510",
              }}
            >
              Start Full Month
            </button>
          </div>
        </div>

        {/* ── Profile Creation Form ── */}
        {showForm && (
          <div ref={formRef}>
            <Card className="bg-gray-900/90 border-gray-800 text-white shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Create Your Profile — {planConfig.title}
                    </h2>
                    <p className="text-xs text-gray-400">Fill in your information to get listed on Escorts UG.</p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-xs text-pink-400 hover:text-pink-300 underline"
                  >
                    Close Form
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Main Profile Photo */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Main Profile Photo *</Label>
                    <div className="flex items-center gap-4">
                      {form.profileImage ? (
                        <img src={form.profileImage} alt="Profile" className="w-20 h-20 rounded-xl object-cover border-2 border-pink-500" />
                      ) : (
                        <div className="w-20 h-20 rounded-xl bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 text-xs">
                          No Photo
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, "profile")} />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : form.profileImage ? "Change Main Photo" : "Upload Main Photo"}
                      </Button>
                    </div>
                  </div>

                  {/* Gallery Photos */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Gallery Photos (Optional)</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {form.images.map((img, i) => (
                          <div key={i} className="relative">
                            <img src={img} className="w-16 h-16 rounded-lg object-cover" />
                            <button
                              onClick={() => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }))}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >x</button>
                          </div>
                        ))}
                      </div>
                      <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleImageUpload(e, "gallery")} />
                      <Button type="button" variant="outline" size="sm" onClick={() => galleryInputRef.current?.click()} disabled={uploading}>
                        {uploading ? "Uploading..." : "+ Add Gallery Photos"}
                      </Button>
                    </div>
                  </div>

                  {/* Videos */}
                  <div className="space-y-3">
                    <Label className="text-white font-medium">Short Video Clips (Optional)</Label>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {form.videos.map((vid, i) => (
                          <div key={i} className="relative">
                            <video src={vid} className="w-24 h-16 rounded object-cover" />
                            <button
                              onClick={() => setForm(f => ({ ...f, videos: f.videos.filter((_, idx) => idx !== i) }))}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >x</button>
                          </div>
                        ))}
                      </div>
                      <input ref={videoInputRef} type="file" accept="video/*" multiple className="hidden" onChange={handleVideoUpload} />
                      <Button type="button" className="bg-pink-600 hover:bg-pink-700 text-white" size="sm" onClick={() => videoInputRef.current?.click()} disabled={uploading}>
                        {uploading ? "Uploading..." : "Add Videos"}
                      </Button>
                      <p className="text-xs text-muted-foreground">Max 100MB per video. MP4, WebM, MOV supported.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label>Display Name *</Label>
                      <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="The name clients will see (e.g. Sandra)" />
                    </div>
                    <div className="space-y-2">
                      <Label>Age</Label>
                      <Input type="number" min={18} max={60} value={form.age} onChange={(e) => handleChange("age", e.target.value)} placeholder="Must be 18+" />
                    </div>
                    <div className="space-y-2">
                      <Label>Height</Label>
                      <Input value={form.height} onChange={(e) => handleChange("height", e.target.value)} placeholder="e.g. 5'6&quot;" />
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input value={form.location} onChange={(e) => handleChange("location", e.target.value)} placeholder="e.g. Kampala, Najjera" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="e.g. 0771234567" />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp (if different)</Label>
                      <Input value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} placeholder="Leave blank if same as above" />
                    </div>
                    <div className="space-y-2">
                      <Label>Body Type</Label>
                      <Select value={form.body_type} onValueChange={(v) => handleChange("body_type", v)}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {["Slim", "Athletic", "Curvy", "Thick", "Plus Size"].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Complexion</Label>
                      <Select value={form.complexion} onValueChange={(v) => handleChange("complexion", v)}>
                        <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {["Light", "Brown", "Dark", "Chocolate", "Caramel"].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Short Bio (shown on profile card)</Label>
                      <Input value={form.short_bio} maxLength={100} onChange={(e) => handleChange("short_bio", e.target.value)} placeholder="One sentence about yourself (max 100 chars)" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>About You (full description)</Label>
                      <Textarea value={form.description} onChange={(e) => handleChange("description", e.target.value)} placeholder="Tell clients more about your personality, availability, etc." rows={4} />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Services (comma-separated)</Label>
                      <Input value={form.services} onChange={(e) => handleChange("services", e.target.value)} placeholder="e.g. Dating, Companionship, Massage" />
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/30 text-red-400 text-sm">{error}</div>
                  )}

                  {/* Plan Summary */}
                  <div
                    className="p-3 rounded-lg border text-sm"
                    style={{
                      borderColor: selectedPlan === "ordinary_week" ? "rgba(34,197,94,0.4)" : selectedPlan === "vip_week" ? "rgba(232,185,61,0.4)" : "rgba(242,54,123,0.4)",
                      backgroundColor: selectedPlan === "ordinary_week" ? "rgba(34,197,94,0.1)" : selectedPlan === "vip_week" ? "rgba(232,185,61,0.1)" : "rgba(242,54,123,0.1)",
                      color: selectedPlan === "ordinary_week" ? "#4ade80" : selectedPlan === "vip_week" ? "#facc15" : "#f472b6",
                    }}
                  >
                    <strong>{planConfig.label}</strong>
                    {" – UGX "}{planConfig.price.toLocaleString()}
                    {" · "}Goes live in <strong>5-10 minutes</strong>
                  </div>

                  <Button
                    className={`w-full font-bold py-6 text-base ${planConfig.btnClass}`}
                    onClick={handleSubmitForm}
                    disabled={loading || uploading}
                  >
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</>
                    ) : (
                      <>Continue to Payment (UGX {planConfig.price.toLocaleString()}) <ChevronRight className="ml-2 h-4 w-4" /></>
                    )}
                  </Button>

                  <div className="mt-8 pt-6 border-t border-gray-700 text-center">
                    <p className="text-gray-300 font-medium mb-4">Chat with Support on WhatsApp for help</p>
                    <a
                      href="https://wa.me/256727240143"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-max mx-auto px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 transition-all font-bold"
                    >
                      <Phone className="h-5 w-5" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BecomeEscortPage;