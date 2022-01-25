<template>
  <el-container>
    <el-aside>
      <FilenameItem v-for="item in fileList" :key="item.filename" :filename="item.filename" :filepath="item.filepath"/>
      <el-row type="flex" align="middle" justify="center">
        <el-button size="small" type="primary" @click="selectDir">添加文件</el-button>
      </el-row>
    </el-aside>
    <el-main>

    </el-main>
  </el-container>
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import {ipcRenderer} from "electron";
import FilenameItem from "@/components/sequence-tag/Filenametem";

export default {
  name: "SequenceTag",
  components: {FilenameItem},
  data() {
    return {
      filenameShow: false
    }
  },
  computed: {
    ...mapState({
      isSideBarCollapse: state => state.sequenceTag.isSideBarCollapse,
      fileList: state => state.sequenceTag.fileList
    })
  },
  methods: {
    ...mapMutations({
      collapseSideBar: 'sequenceTag/collapseSideBar',
      clearFileList: 'sequenceTag/clearFileList',
      addFilename: 'sequenceTag/addFilename',
      removeFilename: 'sequenceTag/removeFilename'
    }),
    menuSelect(index, indexPath) {
      this.collapseSideBar(true);
      console.log(index, indexPath)
    },
    selectDir() {
      ipcRenderer.invoke("selectDir").then(result => {
        const fs = require('fs');
        const path = require("path");

        let state = fs.lstatSync(result);
        if (state.isDirectory()) {
          this.clearFileList();
          fs.readdirSync(result).forEach(filename => {
            this.addFilename({'filename': filename, 'filepath': path.join(result, filename)});
          });
        } else if (state.isFile()) {
          this.addFilename({'filename': path.basename(result), 'filepath': result});
        }
      })
    }
  }
}
</script>

<style scoped>
.el-aside {
  border: 2px solid #000000;
  border-bottom-left-radius: 5px;
}

.el-main {
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
  border-bottom-right-radius: 5px;
}
</style>