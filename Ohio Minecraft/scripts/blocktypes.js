const Blocks = [
	{
		Name: "GrassBlock",
		Solid: true,
		Texture: "assets/grassblock.png",
		TextureMap: [
			new BABYLON.Vector4(0.25,0,0.5,1),
			new BABYLON.Vector4(0.25,0,0.5,1),
			new BABYLON.Vector4(0.25,0,0.5,1),
			new BABYLON.Vector4(0.25,0,0.5,1),
			new BABYLON.Vector4(0.5,0,0.75,1),
			new BABYLON.Vector4(0.75,0,1,1),
		],
		DisplayImage: "assets/grassblockdisplay.webp",
		Usable: true
	},

	{
		Name: "MemeBlock",
		Solid: true,
		Texture: "assets/grassblock.png",
		TextureMap: [
			new BABYLON.Vector4(0,0,0.25,1),
			new BABYLON.Vector4(0,0,0.25,1),
			new BABYLON.Vector4(0,0,0.25,1),
			new BABYLON.Vector4(0,0,0.25,1),
			new BABYLON.Vector4(0.5,0,0.75,1),
			new BABYLON.Vector4(0.75,0,1,1),
		],
		DisplayImage: "assets/memeblock.jpg",
		Usable: true
	},

	{
		Name: "StoneBlock",
		Solid: true,
		Texture: "assets/stoneblock.png",
		TextureMap: [],
		Usable: true
	},

	{
		Name: "WaterBlock",
		Solid: false,
		Liquid: true,
		Texture: "assets/waterblock.jpg",
		TextureMap: [],
		Opacity: 0.5,
	},

	{
		Name: "SandBlock",
		Solid: true,
		Texture: "assets/sandblock.jpeg",
		TextureMap: [],
		Usable: true
	},

	{
		Name: "DirtBlock",
		Solid: true,
		Texture: "assets/dirtblock.jpg",
		TextureMap: [],
		Usable: true
	},

	{
		Name: "WoodBlock",
		Solid: true,
		Texture: "assets/woodblock.jpg",
		TextureMap: [],
	},

	{
		Name: "LeafBlock",
		Solid: true,
		Texture: "assets/leafblock.jpg",
		TextureMap: [],
	},

	{
		Name: "RedFlowerBlock",
		Solid: false,
		Sprite: true,
		Texture: "",
		TextureMap: [],
		Sprite:{
			Width: Settings.BlockWidth,
			Height: Settings.BlockWidth,
			Texture: "assets/redflowerblock.png"
		},
		Usable: true,
	},

	{
		Name: "CyanFlowerBlock",
		Solid: false,
		Sprite: true,
		Texture: "",
		TextureMap: [],
		Sprite:{
			Width: Settings.BlockWidth,
			Height: Settings.BlockWidth,
			Texture: "assets/cyanflowerblock.png"
		},
		Usable: true
	},

	{
		Name: "MushroomBlock",
		Solid: false,
		Sprite: true,
		Texture: "",
		TextureMap: [],
		Sprite:{
			Width: Settings.BlockWidth-2,
			Height: Settings.BlockWidth-2,
			Texture: "assets/mushroomblock.png"
		},
	},

	{
		Name: "PlankBlock",
		Solid: true,
		Texture: "assets/plankblock.png",
		TextureMap: [],
		Usable: true
	},

	{
		Name: "GlassBlock",
		Solid: true,
		Texture: "assets/glassblock.png",
		TextureMap: [],
		Usable: true,
		Opacity: 0.7
	}
]