import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=auth_error&message=missing_code`
    )
  }

  try {
    const supabase = await createClient()

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error("[auth/callback] Code exchange failed:", exchangeError.message)
      return NextResponse.redirect(
        `${origin}/login?error=auth_error&message=${encodeURIComponent(exchangeError.message)}`
      )
    }

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("[auth/callback] Failed to get user after exchange:", userError?.message)
      return NextResponse.redirect(
        `${origin}/login?error=auth_error&message=user_not_found`
      )
    }

    // Check if the user has a profile with an organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, organization_id")
      .eq("id", user.id)
      .single()

    if (!profile?.organization_id) {
      // User exists but has no organization — send to onboarding
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    // User has a profile and an organization — proceed to intended destination
    return NextResponse.redirect(`${origin}${next}`)
  } catch (err) {
    console.error("[auth/callback] Unexpected error:", err)
    return NextResponse.redirect(
      `${origin}/login?error=auth_error&message=unexpected_error`
    )
  }
}
