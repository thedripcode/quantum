import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, BUCKET } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file  = form.get('file') as File | null;
    const label = form.get('label') as string | null;
    const ref   = form.get('ref') as string | null;

    if (!file || !label || !ref) {
      return NextResponse.json({ error: 'file, label and ref are required.' }, { status: 400 });
    }

    const ext      = file.name.split('.').pop();
    const safeName = label.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const path     = `${ref}/${safeName}.${ext}`;

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sb = supabaseAdmin();

    const { error } = await sb.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type,
      upsert: true,
    });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: { publicUrl } } = sb.storage.from(BUCKET).getPublicUrl(path);

    return NextResponse.json({ url: publicUrl, name: file.name, label });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
