import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function POST(req) {
  console.log('POST request received at /api/submit');
  try {
    // Check if request body is valid
    const bodyText = await req.text();
    if (!bodyText) {
      console.error('Empty request body');
      return NextResponse.json({ error: 'Request body is empty' }, { status: 400 });
    }

    // Parse JSON body
    let data;
    try {
      data = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('Invalid JSON body:', parseError);
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { accessFor, xUsername, discordUsername, daoSocials } = data;

    // Basic validation
    if (!accessFor || !['community', 'individual'].includes(accessFor)) {
      console.error('Validation failed: Invalid or missing accessFor', { accessFor });
      return NextResponse.json({ error: 'Invalid or missing accessFor' }, { status: 400 });
    }
    if (!xUsername || typeof xUsername !== 'string' || xUsername.length < 3) {
      console.error('Validation failed: Invalid or missing xUsername', { xUsername });
      return NextResponse.json({ error: 'Invalid or missing xUsername' }, { status: 400 });
    }
    if (!discordUsername || typeof discordUsername !== 'string' || discordUsername.length < 3) {
      console.error('Validation failed: Invalid or missing discordUsername', { discordUsername });
      return NextResponse.json({ error: 'Invalid or missing discordUsername' }, { status: 400 });
    }
    if (!daoSocials || typeof daoSocials !== 'string' || daoSocials.length < 3) {
      console.error('Validation failed: Invalid or missing daoSocials', { daoSocials });
      return NextResponse.json({ error: 'Invalid or missing daoSocials' }, { status: 400 });
    }

    // Insert submission into Supabase
    console.log('Attempting to insert submission into Supabase:', data);
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

    console.log('Submission successful');
    return NextResponse.json({ message: 'Submission successful' }, { status: 200 });
  } catch (error) {
    console.error('Submission endpoint error:', error);
    return NextResponse.json({ error: 'Server error: ' + (error.message || 'Unknown error') }, { status: 500 });
  }
}