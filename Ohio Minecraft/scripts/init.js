let Engine, Scene, Camera, Light


function CreateGame(){

	Canvas = CreateCanvas()
	document.body.appendChild(Canvas)

	Engine = new BABYLON.Engine(Canvas, true)

	Scene = (()=>{
		let scene = new BABYLON.Scene(Engine)
		
		scene.onPointerDown = (e)=>{
			if (e.button==2) {
				if (Engine.isPointerLock) PlaceBlock()
			}
			if (e.button==1) Engine.exitPointerlock()
			if (e.button==0) {
				if (Engine.isPointerLock) BreakBlock()
				Engine.enterPointerlock()
			}
		}

		scene.registerBeforeRender = ()=> FrustumCulling()

		// reducing fuccking lag
		scene.autoClear = false; 
		scene.autoClearDepthAndStencil = false; 		
		scene.blockMaterialDirtyMechanism = true;
		// scene.performancePriority = BABYLON.ScenePerformancePriority.Intermediate
		
		return scene
	})()

	Camera = CreateCamera()

	Scene.onKeyboardObservable.add(e=>{
		if (e.type==BABYLON.KeyboardEventTypes.KEYDOWN){
			if (/[wasd]/i.test(e.event.key)){
				let direction = Camera.cameraDirection
				ReplaceChunkX(direction.x>0 ? "d":"a")
				ReplaceChunkZ(direction.z<0 ? "w":"s")
			}

			if (/[1-9]/.test(e.event.key)){
				Hotbar.forEach(slot=>{
					slot.Picked = false
					slot.getContext('2d').clearRect(0,0,slot.width, slot.height)
				})
				Hotbar[e.event.key-1].Picked = true
				Hotbar[e.event.key-1].getContext('2d').fillStyle = "black"
				Hotbar[e.event.key-1].getContext('2d').globalAlpha = 0.5
				Hotbar[e.event.key-1].getContext('2d').fillRect(0,0,Hotbar[e.event.key-1].width, Hotbar[e.event.key-1].height)
				Hotbar[e.event.key-1].getContext('2d').globalAlpha = 1
			}
		}
	})


	InitBlocks()
	CreateUI()
	Start()

	Engine.runRenderLoop(()=>Main())
}

function CreateCanvas(){

	let canvas = document.createElement("canvas")
	canvas.style = "position: absolute; top: 0; bottom:0; left: 0; right:0; margin: auto; background: lightblue"
	canvas.width = document.documentElement.clientWidth
	canvas.height = document.documentElement.clientHeight
	return canvas
}

function CreateCamera(){

	let camera = new BABYLON.FreeCamera("camera1", Settings.POVStartPosition, Scene)
	camera.setTarget(new BABYLON.Vector3.Zero())

	camera.attachControl(Canvas, true)
	camera.keysUp = [87]
	camera.keysDown = [83]
	camera.keysLeft = [65]
	camera.keysRight = [68]

	camera.speed = 10
	camera.inertia = 0.1
	camera.angularSensibility = 800
	camera.rotation.y = Math.PI
	camera.rotation.x = Math.PI/2
	camera.collisionsEnabled = true
	camera.checkCollisions = true

	return camera
}


function CreateUI(){

	crosshair = document.createElement("div")
	crosshair.style = `position: absolute; top:0; right:0; left:0; bottom:0; margin: auto; 
		background: url('assets/crosshair.png'); background-size: 100% 100%; user-select: none; display: none`
	crosshair.style.width = crosshair.style.height = document.documentElement.clientHeight/5
	document.body.appendChild(crosshair)


	let width = document.documentElement.clientWidth/20
	let offset = 9/2*width
	let _blocks = Blocks.filter(i=>i.Usable)
	Hotbar= []
	for (var i=0;i<9;i++){
		let slot = document.createElement("canvas")
		slot.style = "position: absolute; margin: auto; border: 5px solid white;"

		if (_blocks[i])
			slot.style.backgroundImage = `url('${_blocks[i].Sprite ? _blocks[i].Sprite.Texture:(_blocks[i].DisplayImage ? _blocks[i].DisplayImage:_blocks[i].Texture)}')`
		slot.style.backgroundSize = "100% 100%"

		slot.width = slot.height = width
		slot.style.top = document.documentElement.clientHeight-10-width
		slot.style.left = document.documentElement.clientWidth/2-offset+i*width+i*5

		if (_blocks[i]) slot.Name = _blocks[i].Name
		slot.Picked = false

		document.body.appendChild(slot)
		Hotbar.push(slot)
	}
}

function InitBlocks(){
	BlockLib = {}

	for (var block of Blocks){
		let _block = new BABYLON.MeshBuilder.CreateBox("", {
			width: Settings.BlockWidth,
			height: block.Liquid ? Settings.LiquidBlockHeight:Settings.BlockWidth,
			depth: Settings.BlockWidth,
			faceUV: block.TextureMap,
			wrap: true
		}, Scene)
		_block.Solid = block.Solid
		_block.Liquid = block.Liquid

		_block.LinkedMeshes = []


		if (block.Sprite){
			let mesh1 = new BABYLON.MeshBuilder.CreatePlane("",{
				width: Settings.BlockWidth,
				height: Settings.BlockWidth,
				sideOrientation: BABYLON.Mesh.DOUBLESIDE
			}, Scene)

			let _mat = new BABYLON.StandardMaterial("", Scene)
			_mat.diffuseTexture = new BABYLON.Texture(block.Sprite.Texture, Scene)
			_mat.emissiveColor = new BABYLON.Color3.White()
			_mat.diffuseTexture.hasAlpha = true
			_mat.backFaceCulling = true
			mesh1.material = _mat

			let mesh2 = mesh1.createInstance()
			mesh2.rotation.y = BABYLON.Tools.ToRadians(90)

			_block.LinkedMeshes = [mesh1, mesh2]
		}

		let _mat = new BABYLON.StandardMaterial("", Scene)
		_mat.diffuseTexture = new BABYLON.Texture(block.Texture, Scene)
		_mat.backFaceCulling = true
		_mat.emissiveColor = new BABYLON.Color3.White()
		if (block.Opacity) _mat.alpha = block.Opacity
		_block.material = _mat

		BlockLib[block.Name] = _block

		Scene.removeMesh(_block)
	}
}
