export interface CreateItemDto {
  productId: number;
  quantity: number;
  price: string;
}

export type Item = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: string;
};
