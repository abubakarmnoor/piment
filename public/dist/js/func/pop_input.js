var table;
$(document).ready(function (e){
    //init
    $("#co_order_fp_guid").selectpicker('val',null)

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
        console.log(_data);
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
                            resetOrderForm();
                            
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
    // Delete a record
    $('#dtTbl_Order').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = table.row( this ).data().co_order_guid;
        _data.desc = table.row( this ).data().fp_desc;
        _data.upd_by = $("#logged_user_id").text();
        //_data.tblname = 'rm'
        // console.log(_data);
        // console.log( table.row( this ).data().id );

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this! ("+_data.desc+")",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                spinner_popup();
                $.ajax({
                    type:"POST",
                    url: "/apis/del/co_order", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        $('.modal').modal('hide');
                        Swal.fire({
                            icon: "success",
                            title: "Data Deleted",
                            text: _data.rm_desc
                        }).then(function(){
                            refreshOrderTable();
                        });
                        
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
        })
    } );



    //end ready
})

function resetOrderForm(){
    $("#co_order_fp_guid").selectpicker('val',"-");
    $("input[name=co_order_cost]").val(0);
    $("input[name=co_order_price]").val(0);
    $("input[name=co_order_qty]").val(0);

}