<template>
  <div class='form-inline'>
    <div class='form-group'>
      <label for='files'>Upload a CSV formatted file:</label>
      <input
        type='file'
        id='files'
        class='form-control'
        accept='.csv'
        required
      />
    </div>
    <div class='form-group'>
      <button
        type='submit'
        @click='onSubmitCSV'
        id='submit-file'
        class='btn btn-primary'
      >
        Upload File
      </button>
    </div>
  </div>
</template>

<script>
global.jQuery = require('jquery')
var $ = global.jQuery
window.$ = $

export default {
  name: 'UploadCSV',
  props: {
    msg: String
  },
  methods: {
    onSubmitCSV () {
      this.$papa.parse($('#files'), {
        config: {
          delimiter: 'auto',
          complete: this.displayHTMLTable
        },
        before: function (file, inputElem) {},
        error: function (err, file) { console.log(err) },
        complete: function () {}
      })
    },
    displayHTMLTable (results) {
      var table = '<table class="table">'
      var data = results.data
      for (var i = 0; i < data.length; i++) {
        table += '<tr>'
        var row = data[i]
        var cells = row.join(',').split(',')

        for (var j = 0; j < cells.length; j++) {
          table += '<td>'
          table += cells[j]
          table += '</th>'
        }
        table += '</tr>'
      }
      table += '</table>'
      $('#parsed_csv_list').html(table)
    }
  },

  data () {
    return {
      moreData: [],
      URL_GET_AWBS: 'http://192.117.139.143:57772/rest/api/Shop/GetRules'
    }
  }
}
</script>

<style scoped></style>
