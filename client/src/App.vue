<script setup lang="ts">
import { onMounted } from "vue"
import { useAuthStore } from "./stores/auth"
import AuthForm from "./components/AuthForm.vue"
import DefaultLayout from "./layouts/DefaultLayout.vue"

const authStore = useAuthStore()


authStore.getUser()

</script>

<template>
	<div class="flex items-center justify-center h-screen bg-gray-100" v-if="authStore.isLoading">
		<img class="w-20" src="/loader.svg" alt="" />
	</div>
	<DefaultLayout v-else>
		<AuthForm v-if="!authStore.isAuth && !authStore.isLoading" />
		<div class="flex items-center flex-col justify-center h-[calc(100vh-64px)]" v-else>
			<h1 class="text-3xl">HELLO {{ authStore.user?.email }}</h1>
			<p class="text-2xl text-red-500" v-if="!authStore.user?.isActivated">
				Please, activate your account
			</p>
		</div>
	</DefaultLayout>
</template>

<style scoped></style>
