const Settings = {

	BlockWidth: 5,

	PovCollisionRadius: 1,

	WorldLength: 40,
	WorldBreadth: 40,

	MinBedrockHeight: 3,
	MaxBedrockHeight: 20,

	MinFoundationHeight: 1,
	MaxFoundationHeight: 3,
	FoundationHeightMin: 3,
	FoundationHeightLimit: 5,

	MinGroundHeight: 1,
	MaxGroundHeight: 3,
	GroundHeightMin: 5,

	WaterHeightLimit: 5,
	LiquidBlockHeight: 3,

	TreeHeight: 5,

	NoiseSmoothness: 0.05,
}

Settings.POVStartPosition = new BABYLON.Vector3(
		Settings.WorldLength/2*Settings.BlockWidth, 
		(Settings.MaxGroundHeight+Settings.MaxBedrockHeight)*Settings.BlockWidth, 
		Settings.WorldBreadth/2*Settings.BlockWidth)