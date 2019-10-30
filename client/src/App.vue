<template>
  <div id="app">
   <router-view></router-view>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'app',
  components: {
    
  },
  created() {
      if (localStorage.dvaTOKEN) {
           const token = localStorage.dvaTOKEN;
            // 使用jwt-decode解析token，并提交改变到vuex中
            const decode = jwt_decode(token);
            this.$store.commit('initialize', decode)
      }
     
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
 
}
body,
div,
dl,
dt,
dd,
ul,
ol,
li,
h1,
h2,
h3,
h4,
h5,
h6,
pre,
code,
form,
fieldset,
legend,
input,
button,
textarea,
p,
blockquote,
th,
td {
    margin: 0;
    padding: 0;
}

body {
    background: #fff;
    color: #555;
    font-size: 14px;
    font-family: Verdana, Arial, Helvetica, sans-serif;
}

td,
th,
caption {
    font-size: 14px;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    font-weight: normal;
    font-size: 100%;
}

address,
caption,
cite,
code,
dfn,
em,
strong,
th,
i,
b,
strong {
    font-style: normal;
    font-weight: normal;
}

a {
    color: #555;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}

img {
    border: none;
    vertical-align: middle;
}

ol,
ul,
li {
    list-style: none;
}

input,
textarea,
select,
button {
    font: 14px Verdana, Helvetica, Arial, sans-serif;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}


.clearfix:after {
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
}

.clearfix {
    *zoom: 1;
}
</style>
