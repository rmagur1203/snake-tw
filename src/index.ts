import { Game } from "the-world-engine";

import { Bootstrapper } from "./game/bootstrapper";

const game = new Game(document.body);
game.run(Bootstrapper);
game.inputHandler.startHandleEvents();