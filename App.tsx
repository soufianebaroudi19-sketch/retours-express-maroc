import React, { useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_ORDERS, INITIAL_RETURNS } from './constants';
import { Role, ReturnRequest, ReturnStatus, User } from './types';
import { ClientView } from './components/ClientView';
import { AdminView } from './components/AdminView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [returns, setReturns] = useState<ReturnRequest[]>(INITIAL_RETURNS);

  // Simulate persistent data
  useEffect(() => {
    // In a real app, fetch from API
  }, []);

  const handleCreateReturn = (newReturnData: Omit<ReturnRequest, 'id' | 'status' | 'progress' | 'timeline'>) => {
    const newReturn: ReturnRequest = {
      ...newReturnData,
      id: `RET-${Math.floor(Math.random() * 10000)}`,
      status: ReturnStatus.CREATED,
      progress: 0,
      timeline: [
        { status: ReturnStatus.CREATED, date: new Date().toISOString().split('T')[0] }
      ]
    };
    setReturns(prev => [newReturn, ...prev]);
  };

  const handleUpdateReturnStatus = (id: string, newStatus: ReturnStatus) => {
    setReturns(prev => prev.map(r => {
      if (r.id === id) {
        let progress = r.progress;
        if (newStatus === ReturnStatus.VALIDATED) progress = 20;
        if (newStatus === ReturnStatus.COLLECTED) progress = 40;
        if (newStatus === ReturnStatus.RECEIVED) progress = 60;
        if (newStatus === ReturnStatus.PROCESSING) progress = 80;
        if (newStatus === ReturnStatus.REFUNDED) progress = 100;
        if (newStatus === ReturnStatus.REFUSED) progress = 100;

        return {
          ...r,
          status: newStatus,
          progress,
          timeline: [...r.timeline, { status: newStatus, date: new Date().toISOString().split('T')[0] }]
        };
      }
      return r;
    }));
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            R
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenue sur Retours Express</h1>
          <p className="text-gray-500 mb-8">La plateforme de reverse logistics pour le Maroc.</p>
          
          <div className="space-y-4">
            <button 
              onClick={() => setCurrentUser(MOCK_USERS[0])}
              className="w-full p-4 border-2 border-gray-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition group flex items-center gap-4"
            >
              <img src={MOCK_USERS[0].avatar} className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0" alt="Client" />
              <div className="text-left">
                <p className="font-bold text-gray-800 group-hover:text-emerald-700">Je suis Client</p>
                <p className="text-xs text-gray-500">Interface Mobile pour les retours</p>
              </div>
            </button>

            <button 
              onClick={() => setCurrentUser(MOCK_USERS[1])}
              className="w-full p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition group flex items-center gap-4"
            >
               <img src={MOCK_USERS[1].avatar} className="w-12 h-12 rounded-full grayscale group-hover:grayscale-0" alt="Admin" />
              <div className="text-left">
                <p className="font-bold text-gray-800 group-hover:text-indigo-700">Je suis Commerçant</p>
                <p className="text-xs text-gray-500">Dashboard de gestion (Admin)</p>
              </div>
            </button>
          </div>
        </div>
        <p className="mt-8 text-xs text-gray-400">Prototype React TypeScript v1.0</p>
      </div>
    );
  }

  return (
    <>
      {currentUser.role === Role.CLIENT ? (
        <ClientView 
          user={currentUser} 
          orders={MOCK_ORDERS} 
          returns={returns} 
          onCreateReturn={handleCreateReturn} 
        />
      ) : (
        <AdminView 
          user={currentUser} 
          returns={returns}
          onUpdateStatus={handleUpdateReturnStatus}
        />
      )}
      
      {/* Logout Overlay for Demo */}
      <button 
        onClick={() => setCurrentUser(null)}
        className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white text-xs px-3 py-2 rounded-full opacity-50 hover:opacity-100 transition shadow-lg"
      >
        Déconnexion
      </button>
    </>
  );
}
