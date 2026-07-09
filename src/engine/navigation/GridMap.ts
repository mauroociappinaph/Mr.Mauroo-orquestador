export type GridCoordinate = { x: number; z: number };

export class GridMap {
  private grid: Set<string>;
  private size: { width: number; depth: number };

  constructor(width: number, depth: number, obstacles: GridCoordinate[] = []) {
    this.size = { width, depth };
    this.grid = new Set();

    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        this.grid.add(`${x},${z}`);
      }
    }

    obstacles.forEach((obs) => {
      this.grid.delete(`${obs.x},${obs.z}`);
    });
  }

  public isWalkable(x: number, z: number): boolean {
    return this.grid.has(`${Math.floor(x)},${Math.floor(z)}`);
  }

  public getSize() {
    return this.size;
  }
}
