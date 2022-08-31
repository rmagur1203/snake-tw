import {
    AsyncImageLoader,
    BoxCollider2D,
    Camera,
    Color,
    CssHtmlElementRenderer,
    CssTilemapChunkRenderer,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    RigidBody2D,
    RigidbodyType2D,
    TileAtlasItem
} from "the-world-engine";
import { Vector2, Vector3 } from "three/src/Three";

import grid from "../../../assets/grid.png";
import SnakeController from "../scripts/SnakeController";
import { ItemPrefab } from "./Item";

export default class GameScene extends Prefab {
    public make(): GameObjectBuilder {
        const gridCollider = new PrefabRef<BoxCollider2D>();

        return this.gameObjectBuilder
            .withChild(
                this.instantiater
                    .buildGameObject("camera", new Vector3(0, 0, 10))
                    .withComponent(Camera, (c) => {
                        c.viewSize = 11;
                        c.backgroundColor = new Color(0, 0, 0, 100);
                    })
            )

            .withChild(
                this.instantiater
                    .buildGameObject("gridmap")
                    .withComponent(CssHtmlElementRenderer, (c) => {
                        const div = document.createElement("div");
                        div.style.border = "1px solid white";
                        c.element = div;
                        c.elementWidth = 33;
                        c.elementHeight = 17;
                    })
                    .withComponent(CssTilemapChunkRenderer, (c) => {
                        c.chunkSize = 15;
                        c.tileResolutionX = 0;
                        c.tileResolutionY = 0;

                        AsyncImageLoader.loadImageFromPath(grid)
                            .then((image) => {
                                if (!c.exists) return;

                                c.imageSources = [new TileAtlasItem(image, 1, 1)];

                                const source = { i: 0 as const, a: 62 };
                                const gridSize = { x: 33, y: 17 };

                                const array2d: { i: 0; a: number }[][] = [];
                                for (let i = 0; i < gridSize.y; i += 1) {
                                    array2d[i] = [];
                                    for (let j = 0; j < gridSize.x; j += 1) {
                                        array2d[i][j] = source;
                                    }
                                }

                                c.drawTileFromTwoDimensionalArray(
                                    array2d,
                                    -Math.floor(gridSize.x / 2),
                                    -Math.floor(gridSize.y / 2)
                                );
                            })
                            .catch(console.error);
                    })
                    .withComponent(BoxCollider2D, (c) => {
                        c.isTrigger = true;
                        c.size = new Vector2(33, 17);
                        c.debugDraw = false;
                    })
                    .getComponent(BoxCollider2D, gridCollider)
            )

            .withChild(
                this.instantiater
                    .buildGameObject("snake")
                    .withComponent(CssHtmlElementRenderer, (c) => {
                        const div = document.createElement("div");
                        div.style.backgroundColor = "#00ff00";

                        c.element = div;
                        c.elementWidth = 0.8;
                        c.elementHeight = 0.8;
                        c.autoSize = false;
                    })
                    .withComponent(SnakeController, (c) => {
                        c.mapCollider2D = gridCollider.ref ?? undefined;
                    })
                    .withComponent(RigidBody2D, (c) => {
                        c.bodyType = RigidbodyType2D.Kinematic;
                    })
                    .withComponent(BoxCollider2D, (c) => {
                        c.isTrigger = true;
                        c.size = new Vector2(0.5, 0.5);
                        c.debugDraw = false;
                    })
            )

            .withChild(
                this.instantiater
                    .buildPrefab("item", ItemPrefab)
                    .initialize(gridCollider)
                    .make()
            );
    }
}
