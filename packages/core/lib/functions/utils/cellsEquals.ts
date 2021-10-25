import { Cell } from 'lib/types';

export function cellsEquals(cell: Cell, otherCell: Cell): boolean {
  if (cell.type !== otherCell.type) {
    return false;
  }

  if (cell.type === 'border' && otherCell.type === 'border') {
    return cell.axis === otherCell.axis && cell.number === otherCell.number;
  } else if (cell.type === 'schema' && otherCell.type === 'schema') {
    return cell.i === otherCell.i && cell.j === otherCell.j;
  } else {
    return false;
  }
}
