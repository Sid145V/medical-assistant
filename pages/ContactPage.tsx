
import React, { useState } from 'react';
import { api } from '../services/mockApi';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.submitContactForm(formData);
    setIsSent(true);
    setFormData({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800">Contact Us</h1>
        <p className="text-center text-gray-500 mt-2">Have feedback or a question? Let us know!</p>
        
        {isSent && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> Your message has been sent. We'll get back to you soon.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required rows={5} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>
          <button type="submit" className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition-colors">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
