jQuery.ajaxSetup({
            cache: false,
            async: true,
        });
        jQuery.ajax({
            url: 'http://52.4.34.166/apigility/public/ws_pedidos?vendedor_id=0001',
            type: 'jsonp',
            method: 'GET',
            xhrFields: {
                withCredentials: false
            },
            headers: {
            },
            success: function (xhr) {
               //ver en consola la data que recibes del servicio
               console.log(xhr);
             }
        });

