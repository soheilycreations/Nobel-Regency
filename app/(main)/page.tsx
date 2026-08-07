import React from 'react';

export default function SuspensionPage() {
  return (
    <main className="bg-gray-900 text-white min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-800 border border-red-500/30 rounded-2xl p-8 text-center shadow-2xl">
        {/* Warning Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 text-red-500 rounded-full mb-6">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold mb-3 text-red-400">Account Temporarily Suspended</h1>
        
        <p className="text-gray-300 text-sm mb-6 leading-relaxed">
          This website has been temporarily disabled due to a pending payment issue regarding the last billing cycle.
        </p>

        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700 mb-6 text-xs text-gray-400">
          If you are the site owner, please clear the pending invoice immediately to restore services.
        </div>

        {/* WhatsApp Button - Replace 94771234567 with your actual WhatsApp number */}
        <a href="https://wa.me/94773967721?text=Hi,%20I%20am%20calling%20regarding%20the%20website%20suspension%20and%20payment." 
           target="_blank" 
           rel="noopener noreferrer"
           className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-green-600/30">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Contact Developer
        </a>
      </div>
    </main>
  );
}
