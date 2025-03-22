import * as fs from 'fs';
import * as path from 'path';
import RuCensor from '../';

describe('RuCensor', () => {
    let badWords: string[];
    let censor: RuCensor;

    beforeAll(() => {
        const filePath = path.join(__dirname, 'badWords.txt');
        const data = fs.readFileSync(filePath, 'utf-8');
        badWords = data.split('\n').map(word => word.trim()).filter(word => word.length > 0);
    });

    describe('replace', () => {
        it('should replace bad words with replacement string', () => {
            censor = new RuCensor('strict');
            const replacement = '*';
            badWords.forEach((word) => {
                const text = `Это ${word} текст`;
                const result = censor.replace(text, replacement);
                expect(result).toBe(`Это ${replacement.repeat(word.length)} текст`);
            });
        });

        it('should not replace allowed words', () => {
            censor = new RuCensor('normal');
            const allowedWord = 'заштрихуй';
            const text = `Это ${allowedWord} текст`;
            const result = censor.replace(text, '*');
            expect(result).toBe(`Это ${allowedWord} текст`);
        });
    });

    describe('isContainsBadWords', () => {
        it('should detect bad words in text', () => {
            censor = new RuCensor('strict');
            badWords.forEach((word) => {
                const text = `Это ${word} текст`;
                const containsBadWords = censor.isContainsBadWords(text);
                expect(containsBadWords).toBe(true);
            });
        });

        it('should not detect allowed words as bad words', () => {
            censor = new RuCensor('normal');
            const allowedWord = 'заштрихуй';
            const text = `Это ${allowedWord} текст`;
            const containsBadWords = censor.isContainsBadWords(text);
            expect(containsBadWords).toBe(false);
        });
    });

    describe('addPassPatterns', () => {
        it('should add a new pass pattern and skip matching words', () => {
            censor = new RuCensor('strict');
            const allowedWord = 'новоеслово';
            const text = `Это ${allowedWord} текст`;
            censor.addPassPatterns(/новоеслово/gi);
            const result = censor.replace(text, '*');
            expect(result).toBe(`Это ${allowedWord} текст`);
        });

        it('should throw an error if the pattern is invalid', () => {
            censor = new RuCensor('strict');
            expect(() => censor.addPassPatterns(new RegExp('invalid['))).toThrow(SyntaxError);
        });
    });

    describe('addBadWordPattern', () => {
        it('should add a new bad word pattern and detect it', () => {
            censor = new RuCensor('strict');
            const newBadWord = 'синица';
            const text = `Это ${newBadWord} текст`;
            censor.addBadWordPattern(newBadWord);
            const containsBadWords = censor.isContainsBadWords(text);
            expect(containsBadWords).toBe(true);
        });

        it('should throw an error if the pattern is invalid', () => {
            censor = new RuCensor('strict');
            expect(() => censor.addPassPatterns(new RegExp('invalid['))).toThrow(SyntaxError);
        });
    });

    describe('clearBadWordPattern', () => {
        it('should clear all bad word patterns', () => {
            censor = new RuCensor('strict');
            const badWord = 'синица';
            const text = `Это ${badWord} текст`;
            censor.clearBadWordPattern();
            const containsBadWords = censor.isContainsBadWords(text);
            expect(containsBadWords).toBe(false);
        });
    });

    describe('clearPassPatterns', () => {
        it('should clear all pass patterns', () => {
            censor = new RuCensor('normal');
            const allowedWord = 'заштрихуй';
            const text = `Это ${allowedWord} текст`;
            censor.clearPassPatterns();
            const result = censor.replace(text, '*');
            expect(result).toBe(`Это ${'*'.repeat(allowedWord.length)} текст`);
        });
    });
});