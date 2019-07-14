# vue-m-touch
vue-m-touch 是一个vue的移动端的事件项目,内置了点击(press)事件，长按(press)事件

<!-- **[LIVE DEMO]()** -->
demo 后面会抽空写出来

---
## 安装
````
npm install vue-m-touch
````


### 使用方法
1. 安装
2. 引入
3. 在需要监听tap或者press的元素上添加 v-touch 指令 ，后面就可以 像监听 click 事件 一样 使用v-on:tap="fn"的方式监听tap和press事件了

### 示例

````vue

<template>
  <div  v-touch.press.tap @tap="tap" @press="press">
   
  </div>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vueMobileTouch from "vue-m-touch";

Vue.use(vueMobileTouch);

@Component
export default class Home extends Vue {
  public tap() {
    /** tap  */
  }

  public press(e: Event) {
    /** press  */
  }

  public data() {
    return {
     
    };
  }
}
</script>


````
> 开启代理模式


````vue

<template>
  <ul  v-touch.proxy @tap="tap($event)" >
    <li data-proxy data-index="1"></li>
    <li data-proxy data-index="2"></li>
    <li data-proxy data-index="3"></li>
  </ul>
</template>


<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import vueMobileTouch from "vue-m-touch";

Vue.use(vueMobileTouch);

@Component
export default class Home extends Vue {
  public tap(e: event) {
    const currentTarget = e.currentTarget as HTMLElement;
    console.log(currentTarget.tagName.toLowerCase());   // li
    console.log(JSON.stringify(currentTarget.dataset)); // {proxy: "", index: "1"}
  }


  public data() {
    return {
     
    };
  }
}
</script>


````


## 全局配置
在引入 vue-m-touch 时，可以传入一个全局配置对象。该对象目前支持 maxDistance 与 pressTime， maxDistance 用于手指在屏幕上移动多长距离内可触发事件默认10，pressTime 用于手机按住屏幕多长时间触发长按事件,默认650。具体操作如下：
````
import Vue from 'vue';
import vueMobileTouch from "vue-m-touch";

Vue.use(vueMobileTouch, {maxDistance: 10,pressTime: 650});

````

## 指令参数

| 参数名  | 描述 |
|----------|--------------|
| tap | 是否开启tap事件,默认不开启，但是在tap和press都不开启时，则自动开启 |
| press | 是否开启press事件，默认不开启|
| stop | 是否阻止事件冒泡,默认不阻止|
| prevent | 是否阻止游览器默认行为,默认不阻止|
| passive | 是否为passive监听器,如果有该参数，则阻止游览器默认行为无效|
| capture | 是否为捕获监听器,默认不是|
| proxy | 是否开启事件代理模式,默认不开启, 开启后台 在需要触发事件的目标元素上添加  data-proxy 即可 |

----

## 注意
如果是在vue封装的组件上使用 v-touch 指令, 在监听事件时，需要加上 native 参数  

