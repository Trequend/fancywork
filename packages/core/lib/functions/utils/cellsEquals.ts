import { BorderCell, SchemaCell } from 'lib/types';

export function cellsEquals(
  cell: BorderCell | SchemaCell,
  otherCell: BorderCell | SchemaCell
): boolean {
  if (cell.type === 'border' && otherCell.type === 'border') {
    if (cell.axis === 'origin' && otherCell.axis === 'origin') {
      return true;
    } else if (cell.axis !== 'origin' && otherCell.axis !== 'origin') {
      return cell.axis === otherCell.axis && cell.number === otherCell.number;
    } else {
      return false;
    }
  } else if (cell.type === 'schema' && otherCell.type === 'schema') {
    return cell.i === otherCell.i && cell.j === otherCell.j;
  } else {
    return false;
  }
}
