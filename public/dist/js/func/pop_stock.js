var type_guid_;
//load data dt
function load_data_dt(_url){
    type_guid_=$("name[stock_type_guid]").val();
    $("#btn_pop_clear").on("click", function(){
        $('#form__')[0].reset();
    })
    // ajax
    table = $('#dtTbl_pop').DataTable({
        // "scrollY": "370px",
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
                data: "stock_guid",
                className: "dt-center editor-details",
                orderable: true
            },
            { "data": "stock_info"},
            { "data": "stock_qty"},
            { "data": "stock_upd_by"},
            { "data": "stock_upd_date"}
        ]
    });
    
    // Edit record
    $('#dtTbl_pop').on('click', 'td.editor-edit', function (e) {
        e.preventDefault();
        //console.log( table.row( this ).data().id );
        const _id = table.row( this ).data().stock_guid;
         
    } );
    
    // Delete a record
    $('#dtTbl_pop').on('click', 'td.editor-delete', function (e) {
        e.preventDefault();
        let _data = {};
        _data.id = table.row( this ).data().stock_guid;
        _data.type_id = table.row( this ).data().stock_type_guid;
        _data.desc = $("label[name=prod_desc").text();
        _data.upd_by = "Admin";
        // console.log(_data);

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
                        Swal.fire({
                            icon: 'success',
                            title: "Data Deleted",
                            text: _data.desc
                        }).then(function(){
                            //location.href='/clients'
                            $("#btn_pop_clear").click();
                            // console.log(_data.pop_type);
                            table.ajax.url("/apis/pull/rmfp/rm/"+type_guid_, null, false).load(); // refresh pop
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
        _data.pop_updated_by = "Admin";
        _data.tblname = "stock";
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
                $("#spinner-modal").modal('hide')
                Swal.fire({
                    icon: 'success',
                    title: '',
                    text: "Data Saved"
                }).then(function(){
                    $("#btn_pop_clear").click();
                    table.ajax.url("apis/pull/rmfp/rm/"+type_guid_, null, false).load(); // refresh pop
                    selectpicker_reload(_data.pop_type);
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
