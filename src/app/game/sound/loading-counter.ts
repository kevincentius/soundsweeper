import { Subject } from "rxjs";

export class LoadingCounter {
  total = 0;
  loaded = 0;

  progress = new Subject<number>();
  percent = 0;

  add(count=1) {
    this.total += count;
  }

  loadedOne() {
    this.loaded++;
    this.progress.next(this.loaded / this.total);
    this.percent = Math.round(this.loaded / this.total * 100);
  }

  isFinished() {
    return this.loaded === this.total;
  }
}
