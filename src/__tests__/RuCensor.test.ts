import * as fs from 'fs';
import * as path from 'path';
import { RuCensor } from '../';

describe('RuCensor', () => {
    let badWords: string[];

    beforeAll(() => {
        const filePath = path.join(__dirname, 'badWords.txt');
        const data = fs.readFileSync(filePath, 'utf-8');
        badWords = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
    });

    it('should replace bad words with replacement string', () => {
        const replacement = '*';
        badWords.forEach((word) => {
            const text = `Это ${word} текст`;
            const result = RuCensor.replace(text, replacement);
            expect(result).toBe(`Это ${replacement.repeat(word.length)} текст`);
        });
    });

    it('should detect bad words in text', () => {
        badWords.forEach((word) => {
            const text = `Это ${word} текст`;
            const containsBadWords = RuCensor.isContainsBadWords(text);
            expect(containsBadWords).toBe(true);
        });
    });

    it('should not replace allowed words', () => {
        const allowedWord = 'заштрихуй';
        const text = `Это ${allowedWord} текст`;
        const result = RuCensor.replace(text, '***');
        expect(result).toBe(`Это ${allowedWord} текст`);
    });

    it('should not detect allowed words as bad words', () => {
        const allowedWord = 'заштрихуй';
        const text = `Это ${allowedWord} текст`;
        const containsBadWords = RuCensor.isContainsBadWords(text);
        expect(containsBadWords).toBe(false);
    });
});