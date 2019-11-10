<template lang="html">

  <div class="list">
      <header>
        <label for="" class="formLabelCss">角色名:</label>
        <el-input v-model="userName"  class="formInputCss" clearable placeholder="请输入角色名称"></el-input>
        <label for="" class="formLabelCss">ipv4:</label>
        <el-input v-model="ipv4"  class="formInputCss" clearable placeholder="请输入ipv4"></el-input>
        <label for="" class="formLabelCss">时长:</label>
        <el-input v-model="createTime"  class="formInputCss" clearable placeholder="请输入时长"></el-input>
        <el-button type="primary" class="searchBtn" icon="el-icon-search" @keyup.enter.native="searchUsers"  @click="searchUsers">查询用户</el-button>
        <el-button type="text" @click="clear">清空</el-button>
      </header>
      <nav>
        <el-button type="primary" class="addBtn" @click="addUserForm = true" icon="el-icon-plus">添加用户</el-button>
      </nav>
      <main>
          <el-table :data="userData" stripe element-loading-text="拼命加载中" header-row-class-name="tableHeader"
                    v-loading.fullscreen.lock="loading" empty-text="亲，暂时没有数据哦" border style="width: 100%">
            <el-table-column fixed prop="name" label="用户名" align="center" width="100"></el-table-column>
            <el-table-column prop="ipv4" label="ipv4" align="center" width="100"></el-table-column>
            <el-table-column prop="apiUrl" label="apiUrl" align="center" width="300"></el-table-column>
            <el-table-column prop="createTime" label="购买时长" align="center" width="100"></el-table-column>
            <el-table-column label="操作" align="center" width="300">
              <template slot-scope="scope">
                <el-button size="small" type="success" @click="modify(scope.row)">修改</el-button>
                <el-button type="danger" size="small" @click="deleteUser(scope.row['_id'])">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="paginationShow"
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="3"
            layout="total, prev, pager, next, jumper"
            :total="length">
            </el-pagination>
      </main>
    <!--新增角色信息-->
    <el-dialog title="新增角色" :visible.sync="addUserForm" class="addArea" modal custom-class="addUserArea" @close="closeAdd('addUserData')">
      <el-form :model="addUserData" class="addForm" status-icon ref="addUserData">
        <el-form-item label="用户名：" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addUserData.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="ipv4：" :label-width="formLabelWidth" prop="ipv4">
          <el-input v-model="addUserData.ipv4" auto-complete="off" placeholder="请输入ipv4"></el-input>
        </el-form-item>
        <el-form-item label="服务器：" :label-width="formLabelWidth" prop="apiUrl">
          <el-input v-model="addUserData.apiUrl" auto-complete="off" placeholder="请输入服务器"></el-input>
        </el-form-item>
        <el-form-item label="购买时长：" :label-width="formLabelWidth" prop="createTime">
          <el-input v-model="addUserData.createTime" auto-complete="off" placeholder="请输入购买时长"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserForm = false">取 消</el-button>
        <el-button type="primary" @click="addUserSure('addUserData')">确 定</el-button>
      </div>
    </el-dialog>

