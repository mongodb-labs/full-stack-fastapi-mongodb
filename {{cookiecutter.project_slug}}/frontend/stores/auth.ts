import {
  IUserProfile,
  IUserProfileUpdate,
  IUserOpenProfileCreate,
  IEnableTOTP,
  IWebToken,
} from "@/interfaces"
import { apiAuth } from "@/api"
import { tokenIsTOTP, tokenParser } from "@/utilities"
import { useToastStore } from "./toasts"
import { useTokenStore } from "./tokens"

export const useAuthStore = defineStore("authUser", {
  state: (): IUserProfile => ({
    id: "",
    email: "",
    email_validated: false,
    is_active: false,
    is_superuser: false,
    full_name: "",
    password: false,
    totp: false
  }),
  persist: {
    storage: persistedState.cookiesWithOptions({
      // https://prazdevs.github.io/pinia-plugin-persistedstate/frameworks/nuxt-3.html
      // https://nuxt.com/docs/api/composables/use-cookie#options
      // in seconds
      path: "/",
      secure: true,
      maxAge: 60 * 60 * 24 * 90,
      expires: new Date(new Date().getTime() + 60 * 60 * 24 * 90),
    }),
  },
  getters: {
    isAdmin: (state) => {
        return (
          state.id &&
          state.is_superuser &&
          state.is_active
        )
    },
    profile: (state) => state,
    loggedIn: (state) => state.id !== "",
    tokenStore: () => {
      // @ts-ignore
      return ( useTokenStore() )
    }
  },
  actions: {
    // AUTHENTICATION
    async logIn(payload: { username: string; password?: string }) {
      // @ts-ignore
      const toasts = useToastStore()
      try {
        await this.tokenStore.getTokens(payload)
        if (this.tokenStore.token && 
            !tokenIsTOTP(this.tokenStore.token)
            ) await this.getUserProfile()
      } catch (error) {
        toasts.addNotice({
          title: "Login error",
          content: "Please check your details, or internet connection, and try again.",
          icon: "error"
        })
        this.logOut()
      }
    },
    async magicLogin(token: string) {
      // @ts-ignore
      const toasts = useToastStore()
      try {
        await this.tokenStore.validateMagicTokens(token)
        if (this.tokenStore.token && 
          !tokenIsTOTP(this.tokenStore.token)
          ) await this.getUserProfile()
      } catch (error) {
        toasts.addNotice({
          title: "Login error",
          content: "Please check your details, or internet connection, and try again.",
          icon: "error"
        })
        this.logOut()
      }
    },
    async totpLogin(claim: string) {
      // @ts-ignore
      const toasts = useToastStore()
      try {
        await this.tokenStore.validateTOTPClaim(claim)
        if (this.tokenStore.token && 
          !tokenIsTOTP(this.tokenStore.token)
          ) await this.getUserProfile()
      } catch (error) {
        toasts.addNotice({
          title: "Login error",
          content: "Please check your details, or internet connection, and try again.",
          icon: "error"
        })
        this.logOut()
      }
    },
    // PROFILE MANAGEMENT
    async createUserProfile(payload: IUserOpenProfileCreate) {
      // @ts-ignore
      const toasts = useToastStore()
      try {
        const { data: response } = await apiAuth.createProfile(payload)
        if (response.value) this.setUserProfile(response.value)
        await this.tokenStore.getTokens({ 
          username: this.email, 
          password: payload.password 
        })
      } catch (error) {
        toasts.addNotice({
          title: "Login creation error",
          content: "Please check your details, or internet connection, and try again.",
          icon: "error"
        })
      }
    },
    async getUserProfile() {
      if (!this.loggedIn) {
        await this.tokenStore.refreshTokens()
        if (this.tokenStore.token) {
          try {
            const { data: response } = await apiAuth.getProfile(this.tokenStore.token)
            if (response.value) this.setUserProfile(response.value)
          } catch (error) {
            this.logOut()
          }
        }
      }
    },
    async updateUserProfile(payload: IUserProfileUpdate) {
      // @ts-ignore
      const toasts = useToastStore()
      await this.tokenStore.refreshTokens()
      if (this.loggedIn && this.tokenStore.token) {
        try {
          const { data: response } = await apiAuth.updateProfile(this.tokenStore.token, payload)
          if (response.value) 
          if (response.value) {
            this.setUserProfile(response.value)
            toasts.addNotice({
              title: "Profile update",
              content: "Your settings have been updated.",
            })
          } else throw "Error"
        } catch (error) {
          toasts.addNotice({
            title: "Profile update error",
            content: "Please check your submission, or internet connection, and try again.",
            icon: "error"
          })
        }
      }
    },
    // MANAGING TOTP
    async enableTOTPAuthentication(payload: IEnableTOTP) {
      // @ts-ignore
      const toasts = useToastStore()
      await this.tokenStore.refreshTokens()
      if (this.loggedIn && this.tokenStore.token) {
        try {
          const { data: response } = await apiAuth.enableTOTPAuthentication(this.tokenStore.token, payload)
          if (response.value) {
            this.totp = true
            toasts.addNotice({
              title: "Two-factor authentication",
              content: response.value.msg,
            })
          } else throw "Error"
        } catch (error) {
          toasts.addNotice({
            title: "Error enabling two-factor authentication",
            content: "Please check your submission, or internet connection, and try again.",
            icon: "error"
          })
        }
      }
    },
    async disableTOTPAuthentication(payload: IUserProfileUpdate) {
      // @ts-ignore
      const toasts = useToastStore()
      await this.tokenStore.refreshTokens()
      if (this.loggedIn && this.tokenStore.token) {
        try {
          const { data: response } = await apiAuth.disableTOTPAuthentication(this.tokenStore.token, payload)
          if (response.value) {
            this.totp = false
            toasts.addNotice({
              title: "Two-factor authentication",
              content: response.value.msg,
            })
          } else throw "Error"
        } catch (error) {
          toasts.addNotice({
            title: "Error disabling two-factor authentication",
            content: "Please check your submission, or internet connection, and try again.",
            icon: "error"
          })
        }
      }
    },
    // mutations are actions, instead of `state` as first argument use `this`
    setUserProfile (payload: IUserProfile) {
      this.id = payload.id
      this.email = payload.email
      this.email_validated = payload.email_validated
      this.is_active = payload.is_active
      this.is_superuser = payload.is_superuser
      this.full_name = payload.full_name
      this.password = payload.password
      this.totp = payload.totp
    },
    async sendEmailValidation() {
      // @ts-ignore
      const toasts = useToastStore()
      await this.tokenStore.refreshTokens()
      if (this.tokenStore.token && !this.email_validated) {
        try {
          const { data: response } = await apiAuth.requestValidationEmail(this.tokenStore.token)
          if (response.value) {
            toasts.addNotice({
              title: "Validation sent",
              content: response.value.msg,
            })
          }
        } catch (error) {
          toasts.addNotice({
            title: "Validation error",
            content: "Please check your email and try again.",
            icon: "error"
          })
        }
      }
    },
    async validateEmail(validationToken: string) {
      // @ts-ignore
      const toasts = useToastStore()
      await this.tokenStore.refreshTokens()
      if (this.tokenStore.token && !this.email_validated) {
        try {
          const { data: response } = await apiAuth.validateEmail(
            this.tokenStore.token,
            validationToken
          )
          if (response.value) {
            this.email_validated = true
            if (response.value) {
              toasts.addNotice({
                title: "Success",
                content: response.value.msg,
              })
            }
          }
        } catch (error) {
          toasts.addNotice({
            title: "Validation error",
            content: "Invalid token. Check your email and resend validation.",
            icon: "error"
          })
        }
      }
    },
    async recoverPassword(email: string) {
      // @ts-ignore
      const toasts = useToastStore()
      if (!this.loggedIn) {
        try {
          const { data: response } = await apiAuth.recoverPassword(email)
          if (response.value) {
            if (response.value.hasOwnProperty("claim")) 
              this.tokenStore.setMagicToken(response.value as unknown as IWebToken)
            toasts.addNotice({
              title: "Success",
              content: "If that login exists, we'll send you an email to reset your password.",
            })
          } else throw "Error"
        } catch (error) {
          toasts.addNotice({
            title: "Login error",
            content: "Please check your details, or internet connection, and try again.",
            icon: "error"
          })
          this.tokenStore.deleteTokens()
        }
      }
    },
    async resetPassword(password: string, token: string) {
      // @ts-ignore
      const toasts = useToastStore()
      if (!this.loggedIn) {
        try {
          const claim: string = this.tokenStore.token
          // Check the two magic tokens meet basic criteria
          const localClaim = tokenParser(claim)
          const magicClaim = tokenParser(token)
          if (localClaim.hasOwnProperty("fingerprint") 
              && magicClaim.hasOwnProperty("fingerprint")
              && localClaim["fingerprint"] === magicClaim["fingerprint"]) {
            const { data: response } = await apiAuth.resetPassword(password, claim, token)
            if (response.value) toasts.addNotice({
              title: "Success",
              content: response.value.msg,
            })
            else throw "Error"
          }
        } catch (error) {
          toasts.addNotice({
            title: "Login error",
            content: "Ensure you're using the same browser and that the token hasn't expired.",
            icon: "error"
          })
          this.tokenStore.deleteTokens()
        }
      }
    },
    // reset state using `$reset`
    logOut () {
      this.tokenStore.deleteTokens()
      this.$reset()
    }
  }
})