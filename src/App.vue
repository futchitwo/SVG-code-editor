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
      <button role="tab" @click="onTabClick('text')">Base64</button>
    </div>
    <div class="raw-url-container">
      <span> Raw: <code><a :href="rawFileUrl">{{rawFileUrl}}</a></code></span>
    </div>
  </div>
  <div class="viewer-container">
    <fieldset v-if="svgParent === 'object'">
      <legend>Object tag</legend>
      <div class="svg-wrapper">
        <object type="image/svg+xml" :data="dataSvg"></object>
      </div>
    </fieldset>
    <fieldset v-else-if="svgParent === 'img'">
      <legend>Img tag</legend>
      <div class="svg-wrapper">
        <img :src="dataSvg">
      </div>
    </fieldset>
    <fieldset v-else-if="svgParent === 'inline'">
      <legend>Inline SVG tag</legend>
      <div class="svg-wrapper">
        <svg v-html="svgFile"></svg>
      </div>
    </fieldset>
    <fieldset v-else-if="svgParent === 'text'">
      <legend>Encoded text (base64)</legend>
      <div class="svg-wrapper">
        <span class="encoded-text">{{dataSvg}}</span>
      </div>
    </fieldset>
  </div>
</div>
</template>

<style>
  .editor-area,.viewer-area {
    --outer-padding: 8px;
    --outer-width: clamp(50vw,calc(1000000vh - 1000000vw),100vw);
    --outer-height: clamp(50vh,calc(1000000vw - 1000000vh),100vh);
    width: var(--outer-width);
    height: var(--outer-height);
    padding: var(--outer-padding);
    margin: 0px;
    display: inline-grid;
    box-sizing:border-box;
  }
  
  .tab-area {
    display:flex;
    overflow: hidden;
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
    overflow-x: hidden; /* scroll; */
  }
  .svg-wrapper {
    overflow: auto;
  }

  .encoded-text{
    word-break: break-all;
  }
  
  fieldset {
    min-inline-size: auto;
    overflow:hidden;
  }
</style>