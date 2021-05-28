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
	 * Sharing Image templates options name.
	 *
	 * @var string
	 */
	const OPTION_TEMPLATES = 'sharing_image_templates';

	/**
	 * Sharing Image config options name.
	 *
	 * @var string
	 */
	const OPTION_CONFIG = 'sharing_image_config';

	/**
	 * Plugin admin menu slug.
	 *
	 * @var string
	 */
	const SETTINGS_SLUG = 'sharing-image';


	/**
	 * Remote licenses API url.
	 *
	 * @var string
	 */
	const REMOTE_LICENSES = 'https://notset.org/sharing-image/licenses/';

	/**
	 * Premium verification event name.
	 *
	 * @var string
	 */
	const PREMIUM_EVENT = 'sharing_image_premium_event';

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
		$this->init_tabs();
	}

	/**
	 * Init class actions and filters.
	 */
	public function init() {
		add_action( 'admin_menu', array( $this, 'add_menu' ) );

		// Handle settings POST requests.
		add_action( 'admin_init', array( $this, 'handle_post_requests' ) );

		// Handle settings AJAX requests.
		add_action( 'admin_init', array( $this, 'handle_ajax_requests' ) );

		// Allow uploading custom fonts for templates editor.
		add_action( 'admin_init', array( $this, 'allow_custom_fonts' ) );

		// Add settings link to plugins list.
		add_filter( 'plugin_action_links', array( $this, 'add_settings_link' ), 10, 2 );

		// Update admin title for different tabs.
		add_action( 'admin_title', array( $this, 'update_settings_title' ) );

		// Schedule Premium license verification.
		add_action( self::PREMIUM_EVENT, array( $this, 'launch_verification_event' ), 10, 1 );
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
			self::SETTINGS_SLUG,
			array( $this, 'display_settings' )
		);

		// Add required assets and objects.
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_styles' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Handle settings POST requests.
	 */
	public function handle_post_requests() {
		$actions = array(
			'config' => 'save_settings_config',
			'editor' => 'save_settings_template',
			'delete' => 'delete_settings_template',
		);

		foreach ( $actions as $key => $method ) {
			$action = 'sharing_image_' . $key;

			if ( method_exists( $this, $method ) ) {
				add_action( 'admin_post_' . $action, array( $this, $method ) );
			}
		}
	}

	/**
	 * Handle settings AJAX requests.
	 */
	public function handle_ajax_requests() {
		$actions = array(
			'show'   => 'show_template_preview',
			'save'   => 'save_template_preview',
			'verify' => 'verify_premium_key',
			'revoke' => 'revoke_premium_access',
		);

		foreach ( $actions as $key => $method ) {
			$action = 'sharing_image_' . $key;

			if ( method_exists( $this, $method ) ) {
				add_action( 'wp_ajax_' . $action, array( $this, $method ) );
			}
		}
	}

	/**
	 * Allow uploading custom fonts for templates editor.
	 * This function may affect the security of the site.
	 * Disable font uploading if you are not going to use it.
	 */
	public function allow_custom_fonts() {
		/**
		 * Easy way to disable custom font uploading.
		 *
		 * @param bool $disable_ttf Set true to disable fonts uploading.
		 */
		$disable_fonts = apply_filters( 'sharing_image_allow_custom_fonts', false );

		if ( $disable_fonts ) {
			return;
		}

		// Allow True Type fonts uploading.
		add_filter( 'wp_check_filetype_and_ext', array( $this, 'fix_ttf_mime_type' ), 10, 3 );

		// Add new .ttf font mime type.
		add_filter( 'upload_mimes', array( $this, 'add_ttf_mime_type' ) );
	}

	/**
	 * Add settings link to plugins list.
	 *
	 * @param array  $actions     An array of plugin action links.
	 * @param string $plugin_file Path to the plugin file relative to the plugins directory.
	 * @return array
	 */
	public function add_settings_link( $actions, $plugin_file ) {
		$actions = (array) $actions;

		if ( plugin_basename( SHARING_IMAGE_FILE ) === $plugin_file ) {
			$actions[] = sprintf(
				'<a href="%s">%s</a>',
				admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG ),
				__( 'Settings', 'sharing-image' )
			);
		}

		return $actions;
	}

	/**
	 * Save settings config fields.
	 */
	public function save_settings_config() {
		check_admin_referer( basename( __FILE__ ), 'sharing_image_nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to manage options for this site.', 'sharing-image' ) );
		}

		$return = $this->get_tab_link( 'config' );

		if ( null === $return ) {
			$return = admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG );
		}

		if ( ! isset( $_POST['sharing_image_config'] ) ) {
			$this->redirect_with_message( $return, 5 );
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$config = $this->sanitize_config( wp_unslash( $_POST['sharing_image_config'] ) );

		$this->update_config( $config );

		// Redirect with success message.
		$this->redirect_with_message( $return, 1 );
	}

	/**
	 * Save template editor fields.
	 */
	public function save_settings_template() {
		check_admin_referer( basename( __FILE__ ), 'sharing_image_nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( esc_html__( 'Sorry, you are not allowed to manage options for this site.', 'sharing-image' ) );
		}

		$return = admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG );

		if ( ! isset( $_POST['sharing_image_index'] ) ) {
			$this->redirect_with_message( $return, 2 );
		}

		$index = absint( wp_unslash( $_POST['sharing_image_index'] ) );

		if ( ! isset( $_POST['sharing_image_editor'] ) ) {
			$this->redirect_with_message( $return, 2 );
		}

		// Skip 2nd+ templates if the Premium is not active.
		if ( $index > 0 && ! $this->is_premium_features() ) {
			$this->redirect_with_message( $return, 2 );
		}

		$return = add_query_arg( array( 'template' => $index + 1 ), $return );

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$editor = $this->sanitize_editor( wp_unslash( $_POST['sharing_image_editor'] ) );

		$this->update_templates( $index, $editor );

		// Redirect with success message.
		$this->redirect_with_message( $return, 1 );
	}

	/**
	 * Action to delete template from editor page.
	 */
	public function delete_settings_template() {
		check_admin_referer( basename( __FILE__ ), 'nonce' );

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$return = admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG );

		if ( ! isset( $_REQUEST['template'] ) ) {
			$this->redirect_with_message( $return, 4 );
		}

		// Get index from template ID.
		$index = absint( $_REQUEST['template'] ) - 1;

		if ( ! $this->update_templates( $index ) ) {
			$this->redirect_with_message( $return, 4 );
		}

		$this->redirect_with_message( $return, 3 );
	}

	/**
	 * Show generated template from AJAX request.
	 */
	public function show_template_preview() {
		$check = check_ajax_referer( basename( __FILE__ ), 'sharing_image_nonce', false );

		if ( false === $check ) {
			wp_send_json_error( __( 'Invalid security token. Reload the page and retry.', 'sharing-image' ), 403 );
		}

		if ( ! isset( $_POST['sharing_image_index'] ) ) {
			wp_send_json_error( __( 'Poster index undefined.', 'sharing-image' ), 400 );
		}

		$index = absint( wp_unslash( $_POST['sharing_image_index'] ) );

		if ( ! isset( $_POST['sharing_image_editor'] ) ) {
			wp_send_json_error( __( 'Editor settings are not set.', 'sharing-image' ), 400 );
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$editor = $this->sanitize_editor( wp_unslash( $_POST['sharing_image_editor'] ) );

		// Show poster using generator class.
		$poster = ( new Generator() )->show( $editor, $index );

		if ( is_wp_error( $poster ) ) {
			wp_send_json_error( $poster->get_error_message(), 400 );
		}
	}

	/**
	 * Show generated template from AJAX request.
	 */
	public function save_template_preview() {
		$check = check_ajax_referer( basename( __FILE__ ), 'sharing_image_nonce', false );

		if ( false === $check ) {
			wp_send_json_error( __( 'Invalid security token. Reload the page and retry.', 'sharing-image' ), 403 );
		}

		if ( ! isset( $_POST['sharing_image_index'] ) ) {
			wp_send_json_error( __( 'Poster index undefined.', 'sharing-image' ), 400 );
		}

		$index = absint( wp_unslash( $_POST['sharing_image_index'] ) );

		if ( ! isset( $_POST['sharing_image_editor'] ) ) {
			wp_send_json_error( __( 'Editor settings are not set.', 'sharing-image' ), 400 );
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput
		$editor = $this->sanitize_editor( wp_unslash( $_POST['sharing_image_editor'] ) );

		// Save poster using generator class.
		$poster = ( new Generator() )->save( $editor, $index );

		if ( is_wp_error( $poster ) ) {
			wp_send_json_error( $poster->get_error_message(), 400 );
		}

		wp_send_json_success( $poster );
	}

	/**
	 * Verify Premium key from AJAX request.
	 */
	public function verify_premium_key() {
		$check = check_ajax_referer( basename( __FILE__ ), 'sharing_image_nonce', false );

		if ( false === $check ) {
			wp_send_json_error( __( 'Invalid security token. Reload the page and retry.', 'sharing-image' ), 403 );
		}

		if ( empty( $_POST['sharing_image_key'] ) ) {
			wp_send_json_error( __( 'Premium key undefined.', 'sharing-image' ), 400 );
		}

		$key = sanitize_text_field( wp_unslash( $_POST['sharing_image_key'] ) );

		$args = array(
			'body' => array(
				'key'  => $key,
				'host' => wp_parse_url( site_url(), PHP_URL_HOST ),
			),
		);

		$response = wp_remote_post( self::REMOTE_LICENSES, $args );

		if ( is_wp_error( $response ) ) {
			wp_send_json_error( __( 'Unable to get a response from the verification server.', 'sharing-image' ), 400 );
		}

		$answer = json_decode( $response['body'], true );

		if ( ! isset( $answer['success'] ) ) {
			wp_send_json_error( __( 'Unable to get a response from the verification server.', 'sharing-image' ), 400 );
		}

		// Remove license verification event.
		wp_unschedule_hook( self::PREMIUM_EVENT );

		if ( true === $answer['success'] ) {
			$license = $this->update_license( true, $key );

			// Schedule license verification twice daily.
			$this->schedule_verification( array( $key ) );

			wp_send_json_success( $license );
		}

		$error = array(
			'success' => false,
			'data'    => __( 'Verification failed.', 'sharing-image' ),
		);

		if ( isset( $answer['error'] ) ) {
			$error['code'] = $answer['error'];
		}

		$this->update_license( false, $key );

		wp_send_json( $error, 403 );
	}

	/**
	 * Revoke Premium access from AJAX request.
	 */
	public function revoke_premium_access() {
		$check = check_ajax_referer( basename( __FILE__ ), 'sharing_image_nonce', false );

		if ( false === $check ) {
			wp_send_json_error( __( 'Invalid security token. Reload the page and retry.', 'sharing-image' ), 403 );
		}

		// Remove license verification event.
		wp_unschedule_hook( self::PREMIUM_EVENT );

		// Disable Premium license.
		$license = $this->update_license( false );

		wp_send_json_success( $license );
	}

	/**
	 * Show plugin settings.
	 */
	public function display_settings() {
		if ( ! $this->is_settings_screen() ) {
			return;
		}

		include_once SHARING_IMAGE_DIR . '/templates/settings.php';

		/**
		 * Fires on settings template including.
		 */
		do_action( 'sharing_image_settings' );
	}

	/**
	 * Fix .ttf files mime.
	 *
	 * @param array  $types    Values for the extension, mime type, and corrected filename.
	 * @param string $file     Full path to the file.
	 * @param string $filename The name of the file (may differ from $file due to.
	 */
	public function fix_ttf_mime_type( $types, $file, $filename ) {
		$extension = pathinfo( $filename, PATHINFO_EXTENSION );

		if ( 'ttf' === $extension ) {
			$types['ext'] = false;

			if ( current_user_can( 'manage_options' ) ) {
				$types['ext']  = 'ttf';
				$types['type'] = 'application/x-font-ttf';
			}
		}

		return $types;
	}

	/**
	 * Add new .ttf font mime type.
	 *
	 * @param array $types Allowed file types to upload.
	 */
	public function add_ttf_mime_type( $types ) {
		$types['ttf'] = 'application/x-font-ttf';

		return $types;
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
			SHARING_IMAGE_URL . 'assets/styles/settings.css',
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
			SHARING_IMAGE_URL . 'assets/scripts/settings.js',
			array( 'wp-i18n', 'wp-polyfill-url' ),
			SHARING_IMAGE_VERSION,
			true
		);

		wp_enqueue_media();

		// Translations availible only for WP 5.0+.
		wp_set_script_translations( 'sharing-image-settings', 'sharing-image' );

		$object = $this->create_script_object();

		// Add settings script object.
		wp_localize_script( 'sharing-image-settings', 'sharingImageSettings', $object );
	}

	/**
	 * Get plugin config settings.
	 *
	 * @return array List of plugin config settings.
	 */
	public function get_config() {
		$config = get_option( self::OPTION_CONFIG, array() );

		/**
		 * Check if the plugin in development mode.
		 *
		 * @param bool Current development state. Disabled by default.
		 */
		$develop = apply_filters( 'sharing_image_develop', false );

		if ( $develop ) {
			$config['license']['develop'] = true;
		}

		/**
		 * Filters settigns config.
		 *
		 * @param array List of plugin config settings.
		 */
		return apply_filters( 'sharing_image_get_config', $config );
	}

	/**
	 * Update config settings.
	 *
	 * @param array $updated License settings config data.
	 */
	public function update_config( $updated ) {
		$config = get_option( self::OPTION_CONFIG, array() );

		if ( isset( $config['license'] ) ) {
			$updated['license'] = $config['license'];
		}

		/**
		 * Filters config options before their update in database.
		 *
		 * @param array $config Settings config data.
		 */
		$updated = apply_filters( 'sharing_image_update_config', $updated );

		update_option( self::OPTION_CONFIG, $updated );
	}

	/**
	 * Set license options.
	 *
	 * @param bool   $premium Premium status.
	 * @param string $key     License key.
	 * @param string $error   Verification error code.
	 * @return array
	 */
	public function update_license( $premium, $key = '', $error = '' ) {
		$config = get_option( self::OPTION_CONFIG, array() );

		$config['license']['premium'] = $premium;

		if ( ! empty( $key ) ) {
			$config['license']['key'] = $key;
		}

		unset( $config['license']['error'] );

		if ( ! empty( $error ) ) {
			$config['license']['error'] = $error;
		}

		// Save updated config option in database.
		update_option( self::OPTION_CONFIG, $config );

		return $config['license'];
	}

	/**
	 * Get templates list from options.
	 *
	 * @return array List of templates.
	 */
	public function get_templates() {
		$templates = get_option( self::OPTION_TEMPLATES, array() );

		if ( ! $this->is_premium_features() ) {
			$templates = array_slice( $templates, 0, 1 );
		}

		/**
		 * Filters list of templates.
		 *
		 * @param array $templates List of templates.
		 */
		return apply_filters( 'sharing_image_get_templates', $templates );
	}

	/**
	 * Update templates using index.
	 *
	 * @param int   $index  Template index to update.
	 * @param array $editor New template data.
	 */
	public function update_templates( $index, $editor = null ) {
		// Method get_templates() is not used to save old templates during Premium switching.
		$templates = get_option( self::OPTION_TEMPLATES, array() );

		$templates[ $index ] = $editor;

		if ( null === $editor ) {
			unset( $templates[ $index ] );
		}

		/**
		 * Filters list of templates before update in database.
		 *
		 * @param array $templates List of reindexed templates.
		 */
		$templates = apply_filters( 'sharing_image_update_templates', array_values( $templates ) );

		update_option( self::OPTION_TEMPLATES, $templates );
	}

	/**
	 * Update settings page title.
	 *
	 * @param string $title Plugin settings page title.
	 * @return string
	 */
	public function update_settings_title( $title ) {
		if ( ! $this->is_settings_screen() ) {
			return $title;
		}

		$tab = $this->get_current_tab();

		if ( null === $tab ) {
			return $title;
		}

		if ( empty( $this->tabs[ $tab ]['label'] ) ) {
			return $title;
		}

		$label = esc_html( $this->tabs[ $tab ]['label'] );

		return sprintf( '%s &ndash; %s', $label, $title );
	}

	/**
	 * Launch scheduled license verification event.
	 * Do not disable Premium if the verification server does not respond.
	 *
	 * @param string $key License key.
	 */
	public function launch_verification_event( $key ) {
		$args = array(
			'body' => array(
				'key'  => $key,
				'host' => wp_parse_url( site_url(), PHP_URL_HOST ),
			),
		);

		$response = wp_remote_post( self::REMOTE_LICENSES, $args );

		if ( is_wp_error( $response ) ) {
			return;
		}

		$answer = json_decode( $response['body'], true );

		if ( ! isset( $answer['success'] ) ) {
			return;
		}

		if ( true === $answer['success'] ) {
			return $this->update_license( true, $key );
		}

		if ( ! isset( $answer['error'] ) ) {
			return $this->update_license( false, $key );
		}

		$this->update_license( false, $key, $answer['error'] );
	}

	/**
	 * Check if Premium features availible.
	 *
	 * @return bool
	 */
	public function is_premium_features() {
		$config = $this->get_config();

		if ( isset( $config['license'] ) ) {
			$license = $config['license'];

			if ( ! empty( $license['premium'] ) || ! empty( $license['develop'] ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Schedule license verification.
	 *
	 * @param array $args List of event arguments. License key by default.
	 */
	public function schedule_verification( $args = array() ) {
		if ( wp_next_scheduled( self::PREMIUM_EVENT, $args ) ) {
			return;
		}

		wp_schedule_event( time() + DAY_IN_SECONDS / 2, 'twicedaily', self::PREMIUM_EVENT, $args );
	}

	/**
	 * Create script object to inject with settings.
	 *
	 * @return array
	 */
	private function create_script_object() {
		$uploads = wp_get_upload_dir();

		// Get uploads directory path from WordPress root.
		$basedir = str_replace( ABSPATH, '', $uploads['basedir'] );

		$object = array(
			'nonce'     => wp_create_nonce( basename( __FILE__ ) ),
			'links'     => array(
				'uploads' => esc_url( admin_url( 'upload.php' ) ),
				'action'  => esc_url( admin_url( 'admin-post.php' ) ),
				'premium' => esc_url_raw( $this->get_tab_link( 'premium' ) ),
				'storage' => path_join( $basedir, 'sharing-image' ),
			),
			'fonts'     => $this->get_fonts(),
			'config'    => $this->get_config(),
			'templates' => $this->get_templates(),
		);

		/**
		 * Filter settings script object.
		 *
		 * @param array $object Array of settings script object.
		 */
		return apply_filters( 'sharing_image_settings_object', $object );
	}

	/**
	 * Sanitize editor template settings.
	 *
	 * @param array $editor Template editor settings.
	 * @return array
	 */
	private function sanitize_editor( $editor ) {
		$sanitized = array();

		if ( isset( $editor['preview'] ) ) {
			$sanitized['preview'] = sanitize_text_field( $editor['preview'] );
		}

		if ( isset( $editor['title'] ) ) {
			$sanitized['title'] = sanitize_text_field( $editor['title'] );
		}

		if ( ! empty( $editor['attachment'] ) ) {
			$sanitized['attachment'] = absint( $editor['attachment'] );
		}

		if ( ! empty( $editor['suspend'] ) ) {
			$sanitized['suspend'] = 'suspend';
		}

		$sanitized['background'] = 'dynamic';

		if ( isset( $editor['background'] ) ) {
			$background = array( 'dynamic', 'thumbnail', 'permanent' );

			// Set default background for permanent option without attachment.
			if ( empty( $sanitized['attachment'] ) ) {
				$background = array_diff( $background, array( 'permanent' ) );
			}

			if ( in_array( $editor['background'], $background, true ) ) {
				$sanitized['background'] = $editor['background'];
			}
		}

		$sanitized['width'] = 1200;

		if ( ! empty( $editor['width'] ) ) {
			$sanitized['width'] = absint( $editor['width'] );
		}

		$sanitized['height'] = 630;

		if ( ! empty( $editor['height'] ) ) {
			$sanitized['height'] = absint( $editor['height'] );
		}

		if ( isset( $editor['layers'] ) && is_array( $editor['layers'] ) ) {
			$layers = array();

			foreach ( $editor['layers'] as $layer ) {
				if ( empty( $layer['type'] ) ) {
					continue;
				}

				switch ( $layer['type'] ) {
					case 'text':
						$layers[] = $this->sanitize_text_layer( $layer );
						break;

					case 'image':
						$layers[] = $this->sanitize_image_layer( $layer );
						break;

					case 'filter':
						$layers[] = $this->sanitize_filter_layer( $layer );
						break;

					case 'rectangle':
						$layers[] = $this->sanitize_rectangle_layer( $layer );
						break;
				}
			}

			$sanitized['layers'] = $layers;
		}

		/**
		 * Filters template editor sanitized fields.
		 *
		 * @param array $sanitized List of sanitized editor fields.
		 * @param array $editor    List of editor fields before sanitization.
		 */
		return apply_filters( 'sharing_image_sanitize_editor', $sanitized, $editor );
	}

	/**
	 * Sanitize template editor text layer.
	 *
	 * @param array $layer Layer settings.
	 * @return array
	 */
	private function sanitize_text_layer( $layer ) {
		$sanitized = array();

		// No need to sanitize after switch.
		$sanitized['type'] = $layer['type'];

		if ( ! empty( $layer['dynamic'] ) ) {
			$sanitized['dynamic'] = 'dynamic';
		}

		if ( isset( $layer['title'] ) ) {
			$sanitized['title'] = sanitize_text_field( $layer['title'] );
		}

		if ( isset( $layer['content'] ) ) {
			$sanitized['content'] = sanitize_textarea_field( $layer['content'] );
		}

		if ( isset( $layer['sample'] ) ) {
			$sanitized['sample'] = sanitize_textarea_field( $layer['sample'] );
		}

		$sanitized['preset'] = 'none';

		if ( isset( $layer['preset'] ) ) {
			$preset = array( 'title', 'excerpt' );

			if ( in_array( $layer['preset'], $preset, true ) ) {
				$sanitized['preset'] = $layer['preset'];
			}
		}

		$sanitized['color'] = '#ffffff';

		if ( ! empty( $layer['color'] ) ) {
			$sanitized['color'] = sanitize_hex_color( $layer['color'] );
		}

		$sanitized['horizontal'] = 'left';

		if ( isset( $layer['horizontal'] ) ) {
			$horizontal = array( 'center', 'right' );

			if ( in_array( $layer['horizontal'], $horizontal, true ) ) {
				$sanitized['horizontal'] = $layer['horizontal'];
			}
		}

		$sanitized['vertical'] = 'top';

		if ( isset( $layer['vertical'] ) ) {
			$vertical = array( 'center', 'bottom' );

			if ( in_array( $layer['vertical'], $vertical, true ) ) {
				$sanitized['vertical'] = $layer['vertical'];
			}
		}

		if ( isset( $layer['fontsize'] ) ) {
			$sanitized['fontsize'] = absint( $layer['fontsize'] );
		}

		if ( isset( $layer['lineheight'] ) ) {
			$sanitized['lineheight'] = (float) $layer['lineheight'];
		}

		if ( isset( $layer['fontname'] ) ) {
			$sanitized['fontname'] = sanitize_text_field( $layer['fontname'] );
		}

		if ( ! empty( $layer['fontfile'] ) ) {
			$sanitized['fontfile'] = absint( $layer['fontfile'] );
		}

		$sizes = array( 'x', 'y', 'width', 'height' );

		foreach ( $sizes as $size ) {
			if ( ! isset( $layer[ $size ] ) || '' === $layer[ $size ] ) {
				continue;
			}

			$sanitized[ $size ] = absint( $layer[ $size ] );
		}

		return $sanitized;
	}

	/**
	 * Sanitize template editor image layer.
	 *
	 * @param array $layer Layer settings.
	 * @return array
	 */
	private function sanitize_image_layer( $layer ) {
		$sanitized = array();

		// No need to sanitize after switch.
		$sanitized['type'] = $layer['type'];

		if ( ! empty( $layer['attachment'] ) ) {
			$sanitized['attachment'] = absint( $layer['attachment'] );
		}

		$sizes = array( 'x', 'y', 'width', 'height' );

		foreach ( $sizes as $size ) {
			if ( ! isset( $layer[ $size ] ) || '' === $layer[ $size ] ) {
				continue;
			}

			$sanitized[ $size ] = absint( $layer[ $size ] );
		}

		return $sanitized;
	}

	/**
	 * Sanitize template editor filter layer.
	 *
	 * @param array $layer Layer settings.
	 * @return array
	 */
	private function sanitize_filter_layer( $layer ) {
		$sanitized = array();

		// No need to sanitize after switch.
		$sanitized['type'] = $layer['type'];

		if ( ! empty( $layer['grayscale'] ) ) {
			$sanitized['grayscale'] = 'grayscale';
		}

		if ( ! empty( $layer['blur'] ) ) {
			$sanitized['blur'] = 'blur';
		}

		$sanitized['brightness'] = 0;

		if ( isset( $layer['brightness'] ) ) {
			$brightness = (int) $layer['brightness'];

			if ( $brightness >= -100 && $brightness <= 100 ) {
				$sanitized['brightness'] = $brightness;
			}
		}

		$sanitized['contrast'] = 0;

		if ( isset( $layer['contrast'] ) ) {
			$contrast = (int) $layer['contrast'];

			if ( $contrast >= -100 && $contrast <= 100 ) {
				$sanitized['contrast'] = $contrast;
			}
		}

		$sanitized['blackout'] = 0;

		if ( isset( $layer['blackout'] ) ) {
			$blackout = (int) $layer['blackout'];

			if ( $blackout >= 0 && $blackout <= 100 ) {
				$sanitized['blackout'] = $blackout;
			}
		}

		return $sanitized;
	}

	/**
	 * Sanitize template editor rectagle layer.
	 *
	 * @param array $layer Layer settings.
	 * @return array
	 */
	private function sanitize_rectangle_layer( $layer ) {
		$sanitized = array();

		// No need to sanitize after switch.
		$sanitized['type'] = $layer['type'];

		if ( ! empty( $layer['outline'] ) ) {
			$sanitized['outline'] = 'outline';
		}

		$sanitized['color'] = '#ffffff';

		if ( ! empty( $layer['color'] ) ) {
			$sanitized['color'] = sanitize_hex_color( $layer['color'] );
		}

		$sanitized['opacity'] = 0;

		if ( isset( $layer['opacity'] ) ) {
			$opacity = (float) $layer['opacity'];

			if ( $opacity >= 0 && $opacity <= 100 ) {
				$sanitized['opacity'] = $opacity;
			}
		}

		$sanitized['thickness'] = 0;

		if ( isset( $layer['thickness'] ) ) {
			$thickness = (int) $layer['thickness'];

			if ( $thickness >= 0 && $thickness <= 50 ) {
				$sanitized['thickness'] = $thickness;
			}
		}

		$sizes = array( 'x', 'y', 'width', 'height' );

		foreach ( $sizes as $size ) {
			if ( ! isset( $layer[ $size ] ) || '' === $layer[ $size ] ) {
				continue;
			}

			$sanitized[ $size ] = absint( $layer[ $size ] );
		}

		return $sanitized;
	}

	/**
	 * Sanitize config settings.
	 *
	 * @param array $config Config settings.
	 * @return array
	 */
	private function sanitize_config( $config ) {
		$sanitized = array();

		if ( ! empty( $config['rest'] ) ) {
			$sanitized['rest'] = absint( $config['rest'] );
		}

		$sanitized['format'] = 'jpg';

		if ( isset( $config['format'] ) ) {
			$format = $config['format'];

			if ( in_array( $format, array( 'jpg', 'png' ), true ) ) {
				$sanitized['format'] = $config['format'];
			}
		}

		if ( isset( $config['quality'] ) ) {
			$quality = (int) $config['quality'];

			if ( $quality >= 0 && $quality <= 100 ) {
				$sanitized['quality'] = $quality;
			}
		}

		$sanitized['uploads'] = 'default';

		if ( isset( $config['uploads'] ) ) {
			$uploads = $config['uploads'];

			if ( in_array( $uploads, array( 'custom', 'default' ), true ) ) {
				$sanitized['uploads'] = $config['uploads'];
			}
		}

		if ( isset( $config['storage'] ) ) {
			$sanitized['storage'] = sanitize_text_field( $config['storage'] );
		}

		/**
		 * Filters template editor sanitized fields.
		 *
		 * @param array $sanitized List of sanitized config fields.
		 * @param array $config    List of config fields before sanitization.
		 */
		return apply_filters( 'sharing_image_sanitize_config', $sanitized, $config );
	}

	/**
	 * Show settings tab template.
	 */
	private function show_settings_section() {
		$tab = $this->get_current_tab();

		if ( ! empty( $tab ) ) {
			include_once SHARING_IMAGE_DIR . "/templates/{$tab}.php";
		}
	}

	/**
	 * Show settings messages and errors after post actions.
	 */
	private function show_settings_message() {
		// phpcs:ignore WordPress.Security.NonceVerification
		$message = isset( $_GET['message'] ) ? absint( $_GET['message'] ) : 0;

		switch ( $message ) {
			case 1:
				add_settings_error( 'sharing-image', 'sharing-image', __( 'Settings successfully updated.', 'sharing-image' ), 'updated' );
				break;

			case 2:
				add_settings_error( 'sharing-image', 'sharing-image', __( 'Failed to save template settings.', 'sharing-image' ) );
				break;

			case 3:
				add_settings_error( 'sharing-image', 'sharing-image', __( 'Template successfully deleted.', 'sharing-image' ), 'updated' );
				break;

			case 4:
				add_settings_error( 'sharing-image', 'sharing-image', __( 'Failed to delete template.', 'sharing-image' ) );
				break;

			case 5:
				add_settings_error( 'sharing-image', 'sharing-image', __( 'Failed to save configuration settings.', 'sharing-image' ) );
				break;
		}

		settings_errors( 'sharing-image' );
	}

	/**
	 * Set list of settings page tabs.
	 */
	private function init_tabs() {
		$tabs = array(
			'templates' => array(
				'label'   => __( 'Templates', 'sharing-image' ),
				'link'    => admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG ),
				'default' => true,
			),
			'config'    => array(
				'label' => __( 'Configuration', 'sharing-image' ),
				'link'  => admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG . '&tab=config' ),
			),
			'premium'   => array(
				'label' => __( 'Premium', 'sharing-image' ),
				'link'  => admin_url( 'options-general.php?page=' . self::SETTINGS_SLUG . '&tab=premium' ),
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
	 * Print menu on settings page.
	 */
	private function show_settings_menu() {
		$current = $this->get_current_tab();

		foreach ( $this->tabs as $tab => $args ) {
			$classes = array(
				'sharing-image-tab',
			);

			if ( $current === $tab ) {
				$classes[] = 'active';
			}

			if ( null === $current && ! empty( $args['default'] ) ) {
				$classes[] = 'active';
			}

			printf(
				'<a href="%2$s" class="%1$s">%3$s</a>',
				esc_attr( implode( ' ', $classes ) ),
				esc_url( $args['link'] ),
				esc_html( $args['label'] )
			);
		}
	}

	/**
	 * Get availible fonts.
	 *
	 * @return array List of availible poster fonts.
	 */
	private function get_fonts() {
		$fonts = array(
			'open-sans'    => 'Open Sans',
			'merriweather' => 'Merriweather',
			'roboto-slab'  => 'Roboto Slab',
			'ubuntu'       => 'Ubuntu',
			'rubik-bold'   => 'Rubik Bold',
			'montserrat'   => 'Montserrat',
		);

		/**
		 * Filters settigns config.
		 *
		 * @param array List of availible poster fonts.
		 */
		return apply_filters( 'sharing_image_get_fonts', $fonts );
	}

	/**
	 * Get tab link by slug.
	 *
	 * @param string $tab Tab name.
	 * @return string|null
	 */
	private function get_tab_link( $tab ) {
		if ( empty( $this->tabs[ $tab ]['link'] ) ) {
			return null;
		}

		return $this->tabs[ $tab ]['link'];
	}

	/**
	 * Get current tab.
	 *
	 * @return string|null
	 */
	private function get_current_tab() {
		// phpcs:disable WordPress.Security.NonceVerification
		if ( isset( $_GET['tab'] ) ) {
			$tab = sanitize_file_name( wp_unslash( $_GET['tab'] ) );

			if ( array_key_exists( $tab, $this->tabs ) ) {
				return $tab;
			}
		}
		// phpcs:enable WordPress.Security.NonceVerification

		return null;
	}

	/**
	 * Add message id to the back link and redirect
	 *
	 * @param string $return  Redirect link.
	 * @param int    $message Settings error message id.
	 */
	private function redirect_with_message( $return, $message ) {
		$return = add_query_arg( array( 'message' => $message ), $return );

		wp_safe_redirect( $return );
		exit;
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
