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
<script>
    var x = [];
    var y = [];
    var lista = [
        {"descripcion": "Tienda 1", "lat": "Juan Perez", "lng": 25},
        {"descripcion": "Tienda 1", "lat": "Ana Murillo", "lng": 20},
        {"descripcion": "Tienda 1", "lat": "Luis Pacoricona", "lng": 35},
        {"descripcion": "Tienda 1", "lat": "Cesar Sonco", "lng": 30}];

    for (var i = 0; i < lista.length; i++) {
        y[i] = [lista[i].lat];
        x[i] = [lista[i].lng];
    }

    var barChartData = {
        labels: y,
        datasets: [
            {
                fillColor: "rgba(220,220,220,0.9)",
                strokeColor: "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data: x,
            },
        ]

    }
    window.onload = function () {
        var ctx = document.getElementById("canvas").getContext("2d");
        window.myBar = new Chart(ctx).Bar(barChartData, {
            responsive: true
        });
    }
</script>
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
                <li><a href="<?= base_url() ?>mapa_control/inicio">RUTAS</a></li>
                <li  class="active"><a href="<?= base_url() ?>mapa_control/vendedores">VENDEDORES</a></li>
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

<section id="vendedores" class="intro">
    <BR><BR><BR><BR><BR><BR>
    <div class="col-md-12">
        <div class="col-md-9">
            <div class="wow bounceInUp" data-wow-delay="0.2s">
                <div class="team boxed-grey">  
                    <center><h2>Reporte de Vendedores</h2></center>
                    <canvas id="canvas" height="600" width="1500"></canvas>


                </div>

            </div>
        </div>

        <div class="col-md-3">
            <div class="team boxed-grey">
                <center><h3>Seleccione criterios de evaluación</h3></center>
                <select class="form-control" id="combo_vendedores">                            
                            <!--  se llenan datos desde javascript-->
                </select>  
                <br>
                <br>
                <input type="date" class="form-control" id="" placeholder="fecha_consulta">
                <br><br>
                <center><button type="submit" class="btn btn-default btn btn-lg" id="buscar" value="Buscar">Consultar Ventas</button></center>
            </div>
        </div>
    </div>


</section>

