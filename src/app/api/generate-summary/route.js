import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
  try {
    const playerStats = await req.json();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      input: [
        {
          role: 'user',
          content: `Generate a cricket match commentary and performance summary based on: ${JSON.stringify(playerStats)}`,
        },
      ],
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
