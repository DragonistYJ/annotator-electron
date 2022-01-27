<template>
  <el-row type="flex" style="margin-bottom: 1em" align="middle">
    <el-col style="display: flex; flex-wrap: wrap">
      <div class="word" v-for="(item,idx) in tokens" :key="idx">
        <el-button type="text" @click="wordClick(item)"
                   style="color: #000000; font-size: 1em; padding: 0">
          {{ item.word }}
        </el-button>
        <el-tag v-if="item.tag !== 'other'" type="info">
          {{ item.tag }}
        </el-tag>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "Sentence",
  props: {
    tokens: Array
  },
  computed: {
    ...mapState({
      currentTag: state => state.sequenceTag.currentTag
    })
  },
  methods: {
    wordClick(token) {
      token.tag = this.currentTag;
    }
  }
}
</script>

<style scoped>
.word {
  padding: 0.4em 0.4em;
}
</style>