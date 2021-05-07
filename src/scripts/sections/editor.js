/**
 * Editor settings.
 */
/* global ajaxurl:true */

import Build from '../builders';

const { __ } = wp.i18n;

// Store global scriot object for settings page.
let params = null;

// Preview element.
let preview = null;

// Root editor element.
let editor = null;

/**
 * Show template warning message.
 *
 * @param {string} message Warning message.
 */
function showTemplateError( message ) {
	const viewport = preview.parentNode;

	// Try to find warning element.
	const warning = viewport.querySelector( '.sharing-image-editor-warning' );

	warning.classList.add( 'warning-visible' );
	warning.textContent = message || __( 'Unknown generation error', 'sharing-image' );
}

/**
 * Remove warning message block.
 */
function hideTemplateError() {
	const viewport = preview.parentNode;

	// Try to find warning element.
	const warning = viewport.querySelector( '.sharing-image-editor-warning' );

	if ( null !== warning ) {
		warning.classList.remove( 'warning-visible' );
	}
}

/**
 * Geneate template using editor data.
 */
function generateTemplate() {
	preview.classList.add( 'preview-loader' );

	const request = new XMLHttpRequest();
	request.open( 'POST', ajaxurl );
	request.responseType = 'blob';

	// Create data bundle using form data.
	const bundle = new window.FormData( editor );
	bundle.set( 'action', 'sharing_image_show' );

	hideTemplateError();

	// Set blob for success response.
	request.addEventListener( 'readystatechange', () => {
		if ( request.readyState === 2 ) {
			request.responseType = 'json';

			if ( request.status === 200 ) {
				request.responseType = 'blob';
			}
		}
	} );

	// Hide preview loader on request complete.
	request.addEventListener( 'readystatechange', () => {
		if ( request.readyState === 4 ) {
			preview.classList.remove( 'preview-blank', 'preview-loader' );
		}
	} );

	request.addEventListener( 'load', () => {
		const response = request.response || {};

		if ( request.status !== 200 ) {
			return showTemplateError( response.data );
		}

		let image = preview.querySelector( 'img' );

		if ( null === image ) {
			image = Build.element( 'img', {
				append: preview,
			} );
		}

		// Set new blob image source.
		image.src = window.URL.createObjectURL( response );
	} );

	request.addEventListener( 'error', () => {
		showTemplateError();
	} );

	request.send( bundle );
}

/**
 * Save template while editor submiting.
 */
function saveTemplate() {
	const request = new XMLHttpRequest();
	request.open( 'POST', ajaxurl );
	request.responseType = 'json';

	preview.classList.add( 'preview-loader' );

	// Create data bundle using editor data.
	const bundle = new window.FormData( editor );
	bundle.set( 'action', 'sharing_image_save' );

	request.addEventListener( 'load', () => {
		const response = request.response || {};

		if ( request.status !== 200 || ! response.data ) {
			return showTemplateError( response.data );
		}

		const input = preview.querySelector( 'input' );

		if ( null !== input ) {
			input.setAttribute( 'value', response.data );
		}

		editor.submit();
	} );

	request.addEventListener( 'error', () => {
		showTemplateError();
	} );

	request.send( bundle );
}

/**
 * Update form fields name attributes for layers
 *
 * @param {HTMLElement} designer Layouts designer element.
 */
function reorderLayers( designer ) {
	const layers = designer.children;

	for ( let index = 0; index < layers.length; index++ ) {
		const fields = layers[ index ].querySelectorAll( '[name]' );

		fields.forEach( ( field ) => {
			let name = field.getAttribute( 'name' );

			// Try to find layer index.
			const match = name.match( /(.+?\[layers\])\[(\d+)\](\[.+?\])$/ );

			if ( null !== match ) {
				name = match[ 1 ] + `[${ index }]` + match[ 3 ];
			}

			field.setAttribute( 'name', name );
		} );
	}
}

/**
 * Update template background settings with custom logic.
 *
 * @param {HTMLElement} fieldset Fieldset HTML element.
 * @param {Object} data Current template data.
 */
