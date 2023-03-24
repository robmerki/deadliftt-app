import Head from 'next/head'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
const inter = Inter({ subsets: ['latin'] })

const DynamicFlowCanvas = dynamic(() => import('@/components/FlowCanvas'), {
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
      <main className="w-full h-screen bg-white">
        <DynamicFlowCanvas />
      </main>
    </>
  )
}
