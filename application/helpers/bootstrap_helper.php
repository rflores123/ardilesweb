<?php
if (!function_exists('bs_menu_auxiliar')) {

	//El parámetro item es una arreglo cuyos elementos son arreglos con la siguiente estructura:
	//array('titulo' => '', 'link' => '', 'disabled' => FALSE)
	function bs_menu_auxiliar($items, $items_right = NULL) {
		?>
		<nav class="navbar navbar-default">
			<ul class="nav navbar-nav">
				<?php
				foreach ($items as $item) {
					?>
					<li class="<?= $item['disabled'] ? 'disabled' : '' ?> <?= $item['active'] ? 'active' : '' ?>">
						<a href="<?= $item['link'] ?>" <?= $item['disabled'] ? 'disabled' : '' ?>>
							<?= $item['titulo'] ?>
						</a> 
					</li>
					<?php
				}
				?>
			</ul>
			<?php
			if ($items_right !== NULL) {
				?>
				<ul class="nav navbar-nav navbar-right">
					<?php
					foreach ($items_right as $item) {
						?>
						<li class="<?= $item['disabled'] ? 'disabled' : '' ?> <?= $item['active'] ? 'active' : '' ?>">
							<a href="<?= $item['link'] ?>" <?= $item['disabled'] ? 'disabled' : '' ?>>
								<?= $item['titulo'] ?>
							</a> 
						</li>
						<?php
					}
					?>
				</ul>
				<?php
			}
			?>
		</nav>
		<?php
	}

}

if (!function_exists('bs_menu_izquierda')) {

	function bs_navpills($elementos, $stacked = TRUE) {
		//Elemento de búsqueda sólo puede existir 1 por menú y se posiciona siempre al inicio, sin importar la posición
		//que tiene en el arreglo. La estructura del elemento de búsqueda es la siguiente:
		//array('action' => '','tooltip' => '', 'placeholder' => '');
		if (isset($elementos['busqueda'])) {
			$b = $elementos['busqueda'];
			$action = isset($b['action']) ? 'action="' . base_url() . $b['action'] . '"' : '';
			$tooltip = isset($b['tooltip']) ? 'title="' . $b['tooltip'] . '"' : '';
			$placeholder = isset($b['placeholder']) ? 'placeholder="' . $b['placeholder'] . '"' : '';
			?>
			<div class="row">
				<div class="col-xs-12">
					<form method="get" <?= $action ?>>
						<div class="input-group">
							<input type="text" class="form-control input-sm <?= $tooltip !== '' ? 'mi_tooltip' : '' ?>" name="s" <?= $placeholder ?>>
							<span class="input-group-btn">
								<button class="btn btn-primary btn-sm" type="submit"><img src="<?= base_url() ?>assets/img/botones/ver.png"></button>
							</span>
						</div>
					</form>
				</div>
			</div><br>
			<?php
			unset($elementos['busqueda']);
		}
		?>
		<ul class="nav nav-pills <?= $stacked ? 'nav-stacked' : '' ?>">
			<?php
			//Elemento tiene la siguiente estructura:
			//array('label' => 'Etiqueta', 'link' => '', 'active' => FALSE, 'disabled' => FALSE, 'right' => '', 'class' => '', 'more' => '')
			$i = 0;
			$cantidad_elementos = count($elementos);
			foreach ($elementos as $elemento) {
				$i++;
				if (isset($elemento['separador'])) {
					echo ($i === 1 OR $i === $cantidad_elementos) ? '' : "<hr>\n";
					continue;
				}
				$active = isset($elemento['active']) && $elemento['active'] === TRUE ? 'active' : '';
				$class_li = isset($elemento['class_li']) ? $elemento['class_li'] : '';
				$class_a = isset($elemento['class_a']) ? $elemento['class_a'] : '';
				$disabled = isset($elemento['disabled']) && $elemento['disabled'] === TRUE ? 'disabled' : '';
				$attr_li = isset($elemento['attr_li']) ? $elemento['attr_li'] : '';
				$attr_a = isset($elemento['attr_a']) ? $elemento['attr_a'] : '';
				$right = isset($elemento['right']) ? $elemento['right'] : '';
				$label = isset($elemento['label']) ? $elemento['label'] : '';
				$link = isset($elemento['link']) ? $elemento['link'] : '';
				?>
				<li <?= (($class_li !== '' OR $active !== '') ? 'class="' . $class_li . ' ' . $active . '"' : '') . $disabled . ' ' . $attr_li ?>>
					<a <?= ($disabled === '' && $link !== '' ? 'href="' . base_url() . $link . '"' : '') . ' ' . $attr_a . ($class_a !== '' ? ' class="' . $class_a . '"' : '') ?>>
						<?= $label ?>
						<?= $right !== '' ? '<span class="badge pull-right">' . $right . '</span>' : '' ?>
					</a>
				</li>
				<?php
			}
			?>
		</ul>
		<?php
	}

}

