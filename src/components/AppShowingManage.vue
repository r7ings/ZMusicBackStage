<template>
  <div id="root">
    <el-container v-loading.fullscreen.lock="loading">
      <el-tabs value="2" style="width: 100%">
        <!-- 轮播图编辑页面 -->
        <el-tab-pane label="轮播图" name="1">
          <div class="banner">
            <div class="title">轮播图预览</div>
            <el-carousel :interval="5000" type="card" height="300px">
              <el-carousel-item v-for="item in banner" :key="item.index">
                <img :src="item.url" alt="" />
              </el-carousel-item>
            </el-carousel>
          </div>
          <div class="bannerEditBox">
            <el-table :data="banner" style="width: 100%">
              <el-table-column prop="index" label="索引" width="100">
              </el-table-column>
              <el-table-column
                prop="url"
                label="跳转链接"
                width="900"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="img"
                label="图片预览"
                width="180"
                align="center"
              >
                <el-image
                  style="width: 100px; height: 100px"
                  src="http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_1.jpg"
                  :preview-src-list="previewBannerArr"
                >
                </el-image>
              </el-table-column>
              <el-table-column
                prop="changeImg"
                label="更换图片"
                width="180"
                align="center"
              >
                <el-button type="primary" icon="el-icon-upload">上传</el-button>
              </el-table-column>
              <el-table-column
                prop="editUrl"
                label="更换地址"
                width="180"
                align="center"
              >
                <el-button type="primary" icon="el-icon-upload"
                  >更换地址</el-button
                >
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <!-- 发现音乐卡片编辑页面 -->
        <el-tab-pane label="卡片信息" name="2">
          <div class="preview">
            <el-row>
              <el-col
                :span="3"
                v-for="(item, index) in cards"
                :key="index"
                :offset="index > 0 ? 2 : 0"
              >
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="item.imgUrl" alt="" />
                  <div style="padding: 14px; text-align: center">
                    <span>{{ item.name }}</span>
                    <div>
                      <el-button
                        type="text"
                        class="button"
                        @click="editThisCard(item, index)"
                        >让我编辑</el-button
                      >
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div class="dialog">
            <el-dialog
              class="diaContent"
              title="卡片信息"
              :visible.sync="dialogVisible"
              width="50%"
              :append-to-body="true"
              center
              @close="dialogClosde"
            >
              <!-- 上传图片 -->
              <div class="uploadCardImg">
                <el-upload
                  action=""
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleCardImgChange"
                >
                  <el-button type="primary" icon="el-icon-upload"
                    >更换展示图</el-button
                  >
                </el-upload>
              </div>
              <!-- 更换榜单名 -->
              <div class="changeCardName">
                <div class="box">
                  <el-input
                    style="width: 300px"
                    placeholder="输入要更改的榜单名"
                    v-model="changingCardName"
                  >
                    <template slot="prepend">榜单名</template>
                  </el-input>
                  <el-button type="primary" @click="changeCardName" class="btn"
                    >更改</el-button
                  >
                </div>
              </div>
              <!-- 歌曲管理 -->
              <div class="manageCardMusic">
                <el-transfer
                  filterable
                  filter-placeholder="请输入歌曲名"
                  v-model="cardNewData"
                  :data="musicList"
                  :titles="['曲库', '榜单']"
                >
                </el-transfer>
                <el-button type="primary" @click="updateCardList" class="btn"
                  >确认更改</el-button
                >
              </div>
            </el-dialog>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-container>
  </div>
</template>

