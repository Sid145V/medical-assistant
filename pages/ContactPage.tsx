import React, { useState } from 'react';
import { api } from '../services/mockApi';
import { motion, AnimatePresence } from 'framer-motion';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      await api.submitContactForm(formData);
      setStatus('sent');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch(err) {
      setError('Failed to send message. Please try again.');
      setStatus('idle');
    }
  };
  
  const inputClasses = "w-full p-3 border-0 rounded-lg focus:ring-2 focus:ring-primary/40 outline-none bg-black/5 text-text shadow-inner";

  return (
    <div className="max-w-xl mx-auto">
      <div className="glass-card p-8">
        <h1 className="text-3xl font-bold text-center text-text">Contact Us</h1>
        <p className="text-center text-text-muted mt-2">Have feedback or a question? Let us know!</p>
        
        <AnimatePresence>
          {status === 'sent' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 bg-primary/10 border-l-4 border-primary text-primary-dark p-4 rounded-r-lg"
              role="alert"
            >
              <p className="font-bold">Success!</p>
              <p>Your message has been sent. We'll get back to you soon.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className={inputClasses} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className={inputClasses} />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className={inputClasses} />
          </div>
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows={5} className={inputClasses}></textarea>
          
          {error && <p className="text-accent text-sm text-center">{error}</p>}

          <motion.button 
            type="submit"
            disabled={status === 'sending'}
            className="w-full btn-primary disabled:bg-gray-400"
            whileHover={{ y: status !== 'sending' ? -2 : 0 }}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;