<template>
  <el-row>
    <el-table :data="abilities" style="width: 100%">
      <el-table-column label="功能">
        <template slot-scope="scope">
          <span>{{ scope.row.ability }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column>
        <template v-slot="scope">
          <el-button size="mini" @click="toAbility(scope.row.target)">
            进入
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
export default {
  name: "Menu",
  data() {
    return {
      abilities: [{'ability': 'NER标注', 'description': '命名实体识别序列标注', 'target': 'sequence-tag'}]
    }
  },
  methods: {
    toAbility(target) {
      this.$router.push(target);
    }
  }
}
</script>

<style scoped>

</style>