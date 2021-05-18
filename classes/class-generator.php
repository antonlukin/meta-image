<?php
/**
 * Poster generator class
 *
 * @package sharing-image
 * @author  Anton Lukin
 */

namespace Sharing_Image;

use Exception;
use WP_Error;
use PosterEditor\PosterEditor;

/**
 * Poster generator class
 *
 * @class Generator
 */
class Generator {
	/**
	 * The instance of Settings class.
	 *
	 * @var instance
	 */
	private $settings;

	/**
	 * Generator constructor.
	 */
	public function __construct() {
		$this->settings = new Settings();
	}

	/**
	 * Compose image using picker data.
	 *
	 * @param array $picker Picker data from metabox.
	 */
	public function compose( $picker ) {
		if ( ! isset( $picker['template'] ) ) {
			return new WP_Error( 'validate', esc_html__( 'Template id cannot be empty', 'sharing-image' ) );
		}

		$id = absint( $picker['template'] );

		// Get templates list from settings.
		$templates = $this->settings->get_templates();

		if ( ! isset( $templates[ $id ] ) ) {
			return new WP_Error( 'validate', esc_html__( 'Wrong template id', 'sharing-image' ) );
		}

		$fieldset = array();

		if ( isset( $picker['fieldset'][ $id ] ) ) {
			$fieldset = $picker['fieldset'][ $id ];
		}

		$template = $this->prepare_template( $templates[ $id ], $fieldset );

		list( $path, $url ) = $this->get_upload_file();

		// Generate image and save it.
		$poster = $this->create_poster( $template, $path );

		if ( is_wp_error( $poster ) ) {
			return $poster;
		}

		return $url;
	}

	/**
	 * Show image for settings page using template data.
	 *
	 * @param array $template Templates data from settings page.
	 * @param int   $index    Template index.
	 *
	 * @return WP_Error
	 */
	public function show( $template, $index ) {
		$template = $this->prepare_template( $template, null, $index );

		// Generate image and show it immediately.
		$poster = $this->create_poster( $template );

		if ( is_wp_error( $poster ) ) {
			return $poster;
		}

		exit; // It's ok to exit here. Just cause we show an image above.
	}

	/**
	 * Save image for settings page using template data.
	 *
	 * @param array $template Templates data from settings page.
	 * @param int   $index    Template index.
	 *
	 * @return WP_Error
	 */
	public function save( $template, $index ) {
		$template = $this->prepare_template( $template, null, $index );

		list( $path, $url ) = $this->get_upload_file();

		// Generate image and save it.
		$poster = $this->create_poster( $template, $path );

		if ( is_wp_error( $poster ) ) {
			return $poster;
		}

		return $url;
	}

	/**
	 * Prepare template before creating poster.
	 * Used to fill fieldset texts and background image.
	 *
	 * @param array   $template List of template data.
	 * @param array   $fieldset Optional. Fieldset data from picker.
	 * @param integer $index    Optional. Template index from editor.
	 */
	private function prepare_template( $template, $fieldset = array(), $index = null ) {
		$layers = array();

		if ( isset( $template['layers'] ) ) {
			$layers = $template['layers'];
		}

		foreach ( $layers as $i => &$layer ) {
			if ( empty( $layer['type'] ) || 'text' !== $layer['type'] ) {
				continue;
			}

			if ( empty( $layer['dynamic'] ) ) {
				continue;
			}

			$layer['content'] = null;

			if ( isset( $layer['sample'] ) ) {
				$layer['content'] = $layer['sample'];
			}

			if ( isset( $fieldset['captions'][ $i ] ) ) {
				$layer['content'] = $fieldset['captions'][ $i ];
			}
		}

		$template['image'] = null;

		if ( null !== $index ) {
			$template['image'] = sprintf( SHARING_IMAGE_DIR . '/assets/images/%d.jpg', ( $index % 12 ) + 1 );
		}

		if ( 'permanent' === $template['background'] ) {
			if ( isset( $template['attachment'] ) ) {
				$template['image'] = get_attached_file( $template['attachment'] );
			}
		}

		if ( isset( $fieldset['attachment'] ) ) {
			$template['image'] = get_attached_file( $fieldset['attachment'] );
		}

		$template['layers'] = $layers;

		/**
		 * Filters image generator background.
		 *
		 * @param array   $template List of template data.
		 * @param array   $fieldset Fieldset data from picker.
		 * @param integer $index    Template index from editor.
		 */
		return apply_filters( 'sharing_image_prepare_template', $template, $fieldset, $index );
	}

