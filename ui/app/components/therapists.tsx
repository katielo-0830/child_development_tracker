import React, { useEffect, useState } from 'react';

// Define an interface for the Therapist data
interface Therapist {
  id: number;
  name: string;
}

export function Therapists() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        // Assuming your backend API is at /api/therapists
        // and Vite proxy is configured if running on different ports.
        const response = await fetch('/api/therapists');
        /*
        const response = {
          ok: true, // Simulating a successful response for demonstration
          json: async () => [
            { id: 1, name: 'Dr. Smith' },
            { id: 2, name: 'Dr. Johnson' },
          ],
        }
        */

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Therapist[] = await response.json();
        setTherapists(data);
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

    fetchTherapists();
  }, []); // Empty dependency array means this effect runs once on mount

  if (loading) {
    return <p>Loading therapists...</p>;
  }

  if (error) {
    return <p>Error fetching therapists: {error}</p>;
  }

  if (therapists.length === 0) {
    return <p>No therapists found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Therapists</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">Name</th>
              {/* Add more headers if needed, e.g., for createdAt, updatedAt */}
              {/* <th className="py-2 px-4 border-b text-left">Created At</th> */}
            </tr>
          </thead>
          <tbody>
            {therapists.map((therapist) => (
              <tr key={therapist.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{therapist.id}</td>
                <td className="py-2 px-4 border-b">{therapist.name}</td>
                {/* Example for displaying createdAt, if you choose to include it
                <td className="py-2 px-4 border-b">
                  {therapist.createdAt ? new Date(therapist.createdAt).toLocaleDateString() : '-'}
                </td>
                */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}