<template>
  <div id="root">
    <div id="main" style="width: 500px; height: 500px"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "AppDetail",
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
    };
  },
  mounted() {
    this.aa();
  },
  methods: {
    aa() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main"));
      // 绘制图表
      myChart.setOption({
        title: {
          text: "各平台用户",
          subtext: "数据来源为用户注册时的终端形式",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "用户数",
            type: "pie",
            radius: "60%",
            data: [
              { value: 50, name: "web端" },
              { value: 7, name: "ios端" },
              { value: 2, name: "android端" },
              { value: 0, name: "微信小程序端" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
  },
};
</script>