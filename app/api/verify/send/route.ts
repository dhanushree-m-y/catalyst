import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserById, setVerifyCode } from "@/lib/users";
import { sendVerificationEmail, emailConfigured } from "@/lib/email";

export const runtime = "nodejs";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "Please log in first." }, { status: 401 });
  }
  const user = await getUserById(session.user.id);
  if (!user) return NextResponse.json({ ok: false, error: "Account not found." }, { status: 404 });
  if (user.verified) return NextResponse.json({ ok: true, alreadyVerified: true });

  const code = await setVerifyCode(user.id);
  if (!code) return NextResponse.json({ ok: false, error: "Something went wrong." }, { status: 500 });

  if (emailConfigured()) {
    try {
      await sendVerificationEmail(user.email, code);
      return NextResponse.json({ ok: true, sent: true });
    } catch (e) {
      console.error("verify: email send failed", e);
      return NextResponse.json(
        { ok: false, error: "Couldn't send the email just now. Please try again." },
        { status: 502 }
      );
    }
  }

  // email not set up yet — allow local testing by returning the code in dev only
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.json({ ok: true, sent: false, devCode: code });
  }
  return NextResponse.json(
    { ok: false, error: "Email verification isn't set up yet." },
    { status: 503 }
  );
}
