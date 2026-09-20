export type AIStyle = 'tiktok_commenter' | 'podcast_alpha' | 'discord_mod' | 'roblox_kid';

export interface AIRotOptions {
  apiKey?: string;
  style: AIStyle;
  temperature?: number;
}

const STYLE_PROMPTS: Record<AIStyle, string> = {
  tiktok_commenter: 'You are an obnoxious TikTok commenter. Rewrite the input into pure Gen Z / Gen Alpha brain rot slang with lots of skull emojis, "bro really thought", "blud", "skibidi", "no cap", "cooked". Keep it concise and chaotic.',
  podcast_alpha: 'You are an aggressive alpha grindset podcast host like Andrew Tate or Sneako. Rewrite the text into high-intensity masculine hustle brain rot, mentioning aura, looksmaxxing, mewing, mogging, and sigma discipline.',
  discord_mod: 'You are an exaggerated Discord moderator with 100,000 aura in your own head. Rewrite the text with terms like "my kitten", "touch grass", "banned from general", "ratio", "caught in 4k".',
  roblox_kid: 'You are an 8-year-old iPad kid on Roblox. Rewrite the text into hyperactive screaming brain rot with Baby Gronk, Livvy Dunne, Kai Cenat, Fanum tax, Grimace shake, and V-Bucks.',
};

export async function aiRotParagraph(
  text: string,
  options: AIRotOptions
): Promise<string> {
  if (!text.trim()) return '';

  const apiKey = options.apiKey?.trim();

  // If no API key is provided, we simulate an AI style transformation using smart heuristics
  if (!apiKey) {
    return fallbackSmartStyle(text, options.style);
  }

  const systemPrompt = STYLE_PROMPTS[options.style] || STYLE_PROMPTS.tiktok_commenter;

  try {
    // If key looks like a Gemini key (starts with AIzaSy)
    if (apiKey.startsWith('AIzaSy')) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemPrompt}\n\nTransform this text (output ONLY the rewritten text, no conversational filler):\n"${text}"`,
                  },
                ],
              },
            ],
            generationConfig: {
              maxOutputTokens: 250,
              temperature: 0.9,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const generated = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generated) return generated.trim();
    } else {
      // Treat as OpenAI-compatible key
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Rewrite this text into brain rot:\n"${text}"` },
          ],
          max_tokens: 200,
          temperature: 0.9,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API returned status ${response.status}`);
      }

      const data = await response.json();
      const generated = data?.choices?.[0]?.message?.content;
      if (generated) return generated.trim();
    }
  } catch (err) {
    console.warn('AI API call failed or rate-limited. Falling back to local engine:', err);
  }

  // Graceful fallback
  return fallbackSmartStyle(text, options.style);
}

// Fallback smart styler when no API key is provided
function fallbackSmartStyle(text: string, style: AIStyle): string {
  switch (style) {
    case 'podcast_alpha':
      return `LISTEN TO ME CAREFULLY: If you think "${text}" is acceptable, your aura is negative 50,000. Real sigmas don't make excuses; they mew for 14 hours, mog their competition, and secure the bag while the NPCs sleep. Wake up.`;
    case 'discord_mod':
      return `*adjusts fedora and sips Monster Energy* Ahem, whoever said "${text}" is officially in violation of rule 4. Please touch grass immediately or I will confiscate your remaining aura. Caught in 4K.`;
    case 'roblox_kid':
      return `BROOO 😭😭 Kai Cenat just fanum taxed the whole server because of "${text}"!! Livvy Dunne and Baby Gronk are literally crying in Ohio right now!! Give me my 1,000 V-Bucks back 💀🔥🚽`;
    case 'tiktok_commenter':
    default:
      return `Ain't no way blud really said "${text}" with a straight face 💀💀 Chat is this real?? Bro thinks he has the unspoken rizz but he's completely cooked fr fr 🗣️🔥 L + ratio!`;
  }
}

export async function aiGenerateMemeCaptions(
  themeOrPrompt: string,
  apiKey?: string
): Promise<{ top: string; bottom: string }> {
  if (apiKey?.trim()) {
    try {
      const promptText = `Generate a hilarious short top text and bottom text for a brain rot meme about: "${themeOrPrompt || 'being completely cooked'}". Format response strictly as JSON with keys "top" and "bottom". Max 6 words per line.`;
      
      if (apiKey.startsWith('AIzaSy')) {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { responseMimeType: 'application/json' },
            }),
          }
        );
        if (res.ok) {
          const data = await res.json();
          const parsed = JSON.parse(data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
          if (parsed.top && parsed.bottom) return parsed;
        }
      }
    } catch (e) {
      console.warn('AI meme caption generation error, using preset fallback:', e);
    }
  }

  // Local brain rot meme templates
  const presets = [
    { top: 'WHEN YOU STUDY FOR 10 HOURS', bottom: 'BUT STILL FAIL WITH A LEVEL 10 GYATT' },
    { top: 'ME PRETENDING TO LISTEN', bottom: 'WHILE MEWING IN TOTAL SILENCE' },
    { top: 'POV: YOU ACCIDENTALLY OPENED TIKTOK', bottom: 'AT 3:00 AM IN OHIO' },
    { top: 'BRO THOUGHT HE HAD UNLIMITED RIZZ', bottom: 'NOW HE IS COMPLETELY COOKED' },
    { top: 'NO WIFI FOR 5 MINUTES', bottom: 'MY BRAIN IS DELETING ITSELF' },
    { top: 'TEACHER: WHY ARE YOU LATE?', bottom: 'ME: FANUM TAX WAS BEING COLLECTED' },
    { top: 'WAKING UP AT 3PM', bottom: 'SIGMA GRINDSET NEVER SLEEPS' },
  ];

  return presets[Math.floor(Math.random() * presets.length)];
}
