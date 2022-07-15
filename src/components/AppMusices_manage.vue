<template>
  <div id="root">
    <!-- 头部区域 -->
    <div class="header">
      <el-button
        type="primary"
        style="float: left; margin-right: 20px"
        @click="refresh"
        >刷新数据</el-button
      >
      <div class="searchType">
        <el-radio v-model="type" label="1">以id搜索</el-radio>
        <el-radio v-model="type" label="2">以歌名搜索</el-radio>
        <el-radio v-model="type" label="3">以作者搜索</el-radio>
      </div>
      <div class="searchBox">
        <el-input placeholder="请输入内容" v-model="searchVal" clearable>
        </el-input>
        <el-button icon="el-icon-search" @click="search"></el-button>
      </div>
    </div>
    <!-- 展示表格 -->
    <div class="table" v-loading.fullscreen.lock="loading">
      <el-table
        ref="multipleTable"
        :data="
          musicList.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        "
        tooltip-effect="dark"
        style="width: 100%"
        size="small"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" width="100" align="center" type="index">
        </el-table-column>
        <el-table-column label="歌曲id" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.mid }}</template>
        </el-table-column>
        <el-table-column label="歌曲" width="500" align="center">
          <template slot-scope="scope">{{ scope.row.musicName }}</template>
        </el-table-column>
        <el-table-column prop="name" label="作者" width="220" align="center">
          <template slot-scope="scope">{{
            scope.row.musicAuthor
          }}</template></el-table-column
        >
        <el-table-column label="歌曲文件地址" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.musicUrl }}</template>
        </el-table-column>
        <el-table-column label="歌词文件地址" width="120" align="center">
          <template slot-scope="scope">{{ scope.row.musicLyricUrl }}</template>
        </el-table-column>
        <el-table-column label="歌曲状态" width="50" align="center">
          <template slot-scope="scope">
            <el-switch
              :value="scope.row.musicStatus == 0 ? true : false"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
              @change="changeMusicStatus(scope.row, $event)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button @click="editMusicInfo(scope.row)">编辑信息</el-button>
            <el-button disabled @click="singleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="musicList.length"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 编辑信息弹出框 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span style="font-size: 22px">请按需填写对应信息 不需要修改请留空</span>
      <!-- <div style="font-size: 28px">
        <el-link type="primary" @click="copyUrl"
          >点我复制默认URL链接前缀</el-link
        >
      </div> -->

      <div class="input">
        <el-input
          style="margin-top: 20px"
          v-model="musicInfoIpt.musicNameIpt"
          placeholder="填写歌曲名"
        >
          <template slot="prepend">歌曲名</template>
        </el-input>
        <el-input
          style="margin-top: 20px"
          v-model="musicInfoIpt.musicAuthorIpt"
          placeholder="填写作者"
        >
          <template slot="prepend">作者名</template>
        </el-input>
        <el-input
          style="margin-top: 20px"
          v-model="musicInfoIpt.musicUrlIpt"
          placeholder="填写歌曲地址"
        >
          <template slot="prepend">歌曲URL</template>
        </el-input>
        <el-input
          style="margin-top: 20px"
          v-model="musicInfoIpt.musicLryicUrlIpt"
          placeholder="填写歌词地址"
        >
          <template slot="prepend">歌词URL</template>
        </el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEditMusicInfo">取 消</el-button>
        <el-button type="primary" @click="confirmEditMusicInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      type: "1",
      musicList: [],
      currentPage: 1,
      pageSize: 8,
      searchVal: "",
      musicInfoIpt: {
        musicNameIpt: "",
        musicAuthorIpt: "",
        musicUrlIpt: "",
        musicLryicUrlIpt: "",
      },
      editingItem: {},
    };
  },
  methods: {
    refresh() {
      this.loading = true;
      var that = this;
      //获取歌曲列表
      axios({
        method: "get",
        url: "/backStage/manageMusic/getMusicList",
        timeout: 10000,
      })
        .then((res) => {
          that.loading = false;
          that.musicList = res.data;
        })
        .catch((err) => {
          that.loading = false;
          that.$message.error(err.message);
        });
    },
    cancelEditMusicInfo() {
      this.dialogVisible = false;
      this.musicInfoIpt = {};
      this.editingItem = {};
    },
    copyUrl() {
      var textareaEl = document.createElement("textarea");
      textareaEl.setAttribute("readonly", "readonly"); // 防止手机上弹出软键盘
      textareaEl.value = "http://www.zzyyyds.xyz/ZMusicFiles/music/";
      document.body.appendChild(textareaEl);
      textareaEl.select();
      var res = document.execCommand("copy");
      document.body.removeChild(textareaEl);
      Message.success("已复制BASE_URL到剪切板");
    },
    changeMusicStatus(item, val) {
      var that = this;
      const mid = item.mid;
      const targetVal = val ? 0 : 1;
      this.$confirm("此操作将影响所有存在此歌曲的用户列表, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          that.loading = true;
          axios({
            method: "post",
            url: "/backStage/manageMusic/changeMusicStatus",
            timeout: 10000,
            params: { mid, targetVal },
          })
            .then((res) => {
              that.loading = false;
              if (res.data.statusCode < 200) return Message.error("服务器出错");
              item.musicStatus == 1
                ? (item.musicStatus = 0)
                : (item.musicStatus = 1);
              Message.success("已更新歌曲状态");
            })
            .catch((err) => {
              that.loading = false;
              console.log(err);
              Message.error("出错了", err.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    search() {},
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
    },
    handleSelectionChange() {},
    confirmEditMusicInfo() {
      var that = this;
      this.loading = true;
      //排查是否有修改
      this.musicInfoIpt.musicNameIpt.trim() == ""
        ? (this.musicInfoIpt.musicNameIpt = this.editingItem.musicName)
        : (this.musicInfoIpt.musicNameIpt = this.musicInfoIpt.musicNameIpt);
      //-------------
      this.musicInfoIpt.musicAuthorIpt.trim() == ""
        ? (this.musicInfoIpt.musicAuthorIpt = this.editingItem.musicAuthor)
        : (this.musicInfoIpt.musicAuthorIpt = this.musicInfoIpt.musicAuthorIpt);
      //-------------
      this.musicInfoIpt.musicUrlIpt.trim() == ""
        ? (this.musicInfoIpt.musicUrlIpt = this.editingItem.musicUrl)
        : (this.musicInfoIpt.musicUrlIpt = this.musicInfoIpt.musicUrlIpt);
      //-------------
      this.musicInfoIpt.musicLryicUrlIpt.trim() == ""
        ? (this.musicInfoIpt.musicLryicUrlIpt = this.editingItem.musicLyricUrl)
        : (this.musicInfoIpt.musicLryicUrlIpt =
            this.musicInfoIpt.musicLryicUrlIpt);
      //结束排查
      this.musicInfoIpt.mid = this.editingItem.mid;
      axios({
        method: "post",
        url: "/backStage/manageMusic/editMusicInfo",
        timeout: 10000,
        params: that.musicInfoIpt,
      })
        .then((res) => {
          if (res.data.statusCode < 200) return Message.error("服务器返回出错");
          that.loading = false;
          that.dialogVisible = false;
          Message.success("已更新歌曲信息");
          that.musicInfoIpt = {};
          that.editingItem = {};
        })
        .catch((err) => {
          that.loading = false;
          that.musicInfoIpt = {};
          that.editingItem = {};
          console.log(err);
          Message.error("出错了", err);
        });
    },
    editMusicInfo(item) {
      // console.log(item);
      this.dialogVisible = true;
      this.editingItem = item;
    },
    singleDelete(item) {
      console.log(item);
    },
  },
  watch: {
    type(val) {
      switch (val) {
        case "1":
          Message.success("已切换为ID搜索模式");
          break;
        case "2":
          Message.success("已切换为歌曲名搜索模式");
          break;
        case "3":
          Message.success("已切换为作者搜索模式");
          break;
      }
    },
  },
  beforeMount() {
    var that = this;
    //获取歌曲列表
    axios({
      method: "get",
      url: "/backStage/manageMusic/getMusicList",
      timeout: 10000,
    })
      .then((res) => {
        that.musicList = res.data;
      })
      .catch((err) => {
        that.$message.error(err.message);
      });
  },
};
</script>
 
<style lang="less" scoped>
.pagination {
  position: fixed;
  width: 500px;
  bottom: -10px;
  transform: translate(-50%, -50px);
  left: 60%;
}
.header {
  height: 50px;
  .searchType {
    float: left;
    margin-top: 8px;
  }
  .searchBox {
    display: flex;
    float: right;
    margin-right: 100px;
    width: 500px;
  }
}
</style>