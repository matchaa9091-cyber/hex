"use client";

import { useCallback, useEffect, useState } from "react";
import { BarChart3, RefreshCw, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClickRow {
  profile_id: string;
  name: string;
  location: string;
  whatsapp: number;
  call: number;
  phone_copy: number;
  total: number;
  last_contact: string;
}

interface ClickTotals {
  total: number;
  whatsapp: number;
  call: number;
  phone_copy: number;
  profiles: number;
  last_contact: string | null;
}

interface ClickResponse {
  rows: ClickRow[];
  totals: ClickTotals | null;
  generatedAt?: string;
  error?: string;
}

const STORAGE_KEY = "hx_clicks_admin_key";

function formatWhen(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ContactAnalyticsPanel() {
  const [key, setKey] = useState("");
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<ClickResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      setKey(sessionStorage.getItem(STORAGE_KEY) || "");
    } catch {}
  }, []);

  const load = useCallback(async (activeKey: string, activeDays: number) => {
    if (!activeKey.trim()) {
      setError("Enter the analytics access key to view contact counts.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/clicks?days=${activeDays}&t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${activeKey.trim()}` },
        cache: "no-store",
      });
      const json = (await res.json()) as ClickResponse;
      if (!res.ok) {
        setError(json.error || `Request failed (${res.status})`);
        setData(null);
        return;
      }
      setData(json);
      try {
        sessionStorage.setItem(STORAGE_KEY, activeKey.trim());
      } catch {}
    } catch {
      setError("Could not load analytics. Check the Worker connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (key) load(key, days);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const totals = data?.totals;
  const rows = data?.rows || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <KeyRound className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") load(key, days); }}
              placeholder="Analytics access key"
              className="pl-9 w-full sm:w-56 bg-gray-950"
            />
          </div>
          <Button size="sm" onClick={() => load(key, days)} disabled={loading}>
            {loading ? "Loading…" : "Unlock"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {([7, 30, 90] as const).map((d) => (
            <Button
              key={d}
              size="sm"
              variant={days === d ? "default" : "outline"}
              onClick={() => setDays(d)}
            >
              {d} days
            </Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => load(key, days)} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {data && !error && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Total contacts" value={totals?.total || 0} accent="text-white" />
            <StatCard label="WhatsApp taps" value={totals?.whatsapp || 0} accent="text-green-400" />
            <StatCard label="Call taps (mobile)" value={totals?.call || 0} accent="text-blue-400" />
            <StatCard label="Phone copies (desktop)" value={totals?.phone_copy || 0} accent="text-yellow-400" />
            <StatCard label="Escorts contacted" value={totals?.profiles || 0} accent="text-pink-400" />
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-gray-900 text-gray-400">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Escort</th>
                  <th className="text-left px-3 py-2 font-medium">Location</th>
                  <th className="text-right px-3 py-2 font-medium">WhatsApp</th>
                  <th className="text-right px-3 py-2 font-medium">Calls</th>
                  <th className="text-right px-3 py-2 font-medium">Copies</th>
                  <th className="text-right px-3 py-2 font-medium">Total</th>
                  <th className="text-right px-3 py-2 font-medium">Last contact</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                      No contact taps recorded in the last {days} days.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.profile_id} className="border-t border-gray-800 hover:bg-gray-900/40">
                      <td className="px-3 py-2 font-medium">{r.name}</td>
                      <td className="px-3 py-2 text-gray-400">{r.location}</td>
                      <td className="px-3 py-2 text-right text-green-400">{r.whatsapp}</td>
                      <td className="px-3 py-2 text-right text-blue-400">{r.call}</td>
                      <td className="px-3 py-2 text-right text-yellow-400">{r.phone_copy}</td>
                      <td className="px-3 py-2 text-right font-semibold">{r.total}</td>
                      <td className="px-3 py-2 text-right text-gray-400">{formatWhen(r.last_contact)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-500">
            Counts are contact <em>intent</em> (a tap or copy), not confirmed conversations or calls.
            {data.generatedAt ? ` Generated ${formatWhen(data.generatedAt)}.` : ""}
          </p>
        </>
      )}

      {!data && !error && !loading && (
        <div className="rounded-lg border border-gray-800 bg-gray-900/40 p-8 text-center text-gray-500">
          <BarChart3 className="mx-auto mb-3 h-8 w-8 text-gray-600" />
          Enter the access key to load per-escort WhatsApp, call and phone-copy counts.
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value.toLocaleString()}</p>
    </div>
  );
}
