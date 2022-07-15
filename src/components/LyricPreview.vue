<template>
  <div
    id="root"
    v-loading="loading"
    element-loading-text="获取中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255,255,255)"
  >
    {{ lyric }}
  </div>
</template>

<script>
import apis from "../../mixin";
export default {
  name: "LyricPreview",
  data() {
    return {
      loading: true,
      lyric: undefined,
    };
  },
  props: ["id"],
  beforeMount() {
    // console.log(this.id);
    apis.ncmapi
      .post("lyric", { id: this.id })
      .then((res) => {
        this.loading = false;
        //   console.log(res.data.lrc.lyric);
        if (!res.data.lrc.lyric) return this.$message.warning("歌词获取失败");

        this.lyric = res.data.lrc.lyric;
      })
      .catch((err) => {
        this.loading = false;
        this.$message.error("请求超时");
      });
  },
};
</script>

<style scoped>
#root {
  position: relative;
  white-space: pre-line;
  height: 300px;
  overflow: scroll;
}
</style>