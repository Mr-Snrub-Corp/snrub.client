<template>
  <div
    class="rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img
      src="/img/nuclear-symbol.png"
      alt="Snrub logo"
      :style="{ width: `${size * 0.7}px`, height: `${size * 0.7}px` }"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 40 });
</script>
