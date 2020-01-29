import fs from 'fs';
import Encoding from 'encoding-japanese';
import parse from 'csv-parse';
export function parseCsvService(path: string, cb: (input: string[][]) => void) {
    const csv = fs.readFileSync(path);
    const result = Encoding.convert(csv, {
        from: 'SJIS',
        to: 'UNICODE',
        type: 'string',
    }) as string;
    parse(result, (err, data) => {
        if (err) throw err;
        cb(data);
    })
}
