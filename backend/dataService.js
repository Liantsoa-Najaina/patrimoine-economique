import fs from 'fs/promises';

const dataPath = '../ui/public/data/data.json';

export const readData = async () => {
    const data = await fs.readFile(dataPath, 'utf8');
    const parsedData = JSON.parse(data);

    const patrimoine = parsedData.find(item => item.model === 'Patrimoine');
    if (!patrimoine) {
        throw new Error('Patrimoine data not found');
    }
    return patrimoine.data;
};

export const writeData = async (data) => {
    const fileData = [
        { model: 'Personne', data: { nom: 'John Doe' } },
        { model: 'Patrimoine', data }
    ];
    await fs.writeFile(dataPath, JSON.stringify(fileData, null, 2), 'utf8');
};