<!-- 修改数据 -->
  <el-dialog title="修改数据" :visible.sync="modifyUserVisible" class="addArea" modal custom-class="addFormArea" @close="closeModify('modifyData')">
    <el-form :model="modifyData" class="addForm"  status-icon ref="modifyData">
      <el-form-item label="用户名：" :label-width="formLabelWidth" prop="name">
        <el-input v-model="modifyData.name" auto-complete="off" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="ipv4：" :label-width="formLabelWidth" prop="ipv4">
        <el-input v-model="modifyData.ipv4" auto-complete="off" placeholder="请输入ipv4"></el-input>
      </el-form-item>
      <el-form-item label="服务器：" :label-width="formLabelWidth" prop="apiUrl">
        <el-input v-model="modifyData.apiUrl" auto-complete="off" placeholder="请输入服务器"></el-input>
      </el-form-item>
      <el-form-item label="购买时长：" :label-width="formLabelWidth" prop="createTime">
        <el-input v-model="modifyData.createTime" auto-complete="off" placeholder="请输入购买时长"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="modifyUserVisible = false">取 消</el-button>
      <el-button type="primary" @click="modifySure('modifyData')">确 定</el-button>
    </div>
  </el-dialog>



  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: "list",
  data: function() {
    return {
        modifyUserVisible: false,
      addUserForm: false,
      addUserData: {
          name: '',
          ipv4: '',
          apiUrl: '',
          createTime: ''
      },
        modifyData: {
          name: '',
          ipv4: '',
          apiUrl: '',
          createTime: ''
      },
      title: "hello world",
      paginationShow: true,
      userName: '',
      ipv4: '',
      createTime: '',
        apiUrl: '',
      // 校验规则
      rules: {
        heroName: [
          { required: true, message: "请输入英雄名称", trigger: "blur" }
        ],
        age: [
          { required: true, message: "请输入英雄年龄", trigger: "blur" },
          { type: "number", message: "年龄必须为数字值" }
        ],
        heroSex: [
          { required: true, message: "请选择英雄性别", trigger: "change" },
          { required: true, message: "请选择英雄性别", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入英雄籍贯", trigger: "blur" }
        ],
        heroPosition: [
          {
            required: true,
            message: "至少选择一个英雄位置",
            trigger: "change"
          },
          { required: true, message: "至少选择一个英雄位置", trigger: "blur" }
        ],
        favourite: [
          { required: true, message: "请输入英雄台词", trigger: "blur" }
        ],
        explain: [
          { required: true, message: "请输入英雄背景", trigger: "blur" }
        ]
      },
      currentPage: 1, //当前页数
      pageNumber: 1, //第几页
      pageRow: 3, //每页多少条
      length: 0, //共有多少条
      searchUserUrl: './getUserList',
      addUserUrl: './addUser',
      modifyUrl: "./modifyUser",
      deleteUrl: "./deleteUser",
      userData: [],
      addFormVisible: false,
      addpicVisible: false,
      modifyId: "",
      addpicId: "",
      addpicform: {
        url: ""
      },
      formLabelWidth: "120px",
      loading: false
    };
  },
  methods: {
    // 清除查询条件
    clear() {
      this.userName = '';
      this.ipv4 = '';
      this.createTime = '';
    },
    //查询用户
    searchUsers() {
        const searchParmas = {
            name: this.userName,
            ipv4: this.ipv4,
            createTime: this.createTime,
            apiUrl: this.apiUrl,
            pageNumber: this.pageNumber,
            pageRow: this.pageRow
        };
        request({
            url: this.searchUserUrl,
            method: 'post',
            data: searchParmas
        }).then(response => {
            this.$nextTick(function () {
            })
            if (response.data.status == 'success') {
                this.userData = response.data.userList;
                this.length = response.data.total
            } else {
                this.userData = []
                this.$message({
                    message: "查询出错，请重试!",
                    type: "error"
                });
            }
        })
    },

    //页数改变时出发的函数
    handleCurrentChange: function(val) {
      this.pageNumber = `${val}`;
      this.searchUsers();
    },

    // 关闭添加页面
    closeAdd: function(formName) {
      this.$refs[formName].resetFields();
    },
    // 确认添加
    addSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var that = this;
          this.addFormVisible = false;
          //调新增接口,在回调函数中刷新一次
          var addObj = this.addForm;

          request({
            url: this.addUrl,
            method: "post",
            data: addObj
          })
            .then(response => {
              this.loading = false;
              if (response.data.status == "success") {
                this.$message({
                  message: response.data.message,
                  type: "success",
                  onClose: function() {
                    that.search();
                  }
                });
              } else {
                this.$message({
                  message: "新增失败",
                  type: "error"
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //确认添加用户
    addUserSure(addUserData) {
        var that = this;
        this.addUserForm = false;
        //调新增接口,在回调函数中刷新一次
        var addObj = this.addUserData;

        request({
            url: this.addUserUrl,
            method: "post",
            data: addObj
        })
            .then(response => {
                this.loading = false;
                if (response.data.status == "success") {
                    this.$message({
                        message: response.data.message,
                        type: "success",
                        onClose: function() {
                            that.searchUsers();
                        }
                    });
                } else {
                    this.$message({
                        message: "新增失败",
                        type: "error"
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    // 关闭dialog的函数
    closeModify: function(formName) {
      this.$refs[formName].resetFields();
    },

    //修改操作
    modify(row) {
        this.modifyUserVisible = true;
      this.modifyData = Object.assign({}, row);
      this.modifyId = row["_id"];
    },

    // 确认修改
    modifySure(formName) {
      var that = this;
        request({
        url: `${this.modifyUrl}/${this.modifyId}`,
        method: "put",
        data: this.modifyData
      })
        .then(response => {
          this.modifyUserVisible = false;
          if (response.data.status == "success") {
            this.$message({
              message: response.data.message,
              type: "success",
              onClose: function() {
                that.searchUsers();
              }
            });
          } else {
            console.log(response.data.error);
            this.$message({
              message: "修改失败",
              type: "error",
              onClose: function() {
                that.searchUsers();
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    // 删除操作
    deleteUser(id) {
      var that = this;
      var deleteId = id;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          request({
            url: `${this.deleteUrl}/${deleteId}`,
            method: "delete"
          })
            .then(response => {
              if (response.data.status == "success") {
                this.$message({
                  message: "删除成功",
                  type: "success",
                  onClose: function() {
                    that.searchUsers();
                  }
                });
              } else {
                this.$message({
                  message: "删除失败",
                  type: "error",
                  onClose: function() {
                    that.searchUsers();
                  }
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

/*    //跳转至详情页面
    toDetail: function(id) {
      // 通过本地缓存实现页面之前切换时，保存查询条件
      var queryParmas = {
        heroName: this.heroName,
        heroPosition: this.heroPosition,
        heroSex: this.heroSex,
        currentPage: this.currentPage
      };

      sessionStorage.queryParmas = JSON.stringify(queryParmas);

      this.$router.push(`/league/${id}`);
    },

    //添加图片
    addPic: function(id) {
      this.addpicId = id;
      this.addpicVisible = true;
    },

    // 关闭图片新增
    closePicAdd: function() {
      this.addpicform.url = "";
    },

    //确认新增图片
    addpicSure: function() {
      var that = this;
      //如果没有填入图片地址的话，提示报错
      if (!this.addpicform.url.trim()) {
        this.$notify.error({
          title: "错误",
          message: "请输入正确的图片地址"
        });
        return;
      }

      var addObj = {
        url: this.addpicform.url
      };

      request({
        url: `${this.updetePicUrl}/${this.addpicId}`,
        method: "put",
        data: addObj
      })
        .then(response => {
          this.addpicVisible = false;
          if (response.data.status == "success") {
            this.$notify({
              title: "成功",
              message: "添加图片成功",
              type: "success",
              onClose: function() {
                that.search();
              }
            });
          } else {
            this.$notify({
              title: "失败",
              message: "添加图片失败",
              type: "error",
              onClose: function() {
                that.search();
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }*/
  },
  //页面初始化进来查询数据
  mounted: function() {
    // 进入页面判断是否存在缓存
    /*var sessionObj = sessionStorage.getItem("queryParmas");
    if (sessionObj) {
      var queryParmas = JSON.parse(sessionObj);
      this.heroName = queryParmas.heroName;
      this.heroPosition = queryParmas.heroPosition;
      this.heroSex = queryParmas.heroSex;
      // this.currentPage = queryParmas.currentPage;
      var pagenow = queryParmas.currentPage;
      this.handleCurrentChange(pagenow);
      this.currentPage = queryParmas.currentPage;
    }*/
    this.searchUsers()
  }
};
</script>

<style lang="scss">
// header
header {
  padding: 50px 0;
  .formInputCss {
    width: 220px;
    margin-right: 20px;
  }
  .formLabelCss {
    padding: 0 10px;
  }
  .searchBtn {
    margin-left: 30px;
  }
}

// nav
nav {
  padding: 30px 0;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  margin-bottom: 50px;
}

// main
main {
  .pagination {
    float: right;
    padding: 30px 0;
  }
}
.tableHeader {
  color: #000;
}

div.list {
  width: 90%;
  margin: 0 auto;
}

.addArea .el-input {
  width: 200px;
}
.addPicArea .el-input {
  width: 500px;
}
.addForm {
  overflow: hidden;
}
.addForm .el-form-item {
  float: left;
}
.sexArea {
  width: 200px;
}
.addFormArea {
  .el-dialog__body {
    height: 350px;
  }
  .el-dialog__header .el-dialog__title {
    text-align: left;
  }
}
//新建用户表单样式
  .addUserArea {
    .el-dialog__body {
      height: auto;
    }
    .el-dialog__header .el-dialog__title {
      text-align: left;
    }
  }
</style>
