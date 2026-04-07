import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";

export default function CategoriesPage() {
  const [params] = useSearchParams();
  const filter = params.get("filter");
  const [data, setData] = useState(null);
  useEffect(() => {
    if (filter) fetch(`/api/categories?filter=${filter}`).then(r => r.json()).then(setData);
  }, [filter]);
  return <div>{JSON.stringify(data)}</div>;
}
