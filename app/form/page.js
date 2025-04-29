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

      if (!response.ok) {
        const text = await response.text();
        console.error('Form submission failed:', {
          status: response.status,
          statusText: response.statusText,
          responseText: text,
        });
        if (response.status === 405) {
          throw new Error('Method not allowed: The server does not support POST requests for this endpoint');
        }
        if (response.status === 500) {
          throw new Error('Server error: The server encountered an issue processing the request');
        }
        throw new Error(`HTTP error ${response.status}: ${text || response.statusText}`);
      }

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
          Thank you for your interest in ARCANUM.<br />
          This form is your gateway to becoming one of only 350 holders of a Relic Key — the only way to access our token presale and unlock lifetime entry into the cult.<br />
          You are applying for a private allocation of the <strong>$ARCAN</strong> token through the Relic Keys.<br />
          Selected individuals will receive direct contact from our official <a href="https://x.com/ArcanumCult" target="_blank" rel="noopener noreferrer" className="form-link">X</a> account (<a href="https://x.com/ArcanumCult" target="_blank" rel="noopener noreferrer" className="form-link">@ArcanumCult</a>) to confirm access.<br />
          <br />
          <strong>Pre-Sale Price:</strong> 1 SOL<br />
          <strong>Token Delivery:</strong> Full amount in $ARCAN at TGE<br />
          <strong>No vesting. No delay.</strong><br />
          <br />
          The Relic Keys unlocks forever access to all our Trading Tools...<br />
          <br />
          Only 350 total spots will be granted.<br />
          If chosen, you’ll receive your token allocation + lifetime access to all tools.<br />
          <br />
          You can find more information in our <a href="https://discord.gg/arcanumcult" target="_blank" rel="noopener noreferrer" className="form-link">Discord</a> or <a href="https://arcanum-3.gitbook.io/arcanum" target="_blank" rel="noopener noreferrer" className="form-link">Gitbook</a>.<br />
          Those selected will have a special role on <a href="https://discord.gg/arcanumcult" target="_blank" rel="noopener noreferrer" className="form-link">Discord</a> and private chat access.
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