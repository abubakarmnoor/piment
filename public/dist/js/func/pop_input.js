$(document).ready(function (e){
    //init
    resetOrderForm();
    resetInvForm();
    
    //submit
    $("#form_input").submit(function(e){
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.co_order_upd_by = $("#logged_user_id").text();
        _data.co_order_co_guid = $("input[name=co_guid]").val();
        _data.co_order_price = (_data.co_order_price).replace(/\,/g,'')
        _data.co_order_cost = (_data.co_order_cost).replace(/\,/g,'')
        _data.co_order_qty = (_data.co_order_qty).replace(/\,/g,'')
        _data.tblname = "co_order";
        // console.log($("#co_order_fp_guid").val());
        // console.log(_data);
        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                //refresh
                if ($("input[name=input_for]").val() == "co_order"){
                    refreshOrderTable();
                }else{
                    refreshInvTable();
                }
                if (data.success == true){
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        text: "Data Saved"
                    }).then(function(){
                        Swal.fire({
                            // title: 'Add more component ?',
                            text: "Add more FP ?",
                            icon: 'question',
                            showDenyButton: true,
                            confirmButtonText: 'Yes',
                            denyButtonText: 'No'
                          }).then((result) => {
        
                            if (result.isConfirmed) {
                                //reset form
                                $('#spinner-modal').modal('hide');
                                if ($("input[name=input_for]").val() == "co_order"){
                                    resetOrderForm();
                                }else{
                                    resetInvForm();
                                }
                            } else if (result.isDenied) {
                                $('.modal').modal('hide');
    
                            }
                        })
                        
                    });
                }else{
                    $('#spinner-modal').modal('hide');
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
                    icon: "error",
                    title: "Error!",
                    text: textStatus,
                });
            }
        });

    })

    $("#form_input_inv").submit(function(e){
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.inv_upd_by = $("#logged_user_id").text();
        _data.inv_co_guid = $("input[name=co_guid]").val();
        _data.inv_amount = (_data.inv_amount).replace(/\,/g,'')
        _data.inv_amount_paid = (_data.inv_amount_paid).replace(/\,/g,'')
        _data.tblname = "inv";

        if (_data.inv_paid_date == ""){
            _data.inv_paid_date = null;
        }
        // console.log(_data);
        // return;

        //validate
        if (Number(_data.inv_amount) < Number(_data.inv_amount_paid)){
            Swal.fire({
                icon: 'info',
                title: 'Invoice',
                text: "Paid amount cannot greater than invoice amount"
            }).then(function(){
                $("input[name=inv_amount_paid]")
                // .val(_amt)
                .focus()
            })
            return;
        }
        // ajax - save/post data
        if (!_data.inv_code)
        {
            Swal.fire({
                icon: 'warning',
                title: 'Invoice',
                text: "Please select one Invoice Code"
            })
            return;
        }

        spinner_popup();
        $.ajax({
            type:"POST",
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                //refresh
                if ($("input[name=input_for]").val() == "co_order"){
                    refreshOrderTable();
                }else{
                    refreshInvTable();
                }
                if (data.success == true){
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        text: "Data Saved"
                    }).then(function(){
                        Swal.fire({
                            // title: 'Add more component ?',
                            text: "Add more Invoice ?",
                            icon: 'question',
                            showDenyButton: true,
                            confirmButtonText: 'Yes',
                            denyButtonText: 'No'
                          }).then((result) => {
        
                            if (result.isConfirmed) {
                                //reset form
                                $('#spinner-modal').modal('hide');
                                if ($("input[name=input_for]").val() == "co_order"){
                                    resetOrderForm();
                                }else{
                                    const _inv_id = tableInv.row( 0 ).data();
                                    const _inv_id_1 = ((_inv_id) ? _inv_id.inv_id : "");
                                    resetInvForm(_inv_id_1);
                                }
                            } else if (result.isDenied) {
                                $('.modal').modal('hide');
    
                            }
                        })
                        
                    });
                }else{
                    $('#spinner-modal').modal('hide');
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
                    icon: "error",
                    title: "Error!",
                    text: textStatus,
                });
            }
        });

    })

    //dropdown
    $("#co_order_fp_guid").on("change", function(e){
        // alert($("#fp_cp_rm_guid").attr('price'))
        e.preventDefault()
        var cost_ = $('option:selected', this).attr("cost");
        $("input[name=fp_sc_cost]").val(cost_).focusout();
        $("input[name=co_order_cost]").val(cost_).focusout();
        var price_ = $('option:selected', this).attr("price");
        $("input[name=co_order_price]").val(price_).focusout();
        $("input[name=co_order_qty]").val(1).focus();
    })
   
    $("#btncancel").on("click", function(e){
        e.preventDefault();
        resetOrderForm();
        resetInvForm();
    })

    //Invoice
    // $("input[name=inv_amount_paid]").on("change", function(){
    //     const _amt = $("input[name=inv_amount]").val().replace(/\,/g,'')
    //     if (_amt < $(this).val().replace(/\,/g,'')){
    //         Swal.fire({
    //             icon: 'info',
    //             title: 'Invoice',
    //             text: "Paid amount cannot greater than invoice amount"
    //         }).then(function(){
    //             $("input[name=inv_amount_paid]")
    //             .val(_amt)
    //             .focus()
    //         })
    //     }
    // })
    // $("input[name=inv_amount]").on("change", function(){
    //     const _amt = $("input[name=inv_amount_paid]").val().replace(/\,/g,'')
    //     // console.log(_amt);
    //     // console.log($(this).val().replace(/\,/g,''));
    //     if (_amt > $(this).val().replace(/\,/g,'')){
    //         Swal.fire({
    //             icon: 'info',
    //             title: 'Invoice',
    //             text: "Paid amount cannot greater than invoice amount"
    //         }).then(function(){
    //             $("input[name=inv_amount]")
    //             .val(_amt)
    //             .focus()
    //         })
    //     }
    // })

    //end ready
})

function resetOrderForm(){
    $("#co_order_fp_guid").selectpicker('val',null)
    $("input[name=co_order_cost]").val(0);
    $("input[name=co_order_price]").val(0);
    $("input[name=co_order_qty]").val(0);
    $("textarea[name=co_order_info]").val("")

}
function resetInvForm(invId){
    // console.log(invId);
    $("input[name=inv_guid]").val('');
    $("input[name=inv_id]").val(invId); 
    $("#inv_code").selectpicker('val',null)
    $("input[name=inv_amount]").val(0);
    $("input[name=inv_amount_paid]").val(0);
    $("input[name=inv_paid_date]").val(null);
    $("textarea[name=inv_info]").val('');

    if ((invId) && invId !== ""){
        $("input[name=inv_id]").attr("readonly", "readonly")
    } else{
        $("input[name=inv_id]").removeAttr("readonly")
    }
}
