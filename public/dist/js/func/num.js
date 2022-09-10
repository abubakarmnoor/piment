$(document).ready(function(){
    //number
    $(".numeric").on('keyup keypress focusout', function(e){
            
        isNumber(e)
        let _amt = $(this).val().replace(/,/g,"");
        // console.log(_amt);
        $(this).val(numberWithCommas(_amt));
        
    })
    $(".numeric").on('focus', function(e){
            
        isNumber(e)
        let _amt = $(this).val().replace(/,/g,"");
        // console.log(_amt);
        $(this).val(_amt);
        
    })
})
