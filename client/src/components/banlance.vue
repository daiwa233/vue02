<template>
  <div>
    <el-popover
     placement="right" 
     width="400" 
     trigger="click">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="color:#3498db">账户资产余额</span>
          
        </div>
        <div :style="{'color': zfbBalance>=0 ? '#2f3542' : '#d63031' }"  class="text item">支付宝余额 <span class="balance">{{ zfbBalance }}</span></div>
        <div :style="{'color': wxBalance>=0 ? '#2f3542' : '#d63031' }"  class="text item">微信余额 <span class="balance">{{ wxBalance }}</span></div>
        <div :style="{'color': cardBalance>=0 ? '#2f3542' : '#d63031' }"  class="text item">银行卡余额 <span class="balance">{{ cardBalance }}</span></div>
        <div :style="{'color': cashBalance>=0 ? '#2f3542' : '#d63031' }"  class="text item">现金余额 <span class="balance">{{ cashBalance }}</span></div>
      </el-card>
      <el-button 
      slot="reference" 
      type="primary" 
      size="small"
      icon="el-icon-circle-plus-outline" 
      >查看余额</el-button>
     
    </el-popover>
  </div>
</template>

<script>
export default {
  data() {
     return {
      
      };
  },
  props:{
    initializemoney: {
      type: Object,
      required: true
    },
    dataList: {
      type: Array,
      required: true
    }
  },
  methods: {
    // 该函数接受两个参数，第一个参数是要计算的余额的字符串表示，this.list中的，第二个参数是this.initializemoney中对应的key
    computedBalance(tocomputed, key) {
      // 注意：刚开始时，props并未获得异步请求到的数据，计算属性
        let  balance = this.initializemoney[key];
        
        
        let data = this.dataList.filter(item => {
          return item.paymethod === tocomputed
        })
        // 不需要进行如下判断
        // if (data.length == 0) {
        //   return zfb;
        // }

        data.forEach((val,i) => {
          if (val.model === '支出') {
            balance -= val.moneynum;
          }else{
            balance += val.moneynum;
          }
        })
        
        return balance;
    }
  },
  computed: {
    zfbBalance() {
      
      return this.computedBalance('支付宝', 'zfbBalance');
    },
    wxBalance() {
      return this.computedBalance('微信', 'wxBalance');
    },
    cardBalance() {
      return this.computedBalance('银行卡', 'cardBalance');
    },
    cashBalance() {
      return this.computedBalance('现金', 'cashBalance');
    }
  },
  // 注意：刚开始时，props并未获得异步请求到的数据
  // mounted() {
  //   console.log(this.initializemoney, this.dataList)
  //    console.log(this.zfbBalance)
  // }

};
</script>

<style scoped>
.text {
  font-size: 14px;
}
.balance{
  margin-left:1rem;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 400px;
}
</style>