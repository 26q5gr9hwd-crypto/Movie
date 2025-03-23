<script setup>
const emit = defineEmits(['toggleNavbar']);
</script>

<template>
  <input type="checkbox" id="checkbox" @change="emit('toggleNavbar')">
  <label for="checkbox" class="toggle">
      <div class="bars" id="bar1"></div>
      <div class="bars" id="bar2"></div>
      <div class="bars" id="bar3"></div>
  </label>
</template>

<style scoped>
  #checkbox {
    display: none;
  }

  .toggle {
    position: fixed;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition-duration: .3s;
    z-index: 6;
    left: 10px;
    top: 10px;
  }

  .bars {
    width: 100%;
    height: 4px;
    background-color: rgb(202, 209, 207);
    border-radius: 5px;
    transition-duration: .3s;
  }

  #checkbox:checked + .toggle .bars {
    margin-left: 13px;
  }

  #checkbox:checked + .toggle #bar2 {
    transform: rotate(135deg);
    margin-left: 0;
    transform-origin: center;
    transition-duration: .3s;
  }

  #checkbox:checked + .toggle #bar1 {
    transform: rotate(45deg);
    transition-duration: .3s;
    transform-origin: left center;
  }

  #checkbox:checked + .toggle #bar3 {
    transform: rotate(-45deg);
    transition-duration: .3s;
    transform-origin: left center;
  }
</style>
