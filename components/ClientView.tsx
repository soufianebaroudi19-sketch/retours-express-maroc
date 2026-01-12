import React, { useState } from 'react';
import { 
  Plus, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ChevronRight, 
  Camera,
  MapPin,
  Home,
  Store,
  ArrowLeft
} from 'lucide-react';
import { Order, ReturnRequest, ReturnReason, ReturnMode, ReturnStatus, Product, User } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface ClientViewProps {
  user: User;
  orders: Order[];
  returns: ReturnRequest[];
  onCreateReturn: (req: Omit<ReturnRequest, 'id' | 'status' | 'progress' | 'timeline'>) => void;
}

const STEPS = ['Produit', 'Motif', 'Mode', 'Récap'];

export const ClientView: React.FC<ClientViewProps> = ({ user, orders, returns, onCreateReturn }) => {
  const [view, setView] = useState<'dashboard' | 'create' | 'tracking'>('dashboard');
  const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);

  // Form State
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState<ReturnReason | null>(null);
  const [returnDescription, setReturnDescription] = useState('');
  const [returnMode, setReturnMode] = useState<ReturnMode | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const activeReturns = returns.filter(r => r.clientEmail === user.email);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Mock upload - in real app, upload to server
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedOrder && returnReason && returnMode) {
      onCreateReturn({
        orderId: selectedOrder.id,
        clientEmail: user.email,
        requestDate: new Date().toISOString().split('T')[0],
        reason: returnReason,
        description: returnDescription,
        proofImage: uploadedImage || undefined,
        returnMode: returnMode,
      });
      setView('dashboard');
      // Reset form
      setCurrentStep(0);
      setSelectedOrder(null);
      setReturnReason(null);
      setReturnMode(null);
      setUploadedImage(null);
      setReturnDescription('');
    }
  };

  const getProduct = (sku: string) => MOCK_PRODUCTS.find(p => p.sku === sku);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Bonjour, {user.name}</h1>
        <p className="opacity-90">Gérez vos retours en toute simplicité.</p>
        <button 
          onClick={() => setView('create')}
          className="mt-4 bg-white text-emerald-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-50 transition"
        >
          <Plus size={20} />
          Nouveau Retour
        </button>
      </div>

      {/* Active Returns */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Mes Retours en cours</h2>
        {activeReturns.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
            <Package className="mx-auto text-gray-300 mb-2" size={48} />
            <p className="text-gray-500">Aucun retour actif pour le moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeReturns.map(ret => {
              const order = orders.find(o => o.id === ret.orderId);
              const product = order ? getProduct(order.productSku) : null;
              
              return (
                <div 
                  key={ret.id} 
                  onClick={() => { setSelectedReturnId(ret.id); setView('tracking'); }}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-emerald-200 transition"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                        {product && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{product?.name}</h3>
                        <p className="text-xs text-gray-500">CMD: {ret.orderId}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${ret.status === ReturnStatus.CREATED ? 'bg-yellow-100 text-yellow-700' : 
                        ret.status === ReturnStatus.VALIDATED ? 'bg-blue-100 text-blue-700' :
                        ret.status === ReturnStatus.REFUNDED ? 'bg-green-100 text-green-700' : 
                        'bg-gray-100 text-gray-700'}`}>
                      {ret.status}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progression</span>
                      <span>{ret.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${ret.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Eligible Orders */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Commandes éligibles</h2>
        <div className="space-y-3">
          {orders.map(order => {
             const product = getProduct(order.productSku);
             return (
              <div key={order.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden">
                      {product && <img src={product.image} alt="prod" className="w-full h-full object-cover" />}
                   </div>
                   <div>
                     <p className="text-sm font-medium text-gray-900">{product?.name}</p>
                     <p className="text-xs text-gray-500">Éligible jusqu'au {order.returnDeadline}</p>
                   </div>
                </div>
                <button 
                  onClick={() => { setSelectedOrder(order); setView('create'); setCurrentStep(1); }}
                  className="text-emerald-600 text-sm font-medium hover:underline"
                >
                  Retourner
                </button>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );

  const renderCreateReturn = () => (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-200 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-xl font-bold ml-2">Nouvelle demande</h2>
      </div>

      {/* Stepper */}
      <div className="flex justify-between mb-8 px-4">
        {STEPS.map((step, idx) => (
          <div key={step} className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300
              ${idx <= currentStep ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}
            `}>
              {idx + 1}
            </div>
            <span className="text-xs mt-1 text-gray-600">{step}</span>
          </div>
        ))}
        {/* Connector Line - simplified visual */}
        <div className="absolute left-8 right-8 top-[88px] h-0.5 bg-gray-200 -z-0" />
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
        {currentStep === 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sélectionnez un produit</h3>
            {orders.map(order => {
              const product = getProduct(order.productSku);
              return (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-xl border cursor-pointer flex items-center gap-4 transition ${selectedOrder?.id === order.id ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={product?.image} alt={product?.name} className="w-16 h-16 rounded object-cover bg-gray-100" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{product?.name}</h4>
                    <p className="text-sm text-gray-500">Acheté le {order.purchaseDate}</p>
                    <p className="text-xs text-emerald-600 mt-1">Prix: {product?.price} MAD</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Pourquoi retournez-vous ce produit ?</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(ReturnReason).map((reason) => (
                <button
                  key={reason}
                  onClick={() => setReturnReason(reason)}
                  className={`p-3 text-sm rounded-xl border text-center transition ${returnReason === reason ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-medium' : 'border-gray-200 text-gray-600'}`}
                >
                  {reason}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description (Optionnel)</label>
              <textarea 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                rows={3}
                placeholder="Détails supplémentaires..."
                value={returnDescription}
                onChange={(e) => setReturnDescription(e.target.value)}
              />
            </div>

            {returnReason === ReturnReason.DEFECTIVE && (
               <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Camera size={16} /> Preuve photo (Obligatoire)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {uploadedImage ? (
                              <img src={uploadedImage} alt="Preview" className="h-20 object-contain" />
                            ) : (
                              <>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Cliquez pour uploader</span></p>
                                <p className="text-xs text-gray-500">JPG, PNG (MAX. 2MB)</p>
                              </>
                            )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
               </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Mode de retour</h3>
            
            <button onClick={() => setReturnMode(ReturnMode.HOME)} className={`w-full p-4 rounded-xl border flex items-center gap-4 text-left transition ${returnMode === ReturnMode.HOME ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
              <div className="bg-white p-2 rounded-full shadow-sm"><Home className="text-emerald-600" /></div>
              <div>
                <div className="font-semibold">Collecte à Domicile</div>
                <div className="text-xs text-gray-500">Un agent passera sous 2-3 jours.</div>
              </div>
            </button>

            <button onClick={() => setReturnMode(ReturnMode.RELAY)} className={`w-full p-4 rounded-xl border flex items-center gap-4 text-left transition ${returnMode === ReturnMode.RELAY ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
              <div className="bg-white p-2 rounded-full shadow-sm"><MapPin className="text-blue-600" /></div>
              <div>
                <div className="font-semibold">Point Relais</div>
                <div className="text-xs text-gray-500">Déposez le colis au point le plus proche.</div>
              </div>
            </button>

            <button onClick={() => setReturnMode(ReturnMode.STORE)} className={`w-full p-4 rounded-xl border flex items-center gap-4 text-left transition ${returnMode === ReturnMode.STORE ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'}`}>
              <div className="bg-white p-2 rounded-full shadow-sm"><Store className="text-purple-600" /></div>
              <div>
                <div className="font-semibold">Dépôt en Magasin</div>
                <div className="text-xs text-gray-500">Immédiat, sans frais.</div>
              </div>
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Tout est prêt !</h3>
            <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Produit</span>
                <span className="font-medium">{getProduct(selectedOrder!.productSku)?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Motif</span>
                <span className="font-medium">{returnReason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mode</span>
                <span className="font-medium">{returnMode}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">En confirmant, une étiquette de retour sera générée automatiquement.</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-between items-center max-w-md mx-auto">
        <button 
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(prev => prev - 1)}
          className="text-gray-500 font-medium disabled:opacity-30 px-4 py-2"
        >
          Retour
        </button>
        <button 
          onClick={() => {
            if (currentStep === 3) {
              handleSubmit();
            } else {
              // Simple validation
              if (currentStep === 0 && !selectedOrder) return;
              if (currentStep === 1 && !returnReason) return;
              if (currentStep === 1 && returnReason === ReturnReason.DEFECTIVE && !uploadedImage) {
                 alert("La photo est obligatoire pour les produits défectueux.");
                 return;
              }
              if (currentStep === 2 && !returnMode) return;
              setCurrentStep(prev => prev + 1);
            }
          }}
          className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 shadow-md flex items-center gap-2"
        >
          {currentStep === 3 ? 'Confirmer' : 'Suivant'}
          {currentStep !== 3 && <ChevronRight size={18} />}
        </button>
      </div>
    </div>
  );

  const renderTracking = () => {
    const ret = returns.find(r => r.id === selectedReturnId);
    if (!ret) return null;

    const steps = [
      { id: ReturnStatus.CREATED, label: 'Demande créée' },
      { id: ReturnStatus.VALIDATED, label: 'Validé par magasin' },
      { id: ReturnStatus.COLLECTED, label: 'Collecté' },
      { id: ReturnStatus.TRANSIT, label: 'En transit' },
      { id: ReturnStatus.RECEIVED, label: 'Reçu' },
      { id: ReturnStatus.REFUNDED, label: 'Remboursé / Clôturé' },
    ];

    const currentIdx = steps.findIndex(s => s.id === ret.status);

    return (
      <div className="pb-10">
         <div className="flex items-center mb-6">
            <button onClick={() => setView('dashboard')} className="p-2 hover:bg-gray-200 rounded-full">
            <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold ml-2">Suivi #{ret.id}</h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-gray-100 rounded-lg">
                    {/* Placeholder for product img */}
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Package />
                    </div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">Retour en cours</h3>
                    <p className="text-sm text-gray-500">Estimé: 2-7 jours</p>
                    <button className="text-emerald-600 text-xs font-semibold mt-2 border border-emerald-200 px-2 py-1 rounded">
                        Télécharger l'étiquette
                    </button>
                </div>
            </div>

            {/* Vertical Timeline */}
            <div className="relative pl-4 space-y-8 before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {steps.map((step, idx) => {
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                        <div key={step.id} className="relative flex items-center gap-4">
                            <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white 
                                ${isCompleted ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}
                            `}>
                                {isCompleted && <CheckCircle size={12} className="text-white" />}
                            </div>
                            <div className={`${isCurrent ? 'text-emerald-700 font-bold' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                <p className="text-sm">{step.label}</p>
                                {isCurrent && <p className="text-xs text-emerald-600 animate-pulse">En cours...</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Support Chatbot Teaser */}
        <div className="mt-6 bg-blue-50 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <p className="text-sm font-semibold text-blue-900">Besoin d'aide ?</p>
                    <p className="text-xs text-blue-700">Discutez avec notre assistant virtuel.</p>
                </div>
            </div>
            <button className="bg-white text-blue-600 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm">
                Chat
            </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans">
      <div className="p-4 pt-8">
        {view === 'dashboard' && renderDashboard()}
        {view === 'create' && renderCreateReturn()}
        {view === 'tracking' && renderTracking()}
      </div>
    </div>
  );
};