function createPermanentAttachment( fieldset, data ) {
	data.background = data.background || null;

	// Create background settings control.
	const control = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-half-bottom' ],
		label: __( 'Template background settings', 'sharing-image' ),
		fields: [
			{
				group: 'radio',
				classes: [ 'sharing-image-editor-radio' ],
				attributes: {
					name: params.name + '[background]',
					value: 'dynamic',
				},
				label: __( 'Select for each post separately', 'sharing-image' ),
				checked: data.background,
			},
			{
				group: 'radio',
				classes: [ 'sharing-image-editor-radio' ],
				attributes: {
					name: params.name + '[background]',
					value: 'thumbnail',
				},
				label: __( 'Use post thumbnail image', 'sharing-image' ),
				checked: data.background,
			},
			{
				group: 'radio',
				classes: [ 'sharing-image-editor-radio' ],
				attributes: {
					name: params.name + '[background]',
					value: 'permanent',
				},
				label: __( 'Upload permanent background', 'sharing-image' ),
				checked: data.background,
			},
		],
		append: fieldset,
	} );

	params.links = params.links || {};

	const media = Build.media( {
		name: params.name + '[attachment]',
		classes: [ 'sharing-image-editor-control', 'control-details' ],
		value: data.attachment,
		link: params.links.uploads,
		labels: {
			button: __( 'Upload image', 'sharing-image' ),
			heading: __( 'Select layer image', 'sharing-image' ),
			details: __( 'Attachment details', 'sharing-image' ),
		},
		append: fieldset,
	} );

	const upload = media.querySelector( 'button' );
	upload.setAttribute( 'disabled', 'disabled' );

	// Get checked background radio input.
	const fields = control.querySelectorAll( 'input' );

	fields.forEach( ( input ) => {
		// Show button for checked permanent radio.
		if ( input.checked && 'permanent' === input.value ) {
			upload.removeAttribute( 'disabled', 'disabled' );
		}

		input.addEventListener( 'change', () => {
			upload.setAttribute( 'disabled', 'disabled' );

			if ( 'permanent' === input.value ) {
				upload.removeAttribute( 'disabled' );
			}
		} );
	} );
}

/**
 * Text layer dynamic/static fields manager.
 *
 * @param {HTMLElement} layer Current layer element.
 * @param {string} name Fields name attribute prefix.
 * @param {Object} data Layer data object.
 */
