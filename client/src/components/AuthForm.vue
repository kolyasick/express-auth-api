<script setup lang="ts">
import { reactive, ref, watchEffect } from "vue"
import { useAuthStore } from "@/stores/auth"

const authStore = useAuthStore()
const email = ref<string>("")
const password = ref<string>("")
</script>

<template>
	<div class="min-h-[calc(100vh-64px)] bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
		<div class="relative py-3 sm:max-w-xl sm:mx-auto w-full">
			<div
				class="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-800 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
			<div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
				<div class="max-w-md mx-auto">
					<div>
						<h1 class="text-2xl font-semibold">Login / Register</h1>
					</div>
					<div class="divide-y divide-gray-200">
						<div
							class="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
							<div class="relative">
								<input
									@input="authStore.clearErrors()"
									v-model="email"
									id="email"
									type="text"
									:class="authStore.errors.email ? 'border-red-500' : ''"
									class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="Email address" />
								<label
									for="email"
									class="absolute cursor-text left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
									>Email Address</label
								>
								<p v-if="authStore.errors.email" class="text-red-500">
									{{ authStore.errors.email }}
								</p>
							</div>
							<div class="relative">
								<input
									@input="authStore.clearErrors()"
									v-model="password"
									id="password"
									type="password"
									:class="authStore.errors.password ? 'border-red-500' : ''"
									class="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="Password" />
								<label
									for="password"
									class="absolute cursor-text left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
									>Password</label
								>
								<p v-if="authStore.errors.password" class="text-red-500">
									{{ authStore.errors.password }}
								</p>
							</div>
							<div class="flex justify-between">
								<button
									@click="authStore.auth('login', email, password)"
									class="bg-blue-500 text-white rounded-md px-2 py-1">
									Login
								</button>
								<button
									@click="authStore.auth('register', email, password)"
									class="bg-blue-500 text-white rounded-md px-2 py-1">
									Register
								</button>
							</div>
							<span v-if="authStore.errors.other" class="text-red-500">
								{{ authStore.errors.other }}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style></style>