if (!function_exists('bs_navegador_meses')) {

	function bs_navegador_meses($mes, $anio, $link, $selects = NULL) {
		$link_botones = strpos($link, '?') !== FALSE ? $link . '&' : $link . '?';
		$botones = [
			['label' => bs_glyphicon('backward') . ' Mes anterior', 'link' => $link_botones . 'mes=' . ($mes - 1 === 0 ? 12 : $mes - 1) . '&anio=' . ($mes - 1 === 0 ? $anio - 1 : $anio)],
			['label' => bs_glyphicon('forward') . ' Mes siguiente', 'link' => $link_botones . 'mes=' . ($mes + 1 === 13 ? 1 : $mes + 1) . '&anio=' . ($mes + 1 === 13 ? $anio + 1 : $anio)],
			['label' => bs_glyphicon('calendar') . ' Mes actual', 'link' => $link_botones . 'mes=' . date('m') . '&anio=' . date('Y')],
		];
		bs_navpills($botones, FALSE);
		?>
		<form method="get" action="<?= base_url() . $link ?>" class="navbar-form" role="form" style="margin-top: 0px; margin-bottom: 0px">
			<?php
			$pos_gets = strpos($link, '?');
			if ($pos_gets !== FALSE) {
				$solo_gets = substr($link, $pos_gets + 1);
				$gets = explode('&');
				foreach ($gets as $get) {
					$get = explode('=', $get);
					$name = $get[0];
					$value = isset($get[1]) ? $get[1] : '';
					echo "<input type='hidden' name='" . $name . "' value='" . $value . "'>\n";
				}
			}
			?>
			<div class="form-group">
				<?php
				if (is_array($selects)) {
					foreach ($selects as $select) {
						$name = isset($select['name']) ? $select['name'] : '';
						$type = isset($select['type']) ? $select['type'] : 'select';
						$attr = isset($select['attr']) ? $select['attr'] : '';
						if ($type === 'select') {
							echo "<select class='form-control input-sm' name='" . $name . "'>\n";
							foreach ($select['options'] as $option) {
								$label = isset($option['label']) ? $option['label'] : '';
								$value = isset($option['value']) ? $option['value'] : '';
								$selected = isset($option['selected']) && $option['selected'] ? 'selected' : '';
								echo "<option value='" . $value . "' " . $selected . ">" . $label . "</option>\n";
							}
							echo "</select>\n";
						} else if ('text') {
							echo "<input type='text' name='" . $name . "' class='form-control input-sm' list='lista_" . $name . "' " . $attr . ">\n";
							bs_datalist('lista_' . $name, $select['options']);
						}
					}
				}
				?>
				<select class="form-control input-sm" name="mes">
					<option value="01" <?= $mes + 0 === 1 ? 'selected' : '' ?>>Enero</option>
					<option value="02" <?= $mes + 0 === 2 ? 'selected' : '' ?>>Febrero</option>
					<option value="03" <?= $mes + 0 === 3 ? 'selected' : '' ?>>Marzo</option>
					<option value="04" <?= $mes + 0 === 4 ? 'selected' : '' ?>>Abril</option>
					<option value="05" <?= $mes + 0 === 5 ? 'selected' : '' ?>>Mayo</option>
					<option value="06" <?= $mes + 0 === 6 ? 'selected' : '' ?>>Junio</option>
					<option value="07" <?= $mes + 0 === 7 ? 'selected' : '' ?>>Julio</option>
					<option value="08" <?= $mes + 0 === 8 ? 'selected' : '' ?>>Agosto</option>
					<option value="09" <?= $mes + 0 === 9 ? 'selected' : '' ?>>Septiembre</option>
					<option value="10" <?= $mes + 0 === 10 ? 'selected' : '' ?>>Octubre</option>
					<option value="11" <?= $mes + 0 === 11 ? 'selected' : '' ?>>Noviembre</option>
					<option value="12" <?= $mes + 0 === 12 ? 'selected' : '' ?>>Diciembre</option>
				</select>
				<input type="number" name="anio" value="<?= $anio ?>" class="form-control input-sm">
				<button type="submit" class="btn btn-default btn-sm" style="margin-right: 5px">
					<img src="<?= base_url() ?>assets/img/lupa_negra.png">
				</button>
			</div>
		</form>	
		<?php
	}

}

