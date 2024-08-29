import fs from 'fs/promises';

const dataPath = '../ui/public/data/data.json'; // Update path as needed

export const readData = async () => {
    const data = await fs.readFile(dataPath, 'utf8');
    const parsedData = JSON.parse(data);

    // Assuming the 'Patrimoine' model contains the 'possesseur' and 'possessions'
    const patrimoine = parsedData.find(item => item.model === 'Patrimoine');
    if (!patrimoine) {
        throw new Error('Patrimoine data not found');
    }

    return patrimoine.data;
};

export const writeData = async (data) => {
    // Assuming the data to write includes the 'Patrimoine' model
    const fileData = [
        { model: 'Personne', data: { nom: 'John Doe' } },
        { model: 'Patrimoine', data }
    ];
    await fs.writeFile(dataPath, JSON.stringify(fileData, null, 2), 'utf8');
};
