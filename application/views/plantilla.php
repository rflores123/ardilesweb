<!doctype html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="<?= base_url() ?>assets/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="<?= base_url() ?>assets/bootstrap/css/style_index.css">
        <link rel="stylesheet" type="text/css" href="<?= base_url() ?>assets/bootstrap/css/bootstrap.css">
        <!-- librerias mapa -->
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>        
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=true"></script>
        <script type="text/javascript" src="<?= base_url() ?>assets/jquery/gmaps.js"></script>
        <link rel="stylesheet" href="http://twitter.github.com/bootstrap/1.3.0/bootstrap.min.css" />
        <link rel="stylesheet" type="text/css" href="<?= base_url() ?>assets/css/examples.css" />
        <!-- librerias mapa -->
        <link href="<?= base_url() ?>assets/css/animate.css" rel="stylesheet" type="text/css"/>
        <link href="<?= base_url() ?>assets/css/style.css" rel="stylesheet" type="text/css"/>

        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
        <?php
        
              $this->load->view($vista);
       
        ?>

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