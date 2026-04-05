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
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const addJob = async (jobData) => {
    try {
      const { error } = await supabase
        .from('Jobs')
        .insert([jobData])
      if (error) throw error
      fetchJobs()
    } catch (error) {
      console.error('Error adding job:', error)
    }
  }

  const deleteJob = async (id) => {
    try {
      const { error } = await supabase
        .from('Jobs')
        .delete()
        .eq('id', id)
      if (error) throw error
      fetchJobs()
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  if (loading) return 

  return (
    
        ))}
      
    
  )
}

