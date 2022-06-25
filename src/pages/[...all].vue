<template>
  <div class="flex h-screen items-center justify-center text-center">
    <div>
      <img
        class="inline-block h-[50px] rotate-[5deg]"
        src="@/assets/logo.png"
        alt="ycsAudio Logo"
      >

      <h2 class="mt-6 text-4xl font-bold">
        頁面不存在！
      </h2>

      <RouterLink
        to="/"
        class="mt-8 inline-block rounded border border-gray-300 px-6 py-1.5"
      >
        回首頁
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTitle } from '@/logic/useTitle'

useTitle('頁面不存在！')
</script>
