<?php

namespace MetaImage; 

class MetaBox {
	function __construct() {
		add_action('admin_enqueue_scripts', [$this, 'add_assets']);
		add_action('add_meta_boxes', [$this, 'add_box']);
	}

	public function add_box() {
		add_meta_box('meta-image-box', __('Social sharing image', 'meta-image'), [$this, 'display_box'], 'post', 'side', 'low');
	}

	public function display_box() {
		include(plugin_dir_path(__DIR__) . "views/metabox.php");
	}

	public function add_assets($hook) {
		if('post.php' !== $hook )
			return;

		$options = [
			'choose' => __('Choose image for social sharing', 'meta-image')
		];

		wp_enqueue_script('meta-image', plugins_url("assets/meta-image.js", dirname(__DIR__)), ['jquery'], '0.2');
 		wp_enqueue_style('meta-image', plugins_url("assets/meta-image.css", dirname(__DIR__)), [], '0.2'); 

		wp_localize_script('meta-image', 'meta_image_options', $options); 
	}
}

