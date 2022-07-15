<template>
  <div
    id="root"
    v-loading="loading"
    element-loading-text="搜索中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255,255,255)"
  >
    <div class="preview" v-if="previewShow">
      <div class="close">
        <el-button
          size="small"
          type="danger"
          @click="previewShow = false"
          plain
          icon="el-icon-close"
          circle
        ></el-button>
      </div>
      <el-popover
        placement="right-start"
        title="歌词内容预览"
        width="300"
        trigger="manual"
        v-model="previewShow"
        v-if="previewShow"
      >
        <LyricPreview :id="id" />
      </el-popover>
    </div>
    <div class="table">
      <el-table :data="songs" style="width: 100%">
        <el-table-column prop="name" label="歌名" width="180">
        </el-table-column>
        <el-table-column prop="artist" label="作者" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="btnBox">
              <el-button type="primary" size="small" @click="preview(scope.row)"
                >预览</el-button
              >
              <el-button
                type="success"
                size="small"
                @click="chosenLyric(scope.row)"
                >使用</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import apis from "../../mixin";
import LyricPreview from "../components/LyricPreview.vue";
export default {
  name: "LyricSearch",
  data() {
    return {
      loading: true,
      id: undefined,
      previewShow: false,
      songs: [],
    };
  },
  methods: {
    chosenLyric(item) {
      apis.ncmapi.post("lyric", { id: item.id }).then((res) => {
        // console.log(res.data.lrc.lyric);
        this.$bus.$emit("chosenLyric", res.data.lrc.lyric);
      });
    },
    preview(item) {
      //   console.log(item);
      this.id = item.id;
      //   apis.ncmapi.post("lyric", { id }).then((res) => {
      //     console.log(res.data.lrc.lyric);
      //   });
      if (this.previewShow) this.previewShow = false;
      this.$nextTick(() => {
        this.previewShow = true;
      });
    },
  },
  props: ["musicName", "musicAuthor"],
  components: { LyricPreview },
  beforeMount() {
    apis.ncmapi
      .post("/search", {
        keywords: this.musicName + this.musicAuthor,
        limit: 5,
      })
      .then((res) => {
        this.loading = false;
        if (!res.data.result.songs)
          return Message.warning("没有查询到对应歌词");
        var songs = res.data.result.songs;
        // console.log(songs);
        songs.forEach((item) => {
          item.artist = "";
          //   item.artists = item.artists[0].name;
          item.artists.forEach((art) => {
            item.artist += " , " + art.name;
          });
          item.artist = item.artist.slice(2);
        });
        this.songs = songs || [];
        // console.log(this.songs);
      })
      .catch((err) => {
        this.loading = false;
        Message.error("请求超时");
      });
  },
};
</script>

<style scoped>
.btnBox {
  display: flex;
  width: 100px;
}
.close {
  position: absolute;
  top: 75px;
  right: 200px;
  z-index: 99999999;
}
/* .preview {
  height: 400px;
  overflow: scroll;
} */
</style>