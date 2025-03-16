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
    private static wordsToPass: string[] = ['заштрихуй', 'смузихлёбы'];

    /**
     * Проверяет текст на наличие нецензурных слов и обрабатывает их.
     *
     * @param {string} text - Текст для проверки.
     * @param {string} replace - Строка для замены нецензурных слов.
     * @returns {string} - Результат проверки и обработки текста.
     */
    public static replace(text: string, replace: string): string {
        const words = text.split(/(\s+)/);
        const processedWords = words.map((word) => {
            if (this.wordsToPass.includes(word.toLowerCase())) {
                return word;
            }

            const processedText = this.processText(word);
            const matches = this.findMatches(processedText);

            if (!matches) {
                return word;
            }

            return replace.repeat(word.length);
        });

        return processedWords.join('');
    }

    /**
     * Проверяет текст на наличие нецензурных слов.
     *
     * @param {string} text - Текст для проверки.
     * @returns {boolean} - Результат проверки.
     */
    public static isContainsBadWords(text: string): boolean {
        const words = text.split(/(\s+)/);

        for (const word of words) {
            if (this.wordsToPass.includes(word.toLowerCase())) {
                continue;
            }

            const processedText = this.processText(word);
            const matches = this.findMatches(processedText);

            if (matches) {
                return true;
            }
        }

        return false;
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
            '[пp][иie][дdg][еeёaаoо][рpr]',
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
            '[аa][нnh][уy][сc]',
            '[фf][аa][лl][лl][оo][сc]',
            '[пp][еeё][нnh][иi][сc]',
            '[бb6][зz3сc]?[дdg]?[уyu]?[нnhхx]', // Шаблон для "бздун" и однокоренных
            '[бb6][зz3сc]?[дdg]?[юyu]?[хxh]',   // Шаблон для "бздюх" и однокоренных
            '[бb6][лl][уyu][дdg][иi][лl][иi][щsсc][еe]', // Шаблон для "блудилище"
            `(?:${pretext})?[жj][оo][пp]`, // Шаблон для корня "жоп"
            `(?:${pretext})?[бb6][зz3сc][дdg]`, // Шаблон для корня "бзд"
            `(?:${pretext})?[дdg][рpr][оoюyu][чc]`, // Шаблон для корня "дроч" и "дрюч"
            `(?:${pretext})?[зz3][аa][лl][уy][пp]`, // Шаблон для "залупа"
            `(?:${pretext})?[сc][рr][аa][нnh][тt]`, // Шаблон для "срань"
            `(?:${pretext})?[тt][рr][аa][хxh]`, // Шаблон для "трах"
            `(?:${pretext})?[мm][аa][нnh][дdg]`, // Шаблон для "манда"
            `(?:${pretext})?[кk][оo][нnh][чc]`, // Шаблон для "конч"
            `(?:${pretext})?[мm][аa][сc][тt][уyu][рr]`, // Шаблон для "мастур"
            `(?:${pretext})?[мm][иi][нnh][еe][тt]`, // Шаблон для "минет"
            `(?:${pretext})?[дdg][рr][иi][сc][тt]`, // Шаблон для "дрист"
            `(?:${pretext})?[дdg][рr][а][чc]`,
            `(?:${pretext})?[дdg][рr][о][чc]`,
            `(?:${pretext})?[сc][аa][сc]`, // Шаблон для "сас"
            `(?:${pretext})?[сc][оo][сc]`, // Шаблон для "сос"
            `(?:${pretext})?[пp][еe][дdg][еe][рr][аa][сc]`, // Шаблон для "педерас"
            `(?:${pretext})?[пp][еe][дdg][иi][кk]`, // Шаблон для "педик"
            `(?:${pretext})?[пp][иi][сc][ь]?[кk]`, // Шаблон для "писюк"
            `(?:${pretext})?[пp][иi][сc][юyu][лl]`, // Шаблон для "писюл"
            `(?:${pretext})?[пp][оo][пp][иi][зz3][жj][иi][вv][аa][тt]`, // Шаблон для "попизживать"
            `(?:${pretext})?[яя][бb6][ыy][вv][аa]`, // Шаблон для "ябыва"
            `(?:${pretext})?[пp][иi][зz3][жj][иi]`, // Шаблон для "пизжи"
            `(?:${pretext})?[сc][уyu][чc][аa][рr]`, // Шаблон для "сучар"
            `(?:${pretext})?[сc][уyu][чc][иi][йy]`, // Шаблон для "сучий"
            `(?:${pretext})?[сc][уyu][чc][ь]`, // Шаблон для "суть"
            `(?:${pretext})?[уyu][бb6][лl][юyu][дdg]`, // Шаблон для "ублюд"
            `(?:${pretext})?[фf][аa][лl][лl]?[оo][сc]`, // Шаблон для "фаллос"
            '[хxh][уyu][лl][иiеeё]', // Шаблон для "хули"
            ...this.badWordsPatterns,
        ].join('|');
    }

    /**
     * Добавляет новый паттерн в список нецензурных слов.
     *
     * @param {string} pattern - Паттерн для добавления.
     * @throws {Error} - Если паттерн не передан или не может быть приведённым как regex.
     */
    public static addBadWordPattern(pattern: string): void {
        if (!pattern) {
            throw new Error('Pattern must be provided');
        }

        try {
            new RegExp(pattern);
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new Error('Invalid regular expression pattern');
            } else {
                throw e; 
            }
        }

        this.badWordsPatterns.push(pattern);
    }

    /**
     * Добавляет слова, которые будут обязательно пропущены.
     *
     * @param {string} word - Слово для добавления.
     * @throws {Error} - Если слово не передано.
     */
    public static addWordsToPass(word: string): void {
        if (!word) {
            throw new Error('Provide word to pass');
        }

        const lowerWord = word.toLowerCase();

        if (lowerWord !== word) {
            console.info(`Word to pass: ${word} will be cast to lower case`);
        }

        this.wordsToPass.push(lowerWord);
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
            ''
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