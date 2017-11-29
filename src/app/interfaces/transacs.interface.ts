import { Item } from 'app/shared/item.model';
import { IItem } from 'app/interfaces/item.interface';
/**
 * Transaction data contract
 */
export interface ITransactionData {
    date: String;
    items: IItem[];
    transactionType: number;
}
