import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fdpjqttwhphawwmykxzx.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkcGpxdHR3aHBoYXd3bXlreHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzNjE4MjEsImV4cCI6MjA5MDkzNzgyMX0.hO3s4e6oxde4FX6-_TssoOtMF0KRLZg0FVS96P6tQQQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)