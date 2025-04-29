'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Form() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(event.target);
    const data = {
      accessFor: formData.get('accessFor'),
      xUsername: formData.get('xUsername'),
      discordUsername: formData.get('discordUsername'),
      daoSocials: formData.get('daoSocials'),
    };

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if response is OK and has content
      if (!response.ok) {
        const text = await response.text();
        console.error('Form submission failed:', {
          status: response.status,
          statusText: response.statusText,
          responseText: text,
        });
        throw new Error(`HTTP error ${response.status}: ${text || response.statusText}`);
      }

      // Attempt to parse JSON
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        const text = await response.text();
        console.error('Failed to parse JSON response:', {
          error: jsonError.message,
          responseText: text,
        });
        throw new Error('Invalid server response: Unexpected end of JSON input');
      }

      if (result.message) {
        setMessage('Submission successful! Thank you for applying.');
        event.target.reset();
      } else {
        console.error('Form submission error:', result);
        setMessage(`Submission failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Form submission fetch error:', error);
      setMessage(`Error submitting form: ${error.message || 'Please try again'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="password-container">
      <Image
        src="/arcanum-2.png"
        alt="Arcanum Text"
        width={400}
        height={100}
        className="password-text-image"
      />
      <div className="form-input-container">
        <h2 className="form-title">$ARCAN Pre-Sale Application</h2>
        <p className="form-description">
          Thank you for your interest in ARCANUM. This form is your gateway to becoming one of only 350 holders of a Relic Key — the only way to access our token presale and unlock lifetime entry into the cult.
          <br />
          <strong>Pre-Sale Price:</strong> 1 SOL<br />
          <strong>Token Delivery:</strong> Full amount in $ARCAN at TGE<br />
          No vesting. No delay.<br />
          Only 350 total spots will be granted. Selected individuals will receive direct contact from our official X account (@ArcanumCult).
        </p>
        <form className="form-content" onSubmit={handleSubmit}>
          <div className="form-field">
            <label className="form-label">Who is this access meant for? *</label>
            <div className="form-radio-group">
              <label className="form-radio">
                <input type="radio" name="accessFor" value="community" required />
                <span className="form-radio-custom"></span>
                Community
              </label>
              <label className="form-radio">
                <input type="radio" name="accessFor" value="individual" required />
                <span className="form-radio-custom"></span>
                Individual
              </label>
            </div>
          </div>
          <div className="form-field">
            <label className="form-label">X username for contact *</label>
            <input
              type="text"
              name="xUsername"
              className="form-input"
              placeholder="Enter your X username"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Discord username *</label>
            <input
              type="text"
              name="discordUsername"
              className="form-input"
              placeholder="Enter your Discord username"
              required
            />
          </div>
          <div className="form-field">
            <label className="form-label">Name of DAO or socials *</label>
            <input
              type="text"
              name="daoSocials"
              className="form-input"
              placeholder="Enter DAO or socials"
              required
            />
          </div>
          <button
            type="submit"
            className="arc-button form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
          {message && <p className="form-message">{message}</p>}
        </form>
      </div>
    </div>
  );
}