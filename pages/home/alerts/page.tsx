// export async function getStaticProps(context: any) {
//   // const data = await fetchData(context.params.id)
//   const data = Promise.resolve({ pagedata: true, file: 'pages/home/alerts/page.tsx' })
//   if (!data) {
//     return {
//       notFound: true,
//     }
//   }
//   return {
//     props: { data },
//   }
// }

// export function generateStaticParams() {
//   return [{ id: '1' }, { id: '2' }, { id: '3' }]
// }

// Three versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
// - /product/1
// - /product/2
// - /product/3
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  console.log("page params")
  // const { id } = await params
  return <pre>{ JSON.stringify( params , [] , 2) }</pre>
  // ...
}

