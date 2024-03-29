$(document).ready(function(){
    $("#btn_login").on("click", function(e){
        let _data = {}
        _data.email = $("input[name=email").val()
        _data.pass = $("input[name=password").val()
        
        spinner_popup();
        $.ajax({
            type:"POST", // must be POST 
            url: "/auth", 
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(_data),
            success: function(data) {
                $('.modal').modal('hide');
                // data = JSON.stringify(data);
                // data = JSON.parse(data);
                // alert(data.success)
                if(data && data.success){
                    location.href='/?'
                }else{
                    Swal.fire({
                        icon: "warning",
                        title: "Login",
                        text: "email and/or password is invalid"
                    });
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


    })
})