import { BoxCollider2D, Component } from 'the-world-engine';

export class ItemScript extends Component {
  public mapCollider2D?: BoxCollider2D;

  public onTriggerEnter2D() {
    this.SetupRandomPosition();
  }

  public SetupRandomPosition() {
    const bounds = this.mapCollider2D!.size;

    const x = Math.floor(Math.random() * (bounds.x - 1) - bounds.x / 2) + 1;
    const y = Math.floor(Math.random() * (bounds.y - 1) - bounds.y / 2) + 1;

    this.transform.position.set(x, y, 0);
  }

  public awake() {
    this.SetupRandomPosition();
  }
}
