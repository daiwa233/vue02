<template>
    <div class="logFund">
         <el-dialog 
            :title="dialog.title" 
            :visible.sync="dialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form 
                    ref="form" 
                    :model="form"
                    :rules="form_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">

                    <el-form-item prop='describe' label="收支描述:">
                        <el-input  v-model="form.describe"></el-input>
                    </el-form-item>

                    <el-form-item prop='model'  label="收支类型">
                        <el-radio v-model="form.model" label="收入" border size="medium">收入</el-radio>
                          <el-radio v-model="form.model" label="支出" border size="medium">支出</el-radio>
                    </el-form-item>

                    <el-form-item prop='moneynum' label="金额">
                        <el-input type="number" v-model="form.moneynum"></el-input>
                    </el-form-item>

                    <el-form-item prop='paymethod' label="收支方式">
                        <div >
                          <el-radio v-model="form.paymethod" label="支付宝" border size="medium">支付宝</el-radio>
                          <el-radio v-model="form.paymethod" label="现金" border size="medium">现金</el-radio>
                          <el-radio v-model="form.paymethod" label="银行卡" border size="medium">银行卡</el-radio>
                          <el-radio v-model="form.paymethod" label="微信" border size="medium">微信</el-radio>
                        </div>
                    </el-form-item>

                     <el-form-item prop='remark' label="备注:">
                        <el-input  v-model="form.remark"></el-input>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="dialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='onSubmit("form")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
  name: "logfound",
  props: {
    dialog: Object,
    form: Object,
    
  },
  data() {
    return {

      
      
      form_rules: {
        describe: [
          { required: true, message: "收支描述不能为空！", trigger: "change" },
          {min:2, max:8,message:'长度在2~8之间',trigger:'blur'}
        ],
        
        moneynum: [
          { required: true, message: "金额不能为空！", trigger: "change"}
        ],
        
      }
    };
  },
  methods: {
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //表单数据验证完成之后，提交数据;
                     
          const url =
          
            this.dialog.option == "add" ? "add" : `edite/${this.form.id}`;
          this.axios.post(`/api/profiles/${url}`, this.form).then(res => {
            // 操作成功
            this.$emit('update'); 
            this.$message({
              message: "保存成功！",
              type: "success"
            });
            this.dialog.show = false;
          }).catch(err=> {
            this.$message.error('出错了，请重试');
          });
        }
      });
    }
  }
};
</script>

