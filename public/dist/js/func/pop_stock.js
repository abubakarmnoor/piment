//load data dt
function load_data_dt(_url){
    //init
    $(".divhide").css('display', 'none');

    //popup btn
    
    $(".btnaddnew").on("click", function(e){
        $(this).hide()
        $(".divhide").css('display', '');
        $("input[name=stock_guid]").val('');
        $("input[name=stock_qty]").val(0);
        $("textarea[name=stock_info]").val('');
        $("input[name=stock_qty]").focus();
    })
    $(".btnclose").on("click", function(e){
        $(".divhide").css('display', 'none');
        $(".btnaddnew").show();
    })
    $(".btncancel").on("click", function(e){
        $("input[name=stock_qty]").val(0);
        $("textarea[name=stock_info]").val('');
        $(".divhide").css('display', 'none');
        $(".btnaddnew").show();
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
 
	        var col4 = api
                .column( 4 )
                .data()
                .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );
			// Update footer by showing the total with the reference of the column index 
	        $( api.column( 0 ).footer() ).html('Total');
            $( api.column( 4 ).footer() ).html(numberWithCommas(col4));
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
            { "data": "stock_info"},
            { "data": "stock_qty", render: $.fn.dataTable.render.number(',', '.', 0, '')},
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
        // const _type_id = table_stock.row( this ).data().stock_type_guid;
        $("input[name=stock_guid]").val(_id);
        $("input[name=stock_qty]").val(_qty);
        $("textarea[name=stock_info]").val(_info);
        $(".divhide").css('display', '');
        $(".btnaddnew").hide();
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
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.desc
                        }).then(function(){
                            //location.href='/clients'
                            $("#btn_refresh").click();
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
        _data.stock_price = (_data.stock_price).replace(/\,/g,'');//.toFixed(2);
        _data.stock_upd_by = "Admin";
        _data.stock_type = "rm";
        _data.tblname = "stock";
        console.log(_data);
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
                $("#spinner-modal").modal('hide')
                table_stock.ajax.url("/apis/pull/stock/rm/"+_data.stock_type_guid, null, false).load(); // refresh
                $("#btn_refresh").click();
                Swal.fire({
                    icon: 'success',
                    title: '',
                    text: "Data Saved"
                }).then(function(){
                    $(".btncancel").click();
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

    });
}
