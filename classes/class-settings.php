<?php
/**
 * Settings page class
 *
 * @package sharing-image
 * @author  Anton Lukin
 */

namespace Sharing_Image;

if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Settings page class
 *
 * @class Settings
 */
class Settings {
	/**
	 * Admin screen id.
	 *
	 * @var string
	 */
	const SCREEN_ID = 'settings_page_sharing-image';

	/**
	 * Settings AJAX action.
	 */
	const AJAX_ACTION = 'sharing-image-settings';

	/**
	 * Sharing Image posters options name.
	 *
	 * @var string
	 */
	const OPTION_POSTERS = 'sharing_image_posters';

	/**
	 * Sharing Image posters options group.
	 *
	 * @var string
	 */
	const GROUP_POSTERS = 'sharing-image-posters';

	/**
	 * Sharing Image config options name.
	 *
	 * @var string
	 */
	const OPTION_CONFIG = 'sharing_image_config';

	/**
	 * Sharing Image config options group.
	 *
	 * @var string
	 */
	const GROUP_CONFIG = 'sharing-image-config';

	/**
	 * List of settings tabs.
	 *
	 * @var array
	 */
	private $tabs = array();

	/**
	 * Settings constructor.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );

		// Add settings link to plugins list.
		add_filter( 'plugin_action_links', array( $this, 'add_settings_link' ), 10, 2 );

		// Add settings form fields.
		add_action( 'admin_init', array( $this, 'register_config_fields' ) );
		add_action( 'admin_init', array( $this, 'register_posters_fields' ) );

		// Delete poster field action.
		add_action( 'admin_post_' . SHARING_IMAGE_SLUG . '-delete', array( $this, 'delete_poster_field' ) );

		// Sanitize posters fields before save.
		add_action( 'pre_update_option', array( $this, 'sanitize_posters_fields' ), 10, 2 );

		// Process settings AJAX actions.
		add_action( 'wp_ajax_' . self::AJAX_ACTION, array( $this, 'process_ajax' ) );

		$this->init_tabs();
	}

	/**
	 * Add plugin settings page in WordPress menu.
	 */
	public function add_menu() {
		/**
		 * Easy way to hide settings page.
		 *
		 * @param bool $hide_settings Set true to hide settings page.
		 */
		$hide_settings = apply_filters( 'sharing_image_hide_settings', false );

		if ( $hide_settings ) {
			return;
		}

		add_options_page(
			esc_html__( 'Sharing Image settings', 'sharing-image' ),
			esc_html__( 'Sharing Image', 'sharing-image' ),
			'manage_options',
			SHARING_IMAGE_SLUG,
			array( $this, 'display_settings' )
		);

		// Add required assets and objects.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Add settings link to plugins list.
	 *
	 * @param array  $actions     An array of plugin action links.
	 * @param string $plugin_file Path to the plugin file relative to the plugins directory.
	 */
	public function add_settings_link( $actions, $plugin_file ) {
		$actions = (array) $actions;

		if ( plugin_basename( SHARING_IMAGE_FILE ) === $plugin_file ) {
			$actions[] = sprintf(
				'<a href="%s">%s</a>',
				admin_url( 'options-general.php?page=' . SHARING_IMAGE_SLUG ),
				__( 'Settings', 'sharing-image' )
			);
		}

		return $actions;
	}

	/**
	 * Action to delete poster from editor page.
	 */
	public function delete_poster_field() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		check_admin_referer( self::GROUP_POSTERS . '-options' );

		if ( isset( $_REQUEST['poster'] ) ) {
			// Get index from poster ID.
			$index = absint( $_REQUEST['poster'] ) - 1;

			$this->delete_poster( $index );
		}

		wp_safe_redirect( admin_url( 'options-general.php?page=' . SHARING_IMAGE_SLUG ) );
		exit;
	}

