import OpenAI from "openai";

export default async function handler(req, res) {
  // CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(200).json({ message: 'AI Assistant API is live' });
  }

  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Сен №13 мектептің ресми көмекшісісің. Қысқа, сыпайы, нақты жауап бер." },
        { role: "user", content: message }
      ],
      temperature: 0.7
    });

    const reply = completion.choices?.[0]?.message?.content ?? null;
    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
