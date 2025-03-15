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
const text = "Этот текст содержит нецензурное слово: х*y!";

// Проверка и замена нецензурных слов
const result = RuCensor.parse(text, "[цензура]");

console.log(result);
// Output: { isFindBadWords: true, text: "Этот текст содержит нецензурное слово: [цензура]!" }
```
## Добавление собственных шаблонов

Вы можете добавлять собственные шаблоны для поиска нецензурных слов:
```typescript
RuCensor.addBadWordPattern('[с][о][с][а][л]');

const text = "Он сосал леденец";
const result = RuCensor.parse(text, "[цензура]");

console.log(result);
// Output: { "isFindBadWords": true, "text": "Он [цензура] леденец" } 

```

## API
```typescript
RuCensor.parse(text: string, replace: string | null): ParseOut
```
Проверяет текст на наличие нецензурных слов и возвращает результат.

    text: Текст для проверки.

    replace: Строка для замены нецензурных слов. Если null, возвращается фрагмент текста с найденным словом.

    Возвращает: Объект ParseOut с полями:

        isFindBadWords: boolean — найдены ли нецензурные слова.

        text: string — обработанный текст или фрагмент.
```typescript
RuCensor.addBadWordPattern(pattern: string): void
```
Добавляет новый паттерн для поиска нецензурных слов.

    pattern: Регулярное выражение или строка для поиска.

RuCensor.processText(text: string): string

Обрабатывает текст: приводит к нижнему регистру, заменяет символы, удаляет повторы.

    text: Текст для обработки.

    Возвращает: Обработанный текст.

Идея алгоритма взята у https://github.com/rin-nas/php-censure.
