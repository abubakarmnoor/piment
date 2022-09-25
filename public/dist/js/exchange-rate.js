$(document).ready(function(){
    //default 
    load_data();
    $("form :input").prop("disabled", true);
    // $("#btn_cancel").hide()
    // $("#btn_save").hide()
    
    // btn refresh
    $("#btn_refresh").on("click", function(){
        load_data();
    })
    // btn edit
    $("#btn_edit").on("click", function(){
        // load_data();
        $("form :input").prop("disabled", false);
        $("#btn_edit").hide()
        $("#btn_refresh").hide()
        $("#btn_cancel").show()
        $("#btn_save").show()
    })

    // btn cancel
    $("#btn_cancel").on("click", function(){
        // load_data();
        $("form :input").prop("disabled", true);
        $("#btn_edit").show()
        $("#btn_refresh").show()
        $("#btn_cancel").hide()
        $("#btn_save").hide()
        
        $("#btn_refresh").click();

    })

    //btn save
    $('#form_').submit(function(e) {
        e.preventDefault();
        const form = $(e.target);
        const json = convertFormToJSON(form);
        //console.log(json);

        // ajax
        spinner_popup();
        setTimeout(function(){
            $('.modal').modal('hide');
            Swal.fire({
                icon: 'success',
                title: '',
                text: "Data Saved"
            }).then(function(){
                $("form :input").prop("disabled", true);
                $("#btn_edit").show()
                $("#btn_refresh").show()
                $("#btn_cancel").hide()
                $("#btn_save").hide()
                
                load_data(); //re-popupate data to make sure data were saved properly

            })
        },3000)

    });
    
    //number
    $("input[name=usd], input[name=eur]").on('keyup', function(){
        
        let _amt = $(this).val().replace(/,/g,"");
        // console.log(_amt);
        $(this).val(numberWithCommas(_amt));
        
    })
//end doc ready
})

//default edit
function default_edit(data){
    //$("input[type='date']").val(data[0].date)
     let date_ = moment(data[0].date).add(1, 'd')
    $('#date').val(formatDate(date_));
    $("input[name='usd']").val(data[0].usd)
    $("input[name='eur']").val(data[0].eur)
    $("input[name='created_date']").val(data[0].created_date)
    $("input[name='created_by']").val(data[0].created_by)
    // $("input[name='updated_date']").val(data[0].updated_date)
    // $("input[name='updated_by']").val(data[0].updated_by)
    let user_login = 'test';
    get_date_default(data[0].created_by,data[0].created_date, user_login, null)
}

//ajax - load data
function load_data(){
    spinner_popup();
    $.ajax({
        type:"GET", 
        url: "/data/exchange-rate.json", 
        dataType: "json",
        success: function(data) {
            setTimeout(function () {
                default_edit(data.data);
                $('.modal').modal('hide');
            }, 3000);
        }, 
        error: function(jqXHR, textStatus, errorThrown) {
            //alert(jqXHR.status);
            $('.modal').modal('hide');
            swal({
                title: "Error!",
                text: jqXHR.status,
                icon: "error"
            });
        }
    });
}