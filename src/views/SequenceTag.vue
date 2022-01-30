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
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom: 1em">
          <el-breadcrumb-item :to="{ path: 'menu' }">菜单栏</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentFile }}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-row type="flex" style="margin-bottom: 1em">
          <el-col>
            <el-button v-for="item in tags" :key="item" size="small" @click="tagClick(item)"
                       :class="item === currentTag ? 'button-selected' : ''"
                       style="margin-bottom: 0.4em">
              {{ item }}
            </el-button>
          </el-col>
        </el-row>

        <el-main style="border: none; height: 85%; padding: 0">
          <el-row v-for="(item, idx) in documentShowed" :key="idx">
            <el-col :span="22">
              <Sentence :tokens="item"/>
            </el-col>
            <el-col :span="2">
              <el-button size="mini" @click="openEditDialog(item, (documentPage-1) * documentPageSize + idx)">
                编辑
              </el-button>
            </el-col>
          </el-row>

          <!--编辑句子的弹窗-->
          <el-dialog title="编辑句子" :visible.sync="editDialogVisible">
            <el-row type="flex" align="middle" justify="center">
              <el-col>
                <el-popover placement="top" trigger="click" width="1000"
                            v-for="(item,idx) in editingSentence" :key="idx">
                  <el-row type="flex" align="middle" justify="center">
                    <el-col :span="2" v-if="idx !== 0">
                      <el-button size="mini" @click="mergeToken(idx)">合并前词</el-button>
                    </el-col>
                    <el-col :span="2" v-if="idx !== editingSentence.length -1">
                      <el-button size="mini" @click="mergeToken(idx + 1)">合并后词</el-button>
                    </el-col>
                    <el-col :span="2" v-if="idx !== 0">
                      <el-button size="mini" @click="splitSentence(idx-1)">前分句</el-button>
                    </el-col>
                    <el-col :span="2" v-if="idx !== editingSentence.length -1">
                      <el-button size="mini" @click="splitSentence(idx)">后分句</el-button>
                    </el-col>
                    <el-col :span="2">
                      <el-button size="mini" @click="deleteToken(idx)">删除</el-button>
                    </el-col>
                    <el-col :span="10">
                      <el-input placeholder="请输入内容" v-model="newWord">
                        <template slot="prepend">
                          <el-button size="mini" @click="insertToken(idx)">前插入</el-button>
                        </template>
                        <template slot="append">
                          <el-button size="mini" @click="insertToken(idx + 1)">后插入</el-button>
                        </template>
                      </el-input>
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="item.word" placeholder="请输入内容"/>
                    </el-col>
                  </el-row>
                  <el-button slot="reference" size="small" style="margin-right: 0.4em; margin-bottom: 0.4em">
                    {{ item.word }}
                  </el-button>
                </el-popover>
              </el-col>
            </el-row>
            <el-row type="flex" style="margin-top: 1em">
              <el-col :span="4" v-if="editingSentenceIdx !== 0">
                <el-button type="primary" size="medium" @click="mergePrevious">
                  合并前句
                </el-button>
              </el-col>
              <el-col :span="4" v-if="editingSentenceIdx !== document.length-1">
                <el-button type="primary" size="medium" @click="mergeNext">
                  合并后句
                </el-button>
              </el-col>
            </el-row>
            <div slot="footer" class="dialog-footer">
              <el-button @click="editDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogConfirm">确 定</el-button>
            </div>
          </el-dialog>
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
          <el-col :span="2">
            <el-button type="success" @click="commitChange" size="small">
              提交修改
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="saveAnotherPlace" size="small">
              另存为
            </el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="statisticsShow = true" size="small">
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
          <el-descriptions-item v-for="(value, key, index) in currentStatistics" :key="index">
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
import fs from "fs";
import path from "path";

