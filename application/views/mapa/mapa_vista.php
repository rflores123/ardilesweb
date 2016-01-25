<script type="text/javascript">
    
    var map;
    var destino = [];
    var lista = [
        {"descripcion": "Tienda 1", "lat": -12.071478, "lng": -77.060143},
        {"descripcion": "Tienda 2", "lat": -12.085147, "lng": -77.000589},
        {"descripcion": "Tienda 3", "lat": -12.066510, "lng": -76.983016},
        {"descripcion": "Tienda 4", "lat": -12.115532, "lng": -76.997575}];

    for (var i = 0; i < lista.length; i++) {
        destino[i] = [lista[i].lat, lista[i].lng];
    }

    //var destino=[[-12.066472, -76.982950], [-12.05449279282314, -77.03024273281858], [-12.055122327623378, -77.03039293652341], [-12.075917129727586, -77.02764635449216], [-12.07635776902266, -77.02792530422971], [-12.076819390363665, -77.02893381481931], [-12.088527520066453, -77.0241058385925], [-12.090814532191756, -77.02271108990476]];
    $(document).ready(function () {
        map = new GMaps({
            el: '#map',
            lat: -12.071478,
            lng: -77.060143
        });
        map.getElevations
                ({
                    locations: destino,
                    callback: function (result, status)
                    {
                        if (status == google.maps.ElevationStatus.OK)
                        {
                            for (var i in result)
                            {
                                map.addMarker
                                        ({
                                            lat: result[i].location.lat(),
                                            lng: result[i].location.lng(),
                                        });
                            }
                        }
                    }
                });

    });
    $(document).ready(function () {
        map = new GMaps({
            el: '#map',
            lat: -12.071478,
            lng: -77.060143,
            click: function (e) {
                console.log(e);
            }
        });

        map.drawPolyline({
            path: destino,
            strokeColor: '#131540',
            strokeOpacity: 0.9,
            strokeWeight: 6
        });
    });


</script>


<!--
    INICIO
    Web service para capturar datos de latitud y longitud
-->
<script>    
$(document).on("ready",main);
function main()
{
    $("#buscar").on("click",function()
    {
        var texto="";
        var tag=$("#combo_vendedores").val();
        $.getJSON("http://52.4.34.166/apigility/public/ws_pedidos?vendedor_id="+tag,function(datos)
        {
            $.each(datos,function (i,item)
            {     
                texto +=item.DirFacturacion;
            });   
                alert(texto);       
        });   
    });
} 
</script>
<!--
    FIN
    Web service para capturar datos de latitud y longitud
-->


<!--
    INICIO
    Web service para capturar datos de VENDEDOR Y SU ID
-->
<script>   
$(document).on("ready",main);
function main(){
        var texto="";
        $.getJSON("http://52.4.34.166/apigility/public/ws_vendedor",function(datos){
        $.each(datos,function (i,item){
     
        texto +="<option value="+item.Codigo+">"+ item.Descripcion +"</option>";

         });   
         $("#combo_vendedores").html(texto);
   
        });      
} 
</script>
<!--
    FIN
    Web service para capturar datos de VENDEDOR Y SU ID
-->
    

<nav class="navbar navbar-custom navbar-fixed-top" role="navigation">
    <div class="container">
        <div class="navbar-header page-scroll">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-main-collapse">
                <i class="fa fa-bars"></i>
            </button>
            <a class="navbar-brand" href="index.html">
                <h1>ARDILES IMPORT SAC</h1>
            </a>
        </div>

        <div class="collapse navbar-collapse navbar-right navbar-main-collapse">
            <ul class="nav navbar-nav">
                <li  class="active"><a href="#rutas">RUTAS</a></li>
                <li><a href="<?= base_url() ?>mapa_control/vendedores">VENDEDORES</a></li>
                <li><a href="<?= base_url() ?>mapa_control/productos">PRODUCTOS</a></li>	
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">PAGOS<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li class="active"><a href="<?= base_url() ?>mapa_control/pagos1">Pagos 1</a></li>	                        
                        <li><a href="#otro2">Otro 2</a></li>
                        <li><a href="#otro3">Otro 3</a></li>
                    </ul>
                </li>
                <li><a href="<?= base_url() ?>Login_control/login">Cerrar Sesión</a></li>

            </ul>
        </div>            
    </div>        
</nav>
<section id="rutas" class="intro">
    <BR><BR><BR><BR>
    <div class="col-md-12">
        <div class="col-md-9">
            <div class="wow bounceInUp" data-wow-delay="0.2s">
                <div class="team boxed-grey">
                    <center><h3>Rutas de vendedores</h3></center>
                    <div id="map" ></div>                                                
                </div>
            </div>
        </div>
        <div class="col-md-3">
            <div class="wow bounceInUp" data-wow-delay="0.2s">
                <div class="team boxed-grey">
                    <div>
                        <center><h3>Seleccione criterios de evaluación</h3></center>
                        <select class="form-control" id="combo_vendedores">                            
                            <!--  se llenan datos desde javascript-->
                        </select>                        
                        
                        <br><br>
                        <input type="date" class="form-control" id="" placeholder="fecha_consulta">
                        <br><br>
                        <center><button type="submit" class="btn btn-default btn btn-lg" id="buscar" value="Buscar">CONSULTAR RUTAS</button></center>
                    </div>
                </div>
            </div>
        </div>

    </div>

</section>