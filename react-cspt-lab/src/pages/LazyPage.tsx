import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

export default function LazyPage() {
  const { itemId } = useParams();
  const { data } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => fetch(`/api/items/${itemId}`).then(r => r.json()),
  });
  return <div>{JSON.stringify(data)}</div>;
}
