$("#btn_fpc").hide();
spinner_popup();
$(document).ready(function() {
            
    //default
    let id=$("#fp_guid").val()
    $('.selectpicker').selectpicker();
    insert_element_pf(); insert_element_origin();
    load_data_dt('/apis/pop/product-family'); //init

    //edit or add new
    if (location.href.includes('ZWlk')) {
        $('.page-header').text('FINISH PRODUCT UPDATES')
        $("#btn_fpc").show();
        // let url = location.href;
        // let id = getURLParameter(url, 'ZWlk');
        // $("#id").val(id);
        get_details(id);
        
    }else if (location.href.includes('ZGlk')) {
        $('.page-header').text('FINISH PRODUCT DETAILS');
        $("#btn_save").hide();
        $("#btn_fpc").show();
        $("#form_ :input").prop('readonly', true);
        
        $('.selectpicker').prop('disabled', true);
        $('.selectpicker').selectpicker('refresh');

        $("#ck_active").attr("disabled", true);
        $(".cancel").html("<a href='/finish-product' type='button' class='btn btn-outline btn-primary'><i class='fa fa-long-arrow-left'></i> Back</a>");
        // let url = location.href;
        // let id = getURLParameter(url, 'did');
        // $("#id").val(id);
        get_details(id);
        
    
    }else{
        $('.modal').modal('hide');
        $('.page-header').text('FINISH PRODUCT ADD NEW')
        $("#btn_fpc").hide();
        let username = 'Admin';
    }

     //btn
    //save
    $('#form_').submit(function(e) {
        //$('#messages').removeClass('hide').addClass('alert alert-success alert-dismissible').slideDown().show();
        //$('#messages_content').html('<h4>MESSAGE HERE</h4>');
        //$('#modal').modal('show');
        
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.fp_created_by = $("#logged_user_id").text();
        _data.fp_active = $("#ck_active").prop('checked')
        _data.fp_validated = $("#ck_validated").prop('checked')
        _data.fp_box_size_h = (_data.fp_box_size_h).replace(/\,/g,'');
        _data.fp_box_size_l = (_data.fp_box_size_l).replace(/\,/g,'');
        _data.fp_box_size_w = (_data.fp_box_size_w).replace(/\,/g,'');

        _data.fp_sc_extra_cost = (_data.fp_sc_extra_cost).replace(/\,/g,'');
        _data.fp_sc_extra_labour = (_data.fp_sc_extra_labour).replace(/\,/g,'');
        _data.fp_sc_cost = (_data.fp_sc_cost).replace(/\,/g,'');

        _data.fp_sc_wholesale_sale = (_data.fp_sc_wholesale_sale).replace(/\,/g,'');
        _data.fp_sc_wholesale_profit = (_data.fp_sc_wholesale_profit).replace(/\,/g,'');
        // _data.fp_sc_wholesale_markup = (_data.fp_sc_wholesale_markup).replace(/\,/g,'');
        _data.fp_sc_wholesale_markup = 0;

        _data.fp_sc_business_sale = (_data.fp_sc_business_sale).replace(/\,/g,'');
        _data.fp_sc_business_profit = (_data.fp_sc_business_profit).replace(/\,/g,'');
        // _data.fp_sc_business_markup = (_data.fp_sc_business_markup).replace(/\,/g,'');
        _data.fp_sc_business_markup = 0; // auto by calc

        _data.fp_sc_retail_sale = (_data.fp_sc_retail_sale).replace(/\,/g,'');
        _data.fp_sc_retail_profit = (_data.fp_sc_retail_profit).replace(/\,/g,'');
        // _data.fp_sc_retail_markup = (_data.fp_sc_retail_markup).replace(/\,/g,'');
        _data.fp_sc_retail_markup = 0; // auto by calc
        _data.tblname = "fp";

        // console.log(_data);
        // return;

        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                $('.modal').modal('hide');
                if (data.success == true){
                    Swal.fire({
                        icon: 'success',
                        title: 'Finish Product',
                        text: "Data Saved"
                    }).then(function(){
                        location.href='/finish-product'
                    });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: '',
                        text: data.err.sqlMessage
                    })
                }
                
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

    });

    //btn
    $("#btn_fpc").on("click", function(e){
        e.preventDefault();
        location.href = "/fpc/"+$("#fp_guid").val()+"/"+$("#act").val();
    })

    //date datepicker
    $("#created_date").datepicker({
        format: "dd-M-yyyy",
    });
    $("#receipt_last_updated").datepicker({
        format: "dd-M-yyyy",
    });

