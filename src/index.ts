export interface ParseOut {
    isFindBadWords: boolean;
    text: string;
}

export class RuCensor {
    private static readonly CHAR_MAPPING: Record<string, string> = {
        'з': '[3зz]',
        'б': '[6бb]',
        'а': '[аa@]',
        'л': '[лl/\\\\]',
        'о': '[оo]',
        'е': '[еeё]',
        'р': '[рp]',
        'с': '[сc]',
        'у': '[уy]',
        'х': '[хxh]',
        'к': '[кk]',
        'и': '[иi]',
        'т': '[тt]',
        'н': '[нn]',
        'в': '[вv]',
        'г': '[гg]',
        'д': '[дd]',
        'ж': '[жj]',
        'ё': '[ёe]',
        'й': '[йy]',
        'м': '[мm]',
        'п': '[пp]',
        'ф': '[фf]',
        'ц': '[цc]',
        'ч': '[чc]',
        'ш': '[шs]',
        'щ': '[щs]',
        'ъ': '[ъ]',
        'ы': '[ыy]',
        'ь': '[ь]',
        'э': '[эe]',
        'ю': '[юy]',
        'я': '[яy]',
    };

    private static badWordsPatterns: string[] = [];

    /**
     * Проверяет текст на наличие нецензурных слов и обрабатывает их.
     *
     * @param {string} text - Текст для проверки.
     * @param {string} replace - Строка для замены нецензурных слов. Если null, возвращается фрагмент текста с найденным словом.
     * @returns {ParseOut} - Результат проверки и обработки текста.
     */
    static parse(text: string, replace: string): ParseOut {
        if (!text) {
            return { isFindBadWords: false, text };
        }

        const processedText = this.processText(text);
        const matches = this.findMatches(processedText);

        if (!matches) {
            return { isFindBadWords: false, text };
        }

        if (replace !== null) {
            const replacedText = this.replaceMatches(text, matches, replace);
            return { isFindBadWords: true, text: replacedText };
        }

        const fragment = this.getFragment(processedText, matches[0]);
        return { isFindBadWords: true, text: fragment };
    }

    /**
     * Обрабатывает текст: приводит к нижнему регистру, заменяет символы, удаляет повторы.
     *
     * @param {string} text - Текст для обработки.
     * @returns {string} - Обработанный текст.
     */
    private static processText(text: string): string {
        let processedText = text.toLowerCase();

        Object.keys(this.CHAR_MAPPING).forEach((standardChar) => {
            const variants = this.CHAR_MAPPING[standardChar];
            const regex = new RegExp(variants, 'giu');
            processedText = processedText.replace(regex, standardChar);
        });

        processedText = processedText.replace(/([а-яa-z])\1+/g, '$1');
        return processedText.replace(/(\W)(\w+)(\W)/g, '$1 $2 $3');
    }

    /**
     * Ищет совпадения с нецензурными словами в тексте.
     *
     * @param {string} text - Текст для поиска совпадений.
     * @returns {string[] | null} - Массив совпадений или null, если совпадений нет.
     */
    private static findMatches(text: string): string[] | null {
        const badWordsPattern = this.getBadWordsPattern();
        const regex = new RegExp(badWordsPattern, 'giu');
        return text.match(regex);
    }

    /**
     * Заменяет совпадения в тексте на указанную строку.
     *
     * @param {string} text - Текст для замены.
     * @param {string[]} matches - Массив найденных нецензурных слов.
     * @param {string} replace - Строка для замены.
     * @returns {string} - Текст с заменёнными совпадениями.
     */
    private static replaceMatches(text: string, matches: string[], replace: string): string {
        let textToReplace = text;
        const uniqueMatches = [...new Set(matches)];
        uniqueMatches.forEach((match) => {
            const regex = this.getOriginalRegex(match);
            textToReplace = textToReplace.replace(regex, replace);
        });
        return textToReplace;
    }

    /**
     * Возвращает фрагмент текста с нецензурным словом.
     *
     * @param {string} text - Текст для поиска.
     * @param {string} match - Найденное нецензурное слово.
     * @returns {string} - Фрагмент текста с найденным словом.
     */
    private static getFragment(text: string, match: string): string {
        const index = text.indexOf(match);
        return text.substring(index, index + match.length);
    }

    /**
     * Возвращает регулярное выражение для поиска всех вариантов совпадения.
     *
     * @param {string} match - Найденное нецензурное слово.
     * @returns {RegExp} - Регулярное выражение для поиска.
     */
    private static getOriginalRegex(match: string): RegExp {
        let pattern = '';
        for (const c of match) {
            const charRegex = this.CHAR_MAPPING[c] || this.escapeRegExp(c);
            pattern += `${charRegex}+`;
        }
        return new RegExp(pattern, 'giu');
    }

