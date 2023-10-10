FROM node:18.17 AS build
ENV NODE_ENV=development APP_ENV=development
# ENV PATH /frontend/node_modules/.bin:$PATH
COPY . /frontend
WORKDIR /frontend
RUN yarn install --frozen-lockfile --network-timeout 100000 --non-interactive
RUN yarn build --standalone
EXPOSE ${NUXT_PORT}

FROM build AS run-dev
# ENTRYPOINT ["yarn"]
CMD ["yarn", "dev"]

FROM build AS run-start
ENV NODE_ENV=production APP_ENV=production
ENTRYPOINT ["yarn"]
CMD ["start"]

FROM node:18.17-alpine AS run-minimal
# ARG NEXT_VERSION=^13.5.4
# ARG TAILWINDCSS_VERSION=^4.0.0
# ARG AUTOPREFIXER_VERSION=^10.4.13
# ARG POSTCSS_VERSION=^8.4.18
# ARG ASPECT_RATIO_VERSION=^0.4.2
# ARG FORMS_VERSION=^0.5.3
# ARG TYPOGRAPHY_VERSION=^0.5.7
# ARG HEADLESSUI_VERSION=^1.7.3
# ARG HEROICONS_VERSION=^2.0.12
# ENV NODE_ENV=production APP_ENV=production
# WORKDIR /frontend
RUN yarn install
# nuxt@${NUXT_VERSION} @nuxt/content@${NUXT_CONTENT_VERSION} tailwindcss@${TAILWINDCSS_VERSION} autoprefixer@${AUTOPREFIXER_VERSION} postcss@${POSTCSS_VERSION} @tailwindcss/aspect-ratio@${ASPECT_RATIO_VERSION} @tailwindcss/forms@${FORMS_VERSION} @tailwindcss/typography@${TYPOGRAPHY_VERSION} @headlessui/vue@${HEADLESSUI_VERSION} @heroicons/vue@${HEROICONS_VERSION} @pinia/nuxt@${PINIA_VERSION} @pinia-plugin-persistedstate/nuxt${PINIA_PERSISTED_VERSION} vee-validate@${VEE_VERSION} @vee-validate/i18n${VEE_INT_VERSION} @vee-validate/rules${VEE_RULES_VERSION} qrcode.vue${QR_CODE_VERSION} @nuxtjs/i18n${I18N_VERSION} @nuxtjs/robots${NUXT_ROBOTS_VERSION} @vite-pwa/nuxt${VITE_PWA_NUXT_VERSION}
# COPY --from=build /app/.next ./.next
# COPY --from=build /app/app/api ./api
# COPY --from=build /app/app/assets ./assets
# COPY --from=build /app/app/components ./components
# COPY --from=build /app/app/config ./config
# COPY --from=build /app/app/content ./content
# COPY --from=build /app/app/interfaces ./interfaces
# COPY --from=build /app/app/layouts ./layouts
# COPY --from=build /app/app/locales ./locales
# COPY --from=build /app/app/middleware ./middleware
# COPY --from=build /app/app/pages ./pages
# COPY --from=build /app/app/plugins ./plugins
# COPY --from=build /app/public ./public
# COPY --from=build /app/app/static ./static
# COPY --from=build /app/app/stores ./stores
# COPY --from=build /app/app/utilities ./utilities
# COPY --from=build /app/.env.local ./
# COPY --from=build /app/next.config* ./
# COPY --from=build /app/tailwind.config* ./
# COPY --from=build /app/tsconfig.json ./
ENTRYPOINT [ "yarn" ]
CMD [ "start" ]
