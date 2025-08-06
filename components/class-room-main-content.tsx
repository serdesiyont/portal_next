import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

export function ClassRoomMainContent() {
  return (
    
      <div className="p-8 w-full max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Getting Started</h1>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground mb-6">
            Chroma is an AI-native open-source vector database. It comes with
            everything you need to get started built-in, and runs on your
            machine.
          </p>

          <p className="text-muted-foreground mb-6">
            For production, Chroma offers{" "}
            <Link href="#" className="text-primary hover:underline font-medium">
              Chroma Cloud
            </Link>{" "}
            - a fast, scalable, and serverless database-as-a-service. Get
            started in 30 seconds - $5 in free credits included.
          </p>

          {/* YouTube Video Player */}
          <div className="mb-8">
            <div
              className="relative bg-black rounded-lg overflow-hidden shadow-lg"
              style={{ paddingBottom: "56.25%" }}
            >
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
                  <span className="text-slate-400 text-sm font-medium">
                    Terminal
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white text-xs h-6 px-2"
                    >
                      pip
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white text-xs h-6 px-2"
                    >
                      conda
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <code className="text-emerald-400 font-mono text-sm">
                  pip install chromadb
                </code>
              </div>

              <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">
                    Python
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <pre className="text-sm overflow-x-auto">
                  <code className="font-mono leading-relaxed">
                    <span className="text-purple-400">import</span>{" "}
                    <span className="text-blue-300">chromadb</span>
                    {"\n\n"}
                    <span className="text-gray-500">
                      # Create a Chroma client
                    </span>
                    {"\n"}
                    <span className="text-yellow-300">client</span>{" "}
                    <span className="text-pink-400">=</span>{" "}
                    <span className="text-blue-300">chromadb</span>
                    <span className="text-white">.</span>
                    <span className="text-green-300">Client</span>
                    <span className="text-white">()</span>
                    {"\n\n"}
                    <span className="text-gray-500"># Create a collection</span>
                    {"\n"}
                    <span className="text-yellow-300">collection</span>{" "}
                    <span className="text-pink-400">=</span>{" "}
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
                    <span className="text-gray-500">
                      # Query the collection
                    </span>
                    {"\n"}
                    <span className="text-yellow-300">results</span>{" "}
                    <span className="text-pink-400">=</span>{" "}
                    <span className="text-yellow-300">collection</span>
                    <span className="text-white">.</span>
                    <span className="text-green-300">query</span>
                    <span className="text-white">(</span>
                    {"\n    "}
                    <span className="text-orange-300">query_texts</span>
                    <span className="text-pink-400">=</span>
                    <span className="text-white">[</span>
                    <span className="text-emerald-300">
                      "This is a query document"
                    </span>
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
                  <span className="text-slate-400 text-sm font-medium">
                    Terminal
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white text-xs h-6 px-2"
                    >
                      npm
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white text-xs h-6 px-2"
                    >
                      yarn
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-400 hover:text-white h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <code className="text-emerald-400 font-mono text-sm">
                  npm install chromadb
                </code>
              </div>

              <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">
                    TypeScript
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <pre className="text-sm overflow-x-auto">
                  <code className="font-mono leading-relaxed">
                    <span className="text-purple-400">import</span>{" "}
                    <span className="text-white">&lbrace;</span>
                    <span className="text-blue-300">ChromaClient</span>
                    <span className="text-white">&rbrace;</span>{" "}
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-emerald-300">'chromadb'</span>
                    <span className="text-white">;</span>
                    {"\n\n"}
                    <span className="text-gray-500">
                      // Create a Chroma client
                    </span>
                    {"\n"}
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-yellow-300">client</span>{" "}
                    <span className="text-pink-400">=</span>{" "}
                    <span className="text-purple-400">new</span>{" "}
                    <span className="text-green-300">ChromaClient</span>
                    <span className="text-white">();</span>
                    {"\n\n"}
                    <span className="text-gray-500">
                      // Create a collection
                    </span>
                    {"\n"}
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-yellow-300">collection</span>{" "}
                    <span className="text-pink-400">=</span>{" "}
                    <span className="text-purple-400">await</span>{" "}
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
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-yellow-300">collection</span>
                    <span className="text-white">.</span>
                    <span className="text-green-300">add</span>
                    <span className="text-white">(&lbrace;</span>
                    {"\n  "}
                    <span className="text-orange-300">documents</span>
                    <span className="text-white">: [</span>
                    <span className="text-emerald-300">
                      "This is a document"
                    </span>
                    <span className="text-white">, </span>
                    <span className="text-emerald-300">
                      "This is another document"
                    </span>
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
                    <span className="text-gray-500">
                      // Query the collection
                    </span>
                    {"\n"}
                    <span className="text-purple-400">const</span>{" "}
                    <span className="text-yellow-300">results</span>{" "}
                    <span className="text-pink-400">=</span>{" "}
                    <span className="text-purple-400">await</span>{" "}
                    <span className="text-yellow-300">collection</span>
                    <span className="text-white">.</span>
                    <span className="text-green-300">query</span>
                    <span className="text-white">(&lbrace;</span>
                    {"\n  "}
                    <span className="text-orange-300">queryTexts</span>
                    <span className="text-white">: [</span>
                    <span className="text-emerald-300">
                      "This is a query document"
                    </span>
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
            The Chroma client is your main interface to interact with Chroma.
            You can create a client that connects to a local Chroma instance or
            to Chroma Cloud.
          </p>

          <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 mb-6 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">
                Python - Local Client
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="font-mono leading-relaxed">
                <span className="text-purple-400">import</span>{" "}
                <span className="text-blue-300">chromadb</span>
                {"\n\n"}
                <span className="text-gray-500">
                  # For ephemeral in-memory instance
                </span>
                {"\n"}
                <span className="text-yellow-300">client</span>{" "}
                <span className="text-pink-400">=</span>{" "}
                <span className="text-blue-300">chromadb</span>
                <span className="text-white">.</span>
                <span className="text-green-300">Client</span>
                <span className="text-white">()</span>
                {"\n\n"}
                <span className="text-gray-500"># For persistent storage</span>
                {"\n"}
                <span className="text-yellow-300">client</span>{" "}
                <span className="text-pink-400">=</span>{" "}
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
                <span className="text-yellow-300">client</span>{" "}
                <span className="text-pink-400">=</span>{" "}
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
            Collections are where you store your embeddings, documents, and
            metadata. Think of them as tables in a traditional database.
          </p>

          <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 mb-6 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">
                Python - Create Collection
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="font-mono leading-relaxed">
                <span className="text-gray-500"># Create a new collection</span>
                {"\n"}
                <span className="text-yellow-300">collection</span>{" "}
                <span className="text-pink-400">=</span>{" "}
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
                <span className="text-white">&rbrace;</span>{" "}
                <span className="text-gray-500"># l2 is the default</span>
                {"\n"}
                <span className="text-white">)</span>
                {"\n\n"}
                <span className="text-gray-500">
                  # Get an existing collection
                </span>
                {"\n"}
                <span className="text-yellow-300">collection</span>{" "}
                <span className="text-pink-400">=</span>{" "}
                <span className="text-yellow-300">client</span>
                <span className="text-white">.</span>
                <span className="text-green-300">get_collection</span>
                <span className="text-white">(</span>
                <span className="text-orange-300">name</span>
                <span className="text-pink-400">=</span>
                <span className="text-emerald-300">"my_collection"</span>
                <span className="text-white">)</span>
                {"\n\n"}
                <span className="text-gray-500">
                  # Get or create a collection
                </span>
                {"\n"}
                <span className="text-yellow-300">collection</span>{" "}
                <span className="text-pink-400">=</span>{" "}
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
            Once you have a collection, you can add documents to it. Documents
            can include text, metadata, and embeddings.
          </p>

          <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 mb-6 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">
                Python - Add Documents
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="font-mono leading-relaxed">
                <span className="text-gray-500">
                  # Add documents with automatic embedding generation
                </span>
                {"\n"}
                <span className="text-yellow-300">collection</span>
                <span className="text-white">.</span>
                <span className="text-green-300">add</span>
                <span className="text-white">(</span>
                {"\n    "}
                <span className="text-orange-300">documents</span>
                <span className="text-pink-400">=</span>
                <span className="text-white">[</span>
                <span className="text-emerald-300">
                  "This is my first document"
                </span>
                <span className="text-white">, </span>
                <span className="text-emerald-300">
                  "This is my second document"
                </span>
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
            Now you can query your collection to find similar documents based on
            semantic similarity.
          </p>

          <div className="bg-slate-950 dark:bg-slate-900 rounded-lg p-4 mb-6 border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium">
                Python - Query Documents
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code className="font-mono leading-relaxed">
                <span className="text-gray-500">
                  # Query for similar documents
                </span>
                {"\n"}
                <span className="text-yellow-300">results</span>{" "}
                <span className="text-pink-400">=</span>{" "}
                <span className="text-yellow-300">collection</span>
                <span className="text-white">.</span>
                <span className="text-green-300">query</span>
                <span className="text-white">(</span>
                {"\n    "}
                <span className="text-orange-300">query_texts</span>
                <span className="text-pink-400">=</span>
                <span className="text-white">[</span>
                <span className="text-emerald-300">
                  "Find documents about my topic"
                </span>
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
      
   
  );
}