	/**
	 * Show plugin settings.
	 */
	public function display_settings() {
		if ( ! $this->is_settings_screen() ) {
			return;
		}

		include_once SHARING_IMAGE_DIR . '/templates/settings.php';
	}

	/**
	 * Init config settings fields.
	 */
	public function register_config_fields() {
		register_setting( self::GROUP_CONFIG, self::OPTION_CONFIG );

		add_settings_section(
			self::GROUP_CONFIG . '-default',
			null,
			null,
			self::GROUP_CONFIG,
		);

		add_settings_field(
			'sharing-image-upload',
			esc_html__( 'Uploading directory', 'sharing-image' ),
			array( $this, 'print_general_upload' ),
			self::GROUP_CONFIG,
			self::GROUP_CONFIG . '-default',
			array(
				'label_for' => self::GROUP_CONFIG . '-upload',
				self::GROUP_CONFIG . '-upload',
			),
		);
	}

	/**
	 * Init posters settings fields.
	 */
	public function register_posters_fields() {
		register_setting( self::GROUP_POSTERS, self::OPTION_POSTERS );
	}

	/**
	 * Print upload settings field.
	 *
	 * @param array $args Extra arguments used when outputting the field.
	 */
	public function print_general_upload( $args ) {
		$value = get_option( self::OPTION_CONFIG );

		if ( empty( $value['upload'] ) ) {
			$value['upload'] = null;
		}

		printf(
			'<input type="text" id="%s" class="regular-text" name="%s" value="%s">',
			esc_attr( $args['label_for'] ),
			esc_attr( self::OPTION_CONFIG . '[upload]' ),
			esc_attr( $value['upload'] )
		);
	}

	/**
	 * Enqueue settings styles.
	 */
	public function enqueue_styles() {
		if ( ! $this->is_settings_screen() ) {
			return;
		}

		wp_enqueue_style(
			'sharing-image-settings',
			SHARING_IMAGE_URL . '/assets/styles/settings.css',
			array(),
			SHARING_IMAGE_VERSION,
			'all'
		);
	}

	/**
	 * Enqueue settings scripts.
	 */
	public function enqueue_scripts() {
		if ( ! $this->is_settings_screen() ) {
			return;
		}

		wp_enqueue_script(
			'sharing-image-settings',
			SHARING_IMAGE_URL . '/assets/scripts/settings.js',
			array( 'wp-i18n', 'wp-polyfill-url' ),
			SHARING_IMAGE_VERSION,
			true
		);

		wp_enqueue_media();

		wp_set_script_translations(
			'sharing-image-settings',
			'sharing-image',
			plugin_dir_path( SHARING_IMAGE_FILE ) . 'languages'
		);

		$object = array(
			'option'  => self::OPTION_POSTERS,
			'action'  => self::AJAX_ACTION,

			'links'   => array(
				'delete'  => esc_url( admin_url( 'admin-post.php?action=' . SHARING_IMAGE_SLUG . '-delete' ) ),
				'uploads' => esc_url( admin_url( 'upload.php' ) ),
			),

			'posters' => $this->get_posters(),
		);

		wp_localize_script( 'sharing-image-settings', 'sharingImageSettings', $object );
	}

	/**
	 * Process settings AJAX actions.
	 */
	public function process_ajax() {
		check_ajax_referer( self::GROUP_POSTERS . '-options' );

		if ( empty( $_POST['handler'] ) ) {
			wp_send_json_error();
		}

		$handler = sanitize_key( $_POST['handler'] );

		if ( 'show' === $handler ) {
			$posters = $_POST['sharing_image_posters'];

			foreach ( $posters as $poster ) {
				$generator = new Generator();
				$generator->run( $poster );
			}
		}

		if ( 'save' === $handler ) {
			$posters = $_POST['sharing_image_posters'];

			foreach ( $posters as $poster ) {
				$generator = new Generator();
				$generator->save( $poster );
			}
		}
	}

