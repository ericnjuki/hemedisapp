import { ITransactionData } from 'app/interfaces/transacs.interface';
import { IItem } from 'app/interfaces/item.interface';

export class TransactionData implements ITransactionData {
    public date: String;
    public items: IItem[];
    public transactionType: number;
}
