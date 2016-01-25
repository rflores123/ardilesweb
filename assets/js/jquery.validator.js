$(document).ready(function () {
    $("body").on('change', '.price', function () {
        if ($(this).val() > 0) {
            var amt = parseFloat(this.value);
            $(this).val(amt.toFixed(2));
        } else {
            $(this).val('0.00');
        }
    })
    $("body").on('change', '.money', function () {
        if ($(this).val() > 0) {
            var amt = parseFloat(this.value);
            $(this).val(amt.toFixed(2));
        } else {
            $(this).val('0');
        }
    })
})
jQuery.fn.validate = function () {
    //Reiniciamos todo el formulario
    $("select,input,textarea", $(this)).each(function () {
        $(this).removeClass('failed');
        $(this).removeClass('approved');
    })

    //Respuesta
    var fail = 0;

    //Caracteres minimo para la clase Required
    var min_str = 1;

    //Accediendo a los que son requeridos
    $(".required:not(:disabled)", this).each(function () {
        if ($(this).val().length < min_str) {
            $(this).addClass('failed');
            fail++;

            if (fail == 1) $(this).focus();
        } else {
            $(this).addClass('approved');
        }
    })

    $("select.required:not(:disabled)", this).each(function () {
        if ($(this).val() == '0' || $(this).val() == '') {
            $(this).addClass('failed');
            fail++;

            if (fail == 1) $(this).focus();
        } else {
            $(this).addClass('approved');
        }
    })

    /*
    * Valida que solo se ingrese valores numericos
    * y si es obligatorio debe ser mayor a 0
    *
    * NO HA SIDO PROBADO DEL TODO
    */
    $(".numeric:not(:disabled)", this).each(function () {
        var value = $(this).val().replace(',', '');
        if (value.match(/^([0-9])*[.]?[0-9]*$/)) {
            if ($(this).hasClass('required')) {
                if (parseInt(value) > 0) {
                    $(this).addClass('approved');
                } else {
                    $(this).addClass('failed');
                    fail++;

                    if (fail == 1) $(this).focus();
                }
            } else {
                $(this).addClass('approved');
            }
        } else {
            $(this).addClass('failed');
            fail++;

            if (fail == 1) $(this).focus();
        }
    })

    /*
    * Valida que solo se ingrese valores numericos
    * y si es obligatorio debe ser mayor a 0
    *
    * NO HA SIDO PROBADO DEL TODO
    */
    $(".price:not(:disabled)", this).each(function () {
        var value = $(this).val().replace(',', '');
        if (value.match(/^([0-9])*[.]?[0-9]*$/)) {
            if ($(this).hasClass('required')) {
                if (parseFloat(value) > 0) {
                    $(this).addClass('approved');
                } else {
                    $(this).addClass('failed');
                    fail++;

                    if (fail == 1) $(this).focus();
                }
            } else {
                $(this).addClass('approved');
            }
        } else {
            $(this).addClass('failed');
            fail++;

            if (fail == 1) $(this).focus();
        }
    })

    //Correos electronicos
    $(".email:not(:disabled)", this).each(function () {
        if ($(this).val().match(/^[0-9a-z_\-\.]+@[0-9a-z\-\.]+\.[a-z]{2,4}$/i)) {
            $(this).addClass('approved');
        } else {
            $(this).addClass('failed');
            fail++;

            if (fail == 1) $(this).focus();
        }
    })

    //Validar Password, que sea igual al otro
    passwd = new Array();
    $(".password:not(:disabled)", this).each(function (i) {
        passwd[i] = $(this);
    })

    if (passwd[0] != undefined && passwd[1] != undefined) {
        if (passwd[0].val() != "") {
            if (passwd[0].val().length >= 4) {
                passwd[0].addClass('approved');
                if (passwd[0].val() == passwd[1].val()) {
                    passwd[0].addClass('approved');
                    passwd[1].addClass('approved');
                } else {
                    passwd[0].addClass('failed');
                    passwd[1].addClass('failed');
                    fail++;

                    if (fail == 1) $(this).focus();
                }
            } else {
                passwd[0].addClass('failed');
                passwd[1].addClass('failed');
                fail++;

                if (fail == 1) $(this).focus();
            }
        }
    }

    $(".youtube:not(:disabled)", this).each(function () {
        if ($(this).val().match(/http:\/\/(?:youtu\.be\/|(?:[a-z]{2,3}\.)?youtube\.com\/watch(?:\?|#\!)v=)([\w-]{11}).*/gi)) {
            $(this).addClass('approved');
        } else {
            $(this).addClass('failed');
            fail++;
            if (fail == 1) $(this).focus();
        }
    })

    //Retornando la respuesta
    return fail == 0 ? true : false;
}


jQuery.fn.reset = function () {
    $("input:password,input:file,input:text,textarea", $(this)).val('');
    $("input:checkbox:checked", $(this)).click();
    $("select", $(this)).val(0);
};