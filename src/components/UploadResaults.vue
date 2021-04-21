<template>
  <div>
    <!-- <button @click='onFileSelectBtnClick'>GO</button> -->
    <div class="controls-1">
      <h3>Results</h3>
    </div>
    <div class="table-container"></div>
    <button class="btn btn-primary">go to Batchg Resaults</button>
  </div>
</template>

<script>
// import $ from 'jquery'
import axios from 'axios'
import XLSX from 'xlsx'
export default {
  props: {
    results: Array
  },
  name: 'UploadXL',
  methods: {
    reset () {
      this.reqJSON = {}
      this.reqJSONs = []
    },
    onSendBtnClick () {
      this.reset()
      var tableData = this.tableData
      this.startJsonPopulation(tableData.slice(1))
      this.fillReqJson()
      this.submitDataToXPI()
    },
    fillReqJson () {
      var vm = this
      for (var key in vm.diffJSON) {
        vm.reqJSONs[0][vm.reqTarget].s[key] = vm.diffJSON[key]
      }
    },
    async submitDataToXPI () {
      var vm = this
      var reqJson = vm.reqJSONs[0]
      var url4log = vm.URL4LOG
      const headers = { 'content-type': 'application/json' }
      axios.post(url4log, JSON.stringify(reqJson), headers)
        .then(function (response) {
          console.log(response)
        })
    },
    startJsonPopulation (rows) {
      var vm = this
      var root = vm.reqTarget
      for (var i in rows) {
        vm.reqJSON = {}
        vm.reqJSON[root] = {}
        vm.reqJSON[root].userName = 'JWGusernameTest'
        vm.reqJSON[root].password = 'JWGpasswardTest'
        vm.reqJSON[root].s = {}
        vm.reqJSON[root].s.ShipmentItemsArray = [{}]
        var row = rows[i]
        for (var key in row) {
          if (key.substring(0, 7) !== 'Product') {
            if (key) {
              vm.reqJSON[root].s[key] = row[key]
            }
          } else {
            if (key) {
              vm.reqJSON[root].s.ShipmentItemsArray[0][key] = row[key]
            }
          }
        }
        vm.reqJSONs.push(vm.reqJSON)
      }
    },
    onFileSelectBtnClick () {
      document.getElementById('inputt').click()
    },
    setHeadersArr (headers) {
      this.headersArr = headers
    },
    onChangeFile (event) {
      this.fileName = document.getElementById('inputt').value.replace(/^.*[\\]/, '')
      this.file = event.target.files ? event.target.files[0] : null
      // let workbook = XLSX.readFile(this.file)
      if (this.file) {
        const reader = new FileReader()
        reader.onload = e => {
          /* Parse data */
          const bstr = e.target.result
          const wb = XLSX.read(bstr, { type: 'binary' })
          /* Get first worksheet */
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const linesTableData = XLSX.utils.sheet_to_json(ws, { header: 1 })
          var outputData = []
          for (var i in linesTableData) {
            var outputLine = {}
            const tableLine = linesTableData[i]
            for (var cell in tableLine) {
              outputLine[this.headersArr[cell]] = tableLine[cell]
            }
            if (outputLine.OrderNumber) {
              outputData.push(outputLine)
            }
          }
          this.tableData = outputData
        }
        reader.readAsBinaryString(this.file)
      }
    }
  },
  data () {
    return {
      URL4LOG: 'http://192.117.139.150/Magicxpi4.7/MgWebRequester.dll?appname=IFSFourLog_Listener&prgname=HTTP&arguments=-ADelivery%23InterActive',
      reqTarget: 'CreateDelivery',
      diffJSON: {
        Fourlogref: '',
        CompanyName: '',
        Location: '',
        AddrValid: 'ACK',
        Wrapper: 'Elitsur A',
        ShipType: '1',
        Bin: ''
      },
      reqJSONs: [],
      reqJSON: {},
      fileName: '',
      headersArr: [],
      moreData: [],
      URL_GET_AWBS: 'http://192.117.139.143:57772/rest/api/Shop/GetRules',
      tableData: [{}],
      fields_map: {
        OrderNumber: 0,
        Fourlogref: 1,
        StatusMessage: 2
      }
    }
  },
  computed: {
    getTableData () {
      return (this.tableData)
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
    }
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
    overflow-x: scroll;
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
</style>