if (!function_exists('bs_panel_begin')) {

	function bs_panel_begin($titulo, $right = '', $class_type = 'panel-primary') {
		echo "<div class=\"panel " . $class_type . "\">\n";
		?>
		<div class="panel-heading">
			<h3 class="panel-title"><?= $titulo ?><span class="badge pull-right"><?= $right ?></span></h3>
		</div>
		<?php
		echo "<div class=\"panel-body\">\n";
	}

}

if (!function_exists('bs_panel_end')) {

	function bs_panel_end() {
		echo "</div>\n";
		echo "</div>\n";
	}

}

if (!function_exists('bs_label')) {

	function bs_label($text, $label = 'default') {
		return '<span class="label label-' . $label . '">' . $text . '</span>';
		echo "</div>\n";
	}

}

if (!function_exists('bs_row_begin')) {

	function bs_row_begin() {
		echo "<div class='row'>\n";
	}

}

if (!function_exists('bs_row_end')) {

	function bs_row_end() {
		echo "</div>\n";
	}

}

if (!function_exists('bs_form_group_begin')) {

	function bs_form_group_begin($atributos = NULL) {
		$attr = isset($atributos['attr']) ? $atributos['attr'] : '';
		$class = isset($atributos['class']) ? $atributos['class'] : '';
		echo "<div class='form-group " . $class . "' " . $attr . ">\n";
	}

}

if (!function_exists('bs_form_group_end')) {

	function bs_form_group_end() {
		echo "</div>\n";
	}

}

if (!function_exists('bs_form_control_label')) {

	function bs_form_control_label($ancho, $titulo, $clases = '') {
		if (is_array($ancho)) {
			switch (count($ancho)) {
				case 1:
					$col = "col-" . $ancho[0];
					break;
				case 2:
					$col = "col-" . $ancho[0] . " col-" . $ancho[1];
					break;
				case 3:
					$col = "col-" . $ancho[0] . " col-" . $ancho[1] . " col-" . $ancho[2];
					break;
				case 4:
					$col = "col-" . $ancho[0] . " col-" . $ancho[1] . " col-" . $ancho[2] . " col-" . $ancho[3];
					break;
			}
		} else {
			$col = "col-" . $ancho;
		}
		echo "<label class='control-label " . $col . " " . $clases . "'>" . $titulo . "</label>\n";
	}

}

