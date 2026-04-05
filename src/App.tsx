import { useState, useEffect } from 'react'
import { supabase } from './Supabase'
import './App.css'

export default function App() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('Jobs')
        .select('*')
      if (error) throw error
      setJobs(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    
      {loading ? 

Loading...

: (
        
          {jobs.map((job) => (
            
              {job.id}
            
          ))}
        
      )}
    
  )
}

