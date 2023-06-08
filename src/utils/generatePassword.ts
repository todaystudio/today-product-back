export function generatePassword(): string {
	const length = 6
	let password = ''
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
	const charactersLength = characters.length
	for (let i = 0; i < length; i++) {
		password += characters.charAt(Math.floor(Math.random() * charactersLength))
	}
	return password
}
