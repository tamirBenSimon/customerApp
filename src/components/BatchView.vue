<template>
  <div class='upload-order-dashbord'>
      <UploadResaults v-if='isResults' :results='getResults' />
    <div class="controls-1">Batches Center</div>
    <div class="controls-1">
    <!-- <el-button @click='onFileSelectBtnClick' class="file-input-btn btn btn-primary">
      <i class="fa fa-upload" />
      <span style="margin-left:9px;">
        {{ this.fileName || 'No file selected'}}
      </span>
    <input @change='onChangeFile' class="file-input btn btn-primary"  type='file' id='inputt' /> -->
    <!-- </el-button> -->
    <div class="right-corner-controls">
    <!-- <el-button @click='onSendBtnClick' class="send-btn btn btn-primary">
      send
      <i class="fa fa-paper-plane" />
    </el-button> -->
    </div>
    </div>
    <div>
    </div>
    <div class="table-container"></div>
    <el-table @select='checkboxChecked' @select-all='checkboxChecked' class='my-table' :data='tableData'>
          <el-table-column fixed @select='checkboxChecked' type='selection' prop='OrderNumber' label='' width='50'>
      </el-table-column>
      <el-table-column v-for="header in getHeaders" :key='header' :prop='header' :label='header'> </el-table-column>
          <el-table-column
      fixed="right"
      label="Operations"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="goToBatchLabels(scope.$index, tableData)"
          type="text"
          class='table-operations-btn table-operations-btn-Edit'
          size="small">
      <i class="fas blue fa-eye mr-2"></i>
          Batch Labels
        </el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import $ from 'jquery'
// import XLSX from 'xlsx'
import UploadResaults from '../components/UploadResaults'
import axios from 'axios'
export default {
  components: {
    UploadResaults
  },
  name: 'BatchView',
  props: ['Batches'],
  methods: {
    goToBatchLabels (index, rows) {
      this.$emit('goToBatchLabels', rows[index].BatchId)
    },
    // deleteRow (index, rows) {
    //   console.log(index, rows)
    //   this.tableData.splice(index, 1)
    // },
    checkboxChecked (selectedRows) {
      if (selectedRows.length > 100) {
        alert(selectedRows.length + ' items found. 100 is the limit')
        return
      }
      this.tableDataSelected = selectedRows
    },
    reset () {
      this.BatchOrder = {}
      this.BatchOrders = []
    },

    async submitDataToXPI () {
      var vm = this
      var completeReqJson = vm.mainJSON
      var url4log = vm.URL4LOG
      const headers = { 'content-type': 'application/json' }
      axios.post(url4log, JSON.stringify(completeReqJson), headers)
        .then(function (response) {
          // console.log(response)
          const resObj = (response.data)
          // vm.results = [resObj[Object.keys(resObj)[0]]]
          console.log(resObj)
        })
    },
    buildReqJson () {
      var vm = this
      // -set json structure
      vm.reqJson = {}
      vm.reqJson.BatchStatusRequest = {}
      vm.reqJson.BatchStatusRequest.Username = 'test'
      vm.reqJson.BatchStatusRequest.Password = 'test'
      vm.reqJson.BatchStatusRequest.CustomerId = this.Batches[0]
      return (vm.reqJson)
    },
    setHeadersArr (headers) {
      this.headersArr = headers
    }
  },

  data () {
    return {
      // editedIndex: null,
      // isEditing: false,
      tableDataSelected: [],
      results: [],
      switchValue1: false,
      URL4LOG: 'http://192.117.139.225:80/Magicxpi4.7/MgWebRequester.dll?appname=IFSBatch_Listener&prgname=HTTP&arguments=-ABatch%23Status&testMode=1',
      BatchOrders: [],
      BatchOrder: {},
      fileName: '',
      headersArr: [],
      moreData: [],
      URL_GET_AWBS: 'http://192.117.139.143:57772/rest/api/Shop/GetRules',
      tableData: [{}],
      fields_map: {
        BatchId: 0,
        CreationDate: 1,
        Status: 2,
        Message: 3,
        RequestCount: 4,
        StartRunTime: 5,
        EndRunTime: 6
      }
    }
  },
  computed: {
    getEditedRow () {
      var arr = []
      arr.push(this.tableData[this.editedIndex])
      return arr
    },
    getHeaders () {
      var headersArr = []
      for (var key in this.fields_map) {
        if (typeof this.fields_map[key] === 'number') {
          headersArr[this.fields_map[key]] = key
        } else if (typeof this.fields_map[key] === 'object') {
          const objectKey = this.fields_map[key]
          for (var inkey in objectKey) {
            if (objectKey[inkey]) {
              headersArr[objectKey[inkey]] = inkey
            }
          }
        }
      }
      this.setHeadersArr(headersArr)
      return headersArr
    },
    isResults () {
      if (this.results.length === 0) {
        return false
      }
      return true
    },
    getResults () {
      return this.results
    }
  },
  created () {
    const vm = this
    console.log(this.Batches)
    this.tableData = this.Batches.map(batch=>{return {BatchId:batch}})
  }
}
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
.upload-order-dashbord{
    transition: all, .3s;
}
.my-table th{
  background-color: red ! important;
}
.my-table{
    margin: 20px auto;
    width: 96%;
    margin: 15px auto;
    border: 1px solid #00000024;
    border-radius: 0.5rem;
    backdrop-filter: 80%;
    font-size: 0.7rem;
}
.file-input-btn{
  padding: 4px 0px 4px 15px;
}
.table-container{
  max-height: 100vh;
}
.file-input{
    visibility: hidden;
    width: 1rem;
}
.controls-1{
  display: flex;
  width: 96%;
  margin: 0 auto;
  justify-content: space-between;
}
.fa-paper-plane{
  margin-left: 8px;
}
.switch{
  margin:0px 10px ;
}
.table-operations-btn-remove{
  color: rgb(255, 91, 91);
}
.table-operations-btn-remove:hover{
  color: rgb(255, 126, 126);
}
</style>
