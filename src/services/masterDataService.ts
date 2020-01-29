import fs from 'fs';
export interface IMasterData {
    hotel_name: string;
    temairazu_url: string;
    temairazu_username: string;
    temairazu_password: string;
    lastfilename: string;
}

export function fetchMasterData(): IMasterData {
    const json = fs.readFileSync('./master-data.json', 'utf8');
    return JSON.parse(json) as IMasterData;
}

export function updateMasterData(input: IMasterData) {
    fs.writeFileSync('./master-data.json', JSON.stringify(input));
}
