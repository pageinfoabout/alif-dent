import { createClient } from '@supabase/supabase-js'

// Centralized Supabase client used across the app
const SUPABASE_URL = 'https://llveytzjwinxhlvbenhq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsdmV5dHpqd2lueGhsdmJlbmhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTgzMTIsImV4cCI6MjA3NjM5NDMxMn0.9ihflFRVqGqDAdlgf2gwU6PJpRPe6dyf2RSVxDTkoCA'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
export default supabase


