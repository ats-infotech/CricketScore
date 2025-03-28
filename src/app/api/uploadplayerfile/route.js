import { mkdir, readdir, rmdir, unlink, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

async function ensureUploadsDirectory(folderId, subFolder) {
    const public_ = join(process.cwd(), 'public');
    const dir = join(public_, 'uploads', `tournament${folderId}`, subFolder, 'players');
    await mkdir(dir, { recursive: true });
}

async function deleteFolderIfEmpty(folderPath) {
    try {
        const files = await readdir(folderPath);
        if (files.length === 0) {
            await rmdir(folderPath);
        }
    } catch (error) {
        throw new Error('Error checking/deleting folder: ' + error.message);
    }
}

async function deleteFile(filePath) {
    try {
        await unlink(filePath);
    } catch (error) {
        throw new Error(`Error deleting file: ${error.message}`);
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const thumbnail = formData.get('thumbnail');
        const data = JSON.parse(formData.get('data'));
        const folderId = data['folderId']
        const subFolder = data['subFolder']

        if (!thumbnail) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        if (!folderId || !subFolder) {
            return NextResponse.json({ error: 'Missing folderId or subFolder' }, { status: 400 });
        }
        await ensureUploadsDirectory(folderId, subFolder);

        const buffer = Buffer.from(await thumbnail.arrayBuffer());

        const thumbnailUrl = join('uploads', `tournament${folderId}`, subFolder, 'players', `${Date.now()}-${thumbnail.name}`);
        const filePath = join(process.cwd(), 'public', thumbnailUrl);

        await writeFile(filePath, buffer);

        return NextResponse.json({ url: thumbnailUrl, message: 'File uploaded successfully' });

    } catch (error) {
        return NextResponse.json({ error: 'Error uploading file', details: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const formData = await req.formData();
        const thumbnail = formData.get('thumbnail');
        const data = JSON.parse(formData.get('data'));
        const folderId = data['folderId'];
        const subFolder = data['subFolder'];
        const oldFileName = data['oldFileName'];

        if (!thumbnail || !oldFileName) {
            return NextResponse.json({ error: 'No file provided or missing oldFileName' }, { status: 400 });
        }
        if (!folderId || !subFolder) {
            return NextResponse.json({ error: 'Missing folderId or subFolder' }, { status: 400 });
        }

        const oldFilePath = join(process.cwd(), 'public', 'uploads', `tournament${folderId}`, subFolder, 'players', oldFileName);
        await deleteFile(oldFilePath);

        await ensureUploadsDirectory(folderId, subFolder);

        const buffer = Buffer.from(await thumbnail.arrayBuffer());
        const newFileName = `${Date.now()}-${thumbnail.name}`;
        const thumbnailUrl = join('uploads', `tournament${folderId}`, subFolder, 'players', newFileName);
        const filePath = join(process.cwd(), 'public', thumbnailUrl);

        await writeFile(filePath, buffer);

        return NextResponse.json({ url: thumbnailUrl, message: 'File updated successfully' });

    } catch (error) {
        return NextResponse.json({ error: 'Error updating file', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const formData = await req.formData();
        const data = JSON.parse(formData.get('data'));
        const folderId = data['folderId'];
        const subFolder = data['subFolder'];
        const fileName = data['fileName'];

        if (!folderId || !subFolder || !fileName) {
            return NextResponse.json({ error: 'Missing folderId, subFolder, or fileName' }, { status: 400 });
        }

        const filePath = join(process.cwd(), 'public', 'uploads', `tournament${folderId}`, subFolder, 'players', fileName);
        const subFolderPath = join(process.cwd(), 'public', 'uploads', `tournament${folderId}`, subFolder, 'players');
        await deleteFile(filePath);
        await deleteFolderIfEmpty(subFolderPath);

        return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: 'Error deleting file', details: error.message }, { status: 500 });
    }
}