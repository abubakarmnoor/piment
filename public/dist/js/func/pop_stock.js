//load data dt
function load_data_dt(_url){
    //init
    $(".divhide").css('display', 'none');

    //popup btn
    $(".btnaddnew").on("click", function(e){
        $(this).hide()
        $(".divhide").css('display', '');
        clear();
    })
    $(".btnclose").on("click", function(e){
        $(".divhide").css('display', 'none');
        $(".btnaddnew").show();
        $(".modal-title").html('STOCK')
    })
    $(".btncancel").on("click", function(e){
        clear();
        $(".divhide").css('display', 'none');
        $(".modal-title").html('STOCK')
        $(".btnaddnew").show();
    })
    $(".btnclear").on("click", function(e){
        clear();
    })
    
    // ajax
    table_stock = $('#dtTbl_pop').DataTable({
        "footerCallback": function ( row, data, start, end, display ) {
            var api = this.api(), data;
 
            // converting to interger to find total
            var intVal = function ( i ) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '')*1 :
                    typeof i === 'number' ?
                        i : 0;
            };
 
	        var total_qty = api
                .column( 5 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
            var total_price = api
                .column( 6 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
			// Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 5 ).footer() ).html(numberWithCommas(total_qty));
            $( api.column( 6 ).footer() ).html(numberWithCommas(total_price));
        },
        // "scrollY": "370px",
        // "searching": false,
        "ordering": false,
        "scrollCollapse": true,
        "paging": true, 
        "lengthChange": false,
        "ajax": _url,
        "processing": true,
        "pageLength": 5,
        "language": {
            processing: '<i class="fa fa-spinner fa-pulse fa-3x fa-fw loader-custom"></i><span class="sr-only"></span> '},
        //"serverSide": true,
        "columnDefs": [
            {
                "targets": [ 2 ],
                "visible": false
            }
        ],  
        "columns": [
            {
                data: null,
                className: "dt-center editor-edit",
                defaultContent: '<i class="fa fa-pencil"/>',
                orderable: false
            },
            {
                data: null,
                className: "dt-center editor-delete",
                defaultContent: '<i class="fa fa-trash"/>',
                orderable: false
            },
            {
                data: "stock_type_guid",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "stock_trans_date"},
            { "data": "stock_info"},
            { "data": "stock_qty", render: $.fn.dataTable.render.number(',', '.', 0, '')},
            { "data": "stock_price", render: $.fn.dataTable.render.number(',', '.', 0, '')},
            { "data": "stock_upd_by"},
            { "data": "stock_upd_date"}
        ]
    });
    
    // Edit record
    $('#dtTbl_pop').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table_stock.row( this ).data().stock_guid;
        const _qty = table_stock.row( this ).data().stock_qty;
        const _info = table_stock.row( this ).data().stock_info;
        const _trans_date = table_stock.row( this ).data().stock_trans_date;
        const _price = table_stock.row( this ).data().stock_price;
        // const _type_id = table_stock.row( this ).data().stock_type_guid;
        $("input[name=stock_guid]").val(_id);
        $("input[name=stock_trans_date]").datepicker('setDate', _trans_date);
        $("input[name=stock_qty]")
        .val(_qty)
        .focusout();
        $("input[name=stock_price]")
        .val(parseInt(_price))
        .focusout();
        $("textarea[name=stock_info]").val(_info);
        $(".divhide").css('display', '');
        $(".btnaddnew").hide();
        $(".modal-title").html('STOCK - UPDATE')
    } );
    
    // Delete a record
    $('#dtTbl_pop').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = table_stock.row( this ).data().stock_guid;
        _data.type_id = table_stock.row( this ).data().stock_type_guid;
        _data.desc = $("input[name=prod_desc").text();
        _data.upd_by = "Admin";
        // console.log(_data);
        // return 

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
                    url: "/apis/del/stock", 
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    data: JSON.stringify(_data),
                    success: function(data) {
                        // $('.modal').modal('hide');
                        $("#spinner-modal").modal('hide')
                        $("#btn_pop_clear").click();
                        table_stock.ajax.url("/apis/pull/stock/rm/"+_data.type_id, null, false).load(); // refresh
                        $("#btn_refresh").click();
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.desc
                        }).then(function(){
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

    //save
    $('#form__').submit(function(e) {
        //$('#messages').removeClass('hide').addClass('alert alert-success alert-dismissible').slideDown().show();
        //$('#messages_content').html('<h4>MESSAGE HERE</h4>');
        //$('#modal').modal('show');
        
        e.preventDefault();
        const form = $(e.target);
        const _data = convertFormToJSON(form);
        _data.stock_qty = (_data.stock_qty).replace(/\,/g,'');
        _data.stock_price = (_data.stock_price).replace(/\,/g,'');
        _data.stock_upd_by = "Admin";
        _data.stock_type = "rm";
        _data.tblname = "stock";
        // console.log(_data);
        // return; 

        //validate
        if (_data.stock_qty == 0 || _data.stock_price == 0 ){
            Swal.fire({
                icon: 'warning',
                title: 'Stock',
                text: "Qty / Price cannot 0"
            })
            return;
        }
        // ajax - save/post data
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/apis/upd", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                $("#spinner-modal").modal('hide')
                if (data.success == true){
                    table_stock.ajax.url("/apis/pull/stock/rm/"+_data.stock_type_guid, null, false).load(); // refresh
                    $("#btn_refresh").click();
                    Swal.fire({
                        icon: 'success',
                        title: '',
                        text: "Data Saved"
                    }).then(function(){
                        $(".btncancel").click();
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
}

// functions 
clear = function(){
    $("input[name=stock_trans_date]").datepicker('setDate', new Date());
    $("input[name=stock_guid]").val('');
    $("input[name=stock_qty]").val(0);
    $("textarea[name=stock_info]").val('');
    $("input[name=stock_price]").val(0);
    $("input[name=stock_qty]").focus();
    $(".modal-title").html('STOCK - ADD NEW')
}