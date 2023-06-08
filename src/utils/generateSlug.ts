export const generateSlug = (str: string): string => {
	const alphanumeric = str.replace(/[^a-zA-Zа-яА-Я0-9]/g, '-')
	const singleHyphen = alphanumeric.replace(/-{2,}/g, '-')
	return singleHyphen.toLowerCase().replace(/^-+|-+$/g, '')
}
export function genSlug(input: string): string {
	const cyrillicToLatinMap = {
		а: 'a',
		б: 'b',
		в: 'v',
		г: 'g',
		д: 'd',
		е: 'e',
		ё: 'e',
		ж: 'zh',
		з: 'z',
		и: 'i',
		й: 'y',
		к: 'k',
		л: 'l',
		м: 'm',
		н: 'n',
		о: 'o',
		п: 'p',
		р: 'r',
		с: 's',
		т: 't',
		у: 'u',
		ф: 'f',
		х: 'h',
		ц: 'ts',
		ч: 'ch',
		ш: 'sh',
		щ: 'sch',
		ъ: '',
		ы: 'y',
		ь: '',
		э: 'e',
		ю: 'yu',
		я: 'ya',
	}
	const lowercaseInput = input.toLowerCase()
	const alphanumericOnly = lowercaseInput.replace(/[^a-zа-яё0-9\s]/g, '')
	const words = alphanumericOnly.split(/\s+/)
	const kebabCaseWords = words.map((word) => {
		const latinChars = [...word].map((char) => cyrillicToLatinMap[char] ?? char)
		return latinChars.join('')
	})
	const kebabCaseString = kebabCaseWords.join('-')
	return kebabCaseString
}
