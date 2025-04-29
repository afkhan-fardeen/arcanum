'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import * as XLSX from 'xlsx';

export default function Admin() {
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Check local storage for authentication on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth === 'adminsonlyplease') {
      setIsAuthenticated(true);
      fetchTotalEntries();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchTotalEntries = async () => {
    try {
      const { count, error } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw new Error(error.message);
      }

      setTotalEntries(count || 0);
    } catch (err) {
      setError('Failed to fetch total entries');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === 'adminsonlyplease') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'adminsonlyplease');
      setPasswordError('');
      fetchTotalEntries();
    } else {
      setPasswordError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    setPassword('');
  };

  const handleExport = async () => {
    try {
      const { data: submissions, error } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      if (!submissions || submissions.length === 0) {
        alert('No submissions available to export.');
        return;
      }

      // Create Excel workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(submissions);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');

      // Generate and download Excel file
      XLSX.writeFile(workbook, 'submissions.xlsx');
    } catch (err) {
      alert('Failed to export submissions: ' + err.message);
      console.error('Export error:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="password-container">
        <Image
          src="/arcanum-2.png"
          alt="Arcanum Text"
          width={400}
          height={100}
          className="password-text-image"
        />
        <div className="admin-container">
          <h2 className="form-title">Admin Access</h2>
          <p className="form-description">
            Enter the admin password to access the dashboard.
          </p>
          <form className="admin-password-form" onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="form-input"
              required
            />
            {passwordError && <p className="form-message error">{passwordError}</p>}
            <button type="submit" className="arc-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="password-container">
      <Image
        src="/arcanum-2.png"
        alt="Arcanum Text"
        width={400}
        height={100}
        className="password-text-image"
      />
      <div className="admin-container">
        <h2 className="form-title">Admin Dashboard</h2>
        <p className="form-description">
          Manage submissions for the $ARCAN Pre-Sale Application. Download all submissions as an Excel file or view the total number of entries.
        </p>
        <div className="admin-content">
          {isLoading ? (
            <p className="form-message">Loading...</p>
          ) : error ? (
            <p className="form-message error">{error}</p>
          ) : (
            <p className="form-message">Total Entries: {totalEntries}</p>
          )}
          <button onClick={handleExport} className="arc-button">
            Download Submissions Excel
          </button>
          <button onClick={handleLogout} className="arc-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}