import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<string>("");

  const handleChange = (e: any) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch('http://nadscollection.store/app/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Your message has been sent successfully. We\'ll contact you shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      setSubmitMessage(`Unable to send your message: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-neutral-50">
      {/* Header Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4 tracking-wide">
              Get In Touch
            </h1>
            <div className="w-24 h-px bg-neutral-900 mx-auto mb-6"></div>
            <p className="text-neutral-600 font-light text-lg max-w-2xl mx-auto">
              Our concierge team is available to assist you with any inquiries about our luxury collections.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="w-full max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4 tracking-wide">
              Send Us A Message
            </h2>
            <div className="w-24 h-px bg-neutral-900 mx-auto mb-6"></div>
            <p className="text-neutral-600 font-light text-lg max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {submitMessage && (
            <div className={`mb-8 p-6 border ${
              submitMessage.includes('successfully') 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <p className="font-light">{submitMessage}</p>
            </div>
          )}

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Enter your full name"
                  className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors placeholder-neutral-400 disabled:opacity-50" 
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                  Email Address *
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Your email address"
                  className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors placeholder-neutral-400 disabled:opacity-50" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                Subject *
              </label>
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors appearance-none disabled:opacity-50"
              >
                <option value="" disabled>Select inquiry type</option>
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="Order Assistance">Order Assistance</option>
                <option value="Returns & Exchanges">Returns & Exchanges</option>
                <option value="Wholesale Inquiry">Wholesale Inquiry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 uppercase tracking-wider mb-2">
                Message *
              </label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                required 
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                placeholder="How may we assist you today?"
                className="w-full px-4 py-3 border border-neutral-300 bg-transparent focus:border-neutral-900 focus:ring-0 transition-colors resize-none placeholder-neutral-400 disabled:opacity-50"
              ></textarea>
            </div>

            <div className="pt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-light px-12 py-4 uppercase tracking-widest text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center group"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
                {!isSubmitting && (
                  <svg className="ml-4 w-4 h-4 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-neutral-50">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-light text-neutral-900 mb-4 tracking-wide">
              Contact Information
            </h2>
            <div className="w-24 h-px bg-neutral-900 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <a 
          href="mailto:nadscollection.store@gmail.com" target='blank' 
>
            <div className="bg-white border border-neutral-200 p-8 text-center">
              <div className="mb-6">
                <svg className="w-8 h-8 text-neutral-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-700 uppercase tracking-wider mb-4">Email</h3>
              <p className="font-light text-neutral-900">nadscollection.store@gmail.com</p>
            </div>
</a>        <a 
          href="https://wa.me/+923207418826" target='blank' 
>
            <div className="bg-white border border-neutral-200 p-8 text-center">
              <div className="mb-6">
                <svg className="w-8 h-8 text-neutral-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-700 uppercase tracking-wider mb-4">Phone</h3>
              <p className="font-light text-neutral-900">+92-320-7418826</p>
            </div>
</a>
            <div className="bg-white border border-neutral-200 p-8 text-center">
              <div className="mb-6">
                <svg className="w-8 h-8 text-neutral-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-neutral-700 uppercase tracking-wider mb-4">Hours</h3>
              <p className="font-light text-neutral-900">Mon-sat: 9AM-6PM EST</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;