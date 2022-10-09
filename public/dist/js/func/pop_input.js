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
        $("input[name=fp_sc_cost]").val(price_).focusout();
        var price_ = $('option:selected', this).attr("price");
        $("input[name=co_order_price]").val(price_).focusout();
        $("input[name=co_order_qty]").focus();
    })
   
    $("#btncancel").on("click", function(e){
        e.preventDefault();
        resetOrderForm();
        resetInvForm();
    })

    //end ready
})

function resetOrderForm(){
    $("#co_order_fp_guid").selectpicker('val',null)
    $("input[name=co_order_cost]").val(0);
    $("input[name=co_order_price]").val(0);
    $("input[name=co_order_qty]").val(0);

}
function resetInvForm(){
    $("input[name=inv_date]").val(null);
    $("input[name=inv_due_date]").val(null);
    $("#inv_code").selectpicker('val',null)
    $("input[name=inv_cost]").val(0);
    $("input[name=inv_price]").val(0);
    $("textarea[name=inv_info]").val('');

}
