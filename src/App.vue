<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue'
import { debounce, atou, utoa } from './utils'
import CodeMirror from './codemirror/CodeMirror.vue'

const serializedState = location.hash.slice(1);
const saved = atou(serializedState);

const svgFile = ref(saved)
const escapedSvg = computed(() => encodeURIComponent(svgFile.value))
const dataSvg = computed(() => 'data:image/svg+xml;utf8,' + escapedSvg.value)

const svgParent = ref("object")

const rawFileUrl = computed(()=>{ return location.origin + '/svg/' +  utoa(svgFile.value)})
watchEffect(() => history.replaceState({}, '', '#' + utoa(svgFile.value)))

const onChange = debounce((code: string) => {
  svgFile.value = code
}, 250)


const onTabClick = (tabName) => {
  svgParent.value = tabName
}
</script>

<template>
<div class="editor-area">
  <!--fieldset>
    <legend>Code</legend-->
    <CodeMirror
      @change="onChange"
      :value="svgFile"
    />
  <!--/fieldset-->
</div>
<div class="viewer-area">
  <div class="tab-area">
    <div class="tab-list" role="tabpanel">
      <button role="tab" @click="onTabClick('object')">Object</button>
      <button role="tab" @click="onTabClick('img')">Img</button>
      <button role="tab" @click="onTabClick('inline')">Inline</button>
    </div>
    <div class="raw-url-container">
      <span> Raw: <code><a :href="rawFileUrl">{{rawFileUrl}}</a></code></span>
    </div>
  </div>
  <div class="viewer-container">
    <fieldset v-if="svgParent === 'object'">
      <legend>Object tag</legend>
      <object type="image/svg+xml" :data="dataSvg"></object>
    </fieldset>
    <fieldset v-else-if="svgParent === 'img'">
      <legend>Img tag</legend>
      <img :src="dataSvg">
    </fieldset>
    <fieldset v-else-if="svgParent === 'inline'">
      <legend>Inline SVG tag</legend>
      <svg v-html="svgFile"></svg>
    </fieldset>
  </div>
</div>
</template>

<style>
  .editor-area,.viewer-area {
    --outer-padding: 8px;
    --outer-width: clamp(calc(50vw - var(--outer-padding) * 2),calc(1000000vh - 1000000vw),100vw);
    --outer-height: clamp(calc(50vh - var(--outer-padding) * 2),calc(1000000vw - 1000000vh),100vh);
    width: var(--outer-width);
    height: var(--outer-height);
    max-width: calc(100vw - var(--outer-padding) * 2);
    max-height: calc(100vh - var(--outer-padding) * 2);
    padding: var(--outer-padding);
    margin: 0px;
    display: inline-block;
    display: inline-grid;
  }
  textarea {
    width: 100%;
    width: -webkit-fill-available;
    width: -moz-available;
    height: 100%;
    height: -webkit-fill-available;
    height: -moz-available;
    min-height: 100px;
    min-width: 300px;
  }
  
  .tab-area {
    display:flex;
    width: calc(var(--outer-width) - var(--outer-padding) * 2);
  }
  .tab-list {
    margin-right:10px;
  }
  .raw-url-container {
    white-space:nowrap;
    overflow:hidden;
    text-overflow: ellipsis;
    flex: 1;
  }
  
  .viewer-container {
    overflow-x:scroll;
  }
  
  fieldset {
    width: calc(var(--outer-width) - 132px);
    min-inline-size: auto;
    position: relative;
  }
</style>