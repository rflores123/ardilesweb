<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Mapa_model extends CI_Model {
	function __construct(){
		parent::__construct();
		$this->load->database();
	}
        function obtenerTrabajadores(){

		$query = $this->db->get('trabajador');
		if ($query->num_rows() > 0)
			{return $query;}
		else
			{return false;}
	}
        
        
}        
?>        