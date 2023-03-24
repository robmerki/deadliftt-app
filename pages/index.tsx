import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import FlowCanvas from '@/components/FlowCanvas'
const inter = Inter({ subsets: ['latin'] })

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
        <FlowCanvas />
      </main>
    </>
  )
}
