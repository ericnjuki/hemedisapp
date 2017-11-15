import { IItem } from 'app/interfaces/item.interface';

export class Item implements IItem {
    public itemName: string;
    public unit: string;
    public quantity: number;
    public sellingPrice: number;
    public purchaseCost: number;
}