export default {
  name: "SequenceTag",
  components: {Sentence},
  data() {
    return {
      fileCloseShow: false,
      statisticsShow: false,
      editDialogVisible: false,
      documentPage: 1,
      documentPageSize: 10,
      document: [],
      editingSentence: [],
      editingSentenceIdx: 1,
      newWord: '',
      tags: ['other', 'url', 'email', 'domain', 'ipv4', 'hash', 'mac_address', 'file_path',
        'registry_key_path', 'cve', 'asn', 'bitcoin_address', 'attack', 'malware']
    }
  },
  computed: {
    ...mapState({
      isSideBarCollapse: state => state.sequenceTag.isSideBarCollapse,
      fileList: state => state.sequenceTag.fileList,
      currentFile: state => state.sequenceTag.currentFile,
      currentTag: state => state.sequenceTag.currentTag,
      currentStatistics: state => state.sequenceTag.currentStatistics
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
      changeCurrentFile: 'sequenceTag/changeCurrentFile',
      changeStatistics: 'sequenceTag/changeStatistics'
    }),
    pageSizeChange(size) {
      this.documentPageSize = size;
    },
    pageCurrentChange(page) {
      this.documentPage = page;
    },
    selectDir() {
      ipcRenderer.invoke("selectDir").then(result => {
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
    checkStatistics() {
      let statistics = {};
      for (let i = 0; i < this.document.length; i++) {
        for (let j = 0; j < this.document[i].length; j++) {
          let tag = this.document[i][j]['tag'];
          if (statistics[tag]) {
            statistics[tag] += 1;
          } else {
            statistics[tag] = 1;
          }
        }
      }
      if (JSON.stringify(statistics) !== JSON.stringify(this.currentStatistics)) {
        this.changeStatistics(statistics);
        this.$message({
          showClose: true,
          message: '更新统计数据',
          type: 'success'
        });
      }
    },
    commitChange() {
      this.checkStatistics();
      fs.writeFile(this.currentFile, JSON.stringify({
        document: this.document,
        statistics: this.currentStatistics
      }), 'utf8', err => {
        if (!err) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          });
        }
      })
    },
    saveAnotherPlace() {
      this.commitChange();

      ipcRenderer.invoke("selectDir").then(result => {
        let dirname = result;
        let state = fs.lstatSync(result);
        if (state.isFile()) {
          dirname = path.dirname(result);
        }
        fs.writeFile(path.join(dirname, path.basename(this.currentFile)), JSON.stringify({
          document: this.document,
          statistics: this.currentStatistics
        }), 'utf8', err => {
          if (!err) {
            this.removeFilename({'filename': path.basename(this.currentFile), 'filepath': this.currentFile})
            this.$message({
              showClose: true,
              message: '另存成功',
              type: 'success'
            });
          }
        })
      })
    },
    openEditDialog(sentence, idx) {
      this.editingSentence = sentence;
      this.editingSentenceIdx = idx;
      this.editDialogVisible = true;
    },
    dialogConfirm() {
      this.commitChange();
      this.editDialogVisible = false;
    },
    mergeNext() {
      this.document[this.editingSentenceIdx].push(...this.document[this.editingSentenceIdx + 1]);
      this.document.splice(this.editingSentenceIdx + 1, 1);
      this.commitChange();
      this.editDialogVisible = false;
    },
    mergePrevious() {
      this.document[this.editingSentenceIdx - 1].push(...this.document[this.editingSentenceIdx]);
      this.document.splice(this.editingSentenceIdx, 1);
      this.commitChange();
      this.editDialogVisible = false;
    },
    splitSentence(idx) {
      let newSentence = this.editingSentence.splice(idx + 1, this.editingSentence.length - idx);
      this.document.splice(this.editingSentenceIdx + 1, 0, newSentence);
      this.commitChange();
      this.editDialogVisible = false;
    },
    deleteToken(idx) {
      this.editingSentence.splice(idx, 1);
      this.commitChange();
    },
    mergeToken(idx) {
      let token = this.editingSentence.splice(idx, 1)[0];
      this.editingSentence[idx - 1]['word'] += token['word'];
      this.commitChange();
    },
    insertToken(idx) {
      this.editingSentence.splice(idx, 0, {'word': this.newWord, 'tag': 'other'});
      this.commitChange();
      this.newWord = "";
    },
  },
  watch: {
    currentFile(newVal) {
      this.documentPage = 1;

      fs.readFile(newVal, 'utf8', (err, result) => {
        let data = JSON.parse(result);
        this.document = data.document;
        this.changeStatistics(data.statistics);
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