<template>
  <div>
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">expand</el-radio-button>
      <el-radio-button :label="true">collapse</el-radio-button>
    </el-radio-group> -->
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
    >
    <el-button class="collapse-btn" @click="()=>{this.isCollapse=!this.isCollapse}"><i class="fas fa-bars"></i></el-button>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-document"></i>
          <span slot="title">Labels Center</span>
        </template>
        <el-menu-item-group>
          <!-- <span slot="title">Transmition Center</span> -->
          <el-menu-item @click="$emit('itemClick', 'UploadXL')" index="1-1">Upload</el-menu-item>
          <el-menu-item @click="$emit('itemClick', 'Drafts')" index="1-2">My Drafts</el-menu-item>
          <el-menu-item @click="$emit('itemClick', 'BatchView')" index="1-3">My Batches</el-menu-item>
          <el-menu-item @click="$emit('itemClick', 'LabelsView')" index="1-4">My Labels</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-location"></i>
        <span slot="title">Navigator Two</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">Navigator Three</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">Navigator Four</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
<style>
.el-menu-vertical-demo {
    padding: 70px 0px 0px 0px;
    position: fixed;
    left: 0px;
    top: 0px;
    height: 100%;
    z-index: 555;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.collapse-btn{
  width: 100%;
  margin: 5px auto;
  border: none;
}
.el-menu-item-group{
  background-color: rgba(211, 209, 209, 0.12);
}
.el-menu-item-group__title{
display: none;
}
</style>