	/**
	 * Update posters option before saving in database.
	 *
	 * @param mixed  $value The new, unserialized option value.
	 * @param string $name  Option name.
	 * @return array
	 */
	public function sanitize_posters_fields( $value, $name ) {
		print_r( $value ); exit;

		if ( self::OPTION_POSTERS !== $name ) {
			return $value;
		}

		$posters = $this->get_posters();

		return array_replace( $posters, $value );
	}

	/**
	 * Get posters list from options.
	 *
	 * @return array List of posters.
	 */
	private function get_posters() {
		$posters = get_option( self::OPTION_POSTERS, array() );

		/**
		 * Filters list of posters.
		 *
		 * @param array $tabs List of settings tabs.
		 */
		return apply_filters( 'sharing_image_get_posters', $posters );
	}

	/**
	 * Delete poster by index.
	 *
	 * @param int $index Poster index.
	 */
	private function delete_poster( $index ) {
		$posters = $this->get_posters();

		unset( $posters[ $index ] );

		// Reindex posters array.
		$posters = array_values( $posters );

		update_option( self::OPTION_POSTERS, $posters );
	}

	/**
	 * Get list of settings page tabs
	 */
	private function init_tabs() {
		$tabs = array(
			'posters' => array(
				'label'   => __( 'Templates', 'sharing-image' ),
				'link'    => admin_url( 'options-general.php?page=' . SHARING_IMAGE_SLUG ),
				'default' => true,
			),
			'config'  => array(
				'label' => __( 'Configuration', 'sharing-image' ),
				'link'  => admin_url( 'options-general.php?page=' . SHARING_IMAGE_SLUG . '&tab=config' ),
			),
			'premium' => array(
				'label' => __( 'Premium', 'sharing-image' ),
				'link'  => admin_url( 'options-general.php?page=' . SHARING_IMAGE_SLUG . '&tab=premium' ),
			),
		);

		/**
		 * Filter tabs in settings page.
		 *
		 * @param array $tabs List of settings tabs.
		 */
		$this->tabs = apply_filters( 'sharing_image_settings_tabs', $tabs );
	}

	/**
	 * Show settings tab template.
	 */
	private function show_settings_section() {
		$tab = $this->get_current_tab();

		if ( ! empty( $tab ) ) {
			include_once SHARING_IMAGE_DIR . "/templates/tabs/{$tab}.php";
		}
	}

	/**
	 * Print menu on settings page.
	 */
	private function show_settings_menu() {
		foreach ( $this->tabs as $tab => $config ) {
			$classes = array(
				'sharing-image-tab',
			);

			$current = $this->get_current_tab();

			if ( $current === $tab ) {
				$classes[] = 'active';
			}

			printf(
				'<a href="%2$s" class="%1$s">%3$s</a>',
				esc_attr( implode( ' ', $classes ) ),
				esc_url( $config['link'] ),
				esc_html( $config['label'] )
			);
		}
	}

	/**
	 * Get current tab.
	 *
	 * @return string $tab Current tab name.
	 */
	private function get_current_tab() {
		// phpcs:ignore WordPress.Security.NonceVerification
		if ( isset( $_GET['tab'] ) ) {
			// phpcs:ignore WordPress.Security.NonceVerification
			$tab = sanitize_file_name( wp_unslash( $_GET['tab'] ) );

			if ( array_key_exists( $tab, $this->tabs ) ) {
				return $tab;
			}
		}

		foreach ( $this->tabs as $tab => $config ) {
			if ( isset( $config['default'] ) && $config['default'] ) {
				return $tab;
			}
		}

		return null;
	}

	/**
	 * Is current admin screen the plugin options screen.
	 *
	 * @return bool
	 */
	private function is_settings_screen() {
		$current_screen = get_current_screen();

		if ( $current_screen && self::SCREEN_ID === $current_screen->id ) {
			return true;
		}

		return false;
	}
}
