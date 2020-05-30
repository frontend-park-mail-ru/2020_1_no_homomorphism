export let lang;

export async function setLanguage(language) {
    const data = await import(`@/lang/${language}.json`);
    lang = data.default;
    window.localStorage.setItem('lang', language);
}
