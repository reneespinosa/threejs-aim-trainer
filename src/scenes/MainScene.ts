// Main scene setup
import * as THREE from "three";
import RandomCubeGenerator from "../objects/RandomCubeGenerator";
import Light from "../objects/Light";
import Cube from "../objects/Cube";
export default class MainScene extends THREE.Scene {
  public targets: Cube[] = [];
  constructor(targets:Cube[]) {
    super();
    this.targets = targets;

    const room = new Cube(false, false, false, true);
    room.position.set(1, 0, 0);

    room.scale.set(15, 7, 15);
    this.add(room);
    const white = new THREE.Color(0xffffff);
    this.background = white;

    const light = new Light();
    this.add(light);
    
    
  }

  public level(level: number) {
    if(level === 1) {
     this.level1();return;
    }
    if(level === 2) {
     this.level2();return;
    }
    if(level === 3) {
     this.level3();return;
    }
    this.level1();
  }

  public level1() {
    
    const rcg = new RandomCubeGenerator(this.targets, this,false);
    rcg.generate(true);
    rcg.generate();
    rcg.generate();
  }

  public level2() {
    const rcg = new RandomCubeGenerator(this.targets, this,false);
    rcg.generate(true);
    for (let i = 0; i < 7; i++) {
      rcg.generate();
    }
  }
  public level3() {
    const rcg = new RandomCubeGenerator(this.targets, this,false);
    rcg.generate(true);
    for (let i = 0; i < 49; i++) {
      rcg.generate();
    }
    
  }
}
