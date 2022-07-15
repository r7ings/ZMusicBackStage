<template>
  <div id="rooter">
    <div
      class="scrollContent"
      @mouseenter="stopMove"
      @mouseleave="continueMove"
      v-show="loginViewData.length > 0 ? true : false"
    >
      <div class="cell" ref="cell">
        <el-descriptions
          v-for="(item, index) in loginViewData"
          :key="index"
          :contentStyle="{
            border: 'none',
            height: '50px',
            'background-color': '#2980b9',
            'min-width': '100px', //最小宽度
            'max-width': '100px', //最小宽度
            'word-break': 'break-all', //过长时自动换行
            opacity: 0.7,
            color: 'black',
          }"
          :labelStyle="{
            border: 'none',
            height: '50px',
            'background-color': '#2980b9',
            'min-width': '100px', //最小宽度
            'max-width': '100px', //最小宽度
            'word-break': 'break-all', //过长时自动换行
            color: '#e4e4e4',
          }"
          :column="3"
          border
        >
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              用户账号
            </template>
            {{ item.account }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline">用户昵称</i>
            </template>
            {{ item.nickname }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              登陆时间
            </template>
            {{ item.date }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </div>
</template>

<script>
import apis from "../../mixin/index";
export default {
  name: "ScrollLoginInfo",
  data() {
    return {
      loginViewData: [],
      //   showFlag: false,
    };
  },
  methods: {
    stopMove() {
      clearInterval(this.scrollTimer);
    },
    continueMove() {
      this.scrollFun();
    },
  },
  computed: {},
  beforeMount() {
    apis.api.get("/backStage/MainDetail/getScrollData").then((res) => {
      //   console.log(res.data);
      this.loginViewData = res.data.data.reverse();
      //   this.showFlag = true;
      clearInterval(this.scrollTimer);
      this.continueMove();
    });
  },
  mounted() {
    this.scrollFun = () => {
      if (this.loginViewData.length <= 4) return;
      var y = 0;
      var maxY = -((this.loginViewData.length - 4) * 50);
      this.scrollTimer = setInterval(() => {
        //   console.log(y, maxY);
        if (y < maxY) y = 0;
        this.$refs.cell.style.transform = `translateY(${y}px)`;
        y -= 50;
      }, 3000);
    };
    this.scrollFun();
  },
  beforeDestroy() {
    clearInterval(this.scrollTimer);
  },
};
</script>

<style lang="less" scoped>
#rooter {
  width: 100%;
  height: 100%;
  //   background-color: pink;
  .scrollContent {
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    opacity: 0.8;
    border: 1px solid rgba(0, 255, 179, 0.767);
    border-radius: 8px;
    .cell {
      position: absolute;
      transition: transform 1.5s;
      width: 100%;
      //   background-color: yellow;
    }
  }
  .scrollContent:hover {
    overflow: scroll;
  }
  //隐藏滚动条
  .scrollContent::-webkit-scrollbar {
    display: none;
  }
}
</style>