if (!function_exists('bs_form_control')) {

	//Crea un control según el tipo enviado.
	//$attr puede ser un arreglo con la siguiente forma: array(
	//'attr' => Atributos como id, placeholder y valores data. No usar para name o class.
	//'class' => Clases del control.
	//'help' => Texto de ayuda.
	//'addon_left' => Texto para el addon left.
	//'addon_right' => Texto para el addon right.
	//'class_group' => Clase de grupo.
	//)
	function bs_form_control($tipo, $ancho, $valor, $nombre, array $atributos = NULL) {
		$attr = isset($atributos['attr']) ? $atributos['attr'] : '';
		$class = isset($atributos['class']) ? $atributos['class'] : '';
		$help = isset($atributos['help']) ? $atributos['help'] : '';
		$addon_left = isset($atributos['addon_left']) ? $atributos['addon_left'] : '';
		$addon_right = isset($atributos['addon_right']) ? $atributos['addon_right'] : '';
		$button_left = isset($atributos['button_left']) ? $atributos['button_left'] : '';
		$button_right = isset($atributos['button_right']) ? $atributos['button_right'] : '';
		$class_group = isset($atributos['class_group']) ? $atributos['class_group'] : '';
		$options = (isset($atributos['options']) && is_array($atributos['options'])) ? $atributos['options'] : array();
		if (is_array($ancho)) {
			switch (count($ancho)) {
				case 1:
					$col = "col-" . $ancho[0];
					break;
				case 2:
					$col = "col-" . $ancho[0] . " col-" . $ancho[1];
					break;
				case 3:
					$col = "col-" . $ancho[0] . " col-" . $ancho[1] . " col-" . $ancho[2];
					break;
				case 4:
					$col = "col-" . $ancho[0] . " col-" . $ancho[1] . " col-" . $ancho[2] . " col-" . $ancho[3];
					break;
			}
		} else {
			$col = "col-" . $ancho;
		}
		echo "<div class='" . $col . "'>\n";
		if ($addon_left !== '' || $addon_right !== '' || $class_group !== '' || $button_left !== '' || $button_right !== '') {
			echo "<div class='input-group " . $class_group . " input-group-sm'>\n";
			if ($addon_left !== '') {
				echo "<span class='input-group-addon input-sm'>" . $addon_left . "</span>\n";
			}
			if ($button_left !== '') {
				echo "<span class='input-group-btn'>" . $button_left . "</span>\n";
			}
		}
		switch ($tipo) {
			default:
				echo "<input type='" . $tipo . "' class='form-control input-sm " . $class . "' name='"
				. $nombre . "' " . $attr . " value='" . $valor . "'>\n";
				break;
			case 'static':
				echo "<p class='form-control-static " . $class . "' " . $attr . ">" . $valor . "</p>\n";
				break;
			case 'textarea':
				echo "<textarea class='form-control input-sm " . $class . "' name='" . $nombre . "' "
				. $attr . ">" . $valor . "</textarea>\n";
				break;
			case 'select':
				echo "<select class='form-control input-sm " . $class . "' name='" . $nombre . "' value='" . $valor . "' "
				. $attr . ">\n";
				foreach ($options as $option) {
					$label = isset($option['label']) ? $option['label'] : '';
					$value = isset($option['value']) ? $option['value'] : '';
					$attr2 = isset($option['attr']) ? $option['attr'] : '';
					$selected = isset($option['selected']) && $option['selected'] ? 'selected' : '';
					echo "<option value='" . $value . "' " . $attr2 . " " . $selected . ">" . $label . "</option>\n";
				}
				echo "</select>\n";
				break;
		}
		if ($addon_right !== '') {
			echo "<span class='input-group-addon input-sm'>" . $addon_right . "</span>\n";
		}
		if ($button_right !== '') {
			echo "<span class='input-group-btn'>" . $button_right . "</span>\n";
		}
		if ($help !== '') {
			echo "<p class='help-block'>" . $help . "</p>\n";
		}
		if ($addon_right !== '' OR $addon_left !== '' OR $class_group !== '' OR $button_left !== '' OR $button_right !== '') {
			echo "</div>\n";
		}
		echo "</div>\n";
	}

}

if (!function_exists('bs_form_control_static')) {

	function bs_form_control_static($ancho, $valor, $ayuda = NULL, $clases = '') {
		bs_form_control('static', $ancho, $valor, '', ['class' => $clases, 'help' => $ayuda]);
	}

}

if (!function_exists('bs_modal_begin')) {

	function bs_modal_begin($titulo, $id, $size = '', $attr = '') {
		echo "<div class='modal fade' id='" . $id . "' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true' " . $attr . ">\n"
		. "<div class='modal-dialog " . ($size !== '' ? 'modal-' . $size : '') . "'>\n"
		. "<div class='modal-content'>\n";
		if ($titulo !== FALSE) {
			echo "<div class='modal-header'>\n"
			. "<button type='button' class='close' data-dismiss='modal'>\n"
			. "<span aria-hidden='true'>&times;</span>\n"
			. "<span class='sr-only'>Close</span>\n"
			. "</button>\n"
			. "<h4 class='modal-title' id='mi_titulo_modal'>" . $titulo . "</h4>\n"
			. "</div>\n";
		}
		echo "<div class='modal-body'>\n";
	}

}

if (!function_exists('bs_modal_end')) {

	function bs_modal_end() {
		echo "</div>\n</div>\n</div>\n</div>\n";
	}

}

if (!function_exists('bs_modal_footer_begin')) {

	function bs_modal_footer_begin() {
		echo "</div>\n<div class='modal-footer'>\n";
	}

}

if (!function_exists('bs_h3')) {

	function bs_h3($cadena) {
		echo "<h3>" . $cadena . "</h3>\n";
	}

}

