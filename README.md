# Russian-Bad-Words

[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Russian-Bad-Word** — это библиотека для поиска и замены нецензурных слов в тексте. Она поддерживает обработку текста на русском и английском языках, учитывает замены символов (например, "з" на "3" или "a" на "@") и позволяет добавлять собственные шаблоны для поиска нецензурных слов.

## Установка

Вы можете установить **Russian-Bad-Word** с помощью npm:

```bash
npm i russian-bad-word-censor
```

с помощью yarn:

```bash
yarn add russian-bad-word-censor
```

## Использование

### Основной пример

Использование
Основной пример

```typescript
import { RuCensor } from 'russian-bad-word-censor';

// Пример текста
const text = "Этот текст содержит нецензурное слово: х*y";

// Проверка и замена нецензурных слов
const result = RuCensor.replace(text, "*");
const isNeededToCheck = RuCensor.isContainsBadWords(text) // bool

console.log(result);
// Output: "Этот текст содержит нецензурное слово: ***"

console.log(isNeededToCheck)
// Output: true
```

## Добавление собственных шаблонов

Вы можете добавлять собственные шаблоны для поиска нецензурных слов:

```typescript
RuCensor.addBadWordPattern('[о][н]');

const text = "Он шёл по дорожке";
const result = RuCensor.replace(text, "*");

console.log(result);
// Output: ** шёл по дорожке 
```

## Добавление слов, которые будут пропущены

Вы можете добавить слова, которые не будут считаться нецензурными:
```typescript
RuCensor.addPassPatterns(/заштрихуй/gi)

const text = "Это слово заштрихуй не будет заменено.";
const result = RuCensor.replace(text, "*");

console.log(result);
// Output: "Это слово заштрихуй не будет заменено."
```

## Очистка списков паттернов

```typescript
// Очистка списка нецензурных слов
RuCensor.clearBadWordPattern();

// Очистка списка слов для пропуска
RuCensor.clearPassPatterns();
```

## API

API
```RuCensor.replace(text: string, replace: string): string```

Проверяет текст на наличие нецензурных слов и заменяет их на указанную строку.

- text: Текст для проверки.

- replace: Строка для замены нецензурных слов.

- Возвращает: Обработанный текст.

```RuCensor.isContainsBadWords(text: string): boolean```

Проверяет текст на наличие нецензурных слов.

- text: Текст для проверки.

- Возвращает: true, если найдены нецензурные слова, иначе false.

```RuCensor.addBadWordPattern(pattern: string): void```

Добавляет новый паттерн для поиска нецензурных слов.

- pattern: Регулярное выражение или строка для поиска.

```RuCensor.addWordsToPass(word: string): void```

Добавляет слово, которое будет пропущено при проверке.

- word: Слово, которое не будет считаться нецензурны

```RuCensor.clearBadWordPattern(): void```
Очищает список паттернов для строгой проверки нецензурных слов и слов добавленных вами.

```RuCensor.clearPassPatterns(): void```
Очищает список паттернов для слов, которые нужно пропустить.

```RuCensor.getPretextPatterns(): string```
Возвращает шаблон для приставок, используемых в нецензурных словах.

- Возвращает: Шаблон регулярного выражения, полезно для добавления новых слов

Идея алгоритма взята у https://github.com/rin-nas/php-censure.
