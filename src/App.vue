<template>
  <div id="app">
    <router-view />
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
body{
  background-color: rgba(237, 238, 243, 0.411)  ! important;
  padding: 80px 0px 0px 60px;
}
.app-nav{
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 60px;
  z-index: 5000;
  box-sizing: border-box;
  -webkit-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.15);
  -moz-box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.15);
  box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.15);
}
.app-nav img{
  height: 100%;
  padding: 15px;
}
</style>