if (!function_exists('bs_navbar_begin')) {

	//$brand puede ser una cadena, que será el título del menú o un arreglo, donde el primer elemento es el título
	//y el segundo es el link.
	function bs_navbar_begin($brand = NULL, $atributos = NULL) {
		$navbar = isset($atributos['navbar']) ? (in_array($atributos['navbar'], ['default', 'inverse']) ? 'navbar-' . $atributos['navbar'] : 'navbar-default') : 'navbar-default';
		$static = isset($atributos['static']) ? (in_array($atributos['static'], ['top', 'bottom']) ? 'navbar-static-' . $atributos['static'] : '') : '';
		$collapse = isset($atributos['collapse']) ? $atributos['collapse'] : TRUE;
		$attr = isset($atributos['attr']) ? $atributos['attr'] : '';
		echo "<nav class='navbar " . $navbar . " " . $static . "' " . $attr . ">\n";
		echo "<div class='container-fluid'>\n";
		if ($collapse) {
			?>
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<?php
				if ($brand !== NULL) {
					if (is_array($brand)) {
						if (count($brand) > 0) {
							echo "<a href='#'><span class='navbar-brand'>" . $brand[0] . "</span></a>\n";
						} else if (count($brand) > 1) {
							echo "<a class='navbar-brand' href='" . base_url() . $brand[1] . "'>" . $brand[0] . "</a>\n";
						}
					} else {
						echo "<a href='#'><span class='navbar-brand'>" . $brand . "</span></a>\n";
					}
				}
				?>
			</div>
			<?php
			echo "<div class='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>\n";
		} else {
			echo "<div>\n";
		}
	}

}

if (!function_exists('bs_navbar_end')) {

	function bs_navbar_end() {
		echo "</div></div></nav>\n";
	}

}

if (!function_exists('bs_navbar_ul_begin')) {

	function bs_navbar_ul_begin($right = FALSE) {
		echo "<ul class='nav navbar-nav " . ($right ? 'navbar-right' : '') . "'>\n";
	}

}

if (!function_exists('bs_navbar_ul_end')) {

	function bs_navbar_ul_end() {
		echo "</ul>\n";
	}

}

if (!function_exists('bs_navegador_intervalos')) {

	function bs_navegador_intervalos($intervalo, $link_navegador, $link_cerrar_intervalo, $link_xls, $con_hora = TRUE) {
		$objeto_fecha = new DateTime($intervalo['ff']);
		$objeto_fecha->modify('+1 ' . ($con_hora ? 'second' : 'day'));
		$intervalo['ff2'] = $objeto_fecha->format('Y-m-d' . ($con_hora ? ' H:i:s' : ''));

		$items = array(
			array(
				'titulo' => '<span class="glyphicon glyphicon-chevron-left"></span>Intervalo anterior',
				'link' => base_url() . $link_navegador . 'fecha=' . $intervalo['fi'],
				'disabled' => $intervalo['fi'] === '0000-00-00' . ($con_hora ? ' 00:00:00' : '') ? TRUE : FALSE,
				'active' => FALSE),
			array(
				'titulo' => 'Intervalo siguiente<span class="glyphicon glyphicon-chevron-right"></span>',
				'link' => base_url() . $link_navegador . 'fecha=' . $intervalo['ff2'],
				'disabled' => $intervalo['ff'] === date('Y-m-d' . ($con_hora ? ' H:i:s' : '')) ? TRUE : FALSE,
				'active' => FALSE),
			array(
				'titulo' => 'Intervalo actual',
				'link' => base_url() . $link_navegador . 'fecha=' . date('Y-m-d' . ($con_hora ? ' H:i:s' : '')),
				'disabled' => FALSE,
				'active' => FALSE),
			array(
				'titulo' => 'Cerrar intervalo',
				'link' => base_url() . $link_cerrar_intervalo,
				'disabled' => FALSE,
				'active' => FALSE)
		);
		$items_derecha = array(
			array(
				'titulo' => 'XLS',
				'link' => base_url() . $link_xls . 'fecha=' . $intervalo['ff'],
				'disabled' => FALSE,
				'active' => FALSE)
		);
		bs_menu_auxiliar($items, $items_derecha);
	}

}

