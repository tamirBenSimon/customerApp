<template>
  <div class="upload-order-dashbord">
    <!-- <button @click='onFileSelectBtnClick'>GO</button> -->
    <UploadResaults v-if="isResults" :results="getResults" />
    <div class="controls-1">Upload Orders</div>
    <div class="controls-1">
      <el-button
        @click="onFileSelectBtnClick"
        class="file-input-btn btn btn-primary"
      >
        <i class="fa fa-upload" />
        <span style="margin-left:9px;">
          {{ this.fileName || "No file selected" }}
        </span>
        <input
          @change="onChangeFile"
          class="file-input btn btn-primary"
          type="file"
          id="inputt"
        />
      </el-button>
      <div class="right-corner-controls">
        <el-button @click="onSendBtnClick" class="send-btn btn btn-primary">
          send
          <i class="fa fa-paper-plane" />
        </el-button>
        <el-button @click="scrollRight" class="send-btn btn btn-primary">
          scroll
        </el-button>
      </div>
    </div>
    <div></div>
    <div class="table-container">
      <el-table
        @select="checkboxChecked"
        @select-all="checkboxChecked"
        class="my-table"
        id="my-table"
        :data="tableData"
      >
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
          sortable
          width="150"
        >
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Operations"
          width="130"
          align="center"
        >
          <template slot="header" slot-scope="scope">
            <el-input v-model="search" size="mini" placeholder="Search.." />
          </template>
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="editRow(scope.$index, tableData)"
              type="text"
              class="table-operations-btn table-operations-btn-Edit"
              size="small"
            >
              <i class="fas fa-edit"></i>
            </el-button>
            <el-button
              @click.native.prevent="deleteRow(scope.$index, tableData)"
              type="text"
              class="table-operations-btn table-operations-btn-remove"
              size="small"
            >
              <i class="fas fa-trash-alt  ml-4"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <EditRow
      @cancel="
        () => {
          isEditing = false;
        }
      "
      @saveLine="onSaveLine"
      :rowData="getEditedRow"
      :fields_map="fields_map"
      v-if="isEditing"
    />
  </div>
</template>

