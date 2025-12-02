import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // --- DÜZELTME BURADA ---
  // Eğer dosya ismi yoksa veya istek gövdesi (body) boşsa hata döndür.
  if (!filename || !request.body) {
    return NextResponse.json(
      { error: "Dosya ismi ve içeriği gereklidir." },
      { status: 400 }
    );
  }

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return NextResponse.json(blob);
}