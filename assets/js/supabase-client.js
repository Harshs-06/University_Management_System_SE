// Initialize Supabase client
const SUPABASE_URL = 'https://klmnijdogskxbpdhtrsj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsbW5pamRvZ3NreGJwZGh0cnNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMDQzMzYsImV4cCI6MjA2MDg4MDMzNn0.Cc59VkplcMpNrX3EFvtAunQy0vzZzuNHHoFRoktM_q8';

// Create Supabase client instance
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function to verify connection status
async function checkConnection() {
  try {
    const { data, error } = await supabaseClient.from('assessments').select('count', { count: 'exact', head: true });
    if (error && error.code === '42P01') {
      console.error('Table does not exist. Please create it first.');
      return false;
    } else if (error) {
      console.error('Connection error:', error);
      return false;
    }
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
}