function PerlinNoise(x, z, min, max){
	let res = Math.round(perlin.get(x*Settings.NoiseSmoothness, z/Settings.BlockWidth*Settings.NoiseSmoothness)*(max-min))+min
	res*=(res<0 ? -1:1)
	return res
}

function CreateChunk(position, coord){

	for (var i=0;(coord=="z" ? i<Settings.WorldLength:i<Settings.WorldBreadth);i++){

		let bHeight = PerlinNoise(i, position.z, Settings.MinBedrockHeight, Settings.MaxBedrockHeight)
		let gStart = CreateBase(i, coord, position.x, position.z, bHeight)

		if (gStart<Settings.WaterHeightLimit){
			for (var j=gStart;j<Settings.WaterHeightLimit;j++){
				CreateBlock("WaterBlock", {
					x: position.x+(coord=="z" ? i*Settings.BlockWidth:0),
					y: j*Settings.LiquidBlockHeight,
					z: position.z+(coord=="z" ? 0:i*Settings.BlockWidth)
				})
			}
			continue
		}

		
		if (gStart<Settings.GroundHeightMin) continue
		let gHeight = PerlinNoise(i, position.z, Settings.MinGroundHeight, Settings.MaxGroundHeight)
		CreateGround(i, coord, position.x, position.z, gHeight, gStart)
	}
}


function CreateBase(iter, coord, x, z, height){
	for (var i=0;i<height;i++){
		CreateBlock("StoneBlock", {
			x: x+(coord=="z" ? iter*Settings.BlockWidth:0),
			y: i*Settings.BlockWidth,
			z: z+(coord=="z" ? 0:iter*Settings.BlockWidth)
		})
	}


	if (height<Settings.FoundationHeightMin) return height

	let fBlock = (height>Settings.FoundationHeightLimit ? "DirtBlock" : "SandBlock")
	let fHeight = PerlinNoise(iter, z, Settings.MinFoundationHeight, Settings.MaxFoundationHeight)
	for (var i=0;i<fHeight; i++){
		CreateBlock(fBlock, {
			x: x+(coord=="z" ? iter*Settings.BlockWidth:0),
			y: (i+height)*Settings.BlockWidth,
			z: z+(coord=="z" ? 0:iter*Settings.BlockWidth)
		})
	}

	return height+fHeight
}


function CreateGround(iter, coord, x, z, height, gStart){

	for (var i=0;i<height;i++){
		CreateBlock("GrassBlock", {
			x: x+(coord=="z" ? iter*Settings.BlockWidth:0),
			y: (i+gStart)*Settings.BlockWidth,
			z: z+(coord=="z" ? 0:iter*Settings.BlockWidth)
		})

		
		if (PerlinNoise(x, z, 0,100)%5)
			SpawnTree(x+(coord=="z" ? iter*Settings.BlockWidth:0), (height+gStart)*Settings.BlockWidth, z+(coord=="z" ? 0:iter*Settings.BlockWidth))
		
		else
			SpawnVegetation(x+(coord=="z" ? iter*Settings.BlockWidth:0), (height+gStart)*Settings.BlockWidth, z+(coord=="z" ? 0:iter*Settings.BlockWidth))
	}
}


function SpawnVegetation(x, y, z){
	if (PerlinNoise(x/Settings.BlockWidth, z/Settings.BlockWidth, 0, 100)%20) return
	
	let index = PerlinNoise(x/Settings.BlockWidth, z/Settings.BlockWidth, 0, 4)
	let block = ["RedFlowerBlock", "MushroomBlock","CyanFlowerBlock"][index>2 ? 2:index]
	CreateBlock(block, {
		x: x,
		y: y,
		z: z
	})
}


