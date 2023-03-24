import Head from 'next/head'
import dynamic from 'next/dynamic'

const DynamicFlowCanvas = dynamic(() => import('@/components/FlowCanvas'), {
  ssr: false,
}) // https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr
const DynamicSidebar = dynamic(() => import('@/components/Sidebar'), {
  ssr: false,
}) // https://nextjs.org/docs/advanced-features/dynamic-import#with-no-ssr

export default function Home() {
  return (
    <>
      <Head>
        <title>Deadliftt - Video Ideas</title>
        <meta name="description" content="Generate video ideas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full h-screen flex bg-white flex-col lg:flex-row">
        <div>
          <DynamicSidebar />
        </div>
        <div className="flex-grow">
          <DynamicFlowCanvas />
        </div>
      </main>
    </>
  )
}
