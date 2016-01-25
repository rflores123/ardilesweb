<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Mapa_control extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('mapa_model');
    }

    public function index() {
        $this->inicio();
    }

    function inicio() {
        $data_trabajador['trabajador'] = $this->mapa_model->obtenerTrabajadores();
        $this->load->view('plantilla_menu', ['vista' => 'mapa/mapa_vista'], $data_trabajador);
//        $datos = [
//            'vista' => 'mapa/mapa_vista',
//            'data_trabajador'=> $this->mapa_model->obtenerTrabajadores()
//        ];
//        $this->load->view('plantilla_menu', $datos);
    }

    function vendedores() {
        $data_trabajador['trabajador'] = $this->mapa_model->obtenerTrabajadores();
        $this->load->view('plantilla_menu', ['vista' => 'vendedores/vendedores_vista'], $data_trabajador);
    }
    
    function productos() {
        $this->load->view('plantilla_menu', ['vista' => 'productos/productos_vista']);
    }
    
    function pagos1() {
        $this->load->view('plantilla_menu', ['vista' => 'pagos/pagos1_vista']);
    }
    
    function logout() {
        

    }
    
    

}
