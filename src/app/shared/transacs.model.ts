import { ITransactionData } from 'app/interfaces/transacs.interface';
import { IItem } from 'app/interfaces/item.interface';
import { Item } from 'app/shared/item.model';

export class TransactionData implements ITransactionData {
    public date: String;
    public items: Item[];
    public transactionType: number;
    public total?: number;
}
