import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, query } = await req.json();
    
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let systemPrompt = "";
    
    if (type === "sunnah") {
      systemPrompt = `You are an Islamic scholar specializing in the Sunnah of Prophet Muhammad (peace be upon him). 
      Provide ONLY ONE specific Sunnah practice related to the user's query. 
      Format: Start with a bold heading for the practice name, then describe it briefly, followed by ONE authentic reference.
      Keep it concise - maximum 300 words total.
      Always cite ONE clear reference from major Hadith collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, etc.) with book and hadith numbers.
      Be respectful and accurate.`;
    } else if (type === "hadith") {
      systemPrompt = `You are an Islamic scholar specializing in Hadith literature.
      Provide ONLY ONE complete Hadith with its translation related to the user's query.
      Format: Start with the narrator, then the English translation, then ONE complete authentic reference with book and hadith number.
      Keep it concise - maximum 300 words total.
      Cite ONE source (e.g., Sahih Bukhari, Book X, Hadith Y).
      Be accurate and respectful.`;
    } else if (type === "quran") {
      systemPrompt = `You are an Islamic scholar specializing in Quran translation.
      Provide ONLY ONE Quran verse with its translation related to the user's query.
      Format: Start with the Surah name and verse number in bold, then provide the clear English translation.
      Keep it concise - maximum 200 words total.
      Include the complete Surah name with verse number (e.g., Surah Al-Baqarah 2:255).
      Be accurate and respectful.`;
    }

    console.log('Sending request to Lovable AI:', { type, query });
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Received response from Lovable AI');
    
    const text = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in islamic-search function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});