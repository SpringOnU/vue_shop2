<template>
<div>123</div>
</template>

<script>
export default {
}
</script>

<style lang="less" scoped>
  .el-header {
      background-color: #373d41;
      display: flex;
      justify-content: space-between; /* 左右贴边 */
      padding-left: 0;
      align-items: center;  /* 垂直居中 */
      color: #fff;
      font-size: 20px;
      > div {
          display: flex;
          align-items: center;
          span{
              margin-left: 15px;
          }
      }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }
  .el-main{
    background-color: #eaedf1;
  }
  .home-container{
    height: 100%;
  }
  .iconfont{
    margin-right: 10px;
  }
  .toggle-button {
    background-color: #4A5064;
    color: #fff;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
