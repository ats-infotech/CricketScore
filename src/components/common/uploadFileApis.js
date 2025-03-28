

export const uploadFile = async (payload, method) => {
    const formData = new FormData();
    formData.append('thumbnail', payload.thumbnail);
    formData.append('data', JSON.stringify({
        folderId: payload.folderId,
        subFolder: payload.subFolder,
        oldFileName: payload.oldFileName || '',
        fileName: payload.fileName || ''
    }));

    const res = await fetch("/api/uploadfile", {
        method: method || "POST",
        body: formData,
    })

    const data = await res.json();
    return data;
}
export const uploadPlayerFile = async (payload, method) => {
    const formData = new FormData();
    formData.append('thumbnail', payload.thumbnail);
    formData.append('data', JSON.stringify({
        folderId: payload.folderId,
        subFolder: payload.subFolder,
        oldFileName: payload.oldFileName || '',
        fileName: payload.fileName || ''
    }));

    const res = await fetch("/api/uploadplayerfile", {
        method: method || "POST",
        body: formData,
    })

    const data = await res.json();
    return data;
}

export const uploadTournamentFile = async (payload, method) => {
    const formData = new FormData();
    formData.append('tournament_banner', payload.tournament_banner);
    formData.append('tournament_image', payload.tournament_image);
    formData.append('data', JSON.stringify({
        folderId: payload.folderId,
        oldBannerFileName: payload.oldBannerFileName || '',
        oldImageFileName: payload.oldImageFileName || '',
    }));
    const res = await fetch("/api/uploadtournamentfile", {
        method: method || "POST",
        body: formData,
    })

    const data = await res.json();
    return data;
}