	/**
	 * Create poster using template data.
	 *
	 * @param array  $template List of template options.
	 * @param string $path     Optional. File path to save.
	 */
	private function create_poster( $template, $path = null ) {
		try {
			$poster = new PosterEditor();

			$poster->make( $template['image'] )->fit( $template['width'], $template['height'] );

			if ( isset( $template['layers'] ) ) {
				$poster = $this->append_layers( $poster, $template['layers'] );
			}

			if ( null === $path ) {
				return $poster->show( 90, 'jpg' );
			}

			$poster->save( $path, 90, 'jpg' );

		} catch ( Exception $e ) {
			return new WP_Error( 'generate', $e->getMessage() );
		}
	}

	/**
	 * Append layers to image.
	 *
	 * @param PosterEditor $poster Instance of PosterEditor class.
	 * @param array        $layers List of layers options.
	 *
	 * @return PosterEditor
	 */
	private function append_layers( $poster, $layers ) {
		$layers = array_reverse( $layers );

		foreach ( $layers as $layer ) {
			if ( empty( $layer['type'] ) ) {
				continue;
			}

			switch ( $layer['type'] ) {
				case 'filter':
					$poster = $this->draw_filter( $poster, $layer );
					break;

				case 'rectangle':
					$poster = $this->draw_rectangle( $poster, $layer );
					break;

				case 'text':
					$poster = $this->draw_text( $poster, $layer );
					break;

				case 'image':
					$poster = $this->draw_image( $poster, $layer );
					break;
			}
		}

		return $poster;
	}

	/**
	 * Draw filter layer
	 *
	 * @param PosterEditor $poster Instance of PosterEditor class.
	 * @param array        $layer  Filter layer options.
	 *
	 * @return PosterEditor
	 */
	private function draw_filter( $poster, $layer ) {
		if ( ! empty( $layer['grayscale'] ) ) {
			$poster->grayscale();
		}

		if ( ! empty( $layer['blur'] ) ) {
			$poster->blur();
		}

		if ( isset( $layer['contrast'] ) ) {
			$poster->contrast( $layer['contrast'] );
		}

		if ( isset( $layer['brightness'] ) ) {
			$poster->brightness( $layer['brightness'] );
		}

		if ( isset( $layer['blackout'] ) ) {
			$poster->blackout( $layer['blackout'] );
		}

		return $poster;
	}

	/**
	 * Draw rectangle layer.
	 *
	 * @param PosterEditor $poster Instance of PosterEditor class.
	 * @param array        $layer  Rectangle layer options.
	 *
	 * @return PosterEditor
	 */
	private function draw_rectangle( $poster, $layer ) {
		// Both x and y should be set.
		if ( ! isset( $layer['x'], $layer['y'] ) ) {
			return $poster;
		}

		$args = $this->prepare_args( $layer, array( 'color', 'opacity', 'thickness' ) );

		if ( ! empty( $layer['outline'] ) ) {
			$args['outline'] = true;
		}

		if ( ! isset( $layer['width'] ) ) {
			$layer['width'] = 0;
		}

		if ( ! isset( $layer['height'] ) ) {
			$layer['height'] = 0;
		}

		// Draw rectangle.
		$poster->rectangle( $layer['x'], $layer['y'], $layer['width'], $layer['height'], $args );

		return $poster;
	}