function createDynamicFields( layer, name, data ) {
	const control = Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		append: layer,
	} );

	const checkbox = Build.checkbox(
		{
			classes: [ 'sharing-image-editor-checkbox' ],
			attributes: {
				name: name + '[dynamic]',
				value: 'dynamic',
			},
			label: __( 'Dynamic field. Filled in the post editing screen.', 'sharing-image' ),
			checked: data.dynamic,
		},
		control
	);

	const fields = [];

	fields[ fields.length ] = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-hidden' ],
		help: __( 'Displayed only in the metabox.', 'sharing-image' ),
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					name: name + '[title]',
					value: data.title,
				},
				label: __( 'Field name', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	fields[ fields.length ] = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-hidden' ],
		help: __( 'This field is used for example only, to see how the editor will look.', 'sharing-image' ),
		fields: [
			{
				group: 'textarea',
				classes: [ 'sharing-image-editor-textarea' ],
				content: data.sample || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
				attributes: {
					name: name + '[sample]',
					rows: 2,
				},
				label: __( 'Text sample', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	fields[ fields.length ] = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-hidden' ],
		label: __( 'Preset text field', 'sharing-image' ),
		fields: [
			{
				group: 'radio',
				classes: [ 'sharing-image-editor-radio' ],
				attributes: {
					name: name + '[preset]',
					value: 'none',
				},
				label: __( 'Fill in manually', 'sharing-image' ),
				checked: data.preset || 'none',
			},
			{
				group: 'radio',
				classes: [ 'sharing-image-editor-radio' ],
				attributes: {
					name: name + '[preset]',
					value: 'title',
				},
				label: __( 'Take from post title', 'sharing-image' ),
				checked: data.preset || 'none',
			},
			{
				group: 'radio',
				classes: [ 'sharing-image-editor-radio' ],
				attributes: {
					name: name + '[preset]',
					value: 'excerpt',
				},
				label: __( 'Use post excerpt text', 'sharing-image' ),
				checked: data.preset || 'none',
			},
		],
		append: layer,
	} );

	fields[ fields.length ] = Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		help: __( 'You can use non-breaking spaces to manage your string position.', 'sharing-image' ),
		fields: [
			{
				group: 'textarea',
				classes: [ 'sharing-image-editor-textarea' ],
				content: data.content,
				attributes: {
					name: name + '[content]',
					rows: 2,
				},
				label: __( 'Content', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	// Helper function to toggle contols visibility.
	const toggleClasses = () => {
		fields.forEach( ( field ) => {
			field.classList.toggle( 'control-hidden' );
		} );
	};

	if ( checkbox.checked ) {
		toggleClasses();
	}

	checkbox.addEventListener( 'change', () => {
		toggleClasses();
	} );
}

/**
 * Text layer more options fields manager.
 *
 * @param {HTMLElement} layer Current layer element.
 * @param {string} name Fields name attribute prefix.
 * @param {Object} data Layer data object.
 */
function createMoreFields( layer, name, data ) {
	const fields = [];

	fields[ fields.length ] = createFontField( layer, name, data );

	fields[ fields.length ] = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-single', 'control-hidden' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-color' ],
				attributes: {
					type: 'color',
					name: name + '[color]',
					value: data.color || '#ffffff',
				},
				label: __( 'Color', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	fields[ fields.length ] = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-double', 'control-hidden' ],
		fields: [
			{
				group: 'select',
				classes: [ 'sharing-image-editor-select' ],
				options: {
					left: __( 'Left', 'sharing-image' ),
					center: __( 'Center', 'sharing-image' ),
					right: __( 'Right', 'sharing-image' ),
				},
				attributes: {
					name: name + '[horizontal]',
				},
				label: __( 'Horizontal alignment', 'sharing-image' ),
				selected: data.horizontal,
			},
			{
				group: 'select',
				classes: [ 'sharing-image-editor-select' ],
				options: {
					top: __( 'Top', 'sharing-image' ),
					center: __( 'Center', 'sharing-image' ),
					bottom: __( 'Bottom', 'sharing-image' ),
				},
				attributes: {
					name: name + '[vertical]',
				},
				label: __( 'Vertical alignment', 'sharing-image' ),
				selected: data.vertical,
			},
		],
		append: layer,
	} );

	const control = Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		append: layer,
	} );

	const button = Build.element( 'button', {
		classes: [ 'sharing-image-editor-more' ],
		text: __( 'More options', 'sharing-image' ),
		attributes: {
			type: 'button',
		},
		append: control,
	} );

	button.addEventListener( 'click', () => {
		fields.forEach( ( field ) => {
			field.classList.remove( 'control-hidden' );
		} );

		// Remove button on expand.
		layer.removeChild( control );
	} );

	// Open more fields for existing layers.
	if ( Object.keys( data ).length > 0 ) {
		button.click();
	}
}

/**
 * Create font field in text layer.
 *
 * @param {HTMLElement} layer Current layer element.
 * @param {string} name Fields name attribute prefix.
 * @param {Object} data Layer data object.
 */
function createFontField( layer, name, data ) {
	const control = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-upload', 'control-hidden' ],
		append: layer,
	} );

	params.fonts = params.fonts || {};

	const select = Build.select(
		{
			classes: [ 'sharing-image-editor-select' ],
			options: params.fonts,
			attributes: {
				name: name + '[fontname]',
			},
			label: __( 'Font family', 'sharing-image' ),
			selected: data.fontname,
		},
		control
	);

	const media = Build.media( {
		name: name + '[fontfile]',
		classes: [ 'sharing-image-editor-media' ],
		value: data.fontfile,
		link: params.links.uploads,
		labels: {
			button: __( 'Upload custom font', 'sharing-image' ),
			heading: __( 'Upload custom font', 'sharing-image' ),
			details: __( 'Font attachment', 'sharing-image' ),
			remove: __( 'Remove font', 'sharing-image' ),
		},
		remove: true,
		append: control,
	} );

	Build.element( 'small', {
		text: __( 'Custom font can only be in .ttf format.' ),
		append: control,
	} );

	if ( data.fontfile ) {
		select.setAttribute( 'disabled', 'disabled' );
	}

	// Find media attachment input.
	const input = media.querySelector( 'input' );

	input.addEventListener( 'change', () => {
		select.removeAttribute( 'disabled' );

		if ( input.value ) {
			select.setAttribute( 'disabled', 'disabled' );
		}
	} );

	return control;
}

