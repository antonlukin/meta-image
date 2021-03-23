import buildElement from './element.js';

/**
 * Helper to create radio field.
 *
 * @param {Object} args List of control options.
 * @param {HTMLElement} parent Parent HTML element to append this field.
 */
function buildCheckbox( args, parent ) {
	const field = buildElement( 'label', {
		classes: args.classes || [],
		append: parent,
	} );

	const checkbox = buildElement( 'input', {
		attributes: {
			type: 'checkbox',
		},
		append: field,
	} );

	// Set attributes
	if ( args.hasOwnProperty( 'attributes' ) ) {
		for ( const key in args.attributes ) {
			checkbox.setAttribute( key, args.attributes[ key ] );
		}
	}

	if ( args.hasOwnProperty( 'checked' ) ) {
		const checked = args.checked;

		if ( checked && checked === checkbox.value ) {
			checkbox.setAttribute( 'checked', 'checked' );
		}
	}

	if ( args.hasOwnProperty( 'label' ) ) {
		buildElement( 'span', {
			text: args.label,
			append: field,
		} );
	}

	return checkbox;
}

export default buildCheckbox;
