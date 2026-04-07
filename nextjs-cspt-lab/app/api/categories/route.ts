import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const filter = request.nextUrl.searchParams.get("filter");
  const categories = [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Books" },
    { id: 3, name: "Clothing" },
  ];

  if (filter) {
    return NextResponse.json(
      categories.filter((c) =>
        c.name.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }
  return NextResponse.json(categories);
}