    /**
     * Возвращает шаблон для поиска нецензурных слов.
     *
     * @returns {string} - Шаблон регулярного выражения.
     */
    private static getBadWordsPattern(): string {
        const pretext = this.getPretextPatterns();
        return [
            `(?:${pretext})?[hхx][уyu][ийiеeёяюju]`,
            `(?:${pretext})?[пp][иieеё][зz3]д`,
            `(?:${pretext})?[eеё][бb6](?=[уyиi]|[ыиiоoaаеeёуy][бвгджзклмнпрстфцчшщ]|л[оаыия]|[нn][уy]|[кk][аa]|[сc][тt])`,
            `(?:${pretext})[eеё][бb6]`,
            'ёб(?=[^а-яa-z]|$)',
            `(?:${pretext})?[бb6][лl][яя]`,
            '[пp][иie][дdg][eеaаoо][рpr]',
            '[мm][уy][дdg][аa]',
            '[жz][оo][пp][аayуыiеeoо]',
            '[мm][аa][нnh][дdg][аayуыiеeoо]',
            '[гg][оo][вvb][нnh][оoаaяеeyу]',
            'f[uу][cс]k',
            'л[оo][хx]',
            '(?<!р)[scс][yуu][kк][aаiи]',
            '(?<!р)[scс][yуu][4ч][кk]',
            `(?:${pretext})?[хxh][еe][рpr](?:[нnh](?:я|ya)|\\s)`,
            '[зz3][аa][лl][уy][пp][аa]',
            ...this.badWordsPatterns,
        ].join('|');
    }

    /**
     * Добавляет новый паттерн в список нецензурных слов.
     *
     * @param {string} pattern - Паттерн для добавления.
     * @throws {Error} - Если паттерн не передан.
     */
    static addBadWordPattern(pattern: string): void {
        if (!pattern) {
            throw new Error('Pattern must be provided');
        }
        this.badWordsPatterns.push(pattern);
    }

    /**
     * Возвращает шаблон для приставок.
     *
     * @returns {string} - Шаблон регулярного выражения.
     */
    private static getPretextPatterns(): string {
        return [
            '[уyоoаa]?(?=[еёeхx])',
            '[вvbсc]?(?=[хпбмгжxpmgj])',
            '[вvbсc]?[ъь]?(?=[еёe])',
            'ё?(?=[бb6])',
            '[вvb]?[ыi]',
            '[зz3]?[аa]',
            '[нnh]?[аaеeиi]',
            '[вvb]?[сc](?=[хпбмгжxpmgj])',
            '[оo]?[тtбb6](?=[хпбмгжxpmgj])',
            '[оo]?[тtбb6][ъь]?(?=[еёe])',
            '[иiвvb]?[зz3](?=[хпбмгжxpmgj])',
            '[иiвvb]?[зz3][ъь]?(?=[еёe])',
            '[иi]?[сc](?=[хпбмгжxpmgj])',
            '([пpдdg]?[оo]([бb6]?(?=[хпбмгжxpmgj])|[бb6][ъь]?(?=[еёe])|[зz3]?[аa])?)',
            '[пp]?[рr]?[оoиi]',
            '[зz3]?[лl]?[оo]',
            '[нnh]?[аa]?[дdg](?=[хпбмгжxpmgj])',
            '[нnh]?[аa]?[дdg][ъь]?(?=[еёe])',
            '[пp]?[оoаa]?[дdg](?=[хпбмгжxpmgj])',
            '[пp]?[оoаa]?[дdg][ъь]?(?=[еёe])',
            '[рr]?[аa]?[зz3сc](?=[хпбмгжxpmgj])',
            '[рr]?[аa]?[зz3сc][ъь]?(?=[еёe])',
            '[вvb]?[оo]?[зz3сc](?=[хпбмгжxpmgj])',
            '[вvb]?[оo]?[зz3сc][ъь]?(?=[еёe])',
            '[нnh]?[еe]?[дdg]?[оo]',
            '[пp]?[еe]?[рr]?[еe]',
            '[oо]?[дdg]?[нnh]?[оo]',
            '[кk]?[oо]?[нnh]?[оo]',
            '[мm]?[уy]?[дdg]?[oоaа]',
            '[oо]?[сc]?[тt]?[оo]',
            '[дdg]?[уy]?[рpr]?[оoаa]',
            '[хx]?[уy]?[дdg]?[оoаa]',
            '[мm]?[нnh]?[оo]?[гg]?[оo]',
            '[мm]?[оo]?[рpr]?[дdg]?[оoаa]',
            '[мm]?[оo]?[зz3]?[гg]?[оoаa]',
            '[дdg]?[оo]?[лl]?[бb6]?[оoаa]',
            '[оo]?[сc]?[тt]?[рpr]?[оo]',
        ].join('|');
    }

    /**
     * Экранирует специальные символы в регулярных выражениях.
     *
     * @param {string} str - Строка для экранирования.
     * @returns {string} - Экранированная строка.
     */
    private static escapeRegExp(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}