if (!function_exists('bs_progress_bar_begin')) {

	function bs_progress_bar_begin() {
		echo "<div class='progress' style='height: 15px'>\n";
	}

}

if (!function_exists('bs_progress_bar_end')) {

	function bs_progress_bar_end() {
		echo "</div>\n";
	}

}

if (!function_exists('bs_progress_bar')) {

	function bs_progress_bar($ancho = '0', $desplazamiento = '0', $tipo = '', $label = NULL) {
		?>
		<div class="progress-bar <?= $tipo !== '' ? 'progress-bar-' . $tipo : '' ?>" role="progressbar" 
			 style="margin-left: <?= $desplazamiento ?>%; width: <?= $ancho ?>%">
				 <?= $label !== NULL ? $label : '' ?>
		</div>
		<?php
	}

}

if (!function_exists('bs_navbar_li')) {

	function bs_navbar_li($titulo, $clases = '', $link = '#', $dropdown = NULL) {
		echo "<li" . ($clases !== '' ? " class='" . $clases . " " . (is_array($dropdown) ? 'dropdown' : '') . "'" : "") . ">";
		if (is_array($dropdown)) {
			echo "<a href='#' class='dropdown-toggle' data-toggle='dropdown' role='button' aria-expanded='false'>"
			. $titulo . "<span class='caret'></span></a>\n";
			echo "<ul class='dropdown-menu' role='menu'>";
			foreach ($dropdown as $item) {
				echo "<li><a href='" . base_url() . $item['link'] . "'>" . $item['label'] . "</a></li>";
			}
			echo "</ul></li>\n";
		} else {
			echo "<a href='" . base_url() . $link . "'>" . $titulo . "</a></li>\n";
		}
	}

}

if (!function_exists('bs_navegador_letras')) {

	function bs_navegador_letras($link, $letra_activa) {
		echo "<ul class='nav nav-pills'>\n";
		for ($i = 65; $i < 91; $i++) {
			if (strpos($link, '?') !== FALSE) {
				$letra_destino = '&l=' . strtolower(chr($i));
			} else {
				$letra_destino = '?l=' . strtolower(chr($i));
			}
			echo "<li role='presentation' " . ($letra_activa === strtolower(chr($i)) ? "class='active'" : "")
			. "><a " . ($link !== '' ? "href='" . base_url() . $link . $letra_destino . "'" : "") . ">"
			. chr($i) . "</a></li>\n";
		}
		echo "</div></div>\n";
	}

}

if (!function_exists('bs_button')) {

	function bs_button($button = NULL) {
		$label = isset($button['label']) ? $button['label'] : '';
		$type = isset($button['type']) ? $button['type'] : 'button';
		$btn = isset($button['btn']) ? $button['btn'] : 'primary';
		$attr = isset($button['attr']) ? $button['attr'] : '';
		echo "<button type='" . $type . "' class='btn btn-" . $btn . "' " . $attr . ">" . $label . "</button>\n";
	}

}

if (!function_exists('bs_modal_form_begin')) {

	function bs_modal_form_begin($title, $action, $alias, $reset = TRUE, $enctype = FALSE, $size = 'lg') {
		$atributos = [
			'class' => 'form-horizontal',
			'data-reset' => $reset ? '1' : '0',
			'data-action' => $action
		];
		if ($enctype) {
			$atributos += [
				'enctype' => 'multipart/form-data'
			];
		}
		echo form_open('', $atributos);
		bs_modal_begin($title, 'mi_modal_formulario_' . $alias, $size, 'data-modal="' . $alias . '"');
	}

}

if (!function_exists('bs_modal_form_end')) {

	function bs_modal_form_end($buttons = NULL) {
		?>
		<div class="row">
			<div class="col-xs-12">
				<div class="alert alert-warning" role="alert" id="mi_respuesta_formulario" style="margin: 10px 0px 0px 0px;"></div>
			</div>
		</div>
		<?php
		bs_modal_footer_begin();
		if (is_array($buttons)) {
			foreach ($buttons as $button) {
				bs_button($button);
			}
		} else {
			bs_button(['label' => 'Guardar', 'type' => 'submit']);
		}
		bs_modal_end();
		echo form_close();
	}

}

if (!function_exists('bs_glyphicon')) {

	function bs_glyphicon($icon) {
		return "<span class='glyphicon glyphicon-" . $icon . "'></span>";
	}

}

