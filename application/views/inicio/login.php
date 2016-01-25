<html>
    <head>
        <title>Ardiles Import SAC</title>
    </head>
    <body>        
        <div class="col-md-12" style="padding-top: 70px;">
            <div class="col-md-3"></div>
            <div class="col-md-6">
                <div class="page-header text-center" style="color:#569905;">                                                        
                    <h1>Ardiles Import SAC</h1>
                    <h2>Reportes y monitoreo</h2>
                </div>						
                <div class="panel panel-default">
                    <div class="panel-heading">
                        <h3 style="text-align: center; "> ACCESO AL SISTEMA</h3>
                    </div>
                    <form method="post" action="<?= base_url() ?>login_control/login">
                        <div class="panel-body">														 
                            <div class="form-group">
                                <label class="col-sm-3 control-label">USUARIO</label>
                                <div class="col-sm-8">
                                    <input type="text" name="username" id="username" value="<?= set_value('username'); ?>" class="form-control required" placeholder="Ingrese su usuario" value="" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label">CONTRASEÑA</label>
                                <div class="col-sm-8">
                                    <input type="password" name="password" id="password" value="<?= set_value('password'); ?>" class="form-control required" placeholder="Ingrese su Contraseña" value="" />
                                </div>
                            </div>
                            <div class="form-group">
                                <div style="height: 65px"> </div>
                                <div class="col-sm-offset-2 col-sm-10 text-right">
                                    <button  style="background-color: #569905; border: #000 0px solid; width: 200px" type="submit" class="btn btn-info">Acceder</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <center><?= validation_errors() ?></center>
            </div>
            <div class="col-md-3"></div>
        </div>
    </body>
</html>
