

//init
$("#reportrange").css("display", "none")
//formatDate
function formatDate(date, display=false) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    if (display){
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        var month_name = monthNames[d.getMonth()];
        return [day, month_name, year].join('-');
    }else{
        return [year, month, day].join('-');
    }
    
}
//find json
function findId(dataArray, idToLookFor) {
    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].id == idToLookFor) {
            return(dataArray[i].product);
        }
    }
}

//getURLParameter
function getURLParameter(url, name) {
    return (RegExp(name + '=' + '(.+?)(&|$)').exec(url)||[,null])[1];
}

//spinner
function spinner_popup (){
    // $('.modal-popup').modal('show');
    $('.spinner-bg').modal('show');    
    
}

//default
function get_date_default(created_by, created_date, updated_by, updated_date){
    
    let c_date; let u_date;
    c_date = new Date();
    u_date = c_date;

    $("input[name=created_by").val(created_by)
    $("input[name=updated_by").val(updated_by)
    $("input[name=updated_date").val(formatDate(u_date,true))  
    if (created_date){
        $("input[name=created_date").val(formatDate(created_date,true))
    }else{
        $("input[name=created_date").val(formatDate(c_date,true))
    }
    
    
}

//form serialize
function convertFormToJSON(form) {
    return $(form)
      .serializeArray()
      .reduce(function (json, { name, value }) {
        json[name] = value;
        return json;
      }, {});
  }

  //daterange
$(function() {

    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'Today': [moment(), moment()],
            'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);
    
});

//number
function numberWithCommas(x, dec) {
    const _val = x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return (!dec, _val, _val);

}

function isNumber(event) {
    var allowed = "";
    if (event.target.value.includes(".")) {
      allowed = "0123456789";
    }
    else if (event.target.value.includes("")) {
        allowed = "0123456789,";  
    } else {
      allowed = "0123456789.";
    }
    if (!allowed.includes(event.key)) {
      event.preventDefault();
    }
}

//reload select picker after add/upd/del
function selectpicker_refresh(id_, url_){
    
    spinner_popup();
    $.ajax({
        type:"GET",
        url: url_, 
        success: function(data) {
            // $('.modal').modal('hide');
            $("#spinner-modal").modal('hide')

            let option_ = new Option("-", "-")
            $('#'+id_)
            .empty()
            .append(option_)
            // .selectpicker('refresh');
            for (let index = 0; index < data.data.length; index++) {
                option_ = new Option(data.data[index].desc, data.data[index].code)
                $('#'+id_).append(option_);
            }
            
            $('#'+id_).selectpicker('refresh');
        }, 
        error: function(jqXHR, textStatus, errorThrown) {
            //alert(jqXHR.status);
            $('.modal').modal('hide');
            Swal.fire({
                title: "Error!",
                text: textStatus,
                icon: "error"
            });
        }
    });
    
}