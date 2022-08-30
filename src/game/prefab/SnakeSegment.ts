import {
    BoxCollider2D,
    CssHtmlElementRenderer,
    GameObjectBuilder,
    Prefab
} from "the-world-engine";
import { Vector2 } from "three/src/Three";

export class SnakeSegment extends Prefab {
    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CssHtmlElementRenderer, (c) => {
                const div = document.createElement("div");
                div.style.backgroundColor = "#00ff00";

                c.element = div;
                c.elementWidth = 0.7;
                c.elementHeight = 0.7;
                c.autoSize = false;
            })
            .withComponent(BoxCollider2D, (c) => {
                c.size = new Vector2(0.5, 0.5);
                c.debugDraw = false;
            });
    }
}
