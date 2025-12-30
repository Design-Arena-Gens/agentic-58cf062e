'use client';

import { useState, useEffect } from 'react';

interface Video {
  id: number;
  filename: string;
  scheduled_time: string;
  status: string;
  youtube_id?: string;
  title?: string;
  description?: string;
  created_at: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchVideos();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/youtube/status');
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch (error) {
      console.error('Failed to check auth:', error);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/videos');
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !scheduledTime) {
      setMessage('Please select a video and schedule time');
      return;
    }

    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('video', file);
    formData.append('scheduled_time', scheduledTime);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Video scheduled successfully!');
        setFile(null);
        setScheduledTime('');
        fetchVideos();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('Upload failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = () => {
    window.location.href = '/api/youtube/auth';
  };

  const deleteVideo = async (id: number) => {
    try {
      await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      fetchVideos();
    } catch (error) {
      console.error('Failed to delete video:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #1a1a2e, #16213e)',
      color: 'white',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '10px',
          background: 'linear-gradient(to right, #ff6b6b, #4ecdc4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          YouTube Auto Uploader
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '40px', color: '#94a3b8' }}>
          AI-powered automatic video scheduler and uploader
        </p>

        {!isAuthenticated && (
          <div style={{
            background: '#ff6b6b',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '15px', fontSize: '18px' }}>
              YouTube authentication required to upload videos
            </p>
            <button
              onClick={handleAuth}
              style={{
                background: 'white',
                color: '#ff6b6b',
                border: 'none',
                padding: '12px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Connect YouTube Account
            </button>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '30px',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Schedule New Video</h2>

          <form onSubmit={handleUpload}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                Video File
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>
                Schedule Time (IST)
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !isAuthenticated}
              style={{
                width: '100%',
                padding: '15px',
                background: isAuthenticated ? 'linear-gradient(to right, #ff6b6b, #4ecdc4)' : '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: isAuthenticated ? 'pointer' : 'not-allowed',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Uploading...' : 'Schedule Video'}
            </button>
          </form>

          {message && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: message.includes('Error') ? 'rgba(255, 107, 107, 0.2)' : 'rgba(78, 205, 196, 0.2)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '15px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Scheduled Videos</h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Filename</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Scheduled</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>YouTube</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <td style={{ padding: '12px' }}>{video.filename}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(video.scheduled_time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        background:
                          video.status === 'completed' ? 'rgba(78, 205, 196, 0.2)' :
                          video.status === 'uploading' ? 'rgba(255, 193, 7, 0.2)' :
                          video.status === 'failed' ? 'rgba(255, 107, 107, 0.2)' :
                          'rgba(148, 163, 184, 0.2)'
                      }}>
                        {video.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {video.youtube_id && (
                        <a
                          href={`https://youtube.com/watch?v=${video.youtube_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#4ecdc4' }}
                        >
                          View
                        </a>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {video.status === 'pending' && (
                        <button
                          onClick={() => deleteVideo(video.id)}
                          style={{
                            background: '#ff6b6b',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {videos.length === 0 && (
              <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                No videos scheduled yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