	/**
	 * Draw image layer
	 *
	 * @param PosterEditor $poster Instance of PosterEditor class.
	 * @param object       $layer  Option name.
	 *
	 * @return PosterEditor
	 */
	private function draw_image( $poster, $layer ) {
		// Attachment id is required.
		if ( ! isset( $layer['attachment'] ) ) {
			return $poster;
		}

		$args = $this->prepare_args( $layer, array( 'x', 'y', 'width', 'height' ) );

		// Get attachment file by id.
		$image = get_attached_file( $layer['attachment'] );

		// Insert image to poster.
		$poster->insert( $image, $args );

		return $poster;
	}

	/**
	 * Draw text layer.
	 *
	 * @param PosterEditor $poster Instance of PosterEditor class.
	 * @param array        $layer  Rectangle layer options.
	 *
	 * @return PosterEditor
	 */
	private function draw_text( $poster, $layer ) {
		$args = $this->prepare_args( $layer, array( 'x', 'y', 'width', 'height', 'fontsize', 'color', 'lineheight', 'opacity', 'horizontal', 'vertical' ) );

		// Try to set font file by name or attachment path.
		$args['fontpath'] = $this->get_fontpath( $layer );

		if ( ! empty( $layer['content'] ) ) {
			$poster->text( $layer['content'], $args );
		}

		return $poster;
	}

	/**
	 * Get font file path by layer data.
	 *
	 * @param array  $layer Layer data.
	 * @param string $path  Default file path.
	 *
	 * @return string Filtered path to font file.
	 */
	private function get_fontpath( $layer, $path = '' ) {
		if ( isset( $layer['fontname'] ) ) {
			$path = sprintf( SHARING_IMAGE_DIR . '/assets/fonts/%s.ttf', $layer['fontname'] );
		}

		if ( isset( $layer['fontfile'] ) ) {
			$path = get_attached_file( $layer['fontfile'] );
		}

		/**
		 * Filters generator font file path.
		 *
		 * @param string $path  Font file path.
		 * @param array  $layer Layer data.
		 */
		return apply_filters( 'sharing_image_get_fontpath', $path, $layer );
	}

	/**
	 * Generate upload file path and url.
	 *
	 * @return array Server file path and url to image.
	 */
	private function get_upload_file() {
		$uploads = wp_upload_dir();

		// Create random file name.
		$name = wp_unique_filename( $uploads['path'], uniqid() . '.jpg' );

		$file = array(
			trailingslashit( $uploads['path'] ) . $name,
			trailingslashit( $uploads['url'] ) . $name,
		);

		/**
		 * Filters upload file path and url
		 *
		 * @param array  $file Server file path and url to image.
		 * @param string $name Unique file name.
		 */
		return apply_filters( 'sharing_image_get_upload_file', $file, $name );
	}

	/**
	 * Update template data using picker fieldset data.
	 *
	 * @param array $template Template data.
	 * @param array $fieldset Fieldset data from request.
	 *
	 * @return array Template
	 */
	private function set_picker_fields( $template, $fieldset ) {
		if ( isset( $fieldset['attachment'] ) ) {
			$template['attachment'] = $fieldset['attachment'];
			$template['background'] = 'uploaded';
		}

		if ( empty( $template['layers'] ) ) {
			return $template;
		}

		foreach ( $template['layers'] as $i => &$layer ) {
			if ( empty( $layer['type'] ) || empty( $layer['dynamic'] ) ) {
				continue;
			}

			if ( 'text' !== $layer['type'] ) {
				continue;
			}

			if ( ! isset( $fieldset['captions'][ $i ] ) ) {
				continue;
			}

			$layer['content'] = $fieldset['captions'][ $i ];
		}

		return $template;
	}

	/**
	 * Prepare args and remove not-allowed keys.
	 *
	 * @param array $args    List of source arguments.
	 * @param array $allowed List of allowed keys.
	 *
	 * @return array List of prepared args.
	 */
	private function prepare_args( $args, $allowed ) {
		return array_intersect_key( $args, array_flip( $allowed ) );
	}
}
