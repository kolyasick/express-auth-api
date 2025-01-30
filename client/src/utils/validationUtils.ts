export function handleApiError(
	error: any,
	errors: {
		email: string | null
		password: string | null
		other: string | null
	}
) {
	if (error.response?.data?.message) {
		const message = error.response.data.message
		if (message.includes("email")) {
			errors.email = message
		} else if (message.includes("password")) {
			errors.password = message
		} else {
			errors.other = message
		}
	} else {
		errors.other = "Unexpected error"
	}
}

export function validateEmail(email: string, errors: { email: string | null }): boolean {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
	if (!email) {
		errors.email = "Email is required"
		return false
	}
	if (!emailPattern.test(email)) {
		errors.email = "Invalid email address"
		return false
	}
	return true
}

export function validatePassword(password: string, errors: { password: string | null }): boolean {
	if (!password || password.length < 6 || password.length > 15) {
		errors.password = "Password must be 6-15 characters"
		return false
	}
	return true
}
