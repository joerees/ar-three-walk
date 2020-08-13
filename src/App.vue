<template>
  <div id="app">
      <router-view />
    </div>
   
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
#app {
  text-align: center;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}



</style>
