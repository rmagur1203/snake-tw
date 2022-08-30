/* eslint-disable no-underscore-dangle */
import {
    BoxCollider2D,
    Collider2D,
    Component,
    CoroutineIterator,
    GameObject,
    Transform,
    WaitForSeconds
} from "the-world-engine";
import { Vector2 } from "three/src/Three";

import GameScene from "../prefab/gamescene";
import { SnakeSegment } from "../prefab/SnakeSegment";

export default class SnakeController extends Component {
    public mapCollider2D?: BoxCollider2D;

    private readonly _moveTime = 0.1;
    private _moveDirection = new Vector2(1, 0);
    private _lastInputDirection = new Vector2(1, 0);

    private readonly _spawnSegmentCountAtStart = 4;
    private readonly _segments: Transform[] = [];

    private gameover() {
        this.engine.scene.iterateChild((transform) => {
            if (transform.gameObject.name === "gamescene") {
                transform.gameObject.destroy();
                return false;
            }
            return true;
        });
        this.engine.scene.addChildFromBuilder(
            this.engine.instantiater.buildPrefab("gamescene", GameScene).make()
        );
    }

    public onTriggerEnter2D(collision: Collider2D) {
        if (collision.gameObject.name === "item") {
            this.spawnSegment();
        } else if (collision.gameObject.name === "segment") {
            this.gameover();
        }
    }

    public awake() {
        this._segments.push(this.transform);

        this.spawnSegment("neck");
        for (let i = 1; i < this._spawnSegmentCountAtStart; i += 1) {
            this.spawnSegment();
        }

        this.startCoroutine(this.move());
    }

    private spawnSegment(name = "segment") {
        const segment: GameObject = this.transform.parent!.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildPrefab(name, SnakeSegment).make()
        );
        const prev = this._segments[this._segments.length - 1].position;
        segment.transform.position.set(prev.x, prev.y, 0);
        this._segments.push(segment.transform);
    }

    private moveSegment() {
        this._moveDirection = this._lastInputDirection;

        for (let i = this._segments.length - 1; i > 0; i -= 1) {
            this._segments[i].position.x = this._segments[i - 1].position.x;
            this._segments[i].position.y = this._segments[i - 1].position.y;
        }

        const x = this.transform.position.x + this._moveDirection.x;
        const y = this.transform.position.y + this._moveDirection.y;
        this._segments[0].position.set(x, y, 0);
    
        const bounds = this.mapCollider2D!.size;

        if (this.transform.position.x < -(bounds.x / 2) || this.transform.position.x > (bounds.x / 2) ||
      this.transform.position.y < -(bounds.y / 2) || this.transform.position.y > (bounds.y / 2)) {
            this.gameover();
        }
    }

    public *move(): CoroutineIterator {
        while (true) {
            this.moveSegment();

            yield new WaitForSeconds(this._moveTime);
        }
    }

    public update() {
        const inputMap = this.engine.input.map;
        if (this._moveDirection.x !== 0) {
            if (inputMap.get("ArrowUp")) this._lastInputDirection = new Vector2(0, 1);
            if (inputMap.get("ArrowDown"))
                this._lastInputDirection = new Vector2(0, -1);
        }
        if (this._moveDirection.y !== 0) {
            if (inputMap.get("ArrowLeft"))
                this._lastInputDirection = new Vector2(-1, 0);
            if (inputMap.get("ArrowRight"))
                this._lastInputDirection = new Vector2(1, 0);
        }
    }
}
