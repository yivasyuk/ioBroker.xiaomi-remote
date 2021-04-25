/**
 * Tests whether the given variable is a real object and not an Array
 * @param it The variable to test
 */
export declare function isObject(it: unknown): it is Record<string, any>;
/**
 * Tests whether the given variable is really an Array
 * @param it The variable to test
 */
export declare function isArray(it: unknown): it is any[];
/**
 * Translates text using the Google Translate API
 * @param text The text to translate
 * @param targetLang The target languate
 * @param yandexApiKey The yandex API key. You can create one for free at https://translate.yandex.com/developers
 */
export declare function translateText(text: string, targetLang: string, yandexApiKey?: string): Promise<string>;