/**
 * Rectangle layer outline option.
 *
 * @param {HTMLElement} layer Current layer element.
 * @param {string} name Fields name attribute prefix.
 * @param {Object} data Layer data object.
 */
function createRectangleOutline( layer, name, data ) {
	const control = Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		append: layer,
	} );

	const checkbox = Build.checkbox(
		{
			classes: [ 'sharing-image-editor-checkbox' ],
			attributes: {
				name: name + '[outline]',
				value: 'outline',
			},
			label: __( 'Outline rectangle.', 'sharing-image' ),
			checked: data.outline,
		},
		control
	);

	const range = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-hidden' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-range' ],
				attributes: {
					type: 'range',
					name: name + '[thickness]',
					min: 0,
					max: 50,
					step: 1,
					value: data.thickness || '0',
				},
				label: __( 'Border width', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	if ( data.outline ) {
		range.classList.remove( 'control-hidden' );
	}

	checkbox.addEventListener( 'change', () => {
		range.classList.add( 'control-hidden' );

		if ( checkbox.checked ) {
			range.classList.remove( 'control-hidden' );
		}
	} );
}

/**
 * Create catalog button in footer.
 *
 * @param {HTMLElement} footer Footer HTML element.
 */
function createCatalogButton( footer ) {
	const link = new URL( document.location.href );
	link.searchParams.delete( 'template' );

	Build.element( 'a', {
		classes: [ 'button' ],
		text: __( '← Back to Catalog', 'sharing-image' ),
		attributes: {
			href: link.href,
		},
		append: footer,
	} );
}

/**
 * Create template deletion button in footer.
 *
 * @param {HTMLElement} footer Footer HTML element.
 */
function createDeleteButton( footer ) {
	params.links = params.links || {};

	const href = new URL( document.location.href );

	// Get template index from current link.
	const index = href.searchParams.get( 'template' );

	// Set template index to delete link.
	const link = new URL( editor.getAttribute( 'action' ) );

	link.searchParams.set( 'action', 'sharing_image_delete' );
	link.searchParams.set( 'template', index );
	link.searchParams.set( 'nonce', params.nonce );

	Build.element( 'a', {
		classes: [ 'sharing-image-editor-delete' ],
		text: __( 'Delete template', 'sharing-image' ),
		attributes: {
			href: link.href,
		},
		append: footer,
	} );
}

/**
 * Create preview element.
 *
 * @param {HTMLElement} viewport Monitor viewport element.
 * @param {Object} data Template data object.
 */
function createPreview( viewport, data ) {
	preview = Build.element( 'div', {
		classes: [ 'sharing-image-editor-preview', 'preview-blank' ],
		append: viewport,
	} );

	if ( data.preview ) {
		Build.element( 'img', {
			attributes: {
				src: data.preview,
				alt: '',
			},
			append: preview,
		} );

		preview.classList.remove( 'preview-blank' );
	}

	Build.element( 'span', {
		classes: [ 'sharing-image-editor-loader' ],
		append: preview,
	} );

	Build.element( 'input', {
		attributes: {
			type: 'hidden',
			name: params.name + '[preview]',
			value: data.preview,
		},
		append: preview,
	} );

	return preview;
}

/**
 * Create button inside layer box to change order.
 *
 * @param {HTMLElement} designer Layers designer HTML element.
 * @param {HTMLElement} layer Current layer HTML emelemt.
 */
function createOrderLayersButton( designer, layer ) {
	const button = Build.element( 'button', {
		classes: [ 'sharing-image-editor-order' ],
		attributes: {
			type: 'button',
			title: __( 'Raise higher', 'sharing-image' ),
		},
		append: layer,
	} );

	button.addEventListener( 'click', () => {
		if ( layer.previousSibling ) {
			designer.insertBefore( layer, layer.previousSibling );
		}

		// Update fields name attributes.
		reorderLayers( designer );

		if ( editor.classList.contains( 'editor-suspend' ) ) {
			return;
		}

		generateTemplate();
	} );
}

