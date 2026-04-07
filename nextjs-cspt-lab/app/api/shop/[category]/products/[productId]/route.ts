import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  {
    params,
  }: { params: Promise<{ category: string; productId: string }> }
) {
  const { category, productId } = await params;
  return NextResponse.json({
    id: productId,
    category,
    name: `Product ${productId}`,
    price: 29.99,
    inStock: true,
  });
}
