import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  ListChecks, 
  Search, 
  Filter, 
  Check, 
  X, 
  MoreHorizontal,
  Clock,
  TrendingUp,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ReturnRequest, ReturnStatus, User, ReturnReason } from '../types';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../constants';

interface AdminViewProps {
  user: User;
  returns: ReturnRequest[];
  onUpdateStatus: (id: string, status: ReturnStatus) => void;
}

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export const AdminView: React.FC<AdminViewProps> = ({ user, returns, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'returns'>('dashboard');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // --- KPI Logic ---
  const pendingReturns = returns.filter(r => r.status === ReturnStatus.CREATED || r.status === ReturnStatus.VALIDATED).length;
  const totalProcessed = returns.filter(r => r.status === ReturnStatus.REFUNDED || r.status === ReturnStatus.REFUSED).length;
  const avgSatisfaction = useMemo(() => {
    const rated = returns.filter(r => r.satisfaction);
    if (!rated.length) return 0;
    return (rated.reduce((acc, curr) => acc + (curr.satisfaction || 0), 0) / rated.length).toFixed(1);
  }, [returns]);

  // --- Chart Data Mock ---
  const trendData = [
    { name: 'Lun', retours: 2 },
    { name: 'Mar', retours: 5 },
    { name: 'Mer', retours: 3 },
    { name: 'Jeu', retours: 8 },
    { name: 'Ven', retours: 4 },
    { name: 'Sam', retours: 6 },
    { name: 'Dim', retours: 4 },
  ];

  const reasonData = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(ReturnReason).forEach(r => counts[r] = 0);
    returns.forEach(r => {
      if (counts[r.reason] !== undefined) counts[r.reason]++;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).filter(x => x.value > 0);
  }, [returns]);


  // --- Filter Logic ---
  const filteredReturns = returns.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || r.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Big Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">En Attente</h3>
            <Clock className="text-yellow-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{pendingReturns}</p>
          <p className="text-xs text-green-500 mt-1 flex items-center">+5% vs hier</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Temps Moyen</h3>
            <TrendingUp className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">2.4 <span className="text-sm font-normal text-gray-400">jours</span></p>
          <p className="text-xs text-green-500 mt-1">-0.5j vs semaine dernière</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Satisfaction</h3>
            <DollarSign className="text-purple-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{avgSatisfaction}/5</p>
          <div className="flex mt-1">
             {[1,2,3,4,5].map(s => <div key={s} className={`h-1 w-4 rounded-full mr-1 ${s <= Number(avgSatisfaction) ? 'bg-purple-500' : 'bg-gray-200'}`}></div>)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Alertes (>24h)</h3>
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">2</p>
          <p className="text-xs text-red-500 mt-1 font-medium">Action requise</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Évolution des Retours</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Line type="monotone" dataKey="retours" stroke="#10B981" strokeWidth={3} dot={{r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Motifs de Retour</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={reasonData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="ml-4 space-y-2">
               {reasonData.map((entry, index) => (
                 <div key={index} className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length]}}></div>
                    {entry.name} ({entry.value})
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReturnList = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher ID, Email..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <button 
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${filterStatus === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Tous
          </button>
          <button 
             onClick={() => setFilterStatus(ReturnStatus.CREATED)}
             className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1 ${filterStatus === ReturnStatus.CREATED ? 'bg-yellow-100 text-yellow-700 ring-1 ring-yellow-400' : 'bg-gray-100 text-gray-600'}`}
          >
            <Clock size={14} /> En Attente
          </button>
          <button 
             onClick={() => setFilterStatus(ReturnStatus.VALIDATED)}
             className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${filterStatus === ReturnStatus.VALIDATED ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-400' : 'bg-gray-100 text-gray-600'}`}
          >
            Validés
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">ID / Date</th>
              <th className="px-6 py-4">Produit</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Motif</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReturns.map((ret) => {
              const order = MOCK_ORDERS.find(o => o.id === ret.orderId);
              const product = MOCK_PRODUCTS.find(p => p.sku === order?.productSku);

              return (
                <tr key={ret.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{ret.id}</div>
                    <div className="text-xs text-gray-400">{ret.requestDate}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-200 flex-shrink-0">
                         {product && <img src={product.image} className="w-full h-full object-cover rounded" alt="" />}
                      </div>
                      <span className="truncate max-w-[150px]">{product?.name || 'Inconnu'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{ret.clientEmail}</div>
                    <div className="text-xs text-gray-400">Via App Mobile</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {ret.reason}
                    </span>
                    {ret.proofImage && (
                       <div className="text-xs text-blue-600 mt-1 flex items-center gap-1 cursor-pointer">
                          <Check size={10} /> Preuve reçue
                       </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${ret.status === ReturnStatus.CREATED ? 'bg-yellow-100 text-yellow-700' : 
                        ret.status === ReturnStatus.VALIDATED ? 'bg-blue-100 text-blue-700' :
                        ret.status === ReturnStatus.REFUSED ? 'bg-red-100 text-red-700' : 
                        'bg-green-100 text-green-700'}`}>
                      {ret.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {ret.status === ReturnStatus.CREATED && (
                      <div className="flex justify-end gap-2">
                         <button 
                           onClick={() => onUpdateStatus(ret.id, ReturnStatus.REFUSED)}
                           className="p-1.5 text-red-600 hover:bg-red-50 rounded border border-red-200" title="Refuser">
                           <X size={16} />
                         </button>
                         <button 
                           onClick={() => onUpdateStatus(ret.id, ReturnStatus.VALIDATED)}
                           className="p-1.5 text-green-600 hover:bg-green-50 rounded border border-green-200" title="Valider">
                           <Check size={16} />
                         </button>
                      </div>
                    )}
                    {ret.status !== ReturnStatus.CREATED && (
                       <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal size={18} />
                       </button>
                    )}
                  </td>
                </tr>
              );
            })}
             {filteredReturns.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Aucun retour trouvé.
                   </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">R</div>
          <span className="font-bold text-gray-800 text-lg">Retours Express <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">{user.city}</p>
           </div>
           <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
         <div className="flex gap-4 mb-6">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <LayoutDashboard size={18} /> Tableau de Bord
            </button>
            <button 
              onClick={() => setActiveTab('returns')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${activeTab === 'returns' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <ListChecks size={18} /> Gestion Demandes
              {pendingReturns > 0 && <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingReturns}</span>}
            </button>
         </div>

         {activeTab === 'dashboard' ? renderDashboard() : renderReturnList()}
      </main>
    </div>
  );
};
