<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
    var persona=[];
    var lista = [
    { "Mes" : 'Enero', "lat" :  150, "lng" : 450}, 
    { "Mes" : 'Febrero', "lat" : 100, "lng" : 200}, 
    { "Mes" : 'Marzo', "lat" : 200, "lng" : 150}, 
    { "Mes" : 'Abril', "lat" : 50, "lng" : 250}];

     
    for( var i=0;i<lista.length;i++){
       persona[i]=[lista[i].Mes,lista[i].lat,lista[i].lng];
    }

      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);
      
      function drawChart() {
       var data = new google.visualization.DataTable();
         
             data.addColumn('string','Año');
             data.addColumn('number','ESTIMADO');
             data.addColumn('number','VENTA REAL');
     data.addRows (
   persona
    
        );

        var options = {
          title: 'CANDADOS TIPO A',
          hAxis: {title: 'Mes',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(data, options);
      }
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
        var texto1="";
        var tag=$("#combo_vendedores").val();
        $.getJSON("http://52.4.34.166/apigility/public/ws_pedidos?vendedor_id="+tag,function(datos)
        {
            $.each(datos,function (i,item)
            {     
                texto1 +=item.DirFacturacion;
            });   
                alert(texto1);       
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
        var texto2="";
        $.getJSON("http://52.4.34.166/apigility/public/ws_vendedor",function(datos){
        $.each(datos,function (i,item){
     
        texto2 +="<option value="+item.Codigo+">"+ item.Descripcion +"</option>";

         });   
         $("#combo_vendedores").html(texto2);
   
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
                <li><a href="<?= base_url() ?>mapa_control/inicio">RUTAS</a></li>
                <li><a href="<?= base_url() ?>mapa_control/vendedores">VENDEDORES</a></li>
                <li class="active"><a href="<?= base_url() ?>mapa_control/productos">PRODUCTOS</a></li>	
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
                    <center><h3>UNIDADES VENDIDAS</h3></center>
                    <div id="chart_div" style="width: 100%; height: 70%"></div>                                             
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