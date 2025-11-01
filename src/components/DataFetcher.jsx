import { useState } from 'react';
import { supabase } from '../db/supabase';

export default function DataFetcher({ }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    const { data: newData } = await supabase.from('teams').select('*').limit(10);
    console.log('Fetched data:', newData);
    setData(newData);
    setLoading(false);
  };

  return (
    <div className="container">
      <button onClick={handleRefresh} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
