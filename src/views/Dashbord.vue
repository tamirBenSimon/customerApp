<template>
  <div>
    <nav class="app-nav">
      <img alt="Vue logo" src="../assets/logo.png" />
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1">Processing Center</el-menu-item>
        <el-submenu index="2">
          <template slot="title"><i class="fa fa-user"/></template>
          <el-menu-item index="2-1">{{ username }}</el-menu-item>
          <router-link to="/">
            <el-menu-item index="2-2">Log out</el-menu-item>
          </router-link>
          <el-submenu index="2-4">
            <template slot="title">item nested</template>
            <el-menu-item index="2-4-1">item one</el-menu-item>
            <el-menu-item index="2-4-2">item two</el-menu-item>
            <el-menu-item index="2-4-3">item three</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item disabled index="4"
          ><a target="_blank">Orders</a></el-menu-item
        >
      </el-menu>
    </nav>
    <SideMenu @itemClick="onItemClick" />
    <UploadXL
      :user="getUser"
      @goToDrafts="onItemClick"
      v-if="currScreen == 'UploadXL'"
    ></UploadXL>
    <Drafts
      :drafts="getDrafts"
      :user="getUser"
      v-if="currScreen == 'Drafts'"
      @sentBatch="ongoToBatchLabels"
    ></Drafts>
    <BatchView
      @goToBatchLabels="ongoToBatchLabels"
      :Batches="getBatches"
      v-if="currScreen == 'BatchView'"
    ></BatchView>
    <SubsView
      @goToLabels="onGoToLabelsView"
      :subs="getSubs"
      v-if="currScreen == 'SubsView'"
    ></SubsView>
    <LabelsView
      :labels="getLabels"
      v-if="currScreen == 'LabelsView'"
    ></LabelsView>
  </div>
</template>

<script>
import axios from "axios";
import UploadXL from "../components/UploadXL";
import Drafts from "../components/Drafts";
import SubsView from "../components/SubsView";
import BatchView from "../components/BatchView";
import LabelsView from "../components/LabelsView";
import SideMenu from "../components/sideMenu";

export default {
  name: "Dashbord",
  components: {
    UploadXL,
    SideMenu,
    BatchView,
    SubsView,
    LabelsView,
    Drafts
  },
  methods: {
    buildReqJsonLabels(subId) {
      var reqJSON = {};
      reqJSON.GetSubRequest = {};
      reqJSON.GetSubRequest.Username = "test";
      reqJSON.GetSubRequest.Password = "test";
      reqJSON.GetSubRequest.SubId = subId;
      return reqJSON;
    },
    getLabelsForBatch(batch) {
      var vm = this;

      // var url4log = 'http://192.117.139.150/Magicxpi4.7/MgWebRequester.dll?appname=IFSCustimer_Draft_API&prgname=HTTP&arguments=-Aget_draft_http%23Trigger1&username=test&password=test&from_date=2021-03-13&batch_mode=1';
      var url4log =
        "http://192.117.139.150/Magicxpi4.7/MgWebRequester.dll?appname=IFSCustimer_Draft_API&prgname=HTTP&arguments=-AGet_PNG%23get_png&batch_id=";

      url4log += batch;
      //   "&batch_id=" +
      //   this.$store.getters.loggedinUser.Username +
      //   "_" +
      //   this.$store.getters.loggedinUser.Last_Batch;
      // url4log += "&batch_id=test_40";
      axios.get(url4log).then(function(response) {
        const resObj = response.data;
        vm.labels = resObj.Orders;
        console.log(resObj);
        console.log("dashboard labels :", vm.labels);
        vm.currScreen = "LabelsView";
      });
    },
    onItemClick(item) {
      this.currScreen = item;
    },
    ongoToBatchLabels(batch) {
      // this.subs = subs
      this.labels = this.getLabelsForBatch(batch) || [];
    },
    onGoToLabelsView(parentSub) {
      this.currScreen = "LabelsView";
    }
  },
  data() {
    return {
      batches: [],
      username: "",
      lastSentBatchId: "",
      URL_Labels:
        "http://192.117.139.150/Magicxpi4.7/MgWebRequester.dll?appname=IFSBatch_Helper&prgname=HTTP&arguments=-Aget_png%23Trigger1",
      // URL_Labels:
      //   "http://192.117.139.225:80/Magicxpi4.7/MgWebRequester.dll?appname=IFSBatch_Listener&prgname=HTTP&arguments=-ABatch%23GetSub&testMode=1",
      labels: [],
      subs: [],
      currScreen: "uploadXL",
      menu: [
        {
          title: "Transmit Excel",
          icon: "fa fa-file-excel",
          attributes: { targetScreen: "UploadXL" }
        },
        {
          title: "My Batches",
          icon: "fas fa-clipboard-list",
          attributes: { targetScreen: "BatchView" }
        },
        {
          title: "My Sub Batches",
          icon: "fas fa-clipboard-list",
          attributes: { targetScreen: "SubsView" }
        },
        {
          title: "My Labels",
          icon: "fas fa-clipboard-list",
          attributes: { targetScreen: "LabelsView" }
        }
      ]
    };
  },
  computed: {
    getUser() {
      return this.user;
    },
    getLastBatch() {
      return this.$store.getters.loggedinUser;
    },
    getDrafts() {
      return this.$store.getters.getDrafts;
    },
    getBatches() {
      return this.batches;
    },
    getSubs() {
      return this.subs;
    },
    getLabels() {
      if (!this.labels) {
        return [{}];
      }
      return this.labels.map(label => {
        return {
          order_number: label.soNumber,
          status: "Completed",
          png: label.pngB64
        };
      });
    }
  },
  mounted() {
    var vm = this
    let user = this.$store.getters.loggedinUser;
    console.log("signed in user::");
    console.log(user);
    this.lastSentBatchId = user;
    this.user = user;
          axios.get("http://192.117.139.150/Magicxpi4.7/MgWebRequester.dll?appname=IFSCustimer_Draft_API&prgname=HTTP&arguments=-Aget_vendor_batches%23get_vendor_batches&username=test&password=test")
        .then(function (response) {
          // console.log(response)
          const resObj = (response.data)
          // vm.results = [resObj[Object.keys(resObj)[0]]]
          console.log(resObj)
          vm.batches = resObj.batches.map(batch=>{return batch.customer_batch_id})
          alert(vm.batches)
        })
  }
};
</script>

<style>
.v-sidebar-menu {
  padding: 180px 0 0 0;
}
.vsm--icon {
  height: 10px;
  line-height: 30px;
  width: 20px !important;
  padding: 2px !important;
  margin: 0px 18px 0px 2px;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  text-align: center;
  border-radius: 3px;
  display: inline-block;
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
