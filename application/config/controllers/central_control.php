<?php

class Central_control extends CI_Controller {

	function __construct() {
		parent::__construct();
	}

	public function Index() {
		$this->load->helper(array('form'));
		$this->load->view('plantilla', ['vista' => 'formulario_vista']);

		//solo cuando no se usa boopstrap
		//$this->load->view('formulario_vista');
	}

	//function index() {
	//}
}
