<template>
  <div class="hello">
    <h3> AR Demo</h3>
    <ul>
      <li> 
        <router-link to="/walk" class="nav-link" active-class="active">
          THREE.js
        </router-link></li>
      <li> 
        <router-link to="/aframe" class="nav-link" active-class="active">
          A-Frame
        </router-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
