<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { limits, useAuthStore } from "@/features/auth";
import { ApiError } from "@/shared/http";
import { AppAlert, AppButton, AppSpinner } from "@/shared/ui";
import StudiesAppBar from "../components/StudiesAppBar.vue";
import StudiesEmptyState from "../components/StudiesEmptyState.vue";
import StudyListItem from "../components/StudyListItem.vue";
import { useStudyListStore } from "../stores/studyListStore";

const { t } = useI18n();
const router = useRouter();
const studies = useStudyListStore();
const auth = useAuthStore();
const errorCode = ref<string | null>(null);
const loggingOut = ref(false);

const errorMessage = computed(() =>
  errorCode.value
    ? t(`errors.${errorCode.value}`, t("errors.INTERNAL_ERROR"))
    : null,
);

const canCreate = computed(() => limits.canCreateStudy());
const showCreateInHeader = computed(
  () => auth.isAuthenticated && canCreate.value && studies.data.length > 0,
);
const showLimitWarning = computed(
  () => auth.isAuthenticated && !canCreate.value,
);
const isLoading = computed(
  () => studies.status === "loading" || studies.status === "idle",
);
const isEmpty = computed(
  () => studies.status === "success" && studies.data.length === 0,
);

onMounted(async () => {
  try {
    await studies.fetchStudies();
  } catch (err) {
    errorCode.value = err instanceof ApiError ? err.code : "INTERNAL_ERROR";
  }
});

async function onLogout() {
  if (loggingOut.value) return;
  loggingOut.value = true;
  try {
    await auth.logout();
    await router.push({ name: "login" });
  } finally {
    loggingOut.value = false;
  }
}

async function onCreate() {
  await router.push({ name: "studies-create" });
}
</script>

<template>
  <main class="min-h-screen bg-background">
    <StudiesAppBar
      :app-name="t('common.appName')"
      :display-name="auth.user?.displayName ?? null"
      :logout-label="loggingOut ? t('common.loading') : t('common.logout')"
      :logging-out="loggingOut"
      @logout="onLogout"
    />

    <div class="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div
        class="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4"
      >
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-foreground">
            {{ t("studies.home.title") }}
          </h1>
          <p class="text-sm text-muted">{{ t("studies.home.subtitle") }}</p>
        </div>
        <AppButton
          v-if="showCreateInHeader"
          color="primary"
          class="w-fit shrink-0"
          @click="onCreate"
        >
          {{ t("studies.home.create") }}
        </AppButton>
        <AppAlert v-else-if="showLimitWarning" tone="warning">
          {{ t("errors.STUDY_CREATE_LIMIT_REACHED") }}
        </AppAlert>
      </div>

      <AppAlert v-if="errorMessage" tone="error">
        {{ errorMessage }}
      </AppAlert>

      <AppSpinner
        v-if="isLoading"
        :label="t('common.loading')"
        label-visible
      />

      <StudiesEmptyState
        v-else-if="isEmpty"
        :empty-message="t('studies.home.empty')"
        :create-label="t('studies.home.create')"
        :can-create="canCreate"
        @create="onCreate"
      />

      <ul v-else class="flex flex-col gap-3">
        <StudyListItem
          v-for="study in studies.data"
          :key="study.id"
          :title="study.title"
          :objective="study.objective"
          :status="study.status"
        />
      </ul>
    </div>
  </main>
</template>
