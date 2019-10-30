<template>
  <div class="manage">
    <el-form :inline="true" ref="search_data" :model="search_data">
      <el-form-item label="记录时间筛选:">
        <el-date-picker v-model="search_data.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>--
        <el-date-picker v-model="search_data.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="el-icon-search" @click="onScreeoutMoney()">筛选</el-button>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="screeflag" type="primary" size="small" icon="el-icon-error" @click="clearScreeout()">清除筛选结果</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="onAddMoney()">添加</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="oninitialize()">初始资产</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <!-- 余额组件 --> 
        <balance :initializemoney="initialize" :dataList="fullData"></balance>
      </el-form-item>
    </el-form>
    <div  v-if="tableData.length<=0">暂无记录，去<a @click.prevent="onAddMoney">添加</a>一条</div>
    <el-table v-if="tableData.length > 0" :data="tableData" style="width: 100%" border height="400">
      <el-table-column type="index" label="序号" width="90" align="center"></el-table-column>
      <el-table-column label="创建时间" align="center" width="250" prop="date">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date | dateFormat2 }}</span>
        </template>
      </el-table-column>

      <el-table-column label="收支描述" align="center" width="210" prop="describe">
        <template slot-scope="scope">
          <i class="el-icon-info"></i>
          <span style="margin-left: 10px">{{ scope.row.describe }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收支类型" align="center" width="210" prop="model">
        <template slot-scope="scope">
          <span :style="{'color': scope.row.model=='支出' ? '#F56C6C' : '#409EFF'}">{{ scope.row.model }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="center" width="210" prop="moneynum">
        <template slot-scope="scope" >
          
          <span :style="{'color': scope.row.model=='支出' ? '#F56C6C' : '#409EFF'}">{{ scope.row.model=='支出' ? '-'+scope.row.moneynum : '+'+scope.row.moneynum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收支方式" align="center" width="210" prop="paymethod">
        <template slot-scope="scope">
          <span style>{{ scope.row.paymethod }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" width="250" prop="remark">
        <template slot-scope="scope">
          
          <span >{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="277" prop="operation">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pagination.page_index"
      :page-sizes="pagination.page_sizes"
      :page-size="pagination.page_size"
      :layout="pagination.layout"
      :total="pagination.total">
    </el-pagination>
    </div>
    <!-- 添加和编辑资金页面 -->
    <Dialog :dialog='dialog' :form='form' @update="getprofile"></Dialog>
    <initialize :dialog ="initializedialog" :form="initialize" @update="update"></initialize>
    
  </div>
</template>

<script>
import Dialog from '../components/dialog.vue'
import initialize from '../components/initialize.vue'
import balance from '../components/banlance.vue'
export default {
  name: "manage",
  components: {
    Dialog,
    initialize,
    balance
  },
  data() {
    return {

      screeflag: true,

      initialize: {
        zfbBalance:'0',
        cardBalance:'0',
        wxBalance: '0',
        cashBalance:'0'
      },
      initializedialog: {
         show: false,
        title: "",
        option: ""
      },
      pagination:{
        page_index:1, //当前页码
        page_sizes: [10,15,20],
        page_size: 10,
        total: 0, 
        layout:"total, sizes, prev, pager, next, jumper",
      },
      // 全部数据
      fullData: [],
      // 表格中展示的数据
      tableData: [],
      // 供过滤的全部数据
      filterData: [],
      search_data: {
        startTime: '',
        endTime: ''
      },
       dialog: {
        show: false,
        title: "",
        option: ""
      },
       form: {
        moneynum: "",
        describe: "",
        paymethod: "支付宝",
        model: "支出",
        id: "",
        remark: ''
      },
    };
  },
  computed: {
    users() {
      return this.$store.getters.userinfo;
    }
  },
  methods: {

    // 用户初始化资金流水内容接口
    getprofile() {
      this.axios({
        method: "get",
        url: `/api/profiles/data/${this.users.name}`
      })
        .then(res => {
          const { data } = res;
          if (data.success) {
            this.fullData =this.filterData = data.data;
            this.pagination.total = this.fullData.length
            // 将数据从容器中遍历出来
            this.tableData = this.fullData.filter((item,i) => {
              return i<this.pagination.page_size;
            })
          } else {
           
            this.$message.error("出错了，刷新试试");
          }
        })
        .catch(err => {
          
          this.$message.error("出错了，刷新试试");
        });
        this.update();
        
    },

    // 后台获取用户资产
    update() {
      this.axios('/api/profiles/initialize').then(res=> {
          
        if (res.data.initializeMoney) {
        const {cardBalance,wxBalance, zfbBalance,cashBalance} =  res.data.initializeMoney;
        this.initialize = {
          cardBalance,
          wxBalance,
          zfbBalance,
          cashBalance
        }
      }
       }).catch(err=> {
         
         this.$message.error('出错了， 请刷新试试')
        });
    },

    // 用户初始化资金对话框
    oninitialize() {
      this.initializedialog={
        show:true,
        title: '添加资产',
      };
      
    },

    // 编辑信息
    handleEdit(index, info) {
      const {_id,describe,model,moneynum,paymethod,remark} = info;
      
      this.form = {
        id: _id,
        describe,
        model,
        moneynum,
        paymethod,
        remark,
        date: Date.now()
      }
       // 编辑
      this.dialog = {
        show: true,
        title: "编辑资金流动信息",
        option: "edite"
      };
    },

    //删除一条信息
    handleDelete(index, info) {
      this.axios({
        method: 'delete',
        url:`/api/profiles/remove/${info._id}`
      }).then(res => {
        if (res.data.success) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.tableData.splice(index, 1);
        }
      }).catch(err => this.$message.error('出错了，刷新试试'))
    },
    //根据时间 筛选数据
    onScreeoutMoney() {
      
      const {startTime, endTime} = this.search_data;
      if (startTime === '' || endTime === '') {
       return this.$message('请先选择开始时间和结束时间再进行筛选');
      }
      this.screeflag = false;
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      
      this.fullData = this.filterData.filter(item => {
        const date = new Date(item.date).getTime();
       
          return start<=date && date<=end;
      })
      // 设置分页的数据，并将数据从容器中遍历出来,
       this.pagination.total = this.fullData.length
      this.tableData = this.fullData.filter((item,i) => {
             return i<this.pagination.page_size;
       })
      
    },

    // 添加流水信息
    onAddMoney() {
      // 初始化form
      this.form = {
        moneynum: "",
        describe: "",
        paymethod: "支付宝",
        model: "支出",
        id: "",
        remark: ''
      };
       // 添加
      this.dialog = {
        show: true,
        title: "添加资金流动信息",
        option: "add"
      };
      
    },
    
    handleSizeChange(val) {
      this.pagination.page_size = val;//改变每页多少数据
      // 将数据从容器中遍历出来
      this.tableData = this.fullData.filter((item,i) => {
          return i<val;
      })
    },

    handleCurrentChange(val) {
     
       const pagesize = this.pagination.page_size;
       const {total} = this.pagination;
       // 判断 剩余数据的个数和pagesize比较
       if (total-pagesize*(val-1) > pagesize) {
         this.tableData = this.fullData.slice(pagesize*(val-1), pagesize*val);
       }else{
         this.tableData = this.fullData.slice(pagesize*(val-1));
       }

       
    },

    // 清除筛选结果
    clearScreeout() {  
      this.screeflag = true;
      this.fullData = this.filterData;
      this.search_data.startTime = this.search_data.endTime = '';

       this.pagination.total = this.fullData.length
       this.tableData = this.fullData.filter((item,i) => {
             return i<this.pagination.page_size;
       })
    }
  },
  created() {
    this.getprofile();

    
  }
};
</script>

<style scoped>
.manage {
  
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination{
  margin-top:10px;
  display: flex;
  justify-content: center;
}

</style>