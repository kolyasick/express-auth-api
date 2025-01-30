import { apiClient } from "@/axios/config"
import { defineStore } from "pinia"
import { validateEmail, validatePassword, handleApiError } from "@/utils/validationUtils"

interface IUser {
	id: string
	email: string
	isActivated: boolean
}

interface ILoginResponse {
	user: IUser
	token: string
}

interface IErrors {
	email: string | null
	password: string | null
	other: string | null
}

export const useAuthStore = defineStore("auth", {
	state: () => ({
		status: false as boolean,
		user: null as IUser | null,
		isLoading: false,
		errors: {
			email: null,
			password: null,
			other: null,
		} as IErrors,
	}),
	getters: {
		isAuth: (state) => state.status,
		email: (state) => state.user?.email || "Гость",
	},

	actions: {
		set(status: boolean, user: IUser | null) {
			this.$patch({ status, user })
		},

		clearErrors() {
			this.$patch({
				errors: { email: null, password: null, other: null },
			})
		},

		async auth(endpoint: "login" | "register", email: string, password: string) {
			if (
				endpoint === "register" &&
				(!validateEmail(email, this.errors) || !validatePassword(password, this.errors))
			) {
				return
			} else if (endpoint === "login" && (!email || !password)) {
				return
			}

			try {
				this.clearErrors()
				this.isLoading = true

				const { data } = await apiClient.post<ILoginResponse>(endpoint, {
					email,
					password,
				})

				this.set(true, data.user)
				localStorage.setItem("token", data.token)
			} catch (error: any) {
				handleApiError(error, this.errors)
			} finally {
				this.isLoading = false
			}
		},

		async getUser() {
			const token = localStorage.getItem("token")

			if (!token) {
				this.set(false, null)
				return
			}

			try {
				this.isLoading = true

				const res = await apiClient.get<IUser>("/get-user")

				this.set(true, res.data)
			} catch (error: any) {
				this.errors.other = error.response?.data?.message || "Unexpected error"
			} finally {
				this.isLoading = false
			}
		},

		async logout() {
			const token = localStorage.getItem("token")

			if (!token) {
				return
			}

			this.isLoading = true

			try {
				await apiClient.get("/logout")

				this.set(false, null)
				localStorage.removeItem("token")
			} catch (error: any) {
				this.errors.other = error.response?.data?.message || "Unexpected error"
			} finally {
				this.isLoading = false
			}
		},
	},
})