if (!function_exists('bs_datalist')) {

	function bs_datalist($id, array $options) {
		echo "<datalist id='" . $id . "'>\n";
		foreach ($options as $option) {
			$value = isset($option['value']) ? $option['value'] : '';
			$attr = isset($option['attr']) ? $option['attr'] : '';
			echo "<option value='" . $value . "' " . $attr . "/>\n";
		}
		echo "</datalist>\n";
	}

}

if (!function_exists('bs_pagination')) {

	function bs_pagination($count, $active) {
		$count += 0;
		$active += 0;
		$current_url = current_url();
		$get = strpos('?', $current_url) !== FALSE ? '&pag=' : '?pag=';
		?>
		<nav>
			<ul class="pagination">
				<li>
					<a <?= $active !== 1 ? 'href="' . current_url() . $get . ($active - 1) . '"' : '' ?> aria-label="Previous">
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>
				<?php
				for ($i = 1; $i <= $count; $i++) {
					echo "<li " . ($active === $i ? "class='active'" : "") . "><a href='" . current_url() . $get . $i . "'>" . $i . "</a></li>\n";
				}
				?>
				<li>
					<a <?= $active < $count ? 'href="' . current_url() . $get . ($active + 1) . '"' : '' ?> aria-label="Next">
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
			</ul>
		</nav>
		<?php
	}

}

if (!function_exists('bs_table_begin')) {

	function bs_table_begin(array $header) {
		echo "<div class='mi_contenedor_de_tabla'>\n"
		. "<table class='table table-condensed table-hover'>\n"
		. "<thead>\n"
		. "<tr>\n";
		foreach ($header as $item) {
			if (is_array($item)) {
				echo "<th width='" . $item[0] . "px'>" . $item[1] . "</th>";
			} else {
				echo "<th>" . $item . "</th>";
			}
		}
		echo
		"</tr>\n"
		. "</thead>\n"
		. "<tbody>\n";
	}

}

if (!function_exists('bs_table_end')) {

	function bs_table_end() {
		echo "</tbody>\n</table>\n</div>\n";
	}

}

if (!function_exists('bs_table_tr')) {

	function bs_table_tr($cells, $attr = '') {
		echo "<tr " . $attr . ">\n";
		foreach ($cells as $cell) {
			echo "<td>" . $cell . "</td>\n";
		}
		echo "</tr>\n";
	}

}

if (!function_exists('bs_hidden_input')) {

	function bs_hidden_input($name, $value, $attr = '') {
		echo "<input type='hidden' name='" . $name . "' value='" . $value . "' " . $attr . ">\n";
	}

}

if (!function_exists('bs_hot')) {

	function bs_hot($attr = '') {
		echo "<div class = 'handsontable' " . $attr . "></div>\n";
	}

}

if (!function_exists('bs_navegador')) {

	function bs_navegador($link, $selects = NULL) {
		?>
		<form method="get" action="<?= base_url() . $link ?>" class="navbar-form navbar-right" role="form" style="margin-top: 0px; margin-bottom: 0px">
			<?php
			$pos_gets = strpos($link, '?');
			if ($pos_gets !== FALSE) {
				$solo_gets = substr($link, $pos_gets + 1);
				$gets = explode('&');
				foreach ($gets as $get) {
					$get = explode('=', $get);
					$name = $get[0];
					$value = isset($get[1]) ? $get[1] : '';
					echo "<input type='hidden' name='" . $name . "' value='" . $value . "'>\n";
				}
			}
			?>
			<div class="form-group">
				<?php
				if (is_array($selects)) {
					foreach ($selects as $select) {
						$name = isset($select['name']) ? $select['name'] : '';
						echo "<select class='form-control input-sm' name='" . $name . "'>\n";
						foreach ($select['options'] as $option) {
							$label = isset($option['label']) ? $option['label'] : '';
							$value = isset($option['value']) ? $option['value'] : '';
							$selected = isset($option['selected']) && $option['selected'] ? 'selected' : '';
							echo "<option value='" . $value . "' " . $selected . ">" . $label . "</option>\n";
						}
						echo "</select>\n";
					}
				}
				?>
				<button type="submit" class="btn btn-default btn-sm" style="margin-right: 5px">
					<img src="<?= base_url() ?>assets/img/lupa_negra.png">
				</button>
			</div>
		</form>	
		<?php
	}

}