import { useAuthStore } from "@/stores"

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore()
  if (!authStore.loggedIn) {
    await authStore.getUserProfile()
  }
})