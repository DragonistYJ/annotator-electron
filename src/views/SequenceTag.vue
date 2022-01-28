<template>
  <el-container>
    <el-aside>
      <el-table
          :data="fileList"
          style="width: 100%"
          height="92%">
        <el-table-column
            label="文件名"
            width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.filename }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" circle
                       @click="changeCurrentFile(scope.row.filepath);"/>
            <el-button size="mini" type="danger" icon="el-icon-delete" circle
                       @click="removeFilename({'filename': scope.row.filename, 'filepath':scope.row.filepath})"/>
          </template>
        </el-table-column>
      </el-table>

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

        <el-main style="border: none; height: 88%; padding: 0">
          <Sentence v-for="(item, idx) in documentShowed" :key="idx" :tokens="item"/>
        </el-main>

        <el-row type="flex" justify="center" align="middle">
          <el-col :span="18">
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
          <el-col :span="3">
            <el-button type="success" @click="commitChange">
              提交修改
            </el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="statisticsShow = true">
              标注统计
            </el-button>
          </el-col>
        </el-row>
      </el-main>

      <el-drawer
          title="标注统计"
          :visible.sync="statisticsShow"
          direction="rtl">
        <el-descriptions :column="1" border style="margin: 1em">
          <el-descriptions-item v-for="(value, key, index) in statistics" :key="index">
            <template slot="label">
              {{ key }}
            </template>
            {{ value }}
          </el-descriptions-item>
        </el-descriptions>
      </el-drawer>
    </el-container>
  </el-container>
</template>

<script>
import {mapMutations, mapState} from 'vuex';
import {ipcRenderer} from "electron";
import Sentence from "@/components/sequence-tag/Sentence";

export default {
  name: "SequenceTag",
  components: {Sentence},
  data() {
    return {
      fileCloseShow: false,
      statisticsShow: false,
      documentPage: 1,
      documentPageSize: 10,
      document: [],
      statistics: {},
      tags: ['other', 'url', 'email', 'domain', 'ipv4', 'hash', 'mac_address', 'file_path',
        'registry_key_path', 'cve', 'asn', 'bitcoin_address', 'attack']
    }
  },
  computed: {
    ...mapState({
      isSideBarCollapse: state => state.sequenceTag.isSideBarCollapse,
      fileList: state => state.sequenceTag.fileList,
      currentFile: state => state.sequenceTag.currentFile,
      currentTag: state => state.sequenceTag.currentTag,
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
      changeCurrentTag: 'sequenceTag/changeCurrentTag',
      changeCurrentFile: 'sequenceTag/changeCurrentFile'
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
      fs.readFile(newVal, 'utf8', (err, result) => {
        let data = JSON.parse(result);
        this.document = data.document;
        this.statistics = data.statistics;
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