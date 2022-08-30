import {
  BoxCollider2D,
  CssHtmlElementRenderer,
  GameObjectBuilder,
  Prefab,
  PrefabRef,
} from 'the-world-engine';
import { Vector2 } from 'three/src/Three';
import { ItemScript } from '../scripts/Item';

export class ItemPrefab extends Prefab {
  private gridCollider = new PrefabRef<BoxCollider2D>();

  public initialize(gridCollider: PrefabRef<BoxCollider2D>) {
    this.gridCollider = gridCollider;
    return this;
  }

  public make(): GameObjectBuilder {
    return this.gameObjectBuilder
      .withComponent(CssHtmlElementRenderer, (c) => {
        const div = document.createElement('div');
        div.style.backgroundColor = '#ff0000';

        c.element = div;
        c.elementWidth = 0.8;
        c.elementHeight = 0.8;
        c.autoSize = false;
      })
      .withComponent(BoxCollider2D, (c) => {
        c.isTrigger = true;
        c.size = new Vector2(0.5, 0.5);
        c.debugDraw = false;
      })
      .withComponent(ItemScript, (c) => {
        c.mapCollider2D = this.gridCollider.ref ?? undefined;
      });
  }
}
