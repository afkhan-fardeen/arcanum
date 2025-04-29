import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req) {
  try {
    const { accessFor, xUsername, discordUsername, daoSocials } = await req.json();

    // Basic validation
    if (!accessFor || !['community', 'individual'].includes(accessFor)) {
      return NextResponse.json({ error: 'Invalid or missing accessFor' }, { status: 400 });
    }
    if (!xUsername || typeof xUsername !== 'string' || xUsername.length < 3) {
      return NextResponse.json({ error: 'Invalid or missing xUsername' }, { status: 400 });
    }
    if (!discordUsername || typeof discordUsername !== 'string' || discordUsername.length < 3) {
      return NextResponse.json({ error: 'Invalid or missing discordUsername' }, { status: 400 });
    }
    if (!daoSocials || typeof daoSocials !== 'string' || daoSocials.length < 3) {
      return NextResponse.json({ error: 'Invalid or missing daoSocials' }, { status: 400 });
    }

    // Insert submission into Supabase
    const { error } = await supabase
      .from('submissions')
      .insert([
        {
          access_for: accessFor,
          x_username: xUsername,
          discord_username: discordUsername,
          dao_socials: daoSocials,
        },
      ]);

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save submission: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Submission successful' }, { status: 200 });
  } catch (error) {
    console.error('Submission endpoint error:', error);
    return NextResponse.json({ error: 'Server error: ' + error.message }, { status: 500 });
  }
}