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
        return ;

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
    //end ready
})