/**
 * Create button to delete layer.
 *
 * @param {HTMLElement} designer Layers designer HTML element.
 * @param {HTMLElement} layer Current layer HTML emelemt.
 */
function createDeleteLayerButton( designer, layer ) {
	const control = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-footer' ],
		append: layer,
	} );

	const button = Build.element( 'button', {
		classes: [ 'sharing-image-editor-delete' ],
		text: __( 'Delete layer', 'sharing-image' ),
		attributes: {
			type: 'button',
		},
		append: control,
	} );

	button.addEventListener( 'click', () => {
		designer.removeChild( layer );

		// Update fields name attributes.
		reorderLayers( designer );

		if ( editor.classList.contains( 'editor-suspend' ) ) {
			return;
		}

		generateTemplate();
	} );
}

/**
 * Create image layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template layer data.
 */
function createLayerImage( index, data ) {
	const description = [];

	description.push( __( 'Use jpg, gif or png image formats.', 'sharing-image' ) );
	description.push( __( 'Leave width and height fields blank to use the original image size.', 'sharing-image' ) );
	description.push( __( 'Sizes are calculated proportionally if not filled.', 'sharing-image' ) );

	const layer = Build.layer( {
		classes: [ 'sharing-image-editor-layer', 'layer-image' ],
		label: __( 'Image', 'sharing-image' ),
		description: description.join( ' ' ),
	} );

	// Form fields name for this layer.
	const name = params.name + `[layers][${ index }]`;

	Build.element( 'input', {
		attributes: {
			type: 'hidden',
			name: name + '[type]',
			value: 'image',
		},
		append: layer,
	} );

	params.links = params.links || {};

	Build.media( {
		name: name + '[attachment]',
		classes: [ 'sharing-image-editor-control', 'control-details' ],
		value: data.attachment,
		link: params.links.uploads,
		labels: {
			button: __( 'Upload image', 'sharing-image' ),
			heading: __( 'Select layer image', 'sharing-image' ),
			details: __( 'Attachment details', 'sharing-image' ),
		},
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-grid' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					name: name + '[x]',
					value: data.x,
					placeholder: '10',
				},
				label: __( 'X starting point', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					name: name + '[y]',
					value: data.y,
					placeholder: '10',
				},
				label: __( 'Y starting point', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					name: name + '[width]',
					value: data.width,
				},
				label: __( 'Width', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					name: name + '[height]',
					value: data.height,
				},
				label: __( 'Height', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	return layer;
}

/**
 * Create text layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template data.
 */
function createLayerText( index, data ) {
	const description = [];

	description.push( __( 'Write a text to the current image.', 'sharing-image' ) );
	description.push( __( 'If the font does not fit within your limits, its size will decrease.', 'sharing-image' ) );
	description.push( __( 'Avoid using large font sizes for long text – this affects performance.', 'sharing-image' ) );

	const layer = Build.layer( {
		classes: [ 'sharing-image-editor-layer', 'layer-text' ],
		label: __( 'Text', 'sharing-image' ),
		description: description.join( ' ' ),
	} );

	// Form fields name for this layer.
	const name = params.name + `[layers][${ index }]`;

	Build.element( 'input', {
		attributes: {
			type: 'hidden',
			name: name + '[type]',
			value: 'text',
		},
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-grid' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					type: 'text',
					name: name + '[x]',
					value: data.x,
					placeholder: '10',
				},
				label: __( 'X starting point', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					type: 'text',
					name: name + '[y]',
					value: data.y,
					placeholder: '10',
				},
				label: __( 'Y starting point', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					type: 'text',
					name: name + '[width]',
					value: data.width,
					placeholder: '1000',
				},
				label: __( 'Width', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					type: 'text',
					name: name + '[height]',
					value: data.height,
				},
				label: __( 'Height', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	// Create static/dynamic text fields.
	createDynamicFields( layer, name, data );

	// Create more options.
	createMoreFields( layer, name, data );

	Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-double' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-range' ],
				attributes: {
					type: 'range',
					name: name + '[fontsize]',
					min: 10,
					max: 200,
					step: 1,
					value: data.fontsize || '48',
				},
				label: __( 'Font size', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-range' ],
				attributes: {
					type: 'range',
					name: name + '[lineheight]',
					min: 0,
					max: 4,
					step: 0.125,
					value: data.lineheight || '1.5',
				},
				label: __( 'Line height', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	return layer;
}

/**
 * Create filter layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template data.
 */
function createLayerFilter( index, data ) {
	const description = [];

	description.push( __( 'Filters are applied one after another to the entire editor image.', 'sharing-image' ) );
	description.push( __( 'If you want to control their order, create multiple layers.', 'sharing-image' ) );

	const layer = Build.layer( {
		classes: [ 'sharing-image-editor-layer', 'layer-text' ],
		label: __( 'Filter', 'sharing-image' ),
		description: description.join( ' ' ),
	} );

	// Form fields name for this layer.
	const name = params.name + `[layers][${ index }]`;

	Build.element( 'input', {
		attributes: {
			type: 'hidden',
			name: name + '[type]',
			value: 'filter',
		},
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		fields: [
			{
				group: 'checkbox',
				classes: [ 'sharing-image-editor-checkbox' ],
				attributes: {
					name: name + '[grayscale]',
					value: 'grayscale',
				},
				label: __( 'Turns image into a grayscale version', 'sharing-image' ),
				checked: data.grayscale,
			},
		],
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		fields: [
			{
				group: 'checkbox',
				classes: [ 'sharing-image-editor-checkbox' ],
				attributes: {
					name: name + '[blur]',
					value: 'blur',
				},
				label: __( 'Blur image by Gaussian effect', 'sharing-image' ),
				checked: data.blur,
			},
		],
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-range' ],
				attributes: {
					type: 'range',
					name: name + '[contrast]',
					min: -50,
					max: 50,
					step: 5,
					value: data.contrast || '0',
				},
				label: __( 'Contrast', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-range' ],
				attributes: {
					type: 'range',
					name: name + '[brightness]',
					min: -50,
					max: 50,
					step: 5,
					value: data.brightness || '0',
				},
				label: __( 'Brightness', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-range' ],
				attributes: {
					type: 'range',
					name: name + '[blackout]',
					min: 0,
					max: 100,
					step: 5,
					value: data.blackout || '0',
				},
				label: __( 'Blackout', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	return layer;
}

/**
 * Create rectangle layer.
 *
 * @param {number} index Current layer index.
 * @param {Object} data Current template data.
 */
function createLayerRectangle( index, data ) {
	const description = [];

	description.push( __( 'Draw a colored rectangle on current image.', 'sharing-image' ) );
	description.push( __( 'You can get filled or outlined figure with custom color and opacity.', 'sharing-image' ) );
	description.push( __( 'Use small height to draw the line.', 'sharing-image' ) );

	const layer = Build.layer( {
		classes: [ 'sharing-image-editor-layer', 'layer-text' ],
		label: __( 'Rectangle', 'sharing-image' ),
		description: description.join( ' ' ),
	} );

	// Form fields name for this layer.
	const name = params.name + `[layers][${ index }]`;

	Build.element( 'input', {
		attributes: {
			type: 'hidden',
			name: name + '[type]',
			value: 'rectangle',
		},
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-single' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-color' ],
				attributes: {
					type: 'color',
					name: name + '[color]',
					value: data.color || '#ffffff',
				},
				label: __( 'Rectangle color', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-grid' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					type: 'text',
					name: name + '[x]' || '10',
					value: data.x,
				},
				label: __( 'X starting point', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					type: 'text',
					name: name + '[y]' || '10',
					value: data.y,
				},
				label: __( 'Y starting point', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					type: 'text',
					name: name + '[width]',
					value: data.width,
				},
				label: __( 'Width', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					type: 'text',
					name: name + '[height]',
					value: data.height,
				},
				label: __( 'Height', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	createRectangleOutline( layer, name, data );

	Build.control( {
		classes: [ 'sharing-image-editor-control' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-range' ],
				attributes: {
					type: 'range',
					name: name + '[opacity]',
					min: 0,
					max: 100,
					step: 5,
					value: data.opacity || '0',
				},
				label: __( 'Opacity', 'sharing-image' ),
			},
		],
		append: layer,
	} );

	return layer;
}

/**
 * Create new layer.
 *
 * @param {HTMLElement} designer Designer HTML element.
 * @param {string} type New layer type.
 * @param {number} index Layer index.
 * @param {Object} data New layer data.
 */
function createLayer( designer, type, index, data = {} ) {
	let layer = null;

	switch ( type ) {
		case 'image':
			layer = createLayerImage( index, data );
			break;
		case 'text':
			layer = createLayerText( index, data );
			break;
		case 'filter':
			layer = createLayerFilter( index, data );
			break;
		case 'rectangle':
			layer = createLayerRectangle( index, data );
			break;
	}

	if ( null === layer ) {
		return;
	}

	designer.insertBefore( layer, designer.firstChild );

	reorderLayers( designer );

	// Delete this layer button.
	createDeleteLayerButton( designer, layer );

	// Reorder layers button.
	createOrderLayersButton( designer, layer );
}

/**
 * Create layers designer control.
 *
 * @param {HTMLElement} fieldset Fieldset HTML element.
 * @param {Object} data Current template data.
 */
function createDesigner( fieldset, data ) {
	const control = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-row', 'control-compact', 'control-pinned' ],
		fields: [
			{
				group: 'select',
				classes: [ 'sharing-image-editor-select' ],
				options: {
					text: __( 'Text', 'sharing-image' ),
					image: __( 'Image', 'sharing-image' ),
					filter: __( 'Filter', 'sharing-image' ),
					rectangle: __( 'Rectangle', 'sharing-image' ),
				},
			},
		],
		append: fieldset,
	} );

	const button = Build.element( 'button', {
		classes: [ 'button' ],
		text: __( 'Add new', 'sharing-image' ),
		attributes: {
			type: 'button',
		},
		append: control,
	} );

	const designer = Build.element( 'div', {
		classes: [ 'snaring-image-editor-designer' ],
		append: fieldset,
	} );

	// Set default layers set.
	let layers = data.layers || [];

	layers = layers.reverse();

	layers.forEach( ( layer, index ) => {
		if ( layer.hasOwnProperty( 'type' ) ) {
			createLayer( designer, layer.type, index++, layer );
		}
	} );

	button.addEventListener( 'click', () => {
		const select = control.querySelector( 'select' );

		if ( null === select ) {
			return;
		}

		createLayer( designer, select.value, designer.children.length );
	} );
}

/**
 * Create common template settings on template editor screen.
 *
 * @param {Object} data Current template data.
 */
function createFieldset( data ) {
	const fieldset = Build.element( 'div', {
		classes: [ 'sharing-image-editor-fieldset' ],
		append: editor,
	} );

	// Create template title control.
	Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-compact' ],
		help: __( 'Used only in the admin panel', 'sharing-image' ),
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					name: params.name + '[title]',
					value: data.title,
				},
				label: __( 'Template title', 'sharing-image' ),
			},
		],
		append: fieldset,
	} );

	// Create background settings with custom logic.
	createPermanentAttachment( fieldset, data );

	// Create width/height settings control.
	Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-grid', 'control-compact' ],
		fields: [
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					name: params.name + '[width]',
					value: data.width || '1200',
					placeholder: '1200',
				},
				label: __( 'Editor width', 'sharing-image' ),
			},
			{
				group: 'input',
				classes: [ 'sharing-image-editor-input' ],
				attributes: {
					name: params.name + '[height]',
					value: data.height || '630',
					placeholder: '630',
				},
				label: __( 'Editor height', 'sharing-image' ),
			},
		],
		append: fieldset,
	} );

	const description = [];

	description.push( __( 'You can add multiple layers on your editor.', 'sharing-image' ) );
	description.push( __( 'Note that the stacking order of the layers is important.', 'sharing-image' ) );
	description.push( __( 'You can change the order using the arrows in the corner of each box.', 'sharing-image' ) );

	Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-pinned' ],
		label: __( 'Add layers', 'sharing-image' ),
		description: description.join( ' ' ),
		append: fieldset,
	} );

	// Create layers designer block.
	createDesigner( fieldset, data );

	const footer = Build.control( {
		classes: [ 'sharing-image-editor-control', 'control-overlined' ],
		append: fieldset,
	} );

	// Create back to catalog button.
	createCatalogButton( footer );

	// Create template deletion button.
	createDeleteButton( footer );

	fieldset.addEventListener( 'change', ( e ) => {
		if ( editor.classList.contains( 'editor-suspend' ) ) {
			return;
		}

		const target = e.target;

		if ( target.hasAttribute( 'name' ) ) {
			generateTemplate();
		}
	} );
}

