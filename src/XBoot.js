/**
 *
 * @author cuckoo99 
 */
var o = this.jslgEngine = this.jslgEngine||{};

jslgEngine.boot = function(data) {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	
	var exData = data||{};
	var xml = exData.xml;

	var iconController, mainController, converter, connector, options;
	var xModelController;
	var timerLimit = 220;
	
	var controls;
	
	var projector = new THREE.Projector();
	var container, stats;
	var camera, scene, renderer, objects, loader;
	var particleLight, pointLight;
	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	var clock = new THREE.Clock();
	var mouseX = 0, mouseY = 0;

	//表示先の作成
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	//シーン作成
	scene = new THREE.Scene();
	
	//カメラなど環境設定	
	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 20000 );
	camera.position.set( 2, 4, 5 );
	
	scene.fog = new THREE.FogExp2( 0x000000, 0.005 );

	//エンジンの設定
	//モデルローダの作成
	xModelController = new jslgEngine.controller.JSONModelFileController({
		loader : new THREE.JSONLoader()
	});
	//テクスチャローダの作成
	xTextureController = new jslgEngine.controller.TextureFileController({
		loader : new THREE.TextureLoader()
	});
	iconController = new jslgEngine.controller.XIconController({
		camera : camera,
		mainController : mainController,
		iconFactory : new jslgEngine.model.factory.JSlgXIconFactory(),
		commandFactory : new jslgEngine.model.factory.JSlgCommandFactory(),
		scene : scene,
		container : container
	});
	mainController = new jslgEngine.controller.MainController({
		fileControllers : [xModelController, xTextureController]
	});
	converter = iconController.converter;
	connector = mainController.connector;
	options = {
		mainController : mainController,
		iconController : iconController,
		converter : converter
	};
	if(xml) {
  		var parser = new DOMParser();
		var xmlDoc = parser.parseFromString(xml.replace(/>[ |\t|\r|\n]*</g, "><"),
				"text/xml");
		
		var region = mainController.getWorldRegion();
		region.setKey('w1');
		converter.map({
			data : xmlDoc,
			mainController : mainController
		});
	}
	
	//モデルを追加
	mainController.load(connector, {}, options);
	connector.pipe(function(connector_s) {
		if(!xml) {
			jslgEngine.makeSampleElements({
				width : 6,
				height : 6,
				depth : 1,
				viewOptions : {
					stageViewOffset : {x:0,y:0,z:0}
				}
			}, options);
		}
		connector_s.resolve();
		jslgEngine.build(connector_s, {}, options);
		
		mainController.ticker.unlockAnimation();

		//光の追加
		scene.add( new THREE.AmbientLight( 0xcccccc ) );
		
		// var geometry = new THREE.CubeGeometry( 20, 20, 20 );
		// var material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors } );
		// var cube = new THREE.Mesh( geometry, material );
		// cube.position.y = 20;
		// scene.add( cube );
		
		//var pointLight = new THREE.DirectionalLight( 0xffffff, 1 );  // 白、強さ1
		//pointLight.position.set(100,100,100).normalize();
		
		var pointLight = new THREE.PointLight( 0xffffff, 5, 1000 );
		pointLight.position.set( 10, 50, 10 );
		scene.add( pointLight );
	
		//光の追加
		// var pointLight2 = new THREE.SpotLight( 0xffffff, 5, 130, Math.PI/2, 1 );
		// pointLight2.target.position = new THREE.Vector3(0,10,0);
		// //pointLight.position.set( 10, 50, 10 );
		// pointLight2.position = camera.position;
		// pointLight2.rotation = camera.rotation;
		// scene.add( pointLight2 );
	
		//レンダラの設定
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);
	
		//画面ステータスの設定
		stats = new Stats();
		container.appendChild(stats.domElement);
	
		//イベントの追加
		window.addEventListener( 'resize', onWindowResize, false );
		//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		
   		controls = new THREE.OrbitControls(camera, renderer.domElement);

		animate();
	});
	
	/**
	 * .
	 *
	 * @name _getIntersectedObjects
	 * @method
	 * @function
	 * @memberOf jslgEngine.controller.XIconController#
	 * @param {Object} key
	 * @param {Boolean} is_visible
	 * @param {Number} alpha
	 **/
	function checkIntersect(vector) {
		var self = this;
		
		projector.unprojectVector( vector, camera );

		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

		var intersects = raycaster.intersectObjects( scene.children );

		if (intersects.length > 0) {
			var name = intersects[0].object.name;
			jslgEngine.log('kicked : '+name);
			
			iconController.get({
				key : name,
				callback : function(icon) {
					if(icon) {
						icon.info.onClick({
							target : {
								name : name
							}
						}, options);
						mainController.kick({
							key : name,
							x : location.x,
							y : location.y,
							z : location.z
						}, options);
					} else {
						jslgEngine.log(name+' icon is not found');
					}
				}
			});
			
			//intersects[0].object.material.color.setHex( Math.random() * 0xffffff );

			// var particle = new THREE.Particle( particleMaterial );
			// particle.position = intersects[ 0 ].point;
			// particle.scale.x = particle.scale.y = 8;
			// scene.add( particle );
		}
	};
	
	function onWindowResize( command ) {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function animate() {
    	controls.update();
		requestAnimationFrame( animate );
		render();
		stats.update();
	}
	
	function onDocumentMouseDown( command ) {

		command.prcommandDefault();

		var vector = new THREE.Vector3( ( command.clientX / window.innerWidth ) * 2 - 1, - ( command.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		
		checkIntersect(vector);
	}

	function onDocumentMouseMove( command ) {

		mouseX = ( command.clientX - windowHalfX ) / 2;
		mouseY = ( command.clientY - windowHalfY ) / 2;

	}
	
	function render() {

		var timer = Date.now() * 0.0005;

		camera.position.set( 2, 30, 100 );
		camera.rotation.set( -0.4, 0, 0 );

		// camera.position.x += ( mouseX - camera.position.x ) * .05;
		// camera.position.y += ( - mouseY - camera.position.y ) * .05;
		// camera.lookAt( scene.position );
		
		//camera.position.set( 2, 0, 15 );
		
		renderer.render( scene, camera );
	}
};