<script>
import { Message } from "element-ui";
import axios from "axios";
export default {
  name: "AppShowingManage",
  data() {
    return {
      editingPid: 0,
      loading: false,
      musicList: [],
      cardNewData: [],
      dialogVisible: false,
      changingCardName: "",
      cards: [],
      banner: [
        {
          index: "1",
          url: "http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_1.jpg",
        },
        {
          index: "2",
          url: "http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_2.jpg",
        },
        {
          index: "3",
          url: "http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_3.jpg",
        },
        {
          index: "4",
          url: "http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_4.jpg",
        },
      ],
      previewBannerArr: [
        "http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_1.jpg",
        "http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_2.jpg",
        "http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_3.jpg",
        "http://www.zzyyyds.xyz/ZMusicFiles/findMusicImgsWeb/banner/banner_4.jpg",
      ],
    };
  },
  methods: {
    // 修改卡片歌曲列表
    updateCardList() {
      var that = this;
      // this.cardNewData是一个索引数组 先对应出歌曲
      const newList = this.cardNewData;
      const newCardMusicMidList = [];
      this.musicList.forEach((item) => {
        newList.forEach((index) => {
          if (item.key == index) return newCardMusicMidList.push(item.mid);
        });
      });
      //   newCardMusicMidList是更新后的歌曲信息列表
      axios({
        method: "post",
        url: "/backStageShowingManage/web/changeCardList",
        params: { pid: that.editingPid, newList: newCardMusicMidList },
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.statusCode < 200) return Message.error("服务器返回出错");
          // console.log(res.data);
          Message.success("更新成功");
        })
        .catch((err) => {
          console.log(err);
          Message.error("服务器返回出错", err);
        });
    },
    //修改卡片标题
    changeCardName() {
      var that = this;
      //获取卡片信息
      axios({
        method: "post",
        url: "/backStageShowingManage/web/changeCardName",
        params: { pid: that.editingPid, newName: that.changingCardName },
        timeout: 10000,
      })
        .then((res) => {
          if (res.data.statusCode < 200) return Message.error("服务器返回出错");
          // console.log(res.data);
          Message.success("修改成功");
        })
        .catch((err) => {
          console.log(err);
          Message.error("服务器返回出错", err);
        });
    },
    //关闭dialog
    dialogClosde() {
      this.cardNewData = [];
      this.changingCardName = "";
    },
    //上传卡片图片的
    handleCardImgChange() {},
    //点击编辑卡片
    editThisCard(item, index) {
      var that = this;
      this.changingCardName = item.name;
      this.loading = true;
      const placeId = index + 1;
      this.editingPid = placeId;
      //拿到位置id 去数据库找这个位置的卡片的歌曲信息 准备渲染穿梭条
      axios({
        method: "post",
        url: "/findMusic/getCards/getInfos",
        params: { placeId },
        timeout: 10000,
      })
        .then((res) => {
          that.loading = false;
          if (res.data.statusCode < 200) return Message.error("服务器返回出错");
          // console.log(res.data);
          if (res.data.statusCode === 888) return (that.dialogVisible = true);
          that.musicList.forEach((item) => {
            res.data.showingList.forEach((element) => {
              if (element.mid == item.mid)
                return that.cardNewData.push(item.key);
            });
          });
          that.dialogVisible = true;
        })
        .catch((err) => {
          that.loading = false;
          console.log(err);
          Message.error("服务器返回出错", err);
        });
    },
  },
  beforeMount() {
    var that = this;
    //获取卡片信息
    axios({
      method: "get",
      url: "/findMusic/getCards",
      timeout: 10000,
    })
      .then((res) => {
        if (res.data.statusCode < 200) return Message.error("服务器返回出错");
        // console.log(res.data);
        that.cards = res.data.cards;
      })
      .catch((err) => {
        console.log(err);
        Message.error("服务器返回出错", err);
      });
    //获取曲库信息
    axios({
      method: "get",
      url: "/backStage/manageMusic/getMusicList",
      timeout: 10000,
    })
      .then((res) => {
        let musicList = res.data;
        for (let i = 0; i < musicList.length; i++) {
          musicList[i].musicName =
            musicList[i].musicName + "-" + musicList[i].musicAuthor;
          musicList[i].label = musicList[i].musicName;
          musicList[i].key = i;
        }
        that.musicList = musicList;
      })
      .catch((err) => {
        that.$message.error(err.message);
      });
  },
};
</script>

<style lang="less">
.banner {
  height: 330px;
  // background-color: pink;
  margin-right: 30px;
  .title {
    text-align: center;
    font-size: 40px;
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.bannerEditBox {
  margin-top: 80px;
}
.preview {
  margin-top: 40px;
  img {
    width: 100%;
    height: 200px;
  }
}
.uploadCardImg {
  width: 100%;
  .el-upload {
    width: 100%;
    margin: 0 auto;
  }
}
.changeCardName {
  position: relative;
  width: 100%;
  .el-input {
    position: absolute;
    left: 45%;
    top: 20px;
    transform: translate(-50%);
  }
  .el-button {
    position: absolute;
    left: 60%;
    top: 20px;
  }
}
.manageCardMusic {
  width: 100%;
  margin: 80px 0 0 80px;
  .btn {
    margin: 30px 0 0 340px;
  }
}
.el-transfer-panel {
  width: 300px;
}
</style>