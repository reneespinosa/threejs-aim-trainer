export default class StartScreen {
  private overlay = document.querySelector(".startScreen") as HTMLDivElement;
  private button = [...document.querySelectorAll(".startButton")] as HTMLButtonElement[];
  private canvas: HTMLCanvasElement;
  private onStart: (level: number) => void;

  constructor(canvas: HTMLCanvasElement, onStart: (level: number) => void) {
    this.canvas = canvas;
    this.onStart = onStart;
    this.bindEvents();
  }

  private bindEvents() {
    this.button[0].addEventListener("click", () => this.start(1));
    this.button[1].addEventListener("click", () => this.start(2));
    this.button[2].addEventListener("click", () => this.start(3));
    
    document.addEventListener("keydown", (e) => {
      const randomNumber = Math.floor(Math.random() * 3)+ 1;
      if (e.code === "Space" && !this.isHidden()) this.start(randomNumber);
    });
  }

  private async start(level: number) {
    this.hide();

    /* Optional: grab pointer lock immediately */
    try {
      await this.canvas.requestPointerLock();
    } catch (_) {
      /* swallow – user can click once inside the game to lock */
    }

    this.onStart(level)
    
  }

  private hide() {
    this.overlay.style.display = "none";
  }

  private isHidden() {
    return this.overlay.style.display === "none";
  }
}
