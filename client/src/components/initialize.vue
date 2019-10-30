<template>
  <div>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
    >
      <el-form :model="form" ref="form" label-width="120px" style="margin:10px;width:auto;">
        <el-form-item label="支付宝余额">
          <el-input v-model="form.zfbBalance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="银行卡余额">
          <el-input v-model="form.cardBalance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="现金余额">
          <el-input v-model="form.cashBalance" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="微信余额">
          <el-input v-model="form.wxBalance" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="open">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "initialize",
  props: {
    dialog: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    }
  },
  methods: {
    submit() {
      this.axios
        .post("/api/profiles/initialize", this.form)
        .then(res => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "修改资产成功"
            });
            this.dialog.show = false;
          }
        })
        .catch(err => {
          this.$message.error("出错了，请重试");
        });
    },
    open() {
      this.$confirm("此操作将更新您的资产, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.submit();
          this.$emit("update");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更改"
          });
        });
    },
    close() {
      this.$emit('update');
      this.dialog.show = false;
    }
  }
};
</script>

<style >
</style>