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
        $("form :input").prop("disabled", false);
        $("#btn_edit").hide()
        $("#btn_refresh").hide()
        $("#btn_cancel").show()
        $("#btn_save").show()
    })

    // btn cancel
    $("#btn_cancel").on("click", function(){
        $("form :input").prop("disabled", true);
        $("#btn_edit").show()
        $("#btn_refresh").show()
        $("#btn_cancel").hide()
        $("#btn_save").hide()
    })

    //btn save
    $('#form_').submit(function(e) {
        e.preventDefault();
        const form = $(e.target);
        const json = convertFormToJSON(form);
        json.txt_created_date = new Date(json.txt_created_date);
        json.txt_created_date = formatDate(json.txt_created_date)
        json.txt_updated_date = new Date(json.txt_updated_date);
        json.txt_updated_date = formatDate(json.txt_updated_date)
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
                load_data(); //re-popupate data to make sure data were saved properly
                $("form :input").prop("disabled", true);
                $("#btn_edit").show()
                $("#btn_refresh").show()
                $("#btn_cancel").hide()
                $("#btn_save").hide()
            })
        },3000)

    });
    
//end doc ready
})

//default edit
function default_edit(data){
    $("input[name='office_desc']").val(data[0].office_desc)
    $("input[name='address_line_1']").val(data[0].address_line_1)
    $("input[name='address_line_2']").val(data[0].address_line_2)
    $("input[name='zipcode']").val(data[0].zipcode)
    $("input[name='google_map']").val(data[0].google_map)
    $("input[name='sales_retail_inquiries_email']").val(data[0].sales_retail_inquiries_email)
    $("input[name='custom_lighting_project_inquiries_email']").val(data[0].custom_lighting_project_inquiries_email)
    $("input[name='phone_1']").val(data[0].phone_1)
    $("input[name='phone_2']").val(data[0].phone_2)
    $("input[name='fax']").val(data[0].fax)
    $("input[name='whatsapp']").val(data[0].whatsapp)
    $("input[name='default']").val(data[0].default)
    $("input[name='created_date']").val(data[0].created_date)
    $("input[name='created_by']").val(data[0].created_by)
    //$("input[name='updated_date']").val(data[0].updated_date)
    // $("input[name='updated_by']").val(data[0].updated_by)

    let user_login = 'test';
    get_date_default(data[0].created_by,data[0].created_date, user_login, null)
}

//ajax - load data
function load_data(){
    spinner_popup();
    $.ajax({
        type:"GET", 
        url: "/data/office.json", 
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