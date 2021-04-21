<template>
  <div class="edit-row-container">
    <el-form label-position="right" class="row-edit-form" label-width="120px">
      <el-button
        @click="
          () => {
            $emit('cancel');
          }
        "
        >×</el-button
      >
      <h3>Details</h3>
      <div class="upper-container">
        <div class="side-container">
          <el-form-item :style="getStyleItem" label="Order Number">
            <el-input class="el-input" v-model="data.OrderNumber"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Company Name">
            <el-input class="el-input" v-model="data.CompanyName"></el-input>
          </el-form-item>
          <el-form-item
            :style="getStyleItem"
            label="First Name"
            class="form-item"
          >
            <el-input class="el-input" v-model="data.FirstName"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Surname">
            <el-input class="el-input" v-model="data.LastName"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Contact Email">
            <el-input
              class="el-input"
              v-model="data.EndContactEmail"
            ></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Contact Phone">
            <el-input class="el-input" v-model="data.RecipientPhone"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Service Type">
            <el-select v-model="value" >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="side-container">
          <el-form-item :style="getStyleItem" label="Country">
            <el-input class="el-input" v-model="data.Country"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Address line 1">
            <el-input
              type="textarea"
              class="el-input"
              v-model="data.AddressLine1"
            ></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Address line 2">
            <el-input class="el-input" v-model="data.AddressLine2"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="City">
            <el-input class="el-input" v-model="data.City"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="State">
            <el-input
              class="el-input"
              v-model="data.AddressLine4State"
            ></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Postcode">
            <el-input class="el-input" v-model="data.PostCode"></el-input>
          </el-form-item>
        </div>
      </div>
      <h3>Product</h3>
      <div class="upper-container">
        <div class="side-container">
          <el-form-item :style="getStyleItem" label="Quantity">
            <el-input
              class="el-input"
              v-model="data.ProductQuantity"
            ></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Description">
            <el-input
              type="textarea"
              class="el-input"
              v-model="data.ProductDescription"
            ></el-input>
          </el-form-item>

          <el-form-item :style="getStyleItem" label="Unit Value">
            <el-input
              class="el-input"
              v-model="data.ProductUnitWeight"
            ></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Unit Weight">
            <el-input
              class="el-input"
              v-model="data.ProductUnitValue"
            ></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Item Origin">
            <el-input
              class="el-input"
              v-model="data.ProductItemOrigin"
            ></el-input>
          </el-form-item>
        </div>
        <div class="side-container">
          <el-form-item :style="getStyleItem" label="Parcel Weight">
            <el-input class="el-input" v-model="data.ParcelWeight"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Length">
            <el-input class="el-input" v-model="data.Length"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Width">
            <el-input class="el-input" v-model="data.Width"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Height">
            <el-input class="el-input" v-model="data.Height"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="UoM">
            <el-input class="el-input" v-model="data.Uom"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="UoM DIM">
            <el-input class="el-input" v-model="data.UomDim"></el-input>
          </el-form-item>
        </div>
      </div>
      <h3>Invoice</h3>
      <div class="upper-container">
        <div class="side-container">
          <el-form-item :style="getStyleItem" label="Invoice number">
            <el-input class="el-input" v-model="data.InvoiceNumber"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Purchased By">
            <el-input class="el-input" v-model="data.PurchasedBy"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Currency">
            <el-input class="el-input" v-model="data.Currency"></el-input>
          </el-form-item>
        </div>
        <div class="side-container">
          <el-form-item :style="getStyleItem" label="Vat">
            <el-input class="el-input" v-model="data.Vat"></el-input>
          </el-form-item>
          <el-form-item :style="getStyleItem" label="Shipping terms">
            <el-input
              type="textarea"
              class="el-input"
              v-model="data.ShippingTerms"
            ></el-input>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          @click.native.prevent="
            () => {
              $emit('saveLine', data);
            }
          "
          >Save</el-button
        >
        <el-button
          @click.native.prevent="
            () => {
              $emit('cancel');
            }
          "
          >Cancel</el-button
        >
      </el-form-item>
    </el-form>

    <!-- <el-table :data="getRowdata" style="width: 100%">
      <el-table-column v-for="header in getHeaders" :key='header' :prop='header' :label='header'>
        <template slot-scope="scope">
          <el-input class="el-input" size="small"
            style="text-align:center"
            v-model="scope.row[header]" controls-position="right"></el-input>
        </template>
      </el-table-column>
      <el-table-column
      fixed="right"
      label="Operations"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="()=>{$emit('cancel')}"
          type="text"
          class='table-operations-btn table-operations-btn-remove'
          size="small">
          Cancel
        </el-button>
        <el-button
          @click.native.prevent="()=>{$emit('saveLine', rowData[0])}"
          type="text"
          class='table-operations-btn table-operations-btn-Edit'
          size="small">
          Save
        </el-button>
      </template>
    </el-table-column>
    </el-table> -->
  </div>
</template>
<script>
// import $ from 'jquery'
export default {
  props: ["rowData", "fields_map"],
  name: "EditRow",
  methods: {
    setHeadersArr(headers) {
      this.headersArr = headers;
    }
  },
  data() {
    return {
      options: [
        {
          value: this.rowData.serviceType,
          label: this.rowData.serviceType
        }, 
        {
          value: 'FEDEX_2_DAY',
          label: 'FEDEX_2_DAY'
        }, 
        {
          value: 'FIRST CLASS',
          label: 'FIRST CLASS'
        }, {
          value: 'PRIME',
          label: 'PRIME'
        }, {
          value: 'PRIORITY',
          label: 'PRIORITY'
        }, {
          value: 'PRIORITY EXPRESS',
          label: 'PRIORITY EXPRESS'
        }],
      data: {}
    };
  },
  computed: {
    getStyleItem() {
      let styleStr = "";
      styleStr += "font-weight:bolder";
      return styleStr;
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
    getRowdata() {
      return this.rowData;
    }
  },
  created() {
    this.data = this.rowData;
  }
};
// https://jsfiddle.net/changjoo_park/pLutx6ey/
</script>
<style scoped>
.edit-row-container {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.685);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50000;
}
.row-edit-form {
  max-width: 1000px;
  overflow-y: scroll;
  align-self: flex-end;
  border-radius: 10px 10px 0px 0px;
  padding: 10px;
  width: 95%;
  height: 90vh;
  background-color: rgba(255, 255, 255, 0.993);
  margin: 0px auto;
  display: flex;
  flex-direction: column;
}

.el-form-item .el-input {
  color: red !important;
  min-width: 150px;
}

.upper-container {
  /* max-width: 1000px; */
  /* align-self: center; */
  display: flex;
  flex-wrap: wrap;
}
.el-form-item__label {
  background-color: red !important;
}
.upper-container .side-container {
  margin: 0px 2rem;
  flex-basis: 1;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
