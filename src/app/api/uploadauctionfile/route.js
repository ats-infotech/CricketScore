import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

async function ensureUploadsDirectory(folderId, subFolder) {
    const public_ = join(process.cwd(), 'public');
    const dir = join(public_, 'uploads', `tournament${folderId}`, subFolder);
    await mkdir(dir, { recursive: true });
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const thumbnail = formData.get('thumbnail');
        const data = JSON.parse(formData.get('data'));
        const folderId = data['folderId']

        if (!thumbnail) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        if (!folderId) {
            return NextResponse.json({ error: 'Missing folderId' }, { status: 400 });
        }
        await ensureUploadsDirectory(folderId, 'auction');

        const buffer = Buffer.from(await thumbnail.arrayBuffer());

        const thumbnailUrl = join('uploads', `tournament${folderId}`, 'auction', `${Date.now()}-${thumbnail.name}`);
        const filePath = join(process.cwd(), 'public', thumbnailUrl);

        await writeFile(filePath, buffer);

        return NextResponse.json({ url: thumbnailUrl, message: 'File uploaded successfully' });

    } catch (error) {
        return NextResponse.json({ error: 'Error uploading file', details: error.message }, { status: 500 });
    }
}