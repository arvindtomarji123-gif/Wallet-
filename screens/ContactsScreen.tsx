
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Search, UserPlus, MessageCircle, Send, MoreVertical } from 'lucide-react';

const ContactsScreen: React.FC = () => {
  const { state } = useAppContext();
  const [search, setSearch] = useState('');

  const filteredContacts = state.contacts.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  return (
    <div className="p-6 space-y-6 animate-in slide-in-from-left duration-500">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-800">Contacts</h1>
        <button className="p-3 bg-purple-600 text-white rounded-2xl shadow-lg active:scale-95 transition-all">
          <UserPlus size={20} />
        </button>
      </header>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold outline-none focus:ring-4 focus:ring-purple-100 shadow-sm"
        />
      </div>

      {/* Recents Horizontal */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Recents</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {state.contacts.map((contact) => (
            <div key={contact.id} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div className="w-16 h-16 rounded-3xl border-2 border-purple-100 p-1">
                <img src={contact.avatar} alt={contact.name} className="w-full h-full rounded-2xl object-cover" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 truncate w-16 text-center">{contact.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contacts List */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">All Contacts</h3>
        <div className="space-y-3">
          {filteredContacts.map((contact) => (
            <div key={contact.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-slate-50 shadow-sm group active:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <img src={contact.avatar} alt={contact.name} className="w-14 h-14 rounded-2xl object-cover" />
                <div>
                  <p className="font-bold text-slate-800">{contact.name}</p>
                  <p className="text-xs font-semibold text-slate-400">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors">
                  <Send size={18} />
                </button>
                <button className="p-2 text-slate-300">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="font-bold">No contacts found</p>
              <p className="text-xs">Try a different search term</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactsScreen;
