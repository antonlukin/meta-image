import buildElement from './element.js';

/**
 * Helper to create radio field.
 *
 * @param {Object} args List of control options.
 * @param {HTMLElement} parent Parent HTML element to append this field.
 */
function buildRadio( args, parent ) {
	const field = buildElement( 'label', {
		classes: args.classes || [],
		append: parent,
	} );

	const radio = buildElement( 'input', {
		attributes: {
			type: 'radio',
		},
		append: field,
	} );

	// Set attributes
	if ( args.hasOwnProperty( 'attributes' ) ) {
		for ( const key in args.attributes ) {
			radio.setAttribute( key, args.attributes[ key ] );
		}
	}

	if ( args.hasOwnProperty( 'checked' ) ) {
		const checked = args.checked;

		if ( checked && checked === radio.value ) {
			radio.setAttribute( 'checked', 'checked' );
		}
	}

	if ( args.hasOwnProperty( 'label' ) ) {
		buildElement( 'span', {
			text: args.label,
			append: field,
		} );
	}

	return radio;
}

export default buildRadio;
