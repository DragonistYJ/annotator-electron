<template>
  <el-row type="flex" align="middle">
    <el-col style="display: flex; flex-wrap: wrap">
      <div class="word" v-for="(item,idx) in tokens" :key="idx">
        <el-button type="text" @click="wordClick(item)"
                   style="color: #000000; font-size: 1em; padding: 0">
          {{ item.word }}
        </el-button>
        <el-tag v-if="item.tag !== 'other'" type="success">
          {{ item.tag }}
        </el-tag>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "Sentence",
  props: {
    tokens: Array
  },
  computed: {
    ...mapState({
      currentTag: state => state.sequenceTag.currentTag,
      currentStatistics: state => state.sequenceTag.currentStatistics
    })
  },
  methods: {
    ...mapMutations({
      addStatistics: 'sequenceTag/addStatistics',
      subStatistics: 'sequenceTag/subStatistics'
    }),
    wordClick(token) {
      this.addStatistics(this.currentTag);
      this.subStatistics(token.tag);
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
