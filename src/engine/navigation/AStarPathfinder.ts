import { GridMap, GridCoordinate } from "./GridMap";

export class AStarPathfinder {
  public findPath(grid: GridMap, start: GridCoordinate, end: GridCoordinate): GridCoordinate[] | null {
    const openSet: GridCoordinate[] = [start];
    const cameFrom: Map<string, GridCoordinate> = new Map();
    
    const gScore: Map<string, number> = new Map();
    gScore.set(`${start.x},${start.z}`, 0);

    const fScore: Map<string, number> = new Map();
    fScore.set(`${start.x},${start.z}`, this.heuristic(start, end));

    while (openSet.length > 0) {
      let current = openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < openSet.length; i++) {
        if (this.fScoreValue(fScore, openSet[i]) < this.fScoreValue(fScore, current)) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      if (current.x === end.x && current.z === end.z) {
        return this.reconstructPath(cameFrom, current);
      }

      openSet.splice(currentIndex, 1);

      for (const neighbor of this.getNeighbors(current)) {
        if (!grid.isWalkable(neighbor.x, neighbor.z)) continue;

        const tentativeGScore = this.gScoreValue(gScore, current) + 1;

        if (tentativeGScore < this.gScoreValue(gScore, neighbor)) {
          cameFrom.set(`${neighbor.x},${neighbor.z}`, current);
          gScore.set(`${neighbor.x},${neighbor.z}`, tentativeGScore);
          fScore.set(`${neighbor.x},${neighbor.z}`, tentativeGScore + this.heuristic(neighbor, end));

          if (!openSet.some((node) => node.x === neighbor.x && node.z === neighbor.z)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return null;
  }

  private heuristic(a: GridCoordinate, b: GridCoordinate): number {
    return Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
  }

  private gScoreValue(scoreMap: Map<string, number>, coord: GridCoordinate): number {
    return scoreMap.get(`${coord.x},${coord.z}`) ?? Infinity;
  }

  private fScoreValue(scoreMap: Map<string, number>, coord: GridCoordinate): number {
    return scoreMap.get(`${coord.x},${coord.z}`) ?? Infinity;
  }

  private getNeighbors(coord: GridCoordinate): GridCoordinate[] {
    const directions = [
      { x: 0, z: 1 }, { x: 0, z: -1 }, { x: 1, z: 0 }, { x: -1, z: 0 },
    ];
    return directions.map((d) => ({ x: coord.x + d.x, z: coord.z + d.z }));
  }

  private reconstructPath(cameFrom: Map<string, GridCoordinate>, current: GridCoordinate): GridCoordinate[] {
    const totalPath = [current];
    let temp = current;
    while (cameFrom.has(`${temp.x},${temp.z}`)) {
      temp = cameFrom.get(`${temp.x},${temp.z}`)!;
      totalPath.unshift(temp);
    }
    return totalPath;
  }
}
