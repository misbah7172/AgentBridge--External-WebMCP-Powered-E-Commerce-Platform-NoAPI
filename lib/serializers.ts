export function money(value: { toString(): string } | number | null | undefined) {
  return value === null || value === undefined ? null : Number(value);
}

export function productDto(product: any) {
  return { ...product, price: money(product.price), compareAtPrice: money(product.compareAtPrice), rating: Number(product.rating), images: product.images, specifications: product.specifications ?? {}, variants: product.variants };
}
