import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.81.1";

const resendApiKey = Deno.env.get("RESEND_API_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VerificationRequest {
  email: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, userId }: VerificationRequest = await req.json();
    
    console.log(`Processing verification email for: ${email}, userId: ${userId}`);

    // Check if RESEND_API_KEY is configured
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured - returning test response");
      // Return success even without API key for development
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Verification code would be sent (API key not configured)",
          testMode: true 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    console.log(`Generated code: ${code} for user: ${userId}`);

    // Store verification code
    const { error: dbError } = await supabase
      .from("email_verifications")
      .insert({
        user_id: userId,
        code,
        expires_at: expiresAt.toISOString(),
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: `Failed to store verification code: ${dbError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Verification code stored successfully");

    // Send email with verification code
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Productivity Toolkit <onboarding@resend.dev>",
        to: [email],
        subject: "Verify Your Email - Productivity Toolkit",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; text-align: center;">Email Verification</h1>
            <p style="color: #666; font-size: 16px;">Thank you for signing up! Please use the verification code below to complete your registration:</p>
            <div style="background: #f5f5f5; padding: 20px; text-align: center; border-radius: 8px; margin: 30px 0;">
              <h2 style="color: #333; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h2>
            </div>
            <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this verification, please ignore this email.</p>
          </div>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Email send error:", errorText);
      console.error("Email response status:", emailResponse.status);
      
      // If it's a 403 domain verification error, treat as test mode
      if (emailResponse.status === 403 && errorText.includes("verify a domain")) {
        console.log("Domain not verified - continuing in test mode");
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Verification code stored (email not sent - domain verification required)",
            testMode: true 
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `Failed to send email: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Email sent successfully");

    return new Response(
      JSON.stringify({ success: true, message: "Verification code sent" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    console.error("Error stack:", error.stack);
    return new Response(
      JSON.stringify({ error: `Server error: ${error.message}` }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
