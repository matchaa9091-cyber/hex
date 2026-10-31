"use client";

import { useState, useRef } from "react";
import { X, Loader2, Upload, Trash2, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileType } from "@/types/profile";

interface ProfileEditModalProps {
  profile: ProfileType;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export function ProfileEditModal({ profile, isOpen, onClose, onUpdated }: ProfileEditModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Form state initialized from profile
  const [name, setName] = useState(profile.name || "");
  const [age, setAge] = useState(profile.age ? String(profile.age) : "");
  const [location, setLocation] = useState(profile.location || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp || "");
  const [height, setHeight] = useState(profile.height || "");
  const [bodyType, setBodyType] = useState(profile.bodyType || "");
  const [complexion, setComplexion] = useState(profile.complexion || "");
  const [shortBio, setShortBio] = useState(profile.shortBio || "");
  const [description, setDescription] = useState(profile.description || "");
  const [services, setServices] = useState((profile.services || []).join(", "));
  const [profileImage, setProfileImage] = useState(profile.profileImage || "");
  const [images, setImages] = useState<string[]>(profile.images || []);
  const [newPasscode, setNewPasscode] = useState("");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Retrieve authenticated passcode from session
  const getStoredPasscode = (): string => {
    try {
      const raw = localStorage.getItem("hx_edit_session");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.profileId === profile.id && parsed.passcode) {
          return parsed.passcode;
        }
      }
    } catch {}
    return "";
  };

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "profile-images");
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadFile(file);
      setProfileImage(url);
    } catch (err: any) {
      setError(`Failed to upload main photo: ${err?.message || "Try again"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryAdd = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadFile(file);
        newUrls.push(url);
      }
      setImages((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      setError(`Failed to upload gallery photos: ${err?.message || "Try again"}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const storedPasscode = getStoredPasscode();
    if (!storedPasscode) {
      setError("Session expired or missing passcode. Please click 'Edit My Profile' on the sidebar again.");
      return;
    }

    if (!name.trim() || !location.trim()) {
      setError("Name and location are required.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profiles/update-my-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          passcode: storedPasscode,
          updates: {
            name: name.trim(),
            age: age ? Number(age) : null,
            location: location.trim(),
            phone: phone.trim(),
            whatsapp: whatsapp.trim() || phone.trim(),
            height: height.trim() || null,
            body_type: bodyType || null,
            complexion: complexion || null,
            short_bio: shortBio.trim(),
            description: description.trim(),
            services: services.split(",").map((s) => s.trim()).filter(Boolean),
            profile_image: profileImage,
            images,
            newPasscode: newPasscode.trim() ? newPasscode.trim() : undefined,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile.");
      }

      // If passcode was changed, update localStorage
      if (newPasscode.trim()) {
        try {
          localStorage.setItem(
            "hx_edit_session",
            JSON.stringify({
              profileId: profile.id,
              passcode: newPasscode.trim(),
              name: name.trim(),
              timestamp: Date.now(),
            })
          );
        } catch {}
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        if (onUpdated) {
          onUpdated();
        } else {
          window.location.reload();
        }
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border border-pink-500/40 rounded-2xl p-5 sm:p-7 shadow-2xl shadow-pink-950/60 my-auto max-h-[92vh] overflow-y-auto">
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
        <div className="mb-6 pb-4 border-b border-gray-800">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Edit Your Profile
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Update your photos, phone number, location, and bio. Changes appear immediately.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Profile updated successfully! Refreshing...
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Main Profile Photo */}
          <div className="space-y-2">
            <Label className="text-white font-medium text-xs uppercase tracking-wider">
              Main Profile Photo
            </Label>
            <div className="flex items-center gap-4">
              <img
                src={profileImage || "/placeholder.svg"}
                alt="Main"
                className="w-20 h-20 rounded-xl object-cover border-2 border-pink-500/60 shadow-md"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10 rounded-xl"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-1.5" /> Change Photo
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Gallery Photos */}
          <div className="space-y-2">
            <Label className="text-white font-medium text-xs uppercase tracking-wider">
              Gallery Photos ({images.length})
            </Label>
            <div className="flex flex-wrap gap-2.5">
              {images.map((img, i) => (
                <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-700">
                  <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(i)}
                    className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                    title="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryAdd}
              />
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploading}
                className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-700 hover:border-pink-500/60 flex flex-col items-center justify-center text-gray-400 hover:text-pink-400 transition-colors text-xs gap-1"
              >
                <Upload className="h-4 w-4" />
                <span>+Add</span>
              </button>
            </div>
          </div>

          {/* Core Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Display Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your display name"
                className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Age</Label>
              <Input
                type="number"
                min={18}
                max={60}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="18+"
                className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Location *</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Kampala, Kololo"
                className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Phone Number *</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0771234567"
                className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">WhatsApp Number</Label>
              <Input
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Leave blank if same as phone"
                className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Height</Label>
              <Input
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 5'6&quot;"
                className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Body Type</Label>
              <Select value={bodyType} onValueChange={setBodyType}>
                <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white rounded-xl">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {["Slim", "Athletic", "Curvy", "Thick", "Plus Size"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-gray-300">Complexion</Label>
              <Select value={complexion} onValueChange={setComplexion}>
                <SelectTrigger className="bg-gray-800/90 border-gray-700 text-white rounded-xl">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {["Light", "Brown", "Dark", "Chocolate", "Caramel"].map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Short Bio */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Short Bio (shown on card preview)</Label>
            <Input
              value={shortBio}
              maxLength={120}
              onChange={(e) => setShortBio(e.target.value)}
              placeholder="One catchphrase or tagline about yourself..."
              className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
            />
          </div>

          {/* Full Description */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">About You (full description)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Tell clients more about yourself, incalls/outcalls, availability..."
              className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
            />
          </div>

          {/* Services */}
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Services (comma-separated)</Label>
            <Input
              value={services}
              onChange={(e) => setServices(e.target.value)}
              placeholder="e.g. Dating, Companionship, Massage, Dinner Dates"
              className="bg-gray-800/90 border-gray-700 text-white rounded-xl"
            />
          </div>

          {/* Change Passcode */}
          <div className="p-3.5 rounded-xl bg-gray-800/50 border border-gray-700/80 space-y-1.5">
            <Label className="text-xs text-pink-300 font-semibold flex items-center gap-1.5">
              <KeyRound className="h-3.5 w-3.5 text-pink-400" /> Change Passcode (Optional)
            </Label>
            <Input
              type="text"
              value={newPasscode}
              onChange={(e) => setNewPasscode(e.target.value)}
              placeholder="Leave blank to keep your current passcode"
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 rounded-xl"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={saving}
              className="text-gray-400 hover:text-white rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || uploading}
              className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-500 hover:opacity-95 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-pink-600/30"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving Changes...
                </>
              ) : (
                "Save Profile Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
