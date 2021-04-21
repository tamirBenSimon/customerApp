<template>
  <div class="upload-order-dashbord">
    <UploadResaults v-if="isResults" :results="getResults" />
    <div class="controls-1">Labels Center</div>
    <div class="controls-1">   
      <div class="right-corner-controls"></div>
    </div>
    <div></div>
    <div class="table-container"></div>
    <el-table class="my-table" :data="getTableData">
      <el-table-column
        fixed
        @select="checkboxChecked"
        type="selection"
        prop="OrderNumber"
        label=""
        width="50"
      >
      </el-table-column>
      <el-table-column
        v-for="header in getHeaders"
        :key="header"
        :prop="header"
        :label="header"
      >
      </el-table-column>
      <el-table-column fixed="right" label="Operations" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="DisplayLabel(scope.$index)"
            type="text"
            class="table-operations-btn table-operations-btn-Edit"
            size="small"
          >
            <i
              class="el-icon-printer"
              v-if="
                labels[scope.$index].png &&
                  (labels[scope.$index].status = 'Completed')
              "
            ></i>
            <i
              class="err-icon el-icon-error"
              v-if="labels[scope.$index].status === 'Failed'"
            ></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import $ from 'jquery'
// import XLSX from 'xlsx'
import UploadResaults from "../components/UploadResaults";
import axios from "axios";
var request = require("request");
export default {
  components: {
    UploadResaults
  },
  name: "SubsView",
  props: ["labels"],
  methods: {
    printlabels(){
      console.log(this.getTableData)
    },
    // async processLabelsProps(labels) {
    //   return new Promise((resolve, reject) => {
    //     for (var i in labels) {
    //       this.getDisplayLabel(labels[i].zpl).then(res => {
    //         labels[i].pngB64 = res;
    //       });
    //     }
    //     resolve(labels);
    //   });
    // },
    // async getDisplayLabel(zpl) {
    //   if (!zpl) {
    //     return;
    //   }
    //   return new Promise((resolve, reject) => {
    //     const vm = this;
    //     const headers = { Accept: "application/pdf" };
    //     const Http = new XMLHttpRequest();
    //     var base64data = "";
    //     const url = "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/";
    //     Http.open("POST", url);
    //     Http.responseType = "arraybuffer";
    //     // Http.setRequestHeader("Accept", "image/png");
    //     Http.setRequestHeader(
    //       "Content-Type",
    //       "application/x-www-form-urlencoded"
    //     );
    //     Http.setRequestHeader("Accept", "image/png");
    //     Http.onload = function(e) {
    //       let b64 = vm.base64ArrayBuffer(e.currentTarget.response);
    //       console.log(b64);
    //       resolve(b64);
    //       //   document.getElementById("pdfemb").data =
    //       //     "data:image/png;base64," + b64;
    //     };
    //     Http.send(zpl);
    //   });
    // },
    // async getDisplayLabel(zpl) {
    //   if (!zpl) {
    //     return;
    //   }
    //   return new Promise((resolve, reject) => {
    //     const vm = this;
    //         const headers = { 'Accept': 'application/pdf' }
    //     axios.post(
    //         "http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/",
    //         zpl,
    //         headers
    //       )
    //       .then(function(res) {
    //         var resObj = res.data
    //         console.log(resObj)
    //         let b64 = vm.base64ArrayBuffer(resObj)
    //         alert(b64)
    //         document.getElementById("pdfemb").data = "data:application/pdf;base64," + b64
    //         resolve(b64)
    //       });
    //   });
    // },
    DisplayLabel(rowIndex) {
      let dataUrl = "data:image/png;base64," + this.labels[rowIndex].png;
      let w = window.open();
      var image = new Image();
      image.src = dataUrl;
      w.document.write(image.outerHTML);
      w.window.stop();
    },
    checkboxChecked(selectedRows) {
      if (selectedRows.length > 100) {
        alert(selectedRows.length + " items found. 100 is the limit");
        return;
      }
      this.tableDataSelected = selectedRows;
    },
    buildReqJson() {
      var vm = this;
      // -set json structure
      vm.reqJson = {};
      vm.reqJson.BatchStatusRequest = {};
      vm.reqJson.BatchStatusRequest.Username = "test";
      vm.reqJson.BatchStatusRequest.Password = "test";
      vm.reqJson.BatchStatusRequest.CustomerId = this.Batches[0];
      return vm.reqJson;
    },
    setHeadersArr(headers) {
      this.headersArr = headers;
    },
    base64ArrayBuffer(arrayBuffer) {
      var base64 = "";
      var encodings =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

      var bytes = new Uint8Array(arrayBuffer);
      var byteLength = bytes.byteLength;
      var byteRemainder = byteLength % 3;
      var mainLength = byteLength - byteRemainder;

      var a, b, c, d;
      var chunk;

      // Main loop deals with bytes in chunks of 3
      for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
        d = chunk & 63; // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
      }

      // Deal with the remaining bytes and padding
      if (byteRemainder == 1) {
        chunk = bytes[mainLength];

        a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4; // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + "==";
      } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];

        a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2; // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + "=";
      }
      return base64;
    }
    // async getLabelsUpdated() {
    //   this.tableData = await this.processLabelsProps(this.labels);
    // }
  },

  data() {
    return {
      // editedIndex: null,
      // isEditing: false,
      DisplayedImg: "",
      Base64Src: "",
      tableDataSelected: [],
      results: [],
      switchValue1: false,
      URL4LOG:
        "http://192.117.139.225:80/Magicxpi4.7/MgWebRequester.dll?appname=IFSBatch_Listener&prgname=HTTP&arguments=-ABatch%23Status&testMode=1",
      BatchOrders: [],
      BatchOrder: {},
      fileName: "",
      headersArr: [],
      moreData: [],
      URL_GET_AWBS: "http://192.117.139.143:57772/rest/api/Shop/GetRules",
      tableData: null,
fields_map: {
        order_number: 0,
        first_name: 1,
        last_name: 2,
        company_name: 3,
        address_line1: 4,
        AddressLine2: 5,
        AddressLine3_city: 6,
        AddressLine4_state: 7,
        post_code: 8,
        country: 9,
        email: 10,
        phone: 11,
        ShipmentItemsArray: {
          HTS_code: 12,
          product_description: 13,
          product_unit_weight: 14,
          product_unit_value: 15,
          product_qantity: 16,
          product_item_origin: 17
        },
        currency: 18,
        parcel_weight: 19,
        ServiceType: 20,
        length: 21,
        width: 22,
        height: 23,
        shipping_terms: 24,
        invoice_number: 25,
        VAT: 26,
        purchased_by: 27,
        UOM: 28,
        UOM_DIM: 29
      }
    };
  },
  computed: {
    getSelectedImage() {
      return this.DisplayedImg ? this.DisplayedImg : this.DisplayedImg;
    },
    getBase64Src() {
      return this.Base64Src;
    },
    getTableData() {
      return this.labels || [{}]
    },
    getEditedRow() {
      var arr = [];
      arr.push(this.tableData[this.editedIndex]);
      return arr;
    },
    getHeaders() {
      var headersArr = [];
      for (var key in this.fields_map) {
        if (typeof this.fields_map[key] === "number") {
          headersArr[this.fields_map[key]] = key;
        } else if (typeof this.fields_map[key] === "object") {
          const objectKey = this.fields_map[key];
          for (var inkey in objectKey) {
            if (objectKey[inkey]) {
              headersArr[objectKey[inkey]] = inkey;
            }
          }
        }
      }
      this.setHeadersArr(headersArr);
      return headersArr;
    },
    isResults() {
      if (this.results.length === 0) {
        return false;
      }
      return true;
    },
    getResults() {
      return this.results;
    }
  },
  created() {
    this.tableData = this.labels;
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.upload-order-dashbord {
  transition: all, 0.3s;
}
.my-table th {
  background-color: red !important;
}
.my-table {
  margin: 20px auto;
  width: 96%;
  margin: 15px auto;
  border: 1px solid #00000024;
  border-radius: 0.5rem;
  backdrop-filter: 80%;
  font-size: 0.7rem;
}
.file-input-btn {
  padding: 4px 0px 4px 15px;
}
.table-container {
  max-height: 100vh;
}
.file-input {
  visibility: hidden;
  width: 1rem;
}
.controls-1 {
  display: flex;
  width: 96%;
  margin: 0 auto;
  justify-content: space-between;
}
.fa-paper-plane {
  margin-left: 8px;
}
.switch {
  margin: 0px 10px;
}
.table-operations-btn-remove {
  color: rgb(255, 91, 91);
}
.table-operations-btn-remove:hover {
  color: rgb(255, 126, 126);
}
.el-icon-printer {
  font-size: 1.2rem;
  margin-left: 50%;
}
.el-icon-loading {
  font-size: 1.2rem;
  margin-left: 50%;
}

.err-icon {
  color: rgb(243, 69, 69);
  font-size: 1.2rem;
  margin-left: 50%;
}
</style>
