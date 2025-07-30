export default class StartScreen {
  private overlay = document.getElementById("startScreen") as HTMLDivElement;
  private button = document.getElementById("startButton") as HTMLButtonElement;
  private canvas: HTMLCanvasElement;
  private onStart: () => void;

  constructor(canvas: HTMLCanvasElement, onStart: () => void) {
    this.canvas = canvas;
    this.onStart = onStart;
    this.bindEvents();
  }

  private bindEvents() {
    const launch = () => this.start();

    this.button.addEventListener("click", launch);
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !this.isHidden()) launch();
    });
  }

  private async start() {
    this.hide();

    /* Optional: grab pointer lock immediately */
    try {
      await this.canvas.requestPointerLock();
    } catch (_) {
      /* swallow – user can click once inside the game to lock */
    }

    this.onStart(); // kick off your game loop / init logic
  }

  private hide() {
    this.overlay.style.display = "none";
  }

  private isHidden() {
    return this.overlay.style.display === "none";
  }
}
