import { useState, useEffect } from "react";

function useApiData(path: string) {
  const [data, setData] = useState(null);
  useEffect(() => { fetch(path).then(r => r.json()).then(setData); }, [path]);
  return data;
}

export default function AboutPage() {
  const data = useApiData("/api/about");
  return <div>{JSON.stringify(data)}</div>;
}
