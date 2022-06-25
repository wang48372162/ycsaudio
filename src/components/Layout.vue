<template>
  <div class="mx-auto max-w-[500px] px-4 pb-4 text-black">
    <div class="py-4 text-center">
      <RouterLink to="/" class="inline-flex items-center text-[2rem] font-bold">
        <img class="h-10" src="@/assets/logo.png" alt="ycsAudio Logo">
        &nbsp;ycsAudio
      </RouterLink>

      <Search class="text-left" />
    </div>

    <slot />
  </div>
</template>
