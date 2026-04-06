import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { EmailOtpType } from "@supabase/supabase-js"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/dashboard"

  if (!tokenHash || !type) {
    return NextResponse.redirect(
      `${origin}/login?error=auth_error&message=missing_confirmation_params`
    )
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })

    if (error) {
      console.error("[auth/confirm] OTP verification failed:", error.message)
      return NextResponse.redirect(
        `${origin}/login?error=auth_error&message=${encodeURIComponent(error.message)}`
      )
    }

    // Verification successful — redirect to the intended page
    // For email confirmation after signup, send to onboarding if no org
    if (type === "signup" || type === "email") {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, organization_id")
          .eq("id", user.id)
          .single()

        if (!profile?.organization_id) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }
    }

    return NextResponse.redirect(`${origin}${next}`)
  } catch (err) {
    console.error("[auth/confirm] Unexpected error:", err)
    return NextResponse.redirect(
      `${origin}/login?error=auth_error&message=unexpected_error`
    )
  }
}
