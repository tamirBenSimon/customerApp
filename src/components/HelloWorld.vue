<template>
  <div>
    <button @click='handleClick'>GO</button>
    <input @change="onChangeFile" type='file' id='inputt' />
    <el-table class='my-table' :data='tableData' style='width: 100%'>
      <el-table-column fixed prop='Check' label='' width='50'>
        <template>
          <el-checkbox v-model='checked'></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop='VendorCode' label='VendorCode' width='120'>
      </el-table-column>

      <el-table-column prop='AWB' label='AWB' width='180'> </el-table-column>
      <el-table-column
        prop='CustomerBatchId'
        label='CustomerBatchId'
        width='120'
      >
      </el-table-column>
      <el-table-column prop='DNDCName' label='DNDCName' width='120'>
      </el-table-column>
      <el-table-column prop='EntityID' label='EntityID' width='120'>
      </el-table-column>
      <el-table-column prop='DeliveryTime' label='DeliveryTime' width='120'>
      </el-table-column>
      <el-table-column prop='DeliveryStatus' label='DeliveryStatus' width='120'>
      </el-table-column>
      <el-table-column
        prop='shipmentType'
        label='shipmentType'
        width='300'
      ></el-table-column>
      <el-table-column prop='VendorCode' label='VendorCode' width='120'>
      </el-table-column>
      <el-table-column fixed='right' label='Operations' width='120'>
        <template>
          <el-button @click='handleClick' type='text' size='small'
            >Detail</el-button
          >
          <el-button type='text' size='small'>Edit</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    handleClick (e) {
      this.tableData = this.tableData.concat(this.moreData.splice(0, 50))
      // console.log(e)
      fetch('http://192.117.139.143:57772/rest/api/Shop/GetRules', {
        method: 'post',
        body: JSON.stringify({
          Rules: [
            {
              Query:
                'SELECT top(2000)  AWB,Vendorcode, EntityID,DeliveryStatus FROM Shipping_Datanew.Delivery where AWB is not null'
            }
          ]
        }),
        headers: { 'Content-Type': 'application/json' }
      })
        .then(response => response.json())
        .then(jsonData => {
          this.tableData = jsonData.children.splice(0, 50)
          this.moreData = jsonData.children
        })
        .catch(err => console.log(err))
    },

    onChangeFile (e) {
      console.log(e)
    }
  },
  data () {
    return {
      moreData: [],
      URL_GET_AWBS: 'http://192.117.139.143:57772/rest/api/Shop/GetRules',
      tableData: [{}]
    }
  }
  // mounted () {
  //   const input = document.getElementById('inputt')
  //   input.addEventListener('change', () => {
  //     readXlsxFile(input.files[0]).then(rows => {
  //       console.log(rows.length())
  //     })
  //   })
  // }
}
</script>

<style scoped>
.my-table {
  max-width: 80%;
}
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
</style>
