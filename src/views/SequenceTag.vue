<template>
  <el-container>
    <el-aside>
      <FilenameItem v-for="(item,idx) in fileList" :key="idx" :filename="item.filename" :filepath="item.filepath"/>
      <el-row type="flex" align="middle" justify="center">
        <el-button size="small" type="primary" @click="selectDir"
                   style="margin-top: 1em">
          添加文件
        </el-button>
      </el-row>
    </el-aside>
    <el-container>
      <el-main>
        <el-row type="flex" style="margin-bottom: 1em">
          <el-col>
            <el-button v-for="item in tags" :key="item" size="small" @click="tagClick(item)"
                       :class="item === currentTag ? 'button-selected' : ''"
                       style="margin-bottom: 0.4em">
              {{ item }}
            </el-button>
          </el-col>
        </el-row>

        <Sentence v-for="(item, idx) in documentShowed" :key="idx" :tokens="item"/>

        <el-row type="flex" justify="center" align="middle">
          <el-col :span="20">
            <el-pagination
                @size-change="pageSizeChange"
                @current-change="pageCurrentChange"
                :current-page="documentPage"
                :page-sizes="[10, 15, 20, 25, 50]"
                :page-size="documentPageSize"
                layout="total, sizes, prev, pager, next"
                :total="document.length">
            </el-pagination>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="commitChange">
              提交修改
            </el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import {ipcRenderer} from "electron";
import FilenameItem from "@/components/sequence-tag/Filenametem";
import Sentence from "@/components/sequence-tag/Sentence";

export default {
  name: "SequenceTag",
  components: {Sentence, FilenameItem},
  data() {
    return {
      filenameShow: false,
      documentPage: 1,
      documentPageSize: 10,
      document: [],
      tags: ['other', 'url', 'email', 'domain', 'ipv4', 'hash', 'mac_address', 'file_path',
        'registry_key_path', 'cve', 'asn', 'bitcoin_address', 'att&ck']
    }
  },
  computed: {
    ...mapState({
      isSideBarCollapse: state => state.sequenceTag.isSideBarCollapse,
      fileList: state => state.sequenceTag.fileList,
      currentFile: state => state.sequenceTag.currentFile,
      currentTag: state => state.sequenceTag.currentTag
    }),
    documentShowed: function () {
      let start = (this.documentPage - 1) * this.documentPageSize;
      return this.document.slice(start, start + this.documentPageSize);
    }
  },
  methods: {
    ...mapMutations({
      collapseSideBar: 'sequenceTag/collapseSideBar',
      clearFileList: 'sequenceTag/clearFileList',
      addFilename: 'sequenceTag/addFilename',
      removeFilename: 'sequenceTag/removeFilename',
      changeCurrentTag: 'sequenceTag/changeCurrentTag'
    }),
    pageSizeChange(size) {
      this.documentPageSize = size;
    },
    pageCurrentChange(page) {
      this.documentPage = page;
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
    },
    tagClick(tag) {
      this.changeCurrentTag(tag);
    },
    commitChange() {
      const fs = require('fs');
      fs.writeFile(this.currentFile, JSON.stringify(this.document), 'utf8', err => {
        if (!err) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          });
        }
      })
    }
  },
  watch: {
    currentFile(newVal) {
      const fs = require('fs');
      fs.readFile(newVal, 'utf8', (err, data) => {
        this.document = JSON.parse(data);
      });
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
}

.el-footer {
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
  border-bottom-right-radius: 5px;
}

.button-selected {
  color: #409EFF;
  border-color: #c6e2ff;
  background-color: #ecf5ff;
}
</style>