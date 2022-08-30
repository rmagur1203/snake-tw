import {
    Bootstrapper as BaseBootstrapper,
    Physics2DLoader,
    SceneBuilder
} from "the-world-engine";

import GameScene from "./prefab/gamescene";

export class Bootstrapper extends BaseBootstrapper {
    public run(): SceneBuilder {
        this.setting.physics.loader(Physics2DLoader);

        return this.sceneBuilder.withChild(
            this.instantiater.buildPrefab("gamescene", GameScene).make()
        );
    }
}
