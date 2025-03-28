import { mkdir, rmdir, unlink, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

async function ensureUploadsDirectory(folderId) {
    const publicDir = join(process.cwd(), 'public');
    const dir = join(publicDir, 'uploads', `tournament${folderId}`);
    await mkdir(dir, { recursive: true });
    return dir;
}

async function deleteFile(filePath) {
    try {
        await unlink(filePath);
    } catch (error) {
        throw new Error(`Error deleting file: ${error.message}`);
    }
}

async function deleteFolder(folderPath) {
    try {
        await rmdir(folderPath, { recursive: true });
    } catch (error) {
        throw new Error(`Error deleting folder: ${error.message}`);
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const tournamentBanner = formData.get('tournament_banner');
        const tournamentImage = formData.get('tournament_image');
        const data = JSON.parse(formData.get('data'));
        const folderId = data['folderId'];

        if (!folderId) {
            return NextResponse.json({ error: 'Missing folderId' }, { status: 400 });
        }

        const dirPath = await ensureUploadsDirectory(folderId);

        const saveFile = async (file, fileNamePrefix) => {
            if (file && file.arrayBuffer) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filePath = join(dirPath, `${fileNamePrefix}-${Date.now()}-${file.name}`);
                await writeFile(filePath, buffer);
                return `/uploads/tournament${folderId}/${filePath.split('/').pop()}`;
            }
            return null;
        };

        let bannerUrl = null;
        let imageUrl = null;

        if (tournamentBanner) {
            bannerUrl = await saveFile(tournamentBanner, 'banner');
        }

        if (tournamentImage) {
            imageUrl = await saveFile(tournamentImage, 'image');
        }

        return NextResponse.json({
            message: 'Files uploaded successfully',
            bannerUrl: bannerUrl || null,
            imageUrl: imageUrl || null,
        });

    } catch (error) {
        return NextResponse.json({ error: 'Error uploading file', details: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const formData = await req.formData();
        const tournamentBanner = formData.get('tournament_banner');
        const tournamentImage = formData.get('tournament_image');
        const data = JSON.parse(formData.get('data'));
        const folderId = data['folderId'];
        const oldBannerFileName = data['oldBannerFileName'];
        const oldImageFileName = data['oldImageFileName'];

        if (!folderId) {
            return NextResponse.json({ error: 'Missing folderId' }, { status: 400 });
        }

        if (tournamentBanner !== null && tournamentBanner !== 'null' && oldBannerFileName) {
            const oldBannerFilePath = join(process.cwd(), 'public', 'uploads', `tournament${folderId}`, oldBannerFileName);
            await deleteFile(oldBannerFilePath);
        }

        if (tournamentImage !== null && tournamentImage !== 'null' && oldImageFileName) {
            const oldImageFilePath = join(process.cwd(), 'public', 'uploads', `tournament${folderId}`, oldImageFileName);
            await deleteFile(oldImageFilePath);
        }

        const dirPath = await ensureUploadsDirectory(folderId);

        const saveFile = async (file, fileNamePrefix) => {
            if (!file || file === null || file === 'null') {
                return null;
            }
            const buffer = Buffer.from(await file.arrayBuffer());
            const filePath = join(dirPath, `${fileNamePrefix}-${Date.now()}-${file.name}`);
            await writeFile(filePath, buffer);
            return `/uploads/tournament${folderId}/${filePath.split('/').pop()}`;
        };

        let bannerUrl = null;
        let imageUrl = null;

        if (tournamentBanner) {
            bannerUrl = await saveFile(tournamentBanner, 'banner');
        }

        if (tournamentImage ) {
            imageUrl = await saveFile(tournamentImage, 'image');
        }

        return NextResponse.json({
            message: 'Files uploaded successfully',
            bannerUrl: bannerUrl || null,
            imageUrl: imageUrl || null,
        });

    } catch (error) {
        return NextResponse.json({ error: 'Error updating file', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const formData = await req.formData();
        const data = JSON.parse(formData.get('data'));
        const folderId = data['folderId'];

        if (!folderId) {
            return NextResponse.json({ error: 'Missing folderId' }, { status: 400 });
        }

        const folderPath = join(process.cwd(), 'public', 'uploads', `tournament${folderId}`);
        await deleteFolder(folderPath);

        return NextResponse.json({ message: 'Tournament folder and all its contents deleted successfully.' });

    } catch (error) {
        return NextResponse.json({ error: 'Error deleting tournament folder', details: error.message }, { status: 500 });
    }
}