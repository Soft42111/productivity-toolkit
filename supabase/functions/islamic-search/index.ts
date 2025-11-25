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
      Provide detailed information about the Sunnah practices related to the user's query. 
      Always include authentic references from major Hadith collections (Bukhari, Muslim, Abu Dawud, Tirmidhi, etc.).
      Format your response clearly with the practice description followed by the references.
      Be respectful and accurate in your citations.`;
    } else if (type === "hadith") {
      systemPrompt = `You are an Islamic scholar specializing in Hadith literature.
      Provide Hadith translations related to the user's query with complete references.
      Include the narrator chain when relevant, the Arabic text if possible, and clear English translation.
      Always cite the source (e.g., Sahih Bukhari, Book X, Hadith Y).
      Explain the context and meaning briefly.
      Be accurate and respectful in presenting Hadith.`;
    } else if (type === "quran") {
      systemPrompt = `You are an Islamic scholar specializing in Quran translation and tafsir.
      Provide Quran verse translations related to the user's query with complete references.
      Include the Surah name, verse number, and clear English translation.
      Provide brief context or explanation of the verse when helpful.
      If the user provides a specific verse reference, give the exact verse with translation.
      Be accurate and respectful in presenting Quranic verses.`;
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