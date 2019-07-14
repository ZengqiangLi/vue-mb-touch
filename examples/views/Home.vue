<style lang="less" scoped>
.home {
  height: 100px;
  background-color: #f00;
  text-align: center;
  color: #fff;
}
h1 {
  height: 300px;
  background: #0f0;
}
h2 {
  height: 200px;
  background: #ff0;
}

h3 {
  height: 100px;
  line-height: 100px;
  background: #00f;
  font-size: 12px;
}
</style>


<template>
  <div class="home" v-touch.press.tap.proxy @tap="tap($event)" @press="press">
    <h1 data-proxy>
      <h2 data-proxy>
        <h3>{{a}}</h3>
      </h2>
    </h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Home extends Vue {
  public tap(e: Event) {
    console.log(e);
    const currentTarget = e.currentTarget as HTMLElement;
    this.$data.a = "tap" + currentTarget.tagName;
  }

  public press(e: Event) {
    const currentTarget = e.currentTarget as HTMLElement;
    this.$data.a = "press" + currentTarget.tagName;
  }

  public data() {
    return {
      a: 1
    };
  }
}
</script>
