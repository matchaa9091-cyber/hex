"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, RefreshCw, Phone, MapPin, User, Crown, Zap } from "lucide-react";

type Application = {
  id: string;
  name: string;
  age: number | null;
  location: string;
  phone: string;
  whatsapp?: string | null;
  short_bio: string | null;
  body_type: string | null;
  complexion: string | null;
  payment_method: string | null;
  payment_phone: string | null;
  transaction_id: string | null;
  status: string;
  plan: string;
  profile_image: string | null;
  images: string[];
  videos: string[];
  created_at: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending_payment:      { label: "Pending Payment",       color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  pending_verification: { label: "Payment Submitted",     color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  approved:             { label: "Approved & Live",       color: "bg-green-500/20 text-green-400 border-green-500/30" },
  rejected:             { label: "Rejected",              color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

type FilterKey = "pending_verification" | "pending_payment" | "vip_boosts" | "approved" | "rejected" | "all";

export default function ApplicationsPanel() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("pending_verification");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        const all = Array.isArray(data) ? data : [];
        setAllApps(all);
        applyFilter(filter, all);
      }
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (f: FilterKey, source: Application[]) => {
    if (f === "all") {
      setApplications(source);
    } else if (f === "vip_boosts") {
      setApplications(source.filter(a => a.plan === "vip_boost" || a.plan === "vip"));
    } else {
      setApplications(source.filter(a => a.status === f));
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleFilterChange = (f: FilterKey) => {
    setFilter(f);
    applyFilter(f, allApps);
  };

  const handleApprove = async (app: Application) => {
    setActionLoading(app.id);
    try {
      const profilePayload = {
        name: app.name,
        age: app.age || 20,
        location: app.location || "Kampala",
        phone: app.phone,
        whatsapp: app.whatsapp || app.phone,
        short_bio: app.short_bio || "",
        body_type: app.body_type || "Slim",
        complexion: app.complexion || "Medium",
        profile_image: app.profile_image || "/placeholder.svg",
        images: app.images || [],
        videos: app.videos || [],
        is_archived: false,
        is_pinned: app.plan === "monthly" || app.plan === "vip" || app.plan === "vip_boost",
        is_vip: app.plan === "monthly" || app.plan === "vip" || app.plan === "vip_boost",
        rating: 4.5,
      };

      // Create live profile in Cloudflare D1
      await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });

      // Update application status in R2
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id, status: "approved" }),
      });

      fetchApplications();
    } catch (err) {
      alert("Failed to approve application.");
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });
    } catch (err) {
      console.error("Failed to reject application:", err);
    } finally {
      setActionLoading(null);
      fetchApplications();
    }
  };

  // Compute badge counts from allApps
  const countByFilter = (f: FilterKey): number => {
    if (f === "all") return allApps.length;
    if (f === "vip_boosts") return allApps.filter(a => a.plan === "vip_boost" || a.plan === "vip").length;
    return allApps.filter(a => a.status === f).length;
  };

  const FILTERS: { key: FilterKey; label: string; highlight?: string }[] = [
    { key: "pending_verification", label: "Needs Verification" },
    { key: "vip_boosts",           label: "VIP Boost Requests", highlight: "yellow" },
    { key: "pending_payment",      label: "No Payment Yet" },
    { key: "approved",             label: "Approved" },
    { key: "rejected",             label: "Rejected" },
    { key: "all",                  label: "All" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Escort Applications & Payments</h2>
        <Button variant="ghost" size="sm" onClick={fetchApplications} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {FILTERS.map((f) => {
          const count = countByFilter(f.key);
          const isActive = filter === f.key;
          const isYellow = f.highlight === "yellow";

          return (
            <button
              key={f.key}
              onClick={() => handleFilterChange(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                isActive
                  ? isYellow
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "bg-pink-600 text-white border-pink-600"
                  : isYellow
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/40 hover:border-yellow-400"
                    : "bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500"
              }`}
            >
              {isYellow && <Crown className="h-3 w-3" />}
              {f.label}
              {count > 0 && (
                <span className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold ${
                  isActive
                    ? isYellow ? "bg-black/20 text-black" : "bg-white/20 text-white"
                    : isYellow ? "bg-yellow-500/30 text-yellow-300" : "bg-gray-700 text-gray-300"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-pink-400" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No applications in this category.
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const statusInfo = STATUS_LABELS[app.status] ?? { label: app.status, color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
            const isVipBoost = app.plan === "vip_boost" || app.plan === "vip";
            const isMonthly = app.plan === "monthly";

            return (
              <div
                key={app.id}
                className={`border rounded-2xl p-3 sm:p-3.5 transition-all ${
                  isVipBoost 
                    ? "bg-yellow-950/20 border-yellow-500/40" 
                    : isMonthly 
                      ? "bg-pink-950/20 border-pink-500/40" 
                      : "bg-[#181a20] border-gray-800"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {/* Info */}
                  <div className="flex gap-3 items-center flex-1 min-w-0">
                    {app.profile_image ? (
                      <img src={app.profile_image} alt={app.name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0 border border-gray-800" />
                    ) : (
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-800 border border-gray-700/60 flex items-center justify-center flex-shrink-0">
                        {isVipBoost ? <Crown className="w-7 h-7 text-yellow-400" /> : <User className="w-7 h-7 text-gray-500" />}
                      </div>
                    )}
                    
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-white text-sm sm:text-base">{app.name}</span>
                        {app.age && <span className="text-gray-400 text-xs sm:text-sm">· {app.age} yrs</span>}
                        
                        {isMonthly ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border bg-pink-500/20 text-pink-400 border-pink-500/30 font-bold tracking-wide flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5 text-pink-400" /> FULL MONTH
                          </span>
                        ) : isVipBoost ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border bg-yellow-500/20 text-yellow-400 border-yellow-500/30 font-bold tracking-wide flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 text-yellow-400" /> VIP BOOST
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full border bg-gray-500/15 text-gray-300 border-gray-600/30 uppercase font-semibold">
                            ORDINARY
                          </span>
                        )}

                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusInfo.color} font-medium`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* VIP Boost Alert Banner */}
                      {app.plan === "vip_boost" && (
                        <div className="p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg text-xs text-yellow-300">
                          ⚡ <strong>VIP Boost Request:</strong> Existing model <strong>"{app.name}"</strong> ({app.phone}) wants to upgrade to VIP for 1 week.
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-gray-400 text-xs">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-gray-500" /> {app.location}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3 text-gray-500" /> {app.phone}</span>
                        {app.body_type && <span>{app.body_type}</span>}
                        {app.complexion && <span>· {app.complexion}</span>}
                        {app.images?.length > 0 && <span className="text-gray-500">· {app.images.length} pics, {app.videos?.length || 0} vids</span>}
                      </div>

                      {app.short_bio && (
                        <p className="text-gray-400 text-xs italic">"{app.short_bio}"</p>
                      )}

                      {/* Payment info */}
                      {app.transaction_id && (
                        <div className="mt-1.5 p-2 bg-blue-900/20 border border-blue-500/20 rounded-lg text-xs space-y-0.5">
                          <p className="text-blue-300 font-medium">Payment Submitted: <span className="text-white uppercase">{app.payment_method}</span> ({app.payment_phone})</p>
                          <p className="text-gray-300">TX ID: <span className="text-white font-mono font-medium">{app.transaction_id}</span></p>
                        </div>
                      )}

                      <p className="text-gray-500 text-[11px]">Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {app.status === "pending_verification" && (
                    <div className="flex gap-1.5 flex-shrink-0 self-center">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-semibold rounded-lg shadow-sm"
                        onClick={() => handleApprove(app)}
                        disabled={actionLoading === app.id}
                      >
                        {actionLoading === app.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <><CheckCircle className="h-3.5 w-3.5 mr-1" /> Verify & Approve</>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/40 text-red-400 hover:bg-red-900/20 h-7 sm:h-8 px-2.5 text-xs rounded-lg"
                        onClick={() => handleReject(app.id)}
                        disabled={actionLoading === app.id}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  )}

                  {app.status === "pending_payment" && (
                    <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400/80 hover:text-red-300 hover:bg-red-950/30 h-7 px-2 text-xs rounded-lg"
                        onClick={() => handleReject(app.id)}
                        disabled={actionLoading === app.id}
                        title="Dismiss / Reject Unpaid Draft"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}