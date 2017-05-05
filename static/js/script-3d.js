var values;
var container;



function initialize(  ){
	// Initialize Values
	values = {
		canvas: {
			width: window.innerWidth * 0.66,
			height: window.innerHeight
		},
		half: {},
		mouse: {}
	}

	values.half = {
		width : values.canvas.width / 2,
		height : values.canvas.height / 2
	}

	values.mouse.x = getMouseXValue( window.innerWidth * 0.66 / 2 );
	values.mouse.y = getMouseYValue( window.innerHeight / 2 );

	values.raycast = new THREE.Vector2(  );

}

$( document ).ready( function(  ){
	
	initialize(  );

	var scene = new THREE.Scene(  );
	var camera = new THREE.PerspectiveCamera( 75, values.canvas.width / values.canvas.height, 0.1, 1000 );

	var wallGroup = new THREE.Group(  );
	var roomGroup = new THREE.Group(  );

	var renderer = new THREE.WebGLRenderer(  );
	renderer.setSize( values.canvas.width, values.canvas.height );

	$( renderer.domElement ).attr( 'id', 'canvas3d' );
	$( '.row-container' ).append( renderer.domElement );

	var texture = new THREE.TextureLoader(  ).load( 'static/assets/tiles/tile0.jpg' );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 3, 3 );


	// var geometry = new THREE.BoxBufferGeometry( 200,200,200 );
	var material = new THREE.MeshLambertMaterial( {
		map: texture,
		transparent: true
	} );


	var geometry = new THREE.BoxGeometry( 25, 25, 1 );
	var cube = new THREE.Mesh( geometry, material );
	wallGroup.add( cube );


	cube = new THREE.Mesh( geometry, material );
	cube.rotation.y = Math.PI / 2;
	cube.position.x = 12.5;
	cube.position.z = 12.5;

	wallGroup.add( cube );


	material = new THREE.MeshLambertMaterial( {
		map: texture,
		transparent: true
	} );
	cube = new THREE.Mesh( geometry, material );
	cube.rotation.x = Math.PI / 2;
	cube.position.y = -12.5;
	cube.position.z = 12.5;

	wallGroup.add( cube );




	roomGroup.add( wallGroup );
	scene.add( roomGroup );


	camera.position.z = 50;
	wallGroup.rotation.y = 0.5;
	wallGroup.rotation.x = 0.2;

	// Light
	var directionalLight = new THREE.DirectionalLight( '#fff', 1 );
	directionalLight.position.set( 1, 30, 30 ).normalize(  );
	scene.add( directionalLight );


	var ambientLight = new THREE.AmbientLight( 0x404040, 0.8 );
	scene.add( ambientLight );


	// Raycaster
	var raycaster = new THREE.Raycaster(  );


	function render(  ){
		requestAnimationFrame( render );


		roomGroup.rotation.y += ( values.mouse.x - roomGroup.rotation.y ) * .05;
		roomGroup.rotation.x = THREE.Math.clamp( roomGroup.rotation.x + ( - values.mouse.y - roomGroup.rotation.x ) * .05, 0, 1000 );

		// Move entire room
		// camera.position.x += ( values.mouse.x - camera.position.x ) * .05;
		// camera.position.y = THREE.Math.clamp( camera.position.y + ( - values.mouse.y - camera.position.y ) * .05, 0, 1000 );
		// camera.lookAt( scene.position );



		renderer.render( scene, camera );
	}
	render(  );

	window.texture = texture;

	window.wallGroup = wallGroup;
	window.camera = camera;
	window.cube = cube;




	$( '#canvas3d' ).mousemove( function( e ){
		values.mouse.x = getMouseXValue( e.offsetX );
		values.mouse.y = getMouseYValue( e.offsetY );
		// console.log( e.offsetX + ", " + e.offsetY );


		values.raycast.x = ( e.offsetX / values.canvas.width ) * 2 - 1;
		values.raycast.y = - ( e.offsetY / values.canvas.height ) * 2 + 1;
	} );

	$( '#canvas3d' ).click( function( e ){
		// Raycast
		raycaster.setFromCamera( values.raycast, camera );

		var intersects = raycaster.intersectObjects( wallGroup.children );

		if( intersects.length >= 1 ){

			if( intersects[0].object == container ){
				container.material.opacity = 1;
				container = undefined;

			}else{
				if( container != undefined )
					container.material.opacity = 1;
				
				intersects[0].object.material.opacity = 0.5;
				container = intersects[0].object;
			}

		}else{
			container.material.opacity = 1;
			container = undefined;
		}
	} );

	// $( '#tile-container .tile' ).click( function(  ){
	// 	if( values.selected != undefined ){
			
	// 		values.selected.material.map = loadTexture( $( this ) );


	// 	}else{
	// 		alert( 'Please select a floor or wall to proceed' );
	// 	}

	// } );


} );

function getMouseXValue( x ){
	return ( x - values.half.width ) / 600;
}

function getMouseYValue( y ){
	return ( y - values.half.height ) / 200;
}


function loadTexture( img ){

	var texture = new THREE.TextureLoader(  ).load( img.attr( 'src' ) );
	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 3, 3 );

	return texture;


}

function applyCanvasBackground( tileImg ){
	container.material.opacity = 1;
	container.material.map = loadTexture( tileImg );
	
}