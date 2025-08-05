"use client"

import { Search, Github, Twitter, Youtube, Users, Moon, Sun, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatWidget, ChatContent } from "@/components/chat-widget"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function ChromaDocsClone() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleChatToggle = (isOpen: boolean) => {
    setIsChatOpen(isOpen)
  }

  const sidebarContent = (
    <div className="p-4">
      {/* Overview Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Overview</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Introduction
            </Link>
          </li>
          <li>
            <Link href="#" className="text-primary font-medium block py-1 px-2 bg-primary/10 rounded-md">
              Getting Started
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Architecture
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Data Model
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Roadmap
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Contributing
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Telemetry
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Migration
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Troubleshooting
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              About
            </Link>
          </li>
        </ul>
      </div>

      {/* Run Chroma Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Run Chroma</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Ephemeral Client
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Persistent Client
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Client-Server Mode
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Cloud Client
            </Link>
          </li>
        </ul>
      </div>

      {/* Collections Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Collections</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Manage Collections
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Configure
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Add Data
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Update Data
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Delete Data
            </Link>
          </li>
        </ul>
      </div>

      {/* Querying Collections Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Querying Collections</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Query And Get
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Metadata Filtering
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Full Text Search and Regex
            </Link>
          </li>
        </ul>
      </div>

      {/* Embeddings Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Embeddings</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Embedding Functions
            </Link>
          </li>
        </ul>
      </div>

      {/* Add more content to demonstrate scrolling */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Advanced Topics</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Performance Tuning
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Security
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Monitoring
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Backup & Recovery
            </Link>
          </li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">API Reference</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Client Methods
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Collection Methods
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Error Handling
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )

  const mainContent = (
    <div className="p-8 w-full max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Getting Started</h1>
      </div>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-6">
          Chroma is an AI-native open-source vector database. It comes with everything you need to get started built-in,
          and runs on your machine.
        </p>

        <p className="text-muted-foreground mb-6">
          For production, Chroma offers{" "}
          <Link href="#" className="text-primary hover:underline font-medium">
            Chroma Cloud
          </Link>{" "}
          - a fast, scalable, and serverless database-as-a-service. Get started in 30 seconds - $5 in free credits
          included.
        </p>

        {/* YouTube Video Player */}
        <div className="mb-8">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: "56.25%" }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Chroma Getting Started Tutorial"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Watch our getting started tutorial to learn Chroma basics
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-4">1. Install</h2>

        <Tabs defaultValue="python" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
          </TabsList>

          <TabsContent value="python" className="space-y-4">
            <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">Terminal</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs h-6 px-2">
                    pip
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs h-6 px-2">
                    conda
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <code className="text-emerald-400 font-mono text-sm">pip install chromadb</code>
            </div>

            <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">Python</span>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code className="font-mono leading-relaxed">
                  <span className="text-purple-400">import</span> <span className="text-blue-300">chromadb</span>
                  {"\n\n"}
                  <span className="text-gray-500"># Create a Chroma client</span>
                  {"\n"}
                  <span className="text-yellow-300">client</span> <span className="text-pink-400">=</span>{" "}
                  <span className="text-blue-300">chromadb</span>
                  <span className="text-white">.</span>
                  <span className="text-green-300">Client</span>
                  <span className="text-white">()</span>
                  {"\n\n"}
                  <span className="text-gray-500"># Create a collection</span>
                  {"\n"}
                  <span className="text-yellow-300">collection</span> <span className="text-pink-400">=</span>{" "}
                  <span className="text-yellow-300">client</span>
                  <span className="text-white">.</span>
                  <span className="text-green-300">create_collection</span>
                  <span className="text-white">(</span>
                  {"\n    "}
                  <span className="text-orange-300">name</span>
                  <span className="text-pink-400">=</span>
                  <span className="text-emerald-300">"my_collection"</span>
                  <span className="text-white">,</span>
                  {"\n    "}
                  <span className="text-orange-300">metadatas</span>
                  <span className="text-pink-400">=</span>
                  <span className="text-white">[&lbrace;</span>
                  <span className="text-emerald-300">"source"</span>
                  <span className="text-white">: </span>
                  <span className="text-emerald-300">"my_source"</span>
                  <span className="text-white">&rbrace;, &lbrace;</span>
                  <span className="text-emerald-300">"source"</span>
                  <span className="text-white">: </span>
                  <span className="text-emerald-300">"my_source"</span>
                  <span className="text-white">&rbrace;],</span>
                  {"\n    "}
                  <span className="text-orange-300">ids</span>
                  <span className="text-pink-400">=</span>
                  <span className="text-white">[</span>
                  <span className="text-emerald-300">"id1"</span>
                  <span className="text-white">, </span>
                  <span className="text-emerald-300">"id2"</span>
                  <span className="text-white">]</span>
                  {"\n"}
                  <span className="text-white">)</span>
                  {"\n\n"}
                  <span className="text-gray-500"># Query the collection</span>
                  {"\n"}
                  <span className="text-yellow-300">results</span> <span className="text-pink-400">=</span>{" "}
                  <span className="text-yellow-300">collection</span>
                  <span className="text-white">.</span>
                  <span className="text-green-300">query</span>
                  <span className="text-white">(</span>
                  {"\n    "}
                  <span className="text-orange-300">query_texts</span>
                  <span className="text-pink-400">=</span>
                  <span className="text-white">[</span>
                  <span className="text-emerald-300">"This is a query document"</span>
                  <span className="text-white">],</span>
                  {"\n    "}
                  <span className="text-orange-300">n_results</span>
                  <span className="text-pink-400">=</span>
                  <span className="text-cyan-300">2</span>
                  {"\n"}
                  <span className="text-white">)</span>
                  {"\n\n"}
                  <span className="text-green-300">print</span>
                  <span className="text-white">(</span>
                  <span className="text-yellow-300">results</span>
                  <span className="text-white">)</span>
                </code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="typescript" className="space-y-4">
            <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">Terminal</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs h-6 px-2">
                    npm
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs h-6 px-2">
                    yarn
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <code className="text-emerald-400 font-mono text-sm">npm install chromadb</code>
            </div>

            <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm font-medium">TypeScript</span>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code className="font-mono leading-relaxed">
                  <span className="text-purple-400">import</span> <span className="text-white">&lbrace;</span>
                  <span className="text-blue-300">ChromaClient</span>
                  <span className="text-white">&rbrace;</span> <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-300">'chromadb'</span>
                  <span className="text-white">;</span>
                  {"\n\n"}
                  <span className="text-gray-500">// Create a Chroma client</span>
                  {"\n"}
                  <span className="text-purple-400">const</span> <span className="text-yellow-300">client</span>{" "}
                  <span className="text-pink-400">=</span> <span className="text-purple-400">new</span>{" "}
                  <span className="text-green-300">ChromaClient</span>
                  <span className="text-white">();</span>
                  {"\n\n"}
                  <span className="text-gray-500">// Create a collection</span>
                  {"\n"}
                  <span className="text-purple-400">const</span> <span className="text-yellow-300">collection</span>{" "}
                  <span className="text-pink-400">=</span> <span className="text-purple-400">await</span>{" "}
                  <span className="text-yellow-300">client</span>
                  <span className="text-white">.</span>
                  <span className="text-green-300">createCollection</span>
                  <span className="text-white">(&lbrace;</span>
                  {"\n  "}
                  <span className="text-orange-300">name</span>
                  <span className="text-white">: </span>
                  <span className="text-emerald-300">"my_collection"</span>
                  {"\n"}
                  <span className="text-white">&rbrace;);</span>
                  {"\n\n"}
                  <span className="text-gray-500">// Add some documents</span>
                  {"\n"}
                  <span className="text-purple-400">await</span> <span className="text-yellow-300">collection</span>
                  <span className="text-white">.</span>
                  <span className="text-green-300">add</span>
                  <span className="text-white">(&lbrace;</span>
                  {"\n  "}
                  <span className="text-orange-300">documents</span>
                  <span className="text-white">: [</span>
                  <span className="text-emerald-300">"This is a document"</span>
                  <span className="text-white">, </span>
                  <span className="text-emerald-300">"This is another document"</span>
                  <span className="text-white">],</span>
                  {"\n  "}
                  <span className="text-orange-300">metadatas</span>
                  <span className="text-white">: [&lbrace;</span>
                  <span className="text-orange-300">source</span>
                  <span className="text-white">: </span>
                  <span className="text-emerald-300">"my_source"</span>
                  <span className="text-white">&rbrace;, &lbrace;</span>
                  <span className="text-orange-300">source</span>
                  <span className="text-white">: </span>
                  <span className="text-emerald-300">"my_source"</span>
                  <span className="text-white">&rbrace;],</span>
                  {"\n  "}
                  <span className="text-orange-300">ids</span>
                  <span className="text-white">: [</span>
                  <span className="text-emerald-300">"id1"</span>
                  <span className="text-white">, </span>
                  <span className="text-emerald-300">"id2"</span>
                  <span className="text-white">]</span>
                  {"\n"}
                  <span className="text-white">&rbrace;);</span>
                  {"\n\n"}
                  <span className="text-gray-500">// Query the collection</span>
                  {"\n"}
                  <span className="text-purple-400">const</span> <span className="text-yellow-300">results</span>{" "}
                  <span className="text-pink-400">=</span> <span className="text-purple-400">await</span>{" "}
                  <span className="text-yellow-300">collection</span>
                  <span className="text-white">.</span>
                  <span className="text-green-300">query</span>
                  <span className="text-white">(&lbrace;</span>
                  {"\n  "}
                  <span className="text-orange-300">queryTexts</span>
                  <span className="text-white">: [</span>
                  <span className="text-emerald-300">"This is a query document"</span>
                  <span className="text-white">],</span>
                  {"\n  "}
                  <span className="text-orange-300">nResults</span>
                  <span className="text-pink-400">=</span>
                  <span className="text-cyan-300">2</span>
                  {"\n"}
                  <span className="text-white">&rbrace;);</span>
                  {"\n\n"}
                  <span className="text-blue-300">console</span>
                  <span className="text-white">.</span>
                  <span className="text-green-300">log</span>
                  <span className="text-white">(</span>
                  <span className="text-yellow-300">results</span>
                  <span className="text-white">);</span>
                </code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>

        <h2 className="text-2xl font-bold mb-4">2. Create a Chroma Client</h2>

        <p className="text-muted-foreground mb-4">
          The Chroma client is your main interface to interact with Chroma. You can create a client that connects to a
          local Chroma instance or to Chroma Cloud.
        </p>

        <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 mb-6 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">Python - Local Client</span>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <pre className="text-sm overflow-x-auto">
            <code className="font-mono leading-relaxed">
              <span className="text-purple-400">import</span> <span className="text-blue-300">chromadb</span>
              {"\n\n"}
              <span className="text-gray-500"># For ephemeral in-memory instance</span>
              {"\n"}
              <span className="text-yellow-300">client</span> <span className="text-pink-400">=</span>{" "}
              <span className="text-blue-300">chromadb</span>
              <span className="text-white">.</span>
              <span className="text-green-300">Client</span>
              <span className="text-white">()</span>
              {"\n\n"}
              <span className="text-gray-500"># For persistent storage</span>
              {"\n"}
              <span className="text-yellow-300">client</span> <span className="text-pink-400">=</span>{" "}
              <span className="text-blue-300">chromadb</span>
              <span className="text-white">.</span>
              <span className="text-green-300">PersistentClient</span>
              <span className="text-white">(</span>
              <span className="text-orange-300">path</span>
              <span className="text-pink-400">=</span>
              <span className="text-emerald-300">"/path/to/save/to"</span>
              <span className="text-white">)</span>
              {"\n\n"}
              <span className="text-gray-500"># For client-server mode</span>
              {"\n"}
              <span className="text-yellow-300">client</span> <span className="text-pink-400">=</span>{" "}
              <span className="text-blue-300">chromadb</span>
              <span className="text-white">.</span>
              <span className="text-green-300">HttpClient</span>
              <span className="text-white">(</span>
              <span className="text-orange-300">host</span>
              <span className="text-pink-400">=</span>
              <span className="text-emerald-300">'localhost'</span>
              <span className="text-white">, </span>
              <span className="text-orange-300">port</span>
              <span className="text-pink-400">=</span>
              <span className="text-cyan-300">8000</span>
              <span className="text-white">)</span>
            </code>
          </pre>
        </div>

        <h2 className="text-2xl font-bold mb-4">3. Create a Collection</h2>

        <p className="text-muted-foreground mb-4">
          Collections are where you store your embeddings, documents, and metadata. Think of them as tables in a
          traditional database.
        </p>

        <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 mb-6 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">Python - Create Collection</span>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <pre className="text-sm overflow-x-auto">
            <code className="font-mono leading-relaxed">
              <span className="text-gray-500"># Create a new collection</span>
              {"\n"}
              <span className="text-yellow-300">collection</span> <span className="text-pink-400">=</span>{" "}
              <span className="text-yellow-300">client</span>
              <span className="text-white">.</span>
              <span className="text-green-300">create_collection</span>
              <span className="text-white">(</span>
              {"\n    "}
              <span className="text-orange-300">name</span>
              <span className="text-pink-400">=</span>
              <span className="text-emerald-300">"my_collection"</span>
              <span className="text-white">,</span>
              {"\n    "}
              <span className="text-orange-300">metadata</span>
              <span className="text-pink-400">=</span>
              <span className="text-white">&lbrace;</span>
              <span className="text-emerald-300">"hnsw:space"</span>
              <span className="text-white">: </span>
              <span className="text-emerald-300">"cosine"</span>
              <span className="text-white">&rbrace;</span> <span className="text-gray-500"># l2 is the default</span>
              {"\n"}
              <span className="text-white">)</span>
              {"\n\n"}
              <span className="text-gray-500"># Get an existing collection</span>
              {"\n"}
              <span className="text-yellow-300">collection</span> <span className="text-pink-400">=</span>{" "}
              <span className="text-yellow-300">client</span>
              <span className="text-white">.</span>
              <span className="text-green-300">get_collection</span>
              <span className="text-white">(</span>
              <span className="text-orange-300">name</span>
              <span className="text-pink-400">=</span>
              <span className="text-emerald-300">"my_collection"</span>
              <span className="text-white">)</span>
              {"\n\n"}
              <span className="text-gray-500"># Get or create a collection</span>
              {"\n"}
              <span className="text-yellow-300">collection</span> <span className="text-pink-400">=</span>{" "}
              <span className="text-yellow-300">client</span>
              <span className="text-white">.</span>
              <span className="text-green-300">get_or_create_collection</span>
              <span className="text-white">(</span>
              <span className="text-orange-300">name</span>
              <span className="text-pink-400">=</span>
              <span className="text-emerald-300">"my_collection"</span>
              <span className="text-white">)</span>
            </code>
          </pre>
        </div>

        {/* Add more content to demonstrate scrolling */}
        <h2 className="text-2xl font-bold mb-4">4. Add Documents</h2>

        <p className="text-muted-foreground mb-4">
          Once you have a collection, you can add documents to it. Documents can include text, metadata, and embeddings.
        </p>

        <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 mb-6 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">Python - Add Documents</span>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <pre className="text-sm overflow-x-auto">
            <code className="font-mono leading-relaxed">
              <span className="text-gray-500"># Add documents with automatic embedding generation</span>
              {"\n"}
              <span className="text-yellow-300">collection</span>
              <span className="text-white">.</span>
              <span className="text-green-300">add</span>
              <span className="text-white">(</span>
              {"\n    "}
              <span className="text-orange-300">documents</span>
              <span className="text-pink-400">=</span>
              <span className="text-white">[</span>
              <span className="text-emerald-300">"This is my first document"</span>
              <span className="text-white">, </span>
              <span className="text-emerald-300">"This is my second document"</span>
              <span className="text-white">],</span>
              {"\n    "}
              <span className="text-orange-300">metadatas</span>
              <span className="text-pink-400">=</span>
              <span className="text-white">[&lbrace;</span>
              <span className="text-emerald-300">"source"</span>
              <span className="text-white">: </span>
              <span className="text-emerald-300">"doc1"</span>
              <span className="text-white">&rbrace;, &lbrace;</span>
              <span className="text-emerald-300">"source"</span>
              <span className="text-white">: </span>
              <span className="text-emerald-300">"doc2"</span>
              <span className="text-white">&rbrace;],</span>
              {"\n    "}
              <span className="text-orange-300">ids</span>
              <span className="text-pink-400">=</span>
              <span className="text-white">[</span>
              <span className="text-emerald-300">"id1"</span>
              <span className="text-white">, </span>
              <span className="text-emerald-300">"id2"</span>
              <span className="text-white">]</span>
              {"\n"}
              <span className="text-white">)</span>
            </code>
          </pre>
        </div>

        <h2 className="text-2xl font-bold mb-4">5. Query Documents</h2>

        <p className="text-muted-foreground mb-4">
          Now you can query your collection to find similar documents based on semantic similarity.
        </p>

        <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 mb-6 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm font-medium">Python - Query Documents</span>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white h-6 w-6 p-0">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <pre className="text-sm overflow-x-auto">
            <code className="font-mono leading-relaxed">
              <span className="text-gray-500"># Query for similar documents</span>
              {"\n"}
              <span className="text-yellow-300">results</span> <span className="text-pink-400">=</span>{" "}
              <span className="text-yellow-300">collection</span>
              <span className="text-white">.</span>
              <span className="text-green-300">query</span>
              <span className="text-white">(</span>
              {"\n    "}
              <span className="text-orange-300">query_texts</span>
              <span className="text-pink-400">=</span>
              <span className="text-white">[</span>
              <span className="text-emerald-300">"Find documents about my topic"</span>
              <span className="text-white">],</span>
              {"\n    "}
              <span className="text-orange-300">n_results</span>
              <span className="text-pink-400">=</span>
              <span className="text-cyan-300">2</span>
              {"\n"}
              <span className="text-white">)</span>
              {"\n\n"}
              <span className="text-green-300">print</span>
              <span className="text-white">(</span>
              <span className="text-yellow-300">results</span>
              <span className="text-white">)</span>
            </code>
          </pre>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      {/* Header - Fixed */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded"></div>
              <span className="font-semibold text-lg">Chroma</span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search" className="pl-10 pr-16 w-64 bg-muted/50 border-input" />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded font-mono">⌘</kbd>
                <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded font-mono">K</kbd>
              </div>
            </div>
          </div>

          {/* Right side stats */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>795 online</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Github className="w-4 h-4" />
              <span>21k</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Twitter className="w-4 h-4" />
              <span>22.1k</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Youtube className="w-4 h-4" />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar */}
      <nav className="border-t border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center gap-6 px-4 py-2">
          <Link
            href="#"
            className="flex items-center gap-2 text-red-500 font-medium hover:text-red-600 transition-colors"
          >
            <span>📄</span> Lesson
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>💪</span> Exercises
          </Link>
          <Link
            href="#"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <span>📚</span> Reference
          </Link>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 border-r bg-muted/30 flex-shrink-0 overflow-y-auto">{sidebarContent}</aside>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">{mainContent}</div>

        {/* Chat Panel */}
        {isChatOpen && (
          <aside className="w-[400px] flex-shrink-0 overflow-hidden border-l">
            <ChatContent onClose={() => handleChatToggle(false)} showHeader={true} className="h-full" />
          </aside>
        )}
      </div>

      {/* Chat Widget - Only show floating button when chat is closed */}
      {!isChatOpen && <ChatWidget onChatToggle={handleChatToggle} />}
    </div>
  )
}
