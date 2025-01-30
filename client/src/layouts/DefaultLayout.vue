<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
</script>

<template>
	<header class="bg-[#2C69EC]">
		<div
			class="container mx-auto flex flex-wrap justify-between p-4 text-white"
		>
			<div>
				<a class="text-xl" href="#">LOGO</a>
			</div>
			<nav>
				<ul class="flex items-center justify-between gap-5">
					<li>Home</li>
					<li>About</li>
					<li>Services</li>
					<li>Contacts</li>
				</ul>
			</nav>
			<div>
				<div v-if="!authStore.isLoading">
					<div
						v-if="authStore.isAuth"
						class="flex items-center gap-3"
					>
						<p class="text-xl">{{ authStore.email }}</p>
						<button
							class="bg-red-500 text-white rounded-md px-2 py-1"
							@click="authStore.logout()"
						>
							Logout
						</button>
					</div>
					<p v-else class="text-xl">{{ authStore.email }}</p>
				</div>
				<div v-else>Loading...</div>
			</div>
		</div>
	</header>
	<main>
		<slot />
	</main>
</template>

<style></style>
