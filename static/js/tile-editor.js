var tileContainer = [];
var tileCanvas = [];

var nMask = {
	loaded 		: 0,
	total 		: 0
};

var masks = [
	initializeMaskPerTile( 0, 3 ),
	initializeMaskPerTile( 1, 1 ),
	initializeMaskPerTile( 2, 1 ),
	initializeMaskPerTile( 3, 2 )
];






function getTileContainer( iTile ){
	return '#tile-editor-container-' + iTile;
}

function getCanvasBackground( iTile ){
	return $( getTileContainer( iTile ) + ' .tile-editor-background' )[0];
}

function getCanvasGrout( iTile ){
	return $( getTileContainer( iTile ) + ' .tile-editor-grout' )[0];
}

function getCanvasMask( iTile, mask ){
	return $( getTileContainer( iTile ) + ' .tile-editor-' + mask )[0];
}

function getCanvasSet( iTile ){
	var tempBackground = getCanvasBackground( iTile );
	var tempGrout = getCanvasGrout( iTile )
	var tempMasks = [];

	for( var i = 0; i < masks[iTile].length; i++ ){
		tempMasks[i] = getCanvasMask( iTile, 'pattern-' + i );
	}

	return {
		background 		: tempBackground,
		masks 			: tempMasks,
		grout 			: tempGrout
	};
}


function initializeMaskPerTile( iTile, maskCount ){
	var tileMask = [];

	for( var i = 0; i < maskCount; i++ ){
		tileMask[i] = loadMask( iTile, i );
	}

	nMask.total += maskCount;

	return tileMask;
}

function loadMask( iTile, iMask ){
	var imgClip = new Image(  );
	imgClip.setAttribute( 'crossOrigin', 'anonymous' );
	imgClip.src = 'static/assets/tiles/masks/tile' + iTile + '_' + iMask + '.png';

	$( imgClip ).ready( function(  ){
		nMask.loaded++;
	} );

	return imgClip; 
}

function drawDefaultCanvas( iTile ){

	drawBackground( iTile, $( tileCanvas[iTile].background ).data( 'value' ) );

	for( var i = 0; i < tileCanvas[iTile].masks.length; i++ ){
		drawColoredMask( iTile, i, $( tileCanvas[iTile].masks[i] ).data( 'value' ) );
	}

	drawGrout( iTile, $( tileCanvas[iTile].grout ).data( 'value' ), 1 );
}

function drawColoredMask( iTile, iMask, color ){
	
	var canvas = tileCanvas[iTile].masks[iMask];
	var ctx = canvas.getContext( '2d' );

	ctx.clearRect( 0, 0, canvas.width, canvas.height );

	var imgClip = masks[iTile][iMask];

	// $( imgClip ).ready( function(  ){
		ctx.drawImage( imgClip, 0, 0, canvas.width, canvas.height );

		ctx.globalCompositeOperation = 'source-in';

		ctx.fillStyle = color;
		ctx.fillRect( 0, 0, canvas.width, canvas.height );

		ctx.globalCompositeOperation = 'source-over';

		applyCanvas( iTile );
		
	// } );
}

function drawBackground( iTile, color ){
	var canvas = tileCanvas[iTile].background;
	var ctx = canvas.getContext( '2d' );

	ctx.clearRect( 0, 0, canvas.width, canvas.height );

	ctx.fillStyle = color;
	ctx.fillRect( 0, 0, canvas.width, canvas.height );

	applyCanvas( iTile );
}

function drawGrout( iTile, color, weight ){
	var canvas = tileCanvas[iTile].grout;
	var ctx = canvas.getContext( '2d' );

	ctx.clearRect( 0, 0, canvas.width, canvas.height );



	ctx.beginPath(  );
	ctx.moveTo( ( canvas.width/2 ) - 1, 0 );
	ctx.lineTo( ( canvas.width/2 ) - 1, canvas.width );

	ctx.strokeStyle = color;
	ctx.lineWidth = weight;

	ctx.stroke(  );


	ctx.beginPath(  );
	ctx.moveTo( 0, ( canvas.height/2 ) - 1 );
	ctx.lineTo( canvas.width, ( canvas.height/2 ) - 1 );

	ctx.strokeStyle = color;
	ctx.lineWidth = weight;

	ctx.stroke(  );


	ctx.rect( 0, 0, canvas.width, canvas.height );
	ctx.stroke(  );

	applyCanvas( iTile );


}

function applyCanvas( iTile ){
	var canvas = $( '<canvas width="150" height="150"></canvas>' )[0];
	var ctx = canvas.getContext( '2d' );


	// STEP 1 - Draw Background
	ctx.drawImage( tileCanvas[iTile].background, 0, 0, canvas.width, canvas.height );

	// STEP 2 - Draw Masks
	for( var i = 0; i < tileCanvas[iTile].masks.length; i++ )
		ctx.drawImage( tileCanvas[iTile].masks[i], 0, 0, canvas.width, canvas.height );

	// STEP 3 - Draw Grout
	ctx.drawImage( tileCanvas[iTile].grout, 0, 0, canvas.width, canvas.height );


	$( '#tile-container .tile' )[iTile].src = canvas.toDataURL(  );



	// TODO: Put to sript.js
	applyCanvasBackground( $( $( '#tile-container .tile' )[iTile] ) );
}




$( document ).ready( function(  ){

	$( '.tile-editor-container' ).each( function( iTile ){
		tileContainer[iTile] = $( getTileContainer( iTile ) );
		tileCanvas[iTile] = getCanvasSet( iTile );
	} );

	
	$( '.colors-container .color' ).each( function(  ){
		$( this ).css( {
			background: $( this ).data( 'color' )
		} )
	} );



	$( '#tile-container .tile' ).click( function( e ){

		if( container != undefined ){

			// TODO: Put in script.js
			applyCanvasBackground( $( this ) );

			

			$( '#tile-editor-wrapper' ).removeClass( 'selection' );
			$( '#tile-editor-wrapper' ).addClass( 'editor' );

			var iTile = $( this ).data( 'itile' );

			tileContainer[iTile].addClass( 'selected' );


			if( !$( this ).hasClass( 'selected' ) ){

				$( this ).addClass( 'selected' );
				drawDefaultCanvas( iTile );
			}


		}else{
			alert( 'Please select a floor or wall to proceed' );
		}


	} )


	$( '.colors-container .color' ).click( function( e ){

		var iTile = $( this ).parents( '.tile-editor-container' ).data( 'itile' );
		var part = $( this ).parent(  ).data( 'part' );


		if( part === 'grout' ){
			drawGrout( iTile, $( this ).data( 'color' ), 1 );


		}else if( part === 'background' ){
			drawBackground( iTile, $( this ).data( 'color' ) );
		}else{

			drawColoredMask( 
				iTile,
				part,
				$( this ).data( 'color' )
			);
		}


	} );




	$( '.tile-editor-finish-button' ).click( function( e ){
		$( '#tile-editor-wrapper' ).removeClass( 'editor' );
		$( '#tile-editor-wrapper' ).addClass( 'selection' );

		$( '.tile-editor-container' ).removeClass( 'selected' );

	} )


} );