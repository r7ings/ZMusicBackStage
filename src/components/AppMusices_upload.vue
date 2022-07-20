<template>
  <div id="root">
    <div
      class="content"
      v-loading.fullscreen="loading"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- 同时上传到网页版歌单 -->

      <div class="WebCard">
        <h1 style="margin-left: 50px">同时上传到Web端榜单</h1>
        <el-select
          style="width: 300px"
          v-model="selectValue"
          clearable
          placeholder="点击同时上传到Web端榜单"
          @change="webCardChange"
          @clear="webPid = 0"
        >
          <el-option
            v-for="(item, index) in webOptions"
            :key="index"
            :label="item.name"
            :value="index"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 上传文件 -->
      <div class="uploadOuter">
        <div class="musicUpload">
          <el-upload
            class="upload"
            drag
            :auto-upload="false"
            :show-file-list="false"
            action=""
            multiple
            :on-change="checkMusicFile"
          >
            <i class="el-icon-upload">上传歌曲</i>
            <div class="el-upload__text">
              将歌曲文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <!-- 进度条 -->
          <el-progress
            style="margin-left: 15px"
            :percentage="musicProgress"
            :status="musicProgress == 100 ? 'success' : null"
          ></el-progress>
          <!-- 左弹窗 -->
          <div class="leftPop">
            <el-popover
              placement="top-start"
              title="网易云音乐歌词文件"
              width="500"
              trigger="manual"
              v-model="leftpopV"
              v-if="leftpopV"
            >
              <div class="closee">
                <el-button
                  size="small"
                  type="danger"
                  @click="leftpopV = false"
                  plain
                  icon="el-icon-close"
                  circle
                ></el-button>
              </div>
              <lyricSearch
                :musicName="musicInfo.musicName"
                :musicAuthor="musicInfo.musicAuthor"
              />
            </el-popover>
          </div>
        </div>

        <div class="lyricUpload">
          <el-upload
            class="upload"
            drag
            :auto-upload="false"
            :show-file-list="false"
            action=""
            multiple
            :on-change="checkLyricFile"
          >
            <i class="el-icon-upload">上传歌词</i>
            <div class="el-upload__text">
              将歌词文件拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
          <el-progress
            style="margin-left: 15px"
            :percentage="LryicProgress"
            :status="LryicProgress == 100 ? 'success' : null"
          ></el-progress>
        </div>
      </div>
      <!-- 填写歌曲信息 -->
      <div class="addToList">
        <el-button style="width: 1000px" type="primary" plain @click="addToList"
          >填写/修改歌曲信息</el-button
        >
        <div style="height: 20px"></div>
        <el-button
          style="width: 1000px"
          type="primary"
          plain
          @click="searchncmLyric"
          >搜索歌词文件</el-button
        >
      </div>
      <!-- 填写歌曲对应信息弹窗 -->
      <el-dialog title="歌曲信息" width="30%" :visible.sync="dialogVisible">
        <el-form :model="musicInfo">
          <el-form-item label="歌曲名" label-width="100px">
            <el-input
              style="width: 320px"
              v-model="musicInfo.musicName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="作者" label-width="100px">
            <el-input
              style="width: 320px"
              v-model="musicInfo.musicAuthor"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addMusicInfoToListConfirm"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 列表信息 -->
      <div class="descriptions">
        <el-descriptions
          title="歌曲详情"
          :column="3"
          border
          style="margin-top: 20px"
          v-show="
            musicInfo.musicName == '' || musicInfo.musicAuthor == ''
              ? false
              : true
          "
        >
          <template slot="extra">
            <el-button type="primary" @click="remove" size="small"
              >移除</el-button
            >
          </template>
          <el-descriptions-item>
            <template slot="label" class="uploadListLable">
              <i class="el-icon-user"></i>
              歌曲名
            </template>
            {{ musicInfo.musicName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label" class="uploadListLable">
              <i class="el-icon-mobile-phone"></i>
              作者
            </template>
            {{ musicInfo.musicAuthor }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 确认上传 -->
      <div class="submitBtn">
        <!-- <el-popconfirm
          v-model="lyricChoosePopV"
          confirm-button-text="网易云歌词"
          @confirm="usencm"
          cancel-button-text="上传的歌词"
          @cancel="useCustom"
          icon="el-icon-info"
          title="检测到上传了歌词文件并且选择了网易云歌词 请选择最终需要上传的歌词"
        >
        </el-popconfirm>
        <el-button style="width: 1000px" type="primary" @click="finnalUpload"
          >上传以上到曲库</el-button
        > -->
        <el-popover placement="top" trigger="manual" v-model="lyricChoosePopV">
          <p>
            检测到上传了歌词文件并且选择了网易云歌词 请选择最终需要上传的歌词
          </p>
          <div style="text-align: right; margin: 0">
            <el-button type="primary" size="mini" @click="usencm"
              >网易云歌词</el-button
            >
            <el-button type="success" size="mini" @click="useCustom"
              >上传的歌词</el-button
            >
          </div>
        </el-popover>
        <el-button style="width: 1000px" type="primary" @click="finnalUpload"
          >上传以上到曲库</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
import LyricSearch from "../components/LyricSearch";
import LyricPreview from "../components/LyricPreview";
export default {
  data() {
    return {
      lyricChoosePopV: false,
      leftpopV: false,
      loading: false,
      webOptions: [],
      appType: "web",
      webPid: 0,
      selectValue: "",
      progressStatus: "warning",
      musicInfo: { musicName: "", musicAuthor: "", musicType: "" },
      dialogVisible: false,
      musicFile: undefined,
      lryicFile: undefined,
      lyricStr: undefined,
      musicProgress: 0,
      LryicProgress: 0,
      uploadKeys: [false, false],
    };
  },
  methods: {
    usencm() {
      Message.success("已选择网易云歌词文件");
      this.lryicFile = undefined;
      this.lyricChoosePopV = false;
      console.log(this.uploadP);
      this.cbFun();
    },
    useCustom() {
      Message.success("已选择本地歌词文件");
      this.lyricStr = undefined;
      this.lyricChoosePopV = false;
      console.log(this.uploadP);
      this.cbFun();
    },
    searchncmLyric() {
      this.leftpopV = true;
    },
    addMusicToCard(appType, pid, mid) {
      var that = this;
      // 以后再做类型辨别
      axios({
        method: "post",
        url: "/backStageShowingManage/web/singleAddToCard",
        params: { pid, mid },
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.statusCode < 200) return Message.error("服务器返回出错");
          // console.log(res.data);
          Message.success("上传到榜单成功");
        })
        .catch((err) => {
          console.log(err);
          Message.error("服务器返回出错", err);
        });
    },
    webCardChange(index) {
      const webPid = index + 1;
      this.webPid = webPid;
    },
    // 移除 初始化
    remove() {
      this.loading = false;
      this.progressStatus = "warning";
      this.musicInfo = { musicName: "", musicAuthor: "" };
      this.musicFile = undefined;
      this.lryicFile = undefined;
      this.lyricStr = undefined;
      this.musicProgress = 0;
      this.LryicProgress = 0;
      this.uploadKeys = [false, false];
      this.leftpopV = false;
    },
    //最终提交
    finnalUpload() {
      var that = this;
      this.uploadP = new Promise((resolve, reject) => {
        if (!(this.uploadKeys[0] && this.uploadKeys[1]))
          return this.$message.error("歌曲必要信息有误");
        if (!this.musicFile) return this.$message.error("请先上传文件");
        if (!this.lryicFile && !this.lyricStr) {
          this.$message.warning("当前歌曲未指定歌词");
        }
        //为没填写作者的歌曲补上unknown的作者
        this.musicInfo.musicAuthor.trim() === ""
          ? (this.musicInfo.musicAuthor = "unknown")
          : null;
        if (this.lryicFile && this.lyricStr) {
          console.log(123);
          this.lyricChoosePopV = true;
          this.cbFun = () => {
            return resolve();
          };
        } else {
          resolve();
        }
      });
      this.uploadP.then(() => {
        const file = new FormData();
        file.append("files", this.musicFile.raw);
        if (this.lryicFile) {
          // console.log("upupup");
          file.append("files", this.lryicFile.raw);
        }
        this.loading = true;
        console.log(file);
        //上传歌曲
        axios({
          method: "post",
          url: "/backStage/uploadMusic",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000,
          data: file,
          params: { musicInfo: that.musicInfo, lyricStr: that.lyricStr },
        })
          .then((res) => {
            that.loading = false;
            if (res.data.statusCode < 200) {
              // console.log(res.data.message, res.data.statusCode);
              that.$message.warning(res.data.message);
            } else {
              //成功的情况在这里
              that.$message.success(res.data.message);
              const mid = res.data.mid;
              //初始化
              that.remove();
              //有附带绑定榜单数据
              if (that.webPid != 0) {
                that.addMusicToCard(that.appType, that.webPid, mid);
              }
            }
          })
          .catch((err) => {
            that.loading = false;
            console.log(err);
            that.$message.error(err.message);
            that.remove();
          });
      });
    },
    //填写歌曲信息
    addToList() {
      if (!this.musicFile) return this.$message.error("请上传歌曲文件");
      if (this.lryicFile && this.lyricStr) {
        this.$message.warning("当前歌曲未指定歌词文件");
      }
      this.uploadKeys[0] = true;
      this.dialogVisible = true;
    },
    addMusicInfoToListConfirm() {
      if (!this.musicInfo.musicName)
        return this.$message.error("请正确填写歌曲对应信息");
      this.dialogVisible = false;
      this.uploadKeys[1] = true;
    },
    //歌曲格式校验
    checkMusicFile(file) {
      let type = file.name.substring(file.name.length - 3);
      //自动解析文件中的歌曲名 这里可以用正则
      let fileName = file.name.substr(0, file.name.length - 4);
      let index = fileName.indexOf("-");
      if (index != -1) {
        let musicAuthor = fileName.substr(0, index).trim();
        let musicName = fileName.substr(index + 1, fileName.length).trim();
        if (!(musicName == "" || musicAuthor == "")) {
          this.$message.success("自动获取歌曲信息成功");
          this.musicInfo.musicName = musicName;
          this.musicInfo.musicAuthor = musicAuthor;
          this.uploadKeys[0] = true;
          this.uploadKeys[1] = true;
          //挂载弹窗 传入歌曲信息去网易云搜索歌词
          if (this.leftpopV) this.leftpopV = false;
          this.$nextTick(() => {
            this.leftpopV = true;
          });
        }
      } else {
        this.$message.warning("自动获取歌曲信息失败！请手动填写");
      }
      //先不要开启ogg 以免ios系统Onended
      // const isMusic = type === "mp3" || type === "ogg";
      const isMusic = type === "mp3" || type === "ncm" || type === "ogg";
      const isLt50M = file.size / 1024 / 1024 < 50;

      if (!isMusic) {
        // return this.$message.error("仅支持MP3/OGG的文件格式");
        return this.$message.error("仅支持MP3/NCM/OGG的文件格式");
      }
      if (!isLt50M) {
        return this.$message.error("单曲不允许超过50M");
      }
      if (type === "ncm") {
        this.$notify.warning({
          title: "提示",
          message:
            "文件为网易云音乐加密文件，此类文件的逆向算法随时可能因为网易云音乐的更新而失效，尽量避免上传ncm格式文件",
          duration: 10000,
        });
      }
      if (type === "ogg") {
        this.$notify.error({
          title: "警告",
          message:
            "文件为ogg类型音频文件，此类文件在ios上播放异常，极度不建议上传ogg格式音乐文件！建议转换格式后上传！",
          duration: 60000,
        });
      }
      this.musicFile = file;
      this.musicInfo.musicType = type;
      this.musicProgress = 100;
      return isMusic && isLt50M;
    },
    // 歌词格式校验
    checkLyricFile(file) {
      let type = file.name.substring(file.name.length - 3);
      const isMusic = type === "lrc";
      const isLt50M = file.size / 1024 / 1024 < 50;

      if (!isMusic) {
        return this.$message.error("仅支持LRC的文件格式");
      }
      if (!isLt50M) {
        return this.$message.error("歌词不允许超过30M");
      }
      Message.success("歌词文件校验通过");
      this.leftpopV = false;
      this.lryicFile = file;
      this.LryicProgress = 100;
      return isMusic && isLt50M;
    },
  },
  components: { LyricSearch, LyricPreview },
  beforeMount() {
    this.$bus.$on("chosenLyric", (str) => {
      Message.success("选择歌词成功");
      this.LryicProgress = 100;
      this.leftpopV = false;
      this.lyricStr = str;
    });
  },
  mounted() {
    var that = this;
    axios({
      method: "get",
      url: "/findMusic/getCards",
      timeout: 10000,
    })
      .then((res) => {
        if (res.data.statusCode < 200) return Message.error("服务器返回出错");
        // console.log(res.data);
        that.webOptions = res.data.cards;
      })
      .catch((err) => {
        console.log(err);
        Message.error("服务器返回出错", err);
      });
  },
};
</script>

<style lang='less'>
.content {
  box-sizing: border-box;
  width: 100%;
  padding: 100px 0 0 300px;
  // background-color: yellow;
  .WebCard {
    margin: 0 0 50px 120px;
  }
  .uploadOuter {
    display: flex;
  }
  .addToList {
    margin-top: 20px;
  }
  .upload .el-upload .el-upload-dragger {
    width: 500px;
    height: 200px;
  }
  .progress {
    margin-top: 30px;
    width: 1000px;
  }
  .descriptions {
    width: 1000px;
    margin-top: 30px;
  }
  .submitBtn {
    width: 1000px;
    margin-top: 30px;
    padding-bottom: 50px;
  }
}
.leftPop {
  position: relative;
  .closee {
    position: absolute;
    top: 5px;
    right: 30px;
    z-index: 999999;
  }
}
</style>