/**
 * Create button to submit editor form.
 *
 * @param {HTMLElement} manager Manager element.
 */
function createSubmitButton( manager ) {
	Build.element( 'button', {
		text: __( 'Save changes', 'sharing-image' ),
		classes: [ 'button', 'button-primary' ],
		attributes: {
			type: 'submit',
		},
		append: manager,
	} );
}

/**
 * Create button to generate new template manually.
 *
 * @param {HTMLElement} manager Manager element.
 */
function createGenerateButton( manager ) {
	const button = Build.element( 'button', {
		text: __( 'Generate preview', 'sharing-image' ),
		classes: [ 'button' ],
		attributes: {
			type: 'button',
		},
		append: manager,
	} );

	button.addEventListener( 'click', () => {
		generateTemplate();
	} );
}

/**
 * Create disable live-reloading checkbox.
 *
 * @param {HTMLElement} manager Manager element.
 * @param {Object} data Template data.
 */
function createSuspendCheckbox( manager, data ) {
	const checkbox = Build.checkbox(
		{
			classes: [ 'sharing-image-editor-suspend' ],
			attributes: {
				name: params.name + '[suspend]',
				value: 'suspend',
			},
			label: __( 'Disable live-reload', 'sharing-image' ),
			checked: data.suspend,
		},
		manager
	);

	if ( data.suspend ) {
		editor.classList.add( 'editor-suspend' );
	}

	checkbox.addEventListener( 'change', () => {
		editor.classList.remove( 'editor-suspend' );

		if ( checkbox.checked ) {
			editor.classList.add( 'editor-suspend' );
		}
	} );
}