<script>
import $ from "jquery";
import EditRow from "../components/EditRow";
import UploadResaults from "../components/UploadResaults";
import Loading from "../components/loading.vue";
import axios from "axios";
import XLSX from "xlsx";
export default {
  components: {
    UploadResaults,
    EditRow
  },
  props: ["user"],
  name: "UploadXL",
  methods: {
    getBatchId() {
      if (localStorage.getItem("lastBatchId")) {
        let lastBatchNum = localStorage.getItem("lastBatchId");
        let newBatchNum = String(Number(lastBatchNum) + 1);
        localStorage.setItem("lastBatchId", newBatchNum);
        let completeBatchId = this.vendorCode + newBatchNum;
        // alert(completeBatchId);
        return completeBatchId;
      } else {
        localStorage.setItem("lastBatchId", "1");
        // alert(localStorage.getItem("lastBatchId"));
      }
    },
    scrollRight() {
      $("#my-table").scrollWidth += 100;
    },
    validateSheetLine(line) {
      if (Object.keys(line).length === 0 && line.constructor === Object) {
        return { validated: false };
      }
      var vm = this;
      var resObj = { validated: true, adjusments: [] };
      for (var i in vm.mandatoryFields) {
        if (!line[vm.mandatoryFields[i]]) {
          resObj.adjusments.push(
            "mandatory field missing: ",
            vm.mandatoryFields[i]
          );
        }
      }
      if (line.AddressLine1 && line.AddressLine1.length > 35) {
        resObj.adjusments.push(
          "Exception in AdressLine1: Max Length is 35 characters"
        );
      }
      if (!line.AddressLine4State) {
        if (
          line.Country === "USA" ||
          line.Country === "US" ||
          line.Country === "United States"
        ) {
          resObj.adjusments.push("Exception: State is Mandatory in US");
        }
        if (line.Country === "CA" || line.Country === "Canada") {
          resObj.adjusments.push("Exception: State is Mandatory in Canada");
        }
        if (line.Country === "AU" || line.Country === "Australia") {
          resObj.adjusments.push("Exception: State is Mandatory in Australia");
        }
      }
      if (line.AddressLine1 && line.AddressLine1.ParcelWeight > 5) {
        resObj.adjusments.push("Exception: Parcel Weight can not exceed 5 KG");
      }
      if (line.AddressLine1 && line.AddressLine1.Length > 70) {
        resObj.adjusments.push("Exception: Max Length is 70 CM");
      }
      if (line.AddressLine1 && line.AddressLine1.Width > 70) {
        resObj.adjusments.push("Exception: Max Width is 70 CM");
      }
      if (line.AddressLine1 && line.AddressLine1.Height > 70) {
        resObj.adjusments.push("Exception: Max Height is 70 CM");
      } // TODO - Calculate volume total formula, and validate
      if (resObj.adjusments.length) {
        resObj.validated = false;
        let strAdjk = resObj.adjusments.join(",");
        alert(strAdjk);
      }
      return resObj;
    },
    editRow(index, rows) {
      this.editedIndex = index;
      this.isEditing = !this.isEditing;
    },
    deleteRow(index, rows) {
      this.tableData.splice(index, 1);
    },
    onSaveLine(newRow) {
      this.tableData.splice(this.editedIndex, 1, newRow);
      this.isEditing = false;
      this.validateSheetLine(newRow);
    },
    checkboxChecked(selectedRows) {
      if (selectedRows.length > 100) {
        alert(selectedRows.length + " items found. 100 is the limit");
        return;
      }
      this.tableDataSelected = selectedRows;
    },
    reset() {
      this.BatchOrder = {};
      this.BatchOrders = [];
    },
    onSendBtnClick() {
      this.reset();
      var tableData = this.tableDataSelected;
      this.mainJSON.BatchRequest.BatchHeader.OrdersQuantity = tableData.length;
      this.mainJSON.BatchRequest.BatchHeader.Username = this.user.Username;
      this.mainJSON.BatchRequest.BatchHeader.Password = this.user.Password;
      this.mainJSON.BatchRequest.BatchHeader.CustomerBatchId =
        this.mainJSON.BatchRequest.BatchHeader.Username +
        "_" +
        this.user.Last_Batch;
      this.startJsonPopulation(tableData);
      this.buildFinalReqObj();
      this.submitDataToXPI();
    },
    buildFinalReqObj() {
      var vm = this;
      vm.mainJSON.BatchOrders = vm.BatchOrders;
    },
    async submitDataToXPI() {
      var vm = this;
      var completeReqJson = vm.mainJSON;
      console.log("reqJSON: ", completeReqJson);
      var url4log = vm.URL4LOG;
      url4log += "&Username=" + this.user.Username;
      url4log += "&Password=" + this.user.Password;
      console.log(url4log)
      const headers = { "content-type": "application/json" };
      axios
        .post(url4log, JSON.stringify(completeReqJson), headers)
        .then(function(response) {
          const resObj = response.data;
          vm.results = [resObj[Object.keys(resObj)[0]]];
          console.log(resObj);
        });
    },

    startJsonPopulation(rows) {
      var vm = this;
      for (var i in rows) {
        // convert row to request json format
        // -set json structure
        vm.BatchOrder = {};
        vm.BatchOrder.ShipTo = {};
        vm.BatchOrder.LineItems = [{}];
        var row = rows[i];
        // convert row fields for json scheme ('BatchOrders:[]')
        vm.BatchOrder.OrderNumber = row.OrderNumber;
        vm.BatchOrder.ServiceType = row.ServiceType;
        vm.BatchOrder.PackageType = "FEDEX_ENVELOPE";
        vm.BatchOrder.Urgent = false;
        vm.BatchOrder.Purchase_Platform = "walmart";
        vm.BatchOrder.WeightMeasure = "Gram";
        vm.BatchOrder.OrderShipDate = "23-03-2021";
        vm.BatchOrder.Amazon_Ship_Date = "18-03-2021";
        vm.BatchOrder.ParcelWeight = "198";
        // convert row fields for json scheme ('BatchOrders[x].ShipTo')
        vm.BatchOrder.ShipTo.ShipToFullName =
          row.FirstName + " " + row.LastName;
        vm.BatchOrder.ShipTo.ShipToAddress1 = row.AddressLine1;
        vm.BatchOrder.ShipTo.ShipToAddress2 = row.AddressLine2;
        vm.BatchOrder.ShipTo.ShipToCountry = row.Country;
        vm.BatchOrder.ShipTo.ShipToCity = row.City;
        // TOCHECK_FIELDS
        vm.BatchOrder.ShipTo.ShipToState = row.AddressLine4State;
        vm.BatchOrder.ShipTo.ShipToZip5 = row.PostCode;
        // convert row fields for json scheme ('BatchOrders[x].LineItems')
        vm.BatchOrder.LineItems[0].Quantity = row.ProductQuantity;
        vm.BatchOrder.LineItems[0].Value = row.ProductUnitValue;
        vm.BatchOrder.LineItems[0].WeightOz = row.ProductUnitWeight;
        vm.BatchOrder.LineItems[0].Description = row.ProductDescription;
        vm.BatchOrder.LineItems[0].SkuId = row.ProductUnitWeight;
        vm.BatchOrders.push(vm.BatchOrder);
      }
    },
    onFileSelectBtnClick() {
      document.getElementById("inputt").click();
    },
    setHeadersArr(headers) {
      this.headersArr = headers;
    },
    onChangeFile(event) {
      const vm = this;
      this.fileName = document
        .getElementById("inputt")
        .value.replace(/^.*[\\]/, "");
      this.file = event.target.files ? event.target.files[0] : null;
      if (this.file) {
        const reader = new FileReader();
        reader.onload = e => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const linesTableData = XLSX.utils.sheet_to_json(ws, { header: 1 });
          var outputData = [];
          for (var i in linesTableData) {
            var outputLine = {};
            const tableLine = linesTableData[i];
            for (var cell in tableLine) {
              outputLine[this.headersArr[cell]] = tableLine[cell];
            }
            if (this.validateSheetLine(outputLine).validated) {
              outputLine.DraftValidation = "validated";
              outputLine.Vendor = this.user.Vendor;
              outputData.push(outputLine);
            }
            // else{
            //   outputLine.draftStatus='created'
            // }
          }
          this.tableData = outputData || [{}];
          this.fetchDraftData();
        };
        reader.readAsBinaryString(this.file);
      }
    },

    fetchDraftData() {
      const vm = this;
      const headers = { "content-type": "application/json" };
      let url4log =
        "http://192.117.139.150/Magicxpi4.7/MgWebRequester.dll?appname=IFSCustimer_Draft_API&prgname=HTTP&arguments=-Asave_draft_lines%23save";
      // let workbook = XLSX.readFile(this.file)
      url4log += "&vendor=" + this.user.Vendor;
      console.log("drafting the follopwing lines:");
      console.log(vm.tableData);
      axios
        .post(url4log, JSON.stringify({ drafts: vm.tableData }), headers)
        .then(function(response) {
          const resObj = response.data;
          console.log(resObj);
        })
        .then(() => {
          this.$store.dispatch({
            type: "loaddrafts",
            filterBy: { username: vm.user.Username, password:vm.user.Password }
          }).then(()=>{
                     vm.$emit('goToDrafts', 'Drafts')
          })
        });
    }
  },
  data() {
    return {
      vendorCode: "JWGtest",
      search: "",
      mandatoryFields: [
        "OrderNumber",
        "FirstName",
        "LastName",
        "AddressLine1",
        "City",
        "PostCode",
        "Country",
        "RecipientPhone",
        "HTSCode",
        "ProductDescription",
        "ProductUnitWeight",
        "ProductUnitValue",
        "ProductQuantity",
        "ProductItemOrigin",
        "Currency",
        "ParcelWeight",
        "Length",
        "Width",
        "Height"
      ],
      editedIndex: null,
      isEditing: false,
      tableDataSelected: [],
      results: [],
      switchValue1: false,
      URL4LOG:
        "http://192.117.139.225:80/Magicxpi4.7/MgWebRequester.dll?appname=IFSBatch_Listener&prgname=HTTP&arguments=-ABatch%23SendBatch&testMode=1",
      reqTarget: "CreateDelivery",
      mainJSON: {
        BatchRequest: {
          BatchHeader: {
            Username: "test",
            Password: "test",
            CustomerBatchId: "TBS00003",
            CreationTimeStamp: "26/03/2021 16:42",
            OrdersQuantity: "",
            ShipTime: "16:42",
            ShipDate: "26/03/2021",
            Currency: "USD",
            Payments: {
              FreightPaymentType: "Sender",
              DutiesPaymentType: "Sender"
            },
            Labels: [
              {
                LabelFormat: "ZPL"
              },
              {
                LabelFormat: "TIF"
              }
            ]
          }
        }
      },
      BatchOrders: [],
      BatchOrder: {},
      fileName: "",
      headersArr: [],
      moreData: [],
      tableData: [{}],
      fields_map: {
        OrderNumber: 0,
        FirstName: 1,
        LastName: 2,
        CompanyName: 3,
        AddressLine1: 4,
        AddressLine2: 5,
        City: 6,
        AddressLine4State: 7,
        PostCode: 8,
        Country: 9,
        EndContactEmail: 10,
        RecipientPhone: 11,
        ShipmentItemsArray: {
          HTSCode: 12,
          ProductDescription: 13,
          ProductUnitWeight: 14,
          ProductUnitValue: 15,
          ProductQuantity: 16,
          ProductItemOrigin: 17
        },
        Currency: 18,
        ParcelWeight: 19,
        ServiceType: 20,
        Length: 21,
        Width: 22,
        Height: 23,
        ShippingTerms: 24,
        InvoiceNumber: 25,
        Vat: 26,
        PurchasedBy: 27,
        Uom: 28,
        UomDim: 29
      }
    };
  },
  created() {
    // console.log(this.user);
  },
  computed: {
    getEditedRow() {
      return { ...this.tableData[this.editedIndex] };
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
  white-space: nowrap;
  margin: 20px auto;
  border: 1px solid #00000017;
  border-radius: 0.5rem;
  backdrop-filter: 80%;
  font-size: 0.7rem;
}
.file-input-btn {
  padding: 4px 0px 4px 15px;
}
/* .table-container {
  margin: 15px 0px 0px 0px;
  max-height: 100vh;
  max-width: 98%;
} */

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

.fa-edit,
.fa-trash-alt {
  font-size: 1rem;
}
.fa-edit {
  margin-left: 15px;
}
</style>
