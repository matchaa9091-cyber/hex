export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { executeD1Query } from "@/lib/d1";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const { passcode } = await req.json();
    const cleanPasscode = passcode ? String(passcode).trim() : "";

    if (!cleanPasscode || cleanPasscode.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your valid passcode." },
        { status: 400 }
      );
    }

    // 1. Search in live profiles
    const profiles = await executeD1Query(
      "SELECT id, name, location, profile_image, phone, whatsapp, passcode FROM profiles WHERE passcode = ? AND is_archived = 0 ORDER BY created_at DESC LIMIT 1;",
      [cleanPasscode]
    );

    if (profiles && profiles.length > 0) {
      const p = profiles[0];
      return NextResponse.json({
        success: true,
        profile: {
          id: String(p.id),
          name: p.name,
          location: p.location,
          slug: slugify(p.name || String(p.id)),
        },
      });
    }

    // 2. Check pending applications as a helpful fallback
    try {
      const apps = await executeD1Query(
        "SELECT id, name, status FROM escort_applications WHERE passcode = ? ORDER BY created_at DESC LIMIT 1;",
        [cleanPasscode]
      );
      if (apps && apps.length > 0) {
        return NextResponse.json({
          success: false,
          isPending: true,
          error: `Hi ${apps[0].name}, your profile application is currently ${apps[0].status}. Once verified and live, you will be able to edit it here.`,
        });
      }
    } catch {
      // Ignore if table check fails
    }

    return NextResponse.json(
      { success: false, error: "Incorrect passcode. Please verify and try again." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Verification failed." },
      { status: 500 }
    );
  }
}