/**
 * Create template settings preview.
 *
 * @param {Object} data Current template data.
 */
function createMonitor( data ) {
	const monitor = Build.element( 'div', {
		classes: [ 'sharing-image-editor-monitor' ],
		append: editor,
	} );

	const viewport = Build.element( 'div', {
		classes: [ 'sharing-image-editor-viewport' ],
		append: monitor,
	} );

	createPreview( viewport, data );

	Build.element( 'div', {
		classes: [ 'sharing-image-editor-warning' ],
		append: viewport,
	} );

	const manager = Build.element( 'div', {
		classes: [ 'sharing-image-editor-manager' ],
		append: viewport,
	} );

	// Create live-reload manager checkbox.
	createSuspendCheckbox( manager, data );

	// Create submit form button.
	createSubmitButton( manager );

	// Create template generator button.
	createGenerateButton( manager );
}

/**
 * Create form hidden settings fields.
 *
 * @param {HTMLElement} form Settings form element.
 * @param {number} index Current option index.
 */
function prepareEditor( form, index ) {
	form.classList.add( 'sharing-image-editor' );

	Build.element( 'input', {
		attributes: {
			type: 'hidden',
			name: 'action',
			value: params.name,
		},
		append: form,
	} );

	Build.element( 'input', {
		attributes: {
			type: 'hidden',
			name: 'sharing_image_index',
			value: index,
		},
		append: form,
	} );

	Build.element( 'input', {
		attributes: {
			type: 'hidden',
			name: 'sharing_image_nonce',
			value: params.nonce,
		},
		append: form,
	} );

	form.addEventListener( 'submit', ( e ) => {
		e.preventDefault();

		saveTemplate();
	} );

	return form;
}

/**
 * Create template editor page.
 *
 * @param {HTMLElement} form Settings form element.
 * @param {Object} object Global object field.
 * @param {number} index Current option index.
 * @param {Object} data Template data.
 */
function createEditor( form, object, index, data = {} ) {
	params = object;

	// Set params name for template form fields.
	params.name = 'sharing_image_editor';

	// Prepare form with hidden fields and events.
	editor = prepareEditor( form, index );

	// Create monitor section part.
	createMonitor( data );

	// Create fieldset section part.
	createFieldset( data );
}

export default createEditor;