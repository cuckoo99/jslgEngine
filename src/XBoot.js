/**
 *
 * @author cuckoo99 
 */
var o = this.jslgEngine = this.jslgEngine||{};

jslgEngine.boot = function(data) {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

	var innerWidth = 640, innerHeight = 480;

	var exData = data||{};
	var xml = exData.xml;

	var iconController, mainController, converter, connector, options;
	var xModelController;
	var timerLimit = 220;
	
	var controls;
	
	//var projector = new THREE.Projector();
	var container, stats;
	var camera, scene, renderer, objects, loader;
	var particleLight, pointLight;
	var windowHalfX = innerWidth / 2;
	var windowHalfY = innerHeight / 2;
	var clock = new THREE.Clock();
	var mouseX = 0, mouseY = 0;

	//表示先の作成
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	
	//シーン作成
	scene = new THREE.Scene();
	
	//カメラなど環境設定	
	camera = new THREE.PerspectiveCamera( 50, innerWidth / innerHeight, 0.1, 20000 );
	camera.position.set( 2, 10, 100 );
	//camera.position.set( 2, 4, 5 );
	
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
	mainController = new jslgEngine.controller.MainController({
		fileControllers : [xModelController, xTextureController]
	});
	iconController = new jslgEngine.controller.XIconController({
		camera : camera,
		mainController : mainController,
		iconFactory : new jslgEngine.model.factory.JSlgXIconFactory(),
		commandFactory : new jslgEngine.model.factory.JSlgCommandFactory(),
		scene : scene,
		container : container,
		stageViewOffset : {x:0,y:0,z:0}
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
		//TODO: Making ScrollButtons
		//jslgEngine.build(connector_s, {}, options);
		
		mainController.updateIconsAll(connector, {}, options);
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
		renderer.setSize(innerWidth, innerHeight);
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
	
		// alternate projector
		//projector.unprojectVector( vector, camera );

		//var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
		var raycaster = new THREE.Raycaster();
		var mouse = new THREE.Vector2();

		//mouse.x = (event.clientX / render.domElement.width) * 2 - 1;
		//mouse.y = - (event.clientY / render.domElement.height) * 2 + 1;
		mouse.x = vector.x;
		mouse.y = vector.y;
		raycaster.setFromCamera(mouse, camera);

		var intersects = raycaster.intersectObjects( scene.children );

		if (intersects.length > 0) {
			var name = intersects[0].object.name;
			jslgEngine.log('kicked : '+name);
			
			mainController.kick({
				key : name
			}, options);	
			//intersects[0].object.material.color.setHex( Math.random() * 0xffffff );

			// var particle = new THREE.Particle( particleMaterial );
			// particle.position = intersects[ 0 ].point;
			// particle.scale.x = particle.scale.y = 8;
			// scene.add( particle );
		}
	};
	
	function onWindowResize( command ) {
		windowHalfX = innerWidth / 2;
		windowHalfY = innerHeight / 2;

		camera.aspect = innerWidth / innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( innerWidth, innerHeight );
	}

	function animate() {
    		controls.update();
		requestAnimationFrame( animate );
		render();
		stats.update();
	}
	
	function onDocumentMouseDown( e ) {

		e.preventDefault();

		// 中心からの距離プラスマイナス1
		var vector = new THREE.Vector3( ( e.clientX / innerWidth ) * 2 - 1, - ( e.clientY / innerHeight ) * 2 + 1, 0.5 );

		// test
		console.log('hoge'+vector.x);
		camera.position.x += vector.x*100;
		camera.position.y += vector.y*100;

		checkIntersect(vector);
	}

	function onDocumentMouseMove( command ) {

		mouseX = ( command.clientX - windowHalfX ) / 2;
		mouseY = ( command.clientY - windowHalfY ) / 2;

	}
	
	function render() {

		var timer = Date.now() * 0.0005;

		// camera.position.set( 2, 30, 100 );
		// camera.rotation.set( -0.4, 0, 0 );

		// camera.position.x += ( mouseX - camera.position.x ) * .05;
		// camera.position.y += ( - mouseY - camera.position.y ) * .05;
		// camera.lookAt( scene.position );
		
		//camera.position.set( 2, 0, 15 );
		
		renderer.render( scene, camera );
	}
};
