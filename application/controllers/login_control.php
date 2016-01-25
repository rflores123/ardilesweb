<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class Login_control extends CI_Controller {

    public function index() {
        $this->load->view('plantilla', ['vista' => 'inicio/login']);
    }

    public function login() {
        $this->load->model('usuario_model');
        $this->form_validation->set_rules('username', 'Usuario', 'strip_tags|trim|required|callback_verificar_usuario');
        $this->form_validation->set_rules('password', 'Contraseña', 'strip_tags|trim|required|callback_verificar_password');
        if ($this->form_validation->run()) {
            $usuario = $this->usuario_model->dar_usuario_validado($this->input->post('username'), ($this->input->post('password')));
            $this->session->sess_create();
            $this->session->set_userdata('username', $usuario->row()->Cuenta);
            redirect(base_url('mapa_control/index'));
        }
        $this->load->view('plantilla', ['vista' => 'inicio/login']);
    }

    //Utilizado como callback para la validación del formulario de logueo.
    public function verificar_usuario($texto) {
        $usuario = $this->usuario_model->dar_usuario($texto);
        if ($usuario->num_rows() > 0) {
            return TRUE;
        } else {
            $this->form_validation->set_message('verificar_usuario', 'Usuario no existe.');
            return FALSE;
        }
    }

    //Utilizado como callback para la validación del formulario de logueo.
    public function verificar_password($texto) {
        $usuario = $this->usuario_model->dar_usuario_validado($this->input->post('username'), ($texto));
        if ($usuario->num_rows() > 0) {
            return TRUE;
        } else {
            $this->form_validation->set_message('verificar_password', 'Contraseña incorrecta.');
            return FALSE;
        }
    }

    public function inicio() {
        $datos = [
            'vista' => 'mapa/mapa_vista',
        ];
        $this->load->view('plantilla', $datos);
    }

}
