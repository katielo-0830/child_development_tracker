import React, { useEffect, useState } from 'react';

// Define an interface for the Session data based on your backend model
interface Session {
  id: number; // Assuming 'id' is the primary key and auto-generated
  date: string; // Dates are often strings in ISO format from JSON
  startTime: string; // Times can also be strings
  endTime: string;
  notes?: string; // Optional notes
  // Add other fields if necessary, e.g., associated therapists
  // Therapists?: { id: number; name: string }[];
}

export function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Assuming your backend is running on port 3000 and UI on 5173
        // and you have a proxy setup in vite.config.ts or are using full URLs
        // For development, if backend is on localhost:3000, the request URL would be '/api/sessions'
        // if proxied, or 'http://localhost:3000/api/sessions' if not.
        const response = await fetch('http://localhost:3000/api/sessions'); // Adjust if your API prefix is different

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Session[] = await response.json();
        setSessions(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <p>Loading sessions...</p>;
  }

  if (error) {
    return <p>Error fetching sessions: {error}</p>;
  }

  if (sessions.length === 0) {
    return <p>No sessions found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sessions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Start Time</th>
              <th className="py-2 px-4 border-b text-left">End Time</th>
              <th className="py-2 px-4 border-b text-left">Notes</th>
              {/* Add more headers if you include associated data like therapists */}
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{session.id}</td>
                <td className="py-2 px-4 border-b">{new Date(session.date).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{session.startTime}</td>
                <td className="py-2 px-4 border-b">{session.endTime}</td>
                <td className="py-2 px-4 border-b">{session.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}