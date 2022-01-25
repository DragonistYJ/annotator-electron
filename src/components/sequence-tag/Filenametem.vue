<template>
  <el-row type="flex"
          @mouseenter.native="closeShow = true"
          @mouseleave.native="closeShow = false">
    <el-col :span="22" style="font-size: 0.9em">
      {{ filename }}
    </el-col>
    <el-col :span="2" v-if="closeShow"
            @click.native="removeFilename({'filename': filename, 'filepath':filepath})">
      <i class="el-icon-close"/>
    </el-col>
  </el-row>
</template>

<script>
import {mapMutations} from "vuex";

export default {
  name: "FilenameItem",
  props: {
    filename: String,
    filepath: String
  },
  data() {
    return {
      closeShow: false
    }
  },
  methods: {
    ...mapMutations({
      removeFilename: 'sequenceTag/removeFilename'
    }),
    openFile() {
      console.log("dfsdfs");
    }
  }
}
</script>

<style scoped>
.el-row {
  padding: 0.2em;
}
</style>