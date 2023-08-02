# Ohio-Minecraft

28/6/23 updates:  
- frustum culling and world matrix freezing to combat lag
- tweaked camera rotation settings and fixed block placing
- fixed tree despawning bug
  
needs chrome without cors to run  
  
![BUILD SCREENSHOT](https://github.com/WAP-Industries/Ohio-Minecraft/blob/main/creeper_rule_34.png?raw=true)

```javascript

  // if you have a fucking nasa supercomputer consider changing the world dimensions
  // had to set it at 40x40 because my computers a piece of shit
  
  // -- inside scripts/settings.js --
  const Settings = {
  
    BlockWidth: 5,

    PovCollisionRadius: 1,

    WorldLength: 40,  // change this shit
    WorldBreadth: 40, // and this shit

```
