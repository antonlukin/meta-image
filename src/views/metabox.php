<div id="meta-image-generate" class="meta-image-generate" data-ajaxurl='<?php echo admin_url('admin-ajax.php') ?>' data-post="<?php echo get_the_ID() ?>">
 	<?php
		$preview = get_post_meta(get_the_ID(), 'meta-image', true);
		$options = get_post_meta(get_the_ID(), 'meta-image-options', true);

		$options = unserialize($options);

		if(!is_array($options))
			$options = ['brightness' => -30, 'contrast' => -30, 'text' => ''];

		if(empty($options['text']))
			$options['text'] = get_the_title();
	?> 

		<button class="meta-image-library button"><?php _e('Choose from library', 'meta-image') ?></button>

	<p class="meta-image-fullsize">
		<img class="meta-image-preview" src="<?php echo $preview; ?>" />
		<span class="meta-image-search dashicons-before dashicons-search"></span>
	</p>

	<p>
		<textarea class="meta-image-text"><?php echo $options['text'] ?></textarea>
	</p>


	<div class="meta-image-options">
		<div class="meta-image-option">
			<label class="meta-image-label" for="meta-image-brightness"><?php _e('Brightness', 'meta-image') ?></label>
			<input class="meta-image-brightness meta-image-input" id="meta-image-brightness" value="<?php echo $options['brightness'] ?>" />
		</div>

		<div class="meta-image-option">
			<label class="meta-image-label" for="meta-image-contrast"><?php _e('Contrast', 'meta-image') ?></label> 
			<input class="meta-image-contrast meta-image-input" id="meta-image-contrast" value="<?php echo $options['contrast'] ?>" />
		</div> 
	</div>
	
	
	<div class="meta-image-manage">
		<button class="meta-image-run button"><?php _e('Generate', 'meta-image') ?></button>

		<a class="meta-image-delete" href="#delete"><?php _e('Delete', 'meta-image') ?></a>
		<span class="spinner"></span>

		<div class="clear"></div>
	</div>
</div>

