define(function(require, exports, module) {
    
    exports.run = function() {

        $('body').on('click', '[data-role=getZip]', function() {
            beforeGetResult();

            var url = $('[data-role="getZip"]').data('url'),
            data = $('[data-role=getSecret]').val();

            if (data) {
                $.post(url, {'postData':data}, function(results){
                    if(results.status == 'success')
                    {
                        console.log(results.secret);
                        // $('#demo').remove();
                        // $('.cr-box').remove();
                       
                       
                    }
                });
            };
            
            

        });


    };

    function beforeGetResult () {
        console.log('waiting for the moment!');
    }

});

