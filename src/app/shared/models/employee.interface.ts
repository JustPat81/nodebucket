/**
 * Title: employee.interface.ts
 * Author: Prof. Krasso
 * Date: 15 January 2023
 * Modified By: Patrick Wolff
 * Description: employee.interface,ts file for node bucket application
 */

import { Item } from './item.interface';

export interface Employee {
  empId: number;
  firstName: string;
  lastName: string;
  todo: Item[];
  done: Item[];
}
