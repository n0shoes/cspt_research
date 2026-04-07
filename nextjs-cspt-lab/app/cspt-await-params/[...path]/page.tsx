import { CsptFetcher } from "./cspt-fetcher";

// SERVER COMPONENT — reads await params, passes to client component for visible fetch
// Pattern: await params → value → client fetch(`/api/content/${value}`) → result
//
// Normal:  /cspt-await-params/docs/getting-started
// Attack:  /cspt-await-params/docs/getting-started/..%2F..%2F..%2Finternal%2Fcredentials

export default async function CsptAwaitParamsPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const filePath = path.join("/");

  return <CsptFetcher pathSegments={path} filePath={filePath} />;
}