function SpawnTree(x, y, z){
	if (PerlinNoise(x/Settings.BlockWidth, z/Settings.BlockWidth, 0, 100)%40) return
	
	let trunk = []
	for (var i=0;i<Settings.TreeHeight;i++){
		trunk.push(
			CreateBlock("WoodBlock",{
				x: x,
				y: y+i*Settings.BlockWidth,
				z: z
			})
		)
	}

	let leafLayers = [[5, 5], [3, 3], [1, 1]]

	for (var i=0;i<leafLayers.length;i++){
		for (var j=0;j<leafLayers[i][0];j++){
			for (var k=0;k<leafLayers[i][1];k++){
				let leafPos = {
					x: x-(leafLayers[i][0]-1)/2*Settings.BlockWidth,
					y: y+Settings.TreeHeight*Settings.BlockWidth,
					z: z-(leafLayers[i][1]-1)/2*Settings.BlockWidth
				}

				let leaf = CreateBlock("LeafBlock",{
					x: leafPos.x+j*Settings.BlockWidth,
					y: leafPos.y+i*Settings.BlockWidth,
					z: leafPos.z+k*Settings.BlockWidth
				})
				trunk.forEach(i=>i.LinkedBlocks.push(leaf))
				
			}
		}
	}
}


function DeleteBlock(mesh){
	mesh.LinkedBlocks?.forEach(i=>{
		i.setEnabled(false)
		Scene.removeMesh(i)
	})
	mesh.setEnabled(false)
	Scene.removeMesh(mesh)
}

function ReplaceChunkZ(dir){
	let farz = dir=="w" ? FurthestZBlock() : NearestZBlock()
	let nearz = dir=="w"? NearestZBlock() : FurthestZBlock()

	if (dir=="w" && Camera.position.z>=NearestZBlock()+Settings.WorldLength/2*Settings.BlockWidth) return
	if (dir=="s" && Camera.position.z<=FurthestZBlock()-Settings.WorldLength/2*Settings.BlockWidth) return

	Scene.meshes.filter(mesh=>mesh.position.z==farz).forEach(mesh=>DeleteBlock(mesh))

	let block = Scene.meshes.filter(mesh=>mesh.position.z==nearz && mesh.Name!="LeafBlock")[0]
	CreateChunk({
		x: NearestXBlock(),
		y: block.position.y,
		z: block.position.z+(dir=="w" ? -1:1)*Settings.BlockWidth
	}, "z")
}

function ReplaceChunkX(dir){

	let farx = dir=="a" ? FurthestXBlock() : NearestXBlock()
	let nearx = dir=="a"? NearestXBlock() : FurthestXBlock()

	if (dir=="a" && Camera.position.x>=NearestXBlock()+Settings.WorldLength/2*Settings.BlockWidth) return
	if (dir=="d" && Camera.position.x<=FurthestXBlock()-Settings.WorldLength/2*Settings.BlockWidth) return

	Scene.meshes.filter(mesh=>mesh.position.x==farx).forEach(mesh=>DeleteBlock(mesh))

	let block = Scene.meshes.filter(mesh=>mesh.position.x==nearx && mesh.Name!="LeafBlock")[0]
	CreateChunk({
		x: block.position.x+(dir=="a" ? -1:1)*Settings.BlockWidth,
		y: block.position.y,
		z: NearestZBlock()
	}, "x")
}



function NearestZBlock(){
	let arr = []
	for (var mesh of Scene.meshes.filter(mesh=>mesh.Name!="LeafBlock"))
		arr.push(mesh.position.z)
	return Math.min.apply(null,arr)
}

function FurthestZBlock(){
	let arr = []
	for (var mesh of Scene.meshes.filter(mesh=>mesh.Name!="LeafBlock"))
		arr.push(mesh.position.z)
	return Math.max.apply(null,arr)
}


function NearestXBlock(){
	let arr = []
	for (var mesh of Scene.meshes.filter(mesh=>mesh.Name!="LeafBlock"))
		arr.push(mesh.position.x)
	return Math.min.apply(null,arr)
}

function FurthestXBlock(){
	let arr = []
	for (var mesh of Scene.meshes.filter(mesh=>mesh.Name!="LeafBlock"))
		arr.push(mesh.position.x)
	return Math.max.apply(null,arr)
}