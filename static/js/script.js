var container;


function applyCanvasBackground( tileImg ){

	$( container + ' .background' ).css( {
		backgroundImage: 'url(' + tileImg.attr( 'src' ) + ')'
	} );

	$( container ).removeClass( 'selected' );
}


$( document ).ready( function(  ){

	
	$( '#simulator-container .hover' ).hover( function( e ){
		// console.log( test.type );

		var part = $( this ).data( 'part' );

		if( e.type === 'mouseenter' )
			$( '#simulator-container #' + part + '-container' ).addClass( 'hover' );
		else if( e.type === 'mouseleave' )
			$( '#simulator-container #' + part + '-container' ).removeClass( 'hover' );


	} );

	$( '#simulator-container .hover' ).click( function( e ){


		var part = $( this ).data( 'part' );
		container = '#simulator-container #' + part + '-container';

		if( !$( container ).hasClass( 'selected' ) ){
			$( '#simulator-container .container.selected' ).removeClass( 'selected' );
			$( container ).addClass( 'selected' );

			$( '#selected-text' ).html( part );

		}else{
			$( container ).removeClass( 'selected' );
			$( '#selected-text' ).html( '' );
		}
		
	} );


	


	

} );