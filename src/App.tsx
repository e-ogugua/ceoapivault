import { useState, useEffect } from 'react'
import { Send, Plus, Moon, Sun, Database, Share2, Download, Upload, Play, BookOpen, Users } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'

interface APIRequest {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  headers: Record<string, string>
  body?: string
  description: string
  collection: string
}

interface APIResponse {
  status: number
  statusText: string
  data: any
  headers: Record<string, string>
  duration: number
}

const sampleRequests: APIRequest[] = [
  {
    id: '1',
    name: 'Get Users',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/users',
    headers: { 'Content-Type': 'application/json' },
    description: 'Fetch all users from the API',
    collection: 'JSONPlaceholder'
  },
  {
    id: '2',
    name: 'Create User',
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/users',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe'
    }),
    description: 'Create a new user',
    collection: 'JSONPlaceholder'
  },
  {
    id: '3',
    name: 'Get Posts',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: { 'Content-Type': 'application/json' },
    description: 'Fetch all posts',
    collection: 'JSONPlaceholder'
  }
]

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<APIRequest>(sampleRequests[0])
  const [response, setResponse] = useState<APIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('headers')

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const sendRequest = async () => {
    setLoading(true)
    const startTime = Date.now()
    
    try {
      const config = {
        method: selectedRequest.method.toLowerCase(),
        url: selectedRequest.url,
        headers: selectedRequest.headers,
        ...(selectedRequest.body && { data: JSON.parse(selectedRequest.body) })
      }
      
      const result = await axios(config)
      const duration = Date.now() - startTime
      
      setResponse({
        status: result.status,
        statusText: result.statusText,
        data: result.data,
        headers: result.headers as Record<string, string>,
        duration
      })
    } catch (error: any) {
      const duration = Date.now() - startTime
      setResponse({
        status: error.response?.status || 0,
        statusText: error.response?.statusText || 'Network Error',
        data: error.response?.data || { error: error.message },
        headers: error.response?.headers || {},
        duration
      })
    } finally {
      setLoading(false)
    }
  }

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'method-get',
      POST: 'method-post',
      PUT: 'method-put',
      PATCH: 'method-patch',
      DELETE: 'method-delete'
    }
    return colors[method as keyof typeof colors] || 'bg-gray-100'
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'status-2xx'
    if (status >= 300 && status < 400) return 'status-3xx'
    if (status >= 400 && status < 500) return 'status-4xx'
    if (status >= 500) return 'status-5xx'
    return 'text-gray-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-all duration-300">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-api-500 to-ocean-500 rounded-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">APIVault</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Universal API Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Users className="h-4 w-4" />
                <span>Team</span>
              </button>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-api-500 to-ocean-500 text-white rounded-lg hover:from-api-600 hover:to-ocean-600 transition-all">
                <BookOpen className="h-4 w-4" />
                <span>Docs</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Collections */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900 dark:text-white">Collections</h2>
                  <button className="p-1.5 bg-api-100 dark:bg-api-900 text-api-600 dark:text-api-400 rounded-lg hover:bg-api-200 dark:hover:bg-api-800 transition-colors">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-2">
                {sampleRequests.map((request) => (
                  <motion.button
                    key={request.id}
                    onClick={() => setSelectedRequest(request)}
                    whileHover={{ x: 4 }}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                      selectedRequest.id === request.id
                        ? 'bg-api-100 dark:bg-api-900 border border-api-200 dark:border-api-700'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getMethodColor(request.method)}`}>
                        {request.method}
                      </span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {request.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {request.url}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 p-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Import Collection</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Download className="h-4 w-4" />
                  <span>Export Collection</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share Collection</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              {/* Request Builder */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-4 mb-4">
                  <select 
                    value={selectedRequest.method}
                    className={`px-3 py-2 rounded-lg font-medium text-sm border-0 ${getMethodColor(selectedRequest.method)}`}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="PATCH">PATCH</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                  
                  <input
                    type="text"
                    value={selectedRequest.url}
                    className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-api-500 focus:border-transparent"
                    placeholder="Enter API endpoint URL"
                  />
                  
                  <button
                    onClick={sendRequest}
                    disabled={loading}
                    className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-api-500 to-ocean-500 text-white rounded-lg hover:from-api-600 hover:to-ocean-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>Send</span>
                  </button>
                </div>

                {/* Request Tabs */}
                <div className="flex space-x-1 mb-4">
                  {(['headers', 'body'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab
                          ? 'bg-api-100 dark:bg-api-900 text-api-700 dark:text-api-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Request Content */}
                <div className="space-y-4">
                  {activeTab === 'headers' && (
                    <div>
                      <textarea
                        value={JSON.stringify(selectedRequest.headers, null, 2)}
                        className="w-full h-32 px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-api-500 focus:border-transparent"
                        placeholder="Request headers (JSON format)"
                      />
                    </div>
                  )}
                  
                  {activeTab === 'body' && (
                    <div>
                      <textarea
                        value={selectedRequest.body || ''}
                        className="w-full h-32 px-4 py-3 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-api-500 focus:border-transparent"
                        placeholder="Request body (JSON format)"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Response */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Response</h3>
                  {response && (
                    <div className="flex items-center space-x-4">
                      <span className={`font-semibold ${getStatusColor(response.status)}`}>
                        {response.status} {response.statusText}
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {response.duration}ms
                      </span>
                    </div>
                  )}
                </div>
                
                <AnimatePresence>
                  {response ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96"
                    >
                      <pre className="text-sm text-slate-100 font-mono">
                        {JSON.stringify(response.data, null, 2)}
                      </pre>
                    </motion.div>
                  ) : (
                    <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-8 text-center">
                      <Play className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400">
                        Send a request to see the response here
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