//end  doc ready
});
//default-edit
function default_edit(data){

    let _c_date = new Date(data[0].created_date)
    let _rlu_date = new Date(data[0].receipt_last_updated)
    //_date.setDate(_date.getDate()+1)
    
    $("input[name=fp_desc]").val(data[0].fp_desc)
    $('#sp_product_family').selectpicker('val',data[0].fp_prod_family)
    $("input[name=fp_box_size_l]").val(data[0].fp_box_size_l)
    $("input[name=fp_box_size_w]").val(data[0].fp_box_size_w)
    $("input[name=fp_box_size_h]").val(data[0].fp_box_size_h)
    $("input[name=created_date]").val(formatDate(_c_date,true))
    $('#sp_origin').selectpicker('val',data[0].fp_origin)
    $("#ck_validated").prop('checked', data[0].fp_validated)
    $("#ck_active").prop('checked', data[0].fp_active)

    
    $("input[name=fp_sc_extra_cost]").val(Number(data[0].fp_sc_extra_cost)).focusout()
    $("input[name=fp_sc_extra_labour]").val(Number(data[0].fp_sc_extra_labour)).focusout()
    $("input[name=fp_sc_cost]").val(Number(data[0].fp_sc_cost)).focusout()
    // const total_cost = Number(data[0].fp_sc_extra_cost)+Number(data[0].fp_sc_extra_labour)+Number(data[0].fp_sc_cost);
    // $("#total_cost").val(total_cost)

    const fp_sc_wholesale_sale = Number(data[0].fp_sc_wholesale_sale);
    $("input[name=fp_sc_wholesale_sale]").val(fp_sc_wholesale_sale).focusout()
    // $("input[name=fp_sc_wholesale_profit]").val(Number(data[0].fp_sc_wholesale_profit)).focusout()
    // $("input[name=fp_sc_wholesale_markup]").val(Number(data[0].fp_sc_wholesale_markup)).focusout()

    $("input[name=fp_sc_business_sale]").val(Number(data[0].fp_sc_business_sale)).focusout()
    $("input[name=fp_sc_business_profit]").val(Number(data[0].fp_sc_business_profit)).focusout()
    $("input[name=fp_sc_business_markup]").val(Number(data[0].fp_sc_business_markup)).focusout()

    $("input[name=fp_sc_retail_sale]").val(Number(data[0].fp_sc_retail_sale)).focusout()
    $("input[name=fp_sc_retail_profit]").val(Number(data[0].fp_sc_retail_profit)).focusout()
    $("input[name=fp_sc_retail_markup]").val(Number(data[0].fp_sc_retail_markup)).focusout()
    
    calc();
}

//
$("input[name=fp_sc_extra_cost]").change(function(){
    calc();
})
$("input[name=fp_sc_extra_labour]").change(function(){
    calc();
})
$("input[name=fp_sc_cost]").change(function(){
    calc();
})
$("input[name=fp_sc_wholesale_sale]").change(function(){
    calc();
})
$("input[name=fp_sc_retail_sale]").change(function(){
    calc();
})
$("input[name=fp_sc_business_sale]").change(function(){
    calc();
})
//calc
function calc(){
    const total_cost = (
        Number($("input[name=fp_sc_extra_cost]").val().replace(/,/g,"")) + 
        Number($("input[name=fp_sc_extra_labour]").val().replace(/,/g,"")) +
        Number($("input[name=fp_sc_cost]").val().replace(/,/g,""))
        ).toFixed(2)
    $("#total_cost").val(total_cost).focusout()

    const sale_ = $("input[name=fp_sc_wholesale_sale]").val().replace(/,/g,"")
    $("input[name=fp_sc_wholesale_profit]").val((sale_-total_cost).toFixed(2)).focusout()
    $("#ws_markup").val(((sale_/total_cost)).toFixed(2))

    const sale_b = $("input[name=fp_sc_business_sale]").val().replace(/,/g,"")
    $("input[name=fp_sc_business_profit]").val((sale_b-total_cost).toFixed(2)).focusout()
    $("#b_markup").val(((sale_b/total_cost)).toFixed(2))

    const sale_r = $("input[name=fp_sc_retail_sale]").val().replace(/,/g,"")
    $("input[name=fp_sc_retail_profit]").val((sale_r-total_cost).toFixed(2)).focusout()
    $("#r_markup").val(((sale_r/total_cost)).toFixed(2))
}

//get details
function get_details(id){
    //ajax - get details
    spinner_popup();
    //ajax
    $.ajax({
        type:"GET", 
        url: "/apis/pull/fp/"+id, 
        dataType: "json",
        success: function(data) {
            default_edit(data.data);
            $('.modal').modal('hide');
        }, 
        error: function(jqXHR, textStatus, errorThrown) {
            //alert(jqXHR.status);
            swal({
                title: "Error!",
                text: jqXHR.status,
                icon: "error"
            });
        }
    });
}

//insert element
function insert_element_pf(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_pf" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(9) > div:nth-child(1) > div > div > div');
}
function insert_element_origin(){
    $('<a href="#" type="button" class="pull-right" id="btn_pop_origin" data-toggle="modal" data-target="#pop-modal-form" style="margin-right: 11px"><i class="glyphicon-plus"></i> Add New</a>').insertBefore('#form_ > div:nth-child(9) > div:nth-child(2) > div > div > div');
    
}
