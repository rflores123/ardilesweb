<html lang="en">

    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <title>Ardiles Import SAC</title>
        <link href="<?= base_url() ?>assets/css/bootstrap.min.css" rel="stylesheet" type="text/css">    
        <link href="<?= base_url() ?>assets/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
        <link href="<?= base_url() ?>assets/css/animate.css" rel="stylesheet" />    
        <link href="<?= base_url() ?>assets/css/style.css" rel="stylesheet">
        <link href="<?= base_url() ?>assets/color/default.css" rel="stylesheet">


        <!-- librerias mapa -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>        
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
        <script type="text/javascript" src="<?= base_url() ?>assets/js/gmaps.js"></script>
        <link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="assets/css/examples.css" />
        <!-- librerias mapa -->

        <!-- Librerias reportes vendedores-->
        <script type="text/javascript" src="<?= base_url() ?>assets/js/highcharts.js"></script>
        <script type="text/javascript" src="<?= base_url() ?>assets/js/exporting.js"></script>
        <script type="text/javascript" src="<?= base_url() ?>assets/js/Chart.js"></script>
        <script type="text/javascript" src="<?= base_url() ?>assets/js/datapedidos.js"></script>        
        <!-- Librerias reportes vendedores-->
        
        
        <!--libreria para recuperar datos de webservice-->
        <script src="//code.jquery.com/jquery-2.2.0.min.js"></script>


    </head>
    <body id="page-top" data-spy="scroll" data-target=".navbar-custom">	
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
                        <li><a href="#rutas">RUTAS</a></li>
                        <li><a href="#vendedores">VENDEDORES</a></li>
                        <li><a href="#productos">PRODUCTOS</a></li>					
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

        <?php
      
            $this->load->view($vista);
      
        ?>

        <footer class="text-right">
            <div align="right">
                <table>
                    <tr>
                        <td colspan="2">
                            <img src="<?php echo base_url('assets/img/logobio.png'); ?>" alt="Ventor" width="250" />
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Desarrollado por el equipo:&nbsp; </b>
                        </td>
                        <td>
                            <a target="blank" href="http://bioingenieriaperu.edu.pe/">BioIngenieria</a>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Ultima Actualización:&nbsp; </b>
                        </td>
                        <td>
                            22 Enero 16'
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <b>Versión Instalad:&nbsp;a</b>
                        </td>
                        <td>
                            1.2
                        </td>
                    </tr>
                </table>
            </div>
        </footer>


    </body>
    <script type="text/javascript" src="<?= base_url() ?>assets/jquery/jquery-2.1.3.min.js"></script>
    <script type="text/javascript" src="<?= base_url() ?>assets/bootstrap/js/bootstrap.min.js"></script>

    <!-- Librerias reportes vendedores-->
    <script type="text/javascript" src="<?= base_url() ?>assets/jquery/highcharts.js"></script>
    <script type="text/javascript" src="<?= base_url() ?>assets/jquery/exporting.js"></script>
    <script type="text/javascript" src="<?= base_url() ?>assets/jquery/Chart.js"></script>

    <script src="<?= base_url() ?>assets/jquery/jquery.min.js"></script>
    <script src="<?= base_url() ?>assets/jquery/bootstrap.min.js"></script>
    <script src="<?= base_url() ?>assets/jquery/jquery.easing.min.js"></script>	
    <script src="<?= base_url() ?>assets/jquery/jquery.scrollTo.js"></script>
    <script src="<?= base_url() ?>assets/jquery/wow.min.js"></script>    
    <script src="<?= base_url() ?>assets/jquery/custom.js"></script>

</html>