<?php

class Usuario_model extends CI_Model {

	function ValidarUsuario($username, $password) {	
		//utilizamos esto para realizar la consulta
		$query = $this->db->where('username', $username)->where('password', $password)->get('trabajador');  
		//devolvemos todos los valores		
		return $query->row();	
	}

	public function dar_usuario($username) {
		return $this->db->where('TU.username = "' . $username . '"')->select('TU.*')->get('trabajador AS TU');
	}

	public function dar_usuario_validado($username, $password) {
		return $this->db->where('username = "' . $username . '"')->where('password', $password)->get('trabajador');
	}
	
	
	public function nuevo_usuario ($grabar){
		$this->db->insert('trabajador',$grabar);	
		
	}
}