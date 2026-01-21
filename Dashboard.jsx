import React, { useState } from 'react';
import { Users, DollarSign, TrendingUp, Calendar, Plus, ArrowLeft, Menu, X, Layout, Settings, LogOut, PiggyBank, Eye, Check, AlertCircle, Trash2, Download } from 'lucide-react';

export default function DashboardNutrizionista() {
  const [activeView, setActiveView] = useState('home');
  const [selectedPaziente, setSelectedPaziente] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pazienti, setPazienti] = useState([]);
  const [spese, setSpese] = useState([]);
  const [entrate, setEntrate] = useState([]);
  const [configGiorni, setConfigGiorni] = useState({ ferie: 20, malattia: 5, ferieAttive: false, malattiaAttiva: false });

  const giorniBase = 365 - 52 - 12 - 1;
  const giorniFerie = configGiorni.ferieAttive ? configGiorni.ferie : 0;
  const giorniMalattia = configGiorni.malattiaAttiva ? configGiorni.malattia : 0;
  const giorniLavorativi = giorniBase - giorniFerie - giorniMalattia;
  const giorniRimanentiAnno = Math.ceil((new Date(new Date().getFullYear(), 11, 31) - new Date()) / 86400000);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8FAFC' }}>
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-72 h-full bg-white shadow-2xl p-6">
            <button onClick={() => setIsMenuOpen(false)} className="ml-auto p-2 mb-8"><X size={24} /></button>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-600">Metodo Luvaro</h2>
              <p className="text-sm text-gray-500">Dott.ssa Alexandra Luvaro</p>
              <p className="text-xs text-gray-400">P.IVA IT01700830852</p>
            </div>
            <nav className="space-y-2">
              <MenuBtn icon={<Layout/>} label="Home" active={activeView === 'home'} onClick={() => { setActiveView('home'); setIsMenuOpen(false); }} />
              <MenuBtn icon={<Users/>} label="Pazienti" active={activeView === 'pazienti'} onClick={() => { setActiveView('pazienti'); setIsMenuOpen(false); }} />
              <MenuBtn icon={<DollarSign/>} label="Gestione Finanziaria" active={activeView === 'finanziaria'} onClick={() => { setActiveView('finanziaria'); setIsMenuOpen(false); }} />
              <MenuBtn icon={<Settings/>} label="Impostazioni Spese" active={activeView === 'impostazioni'} onClick={() => { setActiveView('impostazioni'); setIsMenuOpen(false); }} />
            </nav>
          </div>
        </div>
      )}

      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg"><Menu size={24} /></button>
          <h1 className="text-xl font-bold">Dashboard Nutrizionista</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeView === 'home' && <HomePage spese={spese} entrate={entrate} giorniLavorativi={giorniLavorativi} configGiorni={configGiorni} setConfigGiorni={setConfigGiorni} />}
        {activeView === 'pazienti' && <Pazienti pazienti={pazienti} setPazienti={setPazienti} onSelect={(p) => { setSelectedPaziente(p); setActiveView('dettaglio'); }} />}
        {activeView === 'dettaglio' && <Dettaglio paziente={selectedPaziente} onRegistra={() => setActiveView('registra')} onBack={() => setActiveView('pazienti')} />}
        {activeView === 'registra' && <Registra paziente={selectedPaziente} entrate={entrate} setEntrate={setEntrate} spese={spese} onBack={() => setActiveView('dettaglio')} />}
        {activeView === 'finanziaria' && <Finanziaria entrate={entrate} spese={spese} />}
        {activeView === 'impostazioni' && <Impostazioni spese={spese} setSpese={setSpese} giorniRimanenti={giorniRimanentiAnno} />}
      </main>
    </div>
  );
}

function MenuBtn({ icon, label, active, onClick }) {
  return <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-xl ${active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{icon}<span className="font-medium">{label}</span></button>;
}

function HomePage({ spese, entrate, giorniLavorativi, configGiorni, setConfigGiorni }) {
  const accantonamento = spese.reduce((acc, s) => {
    const giorni = Math.ceil((new Date(s.dataScadenza) - new Date()) / 86400000);
    return acc + (giorni > 0 ? s.importo / giorni : 0);
  }, 0);

  const oggi = new Date().toISOString().split('T')[0];
  const entrateOggi = entrate.filter(e => e.data === oggi);
  const lordo = entrateOggi.reduce((acc, e) => acc + e.importo, 0);
  const tasse = entrateOggi.reduce((acc, e) => acc + e.inps, 0);
  const comm = entrateOggi.reduce((acc, e) => acc + e.commissione, 0);
  const salvadanaio = accantonamento + tasse + comm;
  const netto = lordo - salvadanaio;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-blue-100"><Eye className="text-blue-600" size={28} /></div>
        <div>
          <h2 className="text-2xl font-bold">Situazione Oggi</h2>
          <p className="text-sm text-gray-500">Quadro finanziario in tempo reale</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <div className="flex justify-between mb-4">
            <div className="p-4 rounded-2xl bg-blue-100"><DollarSign className="text-blue-600" size={28} /></div>
            <div className="px-3 py-1 bg-blue-50 rounded-full text-xs font-bold text-blue-600">INCASSATO</div>
          </div>
          <p className="text-sm text-gray-500 mb-2">Entrate Lorde</p>
          <p className="text-4xl font-bold text-blue-600">€{lordo.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-3xl border-2 border-orange-200">
          <div className="flex justify-between mb-4">
            <div className="p-4 rounded-2xl bg-white shadow-sm"><PiggyBank className="text-orange-600" size={28} /></div>
            <div className="px-3 py-1 bg-red-100 rounded-full flex items-center gap-1">
              <AlertCircle size={14} className="text-red-600" />
              <span className="text-xs font-bold text-red-700">NON TOCCARE</span>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-2">Salvadanaio</p>
          <p className="text-4xl font-bold text-orange-600 mb-3">€{salvadanaio.toFixed(2)}</p>
          <div className="space-y-2 pt-3 border-t border-orange-200 text-sm">
            <div className="flex justify-between"><span>Accantonamento</span><span>€{accantonamento.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>INPS 4%</span><span>€{tasse.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Commissioni</span><span>€{comm.toFixed(2)}</span></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg border-2" style={{ borderColor: netto > 0 ? '#10B981' : '#EF4444' }}>
          <div className="flex justify-between mb-4">
            <div className="p-4 rounded-2xl" style={{ backgroundColor: netto > 0 ? '#D1FAE5' : '#FEE2E2' }}>
              <TrendingUp style={{ color: netto > 0 ? '#10B981' : '#EF4444' }} size={28} />
            </div>
            <div className={`px-3 py-1 rounded-full flex items-center gap-1 ${netto > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
              {netto > 0 ? <Check size={14} className="text-green-700" /> : <X size={14} className="text-red-700" />}
              <span className={`text-xs font-bold ${netto > 0 ? 'text-green-700' : 'text-red-700'}`}>
                {netto > 0 ? 'DISPONIBILE' : 'DEFICIT'}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-2">Netto Reale</p>
          <p className="text-5xl font-bold" style={{ color: netto > 0 ? '#10B981' : '#EF4444' }}>€{Math.abs(netto).toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-purple-100"><Calendar className="text-purple-600" size={24} /></div>
          <h3 className="text-xl font-bold">Configurazione Giorni Lavorativi</h3>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-5 bg-gray-50 rounded-2xl">
            <p className="text-sm text-gray-600 mb-2">Giorni Base</p>
            <p className="text-4xl font-bold">{365 - 52 - 12 - 1}</p>
          </div>
          <div className="p-5 rounded-2xl bg-blue-50 border-2 border-blue-500">
            <p className="text-sm text-blue-900 mb-2">Giorni Lavorativi</p>
            <p className="text-4xl font-bold text-blue-600">{giorniLavorativi}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200">
            <label className="flex items-center gap-3 mb-4">
              <input type="checkbox" checked={configGiorni.ferieAttive} onChange={(e) => setConfigGiorni({...configGiorni, ferieAttive: e.target.checked})} className="w-5 h-5" />
              <span className="font-semibold">Sottrai Ferie</span>
            </label>
            <input type="number" value={configGiorni.ferie} onChange={(e) => setConfigGiorni({...configGiorni, ferie: parseInt(e.target.value)})} disabled={!configGiorni.ferieAttive} className="w-full p-3 border-2 rounded-xl text-center font-bold text-lg" />
          </div>
          <div className="p-5 bg-red-50 rounded-2xl border border-red-200">
            <label className="flex items-center gap-3 mb-4">
              <input type="checkbox" checked={configGiorni.malattiaAttiva} onChange={(e) => setConfigGiorni({...configGiorni, malattiaAttiva: e.target.checked})} className="w-5 h-5" />
              <span className="font-semibold">Sottrai Malattia</span>
            </label>
            <input type="number" value={configGiorni.malattia} onChange={(e) => setConfigGiorni({...configGiorni, malattia: parseInt(e.target.value)})} disabled={!configGiorni.malattiaAttiva} className="w-full p-3 border-2 rounded-xl text-center font-bold text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Pazienti({ pazienti, setPazienti, onSelect }) {
  const [show, setShow] = useState(false);
  const [n, setN] = useState({ nome: '', eta: '', email: '', tel: '' });

  const add = () => {
    if (n.nome) {
      setPazienti([...pazienti, { ...n, id: Date.now() }]);
      setN({ nome: '', eta: '', email: '', tel: '' });
      setShow(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm flex justify-between">
        <div>
          <h2 className="text-3xl font-bold">I Tuoi Pazienti</h2>
          <p className="text-gray-500">Gestisci i profili</p>
        </div>
        <button onClick={() => setShow(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl"><Plus size={20} />Nuovo</button>
      </div>

      {pazienti.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed border-gray-300">
          <Users className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Nessun Paziente</h3>
          <button onClick={() => setShow(true)} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl">Aggiungi Primo Paziente</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {pazienti.map(p => (
            <div key={p.id} onClick={() => onSelect(p)} className="bg-white p-6 rounded-2xl border hover:border-blue-400 cursor-pointer hover:shadow-lg">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{p.nome}</h3>
                  <p className="text-sm text-gray-500">{p.eta} anni</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="text-blue-600" size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600">{p.email}</p>
            </div>
          ))}
        </div>
      )}

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShow(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6">Nuovo Paziente</h3>
            <div className="space-y-4">
              <input placeholder="Nome" value={n.nome} onChange={(e) => setN({...n, nome: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input placeholder="Età" type="number" value={n.eta} onChange={(e) => setN({...n, eta: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input placeholder="Email" value={n.email} onChange={(e) => setN({...n, email: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input placeholder="Telefono" value={n.tel} onChange={(e) => setN({...n, tel: e.target.value})} className="w-full p-3 border rounded-xl" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={add} className="flex-1 bg-blue-600 text-white py-3 rounded-xl">Crea</button>
              <button onClick={() => setShow(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Dettaglio({ paziente, onRegistra, onBack }) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg">
        <ArrowLeft size={20} />Torna
      </button>
      <div className="bg-white p-6 rounded-3xl shadow-sm flex justify-between">
        <div>
          <h2 className="text-3xl font-bold">{paziente.nome}</h2>
          <p className="text-gray-500">{paziente.eta} anni · {paziente.email}</p>
        </div>
        <button onClick={onRegistra} className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl"><Plus size={20} />Registra Incasso</button>
      </div>
    </div>
  );
}

function Registra({ paziente, entrate, setEntrate, spese, onBack }) {
  const [i, setI] = useState({ data: new Date().toISOString().split('T')[0], importo: 150, metodo: 'Stripe', fattura: true });
  
  const acc = spese.reduce((a, s) => {
    const g = Math.ceil((new Date(s.dataScadenza) - new Date()) / 86400000);
    return a + (g > 0 ? s.importo / g : 0);
  }, 0);

  let inps = 0, comm = 0;
  if (i.metodo === 'Stripe' || i.metodo === 'PayPal' || i.fattura) inps = i.importo * 0.04;
  if (i.metodo === 'Stripe') comm = i.importo * 0.015 + 0.25;
  if (i.metodo === 'PayPal') comm = i.importo * 0.034 + 0.35;

  const netto = i.importo - inps - comm - acc;

  const save = () => {
    setEntrate([...entrate, { ...i, id: Date.now(), paziente: paziente.nome, inps, commissione: comm, quotaSpese: acc, netto }]);
    alert('✅ Incasso registrato!');
    onBack();
  };

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-blue-600"><ArrowLeft size={20} />Indietro</button>
      <div className="bg-white p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-2">Registra Incasso</h2>
        <p className="text-gray-600">Paziente: {paziente.nome}</p>
      </div>
      <div className="bg-white p-6 rounded-3xl">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Data</label>
            <input type="date" value={i.data} onChange={(e) => setI({...i, data: e.target.value})} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Importo (€)</label>
            <input type="number" value={i.importo} onChange={(e) => setI({...i, importo: parseFloat(e.target.value)})} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Metodo</label>
            <select value={i.metodo} onChange={(e) => setI({...i, metodo: e.target.value})} className="w-full p-3 border rounded-xl">
              <option>Stripe</option>
              <option>PayPal</option>
              <option>Bonifico</option>
              <option>Contanti</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-3 mt-8">
              <input type="checkbox" checked={i.fattura} onChange={(e) => setI({...i, fattura: e.target.checked})} className="w-5 h-5" />
              <span>Emetti Fattura (INPS 4%)</span>
            </label>
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200 mb-6">
          <h4 className="font-bold mb-4">Calcolo Automatico</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Importo Lordo</span><span className="font-bold text-green-600">€{i.importo.toFixed(2)}</span></div>
            {inps > 0 && <div className="flex justify-between"><span>- INPS 4%</span><span className="font-bold text-red-600">€{inps.toFixed(2)}</span></div>}
            {comm > 0 && <div className="flex justify-between"><span>- Commissione</span><span className="font-bold text-red-600">€{comm.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span>- Accantonamento</span><span className="font-bold text-orange-600">€{acc.toFixed(2)}</span></div>
            <div className="border-t-2 pt-2 mt-2 flex justify-between">
              <span className="font-bold">Netto Effettivo</span>
              <span className="font-bold text-2xl text-purple-600">€{netto.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button onClick={save} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold">Registra Incasso</button>
      </div>
    </div>
  );
}

function Finanziaria({ entrate, spese }) {
  const tot = entrate.reduce((a, e) => a + e.importo, 0);
  const netto = entrate.reduce((a, e) => a + e.netto, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl">
        <h2 className="text-3xl font-bold">Gestione Finanziaria</h2>
        <p className="text-gray-500">Analisi completa</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Transazioni</p>
          <p className="text-3xl font-bold">{entrate.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Lordo Totale</p>
          <p className="text-3xl font-bold text-blue-600">€{tot.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl text-center shadow-sm">
          <p className="text-sm text-gray-600 mb-1">Netto Reale</p>
          <p className="text-3xl font-bold text-green-600">€{netto.toFixed(2)}</p>
        </div>
      </div>

      {entrate.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed">
          <p className="text-gray-500">Nessuna transazione registrata</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2">
              <tr>
                <th className="p-4 text-left text-sm font-bold">Data</th>
                <th className="p-4 text-left text-sm font-bold">Paziente</th>
                <th className="p-4 text-right text-sm font-bold">Lordo</th>
                <th className="p-4 text-right text-sm font-bold">INPS</th>
                <th className="p-4 text-right text-sm font-bold">Comm</th>
                <th className="p-4 text-right text-sm font-bold">Spese</th>
                <th className="p-4 text-right text-sm font-bold">Netto</th>
              </tr>
            </thead>
            <tbody>
              {entrate.map(e => (
                <tr key={e.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 text-sm">{e.data}</td>
                  <td className="p-4 font-medium">{e.paziente}</td>
                  <td className="p-4 text-right font-bold text-blue-600">€{e.importo.toFixed(2)}</td>
                  <td className="p-4 text-right text-sm text-red-600">-€{e.inps.toFixed(2)}</td>
                  <td className="p-4 text-right text-sm text-orange-600">-€{e.commissione.toFixed(2)}</td>
                  <td className="p-4 text-right text-sm text-gray-600">-€{e.quotaSpese.toFixed(2)}</td>
                  <td className="p-4 text-right font-bold text-green-600">€{e.netto.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Impostazioni({ spese, setSpese, giorniRimanenti }) {
  const [show, setShow] = useState(false);
  const [n, setN] = useState({ nome: '', importo: '', dataScadenza: '', tipo: 'fisso' });

  const add = () => {
    if (n.nome && n.importo && n.dataScadenza) {
      setSpese([...spese, { ...n, id: Date.now(), importo: parseFloat(n.importo) }]);
      setN({ nome: '', importo: '', dataScadenza: '', tipo: 'fisso' });
      setShow(false);
    }
  };

  const accTot = spese.reduce((a, s) => {
    const g = Math.ceil((new Date(s.dataScadenza) - new Date()) / 86400000);
    return a + (g > 0 ? s.importo / g : 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm flex justify-between">
        <div>
          <h2 className="text-3xl font-bold">Impostazioni Spese</h2>
          <p className="text-gray-500">Gestisci costi fissi e flessibili</p>
        </div>
        <button onClick={() => setShow(true)} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl"><Plus size={20} />Nuova Spesa</button>
      </div>

      {spese.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border-2 border-dashed">
          <p className="text-gray-500 mb-4">Nessuna spesa configurata</p>
          <button onClick={() => setShow(true)} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Aggiungi Prima Spesa</button>
        </div>
      ) : (
        <div className="space-y-4">
          {spese.map(s => {
            const giorni = Math.ceil((new Date(s.dataScadenza) - new Date()) / 86400000);
            const accGiorn = giorni > 0 ? s.importo / giorni : 0;
            return (
              <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-lg">{s.nome}</h4>
                  <p className="text-sm text-gray-500">€{s.importo} · Scadenza: {s.dataScadenza} · {s.tipo}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">Accantona €{accGiorn.toFixed(2)}/giorno</p>
                </div>
                <button onClick={() => setSpese(spese.filter(x => x.id !== s.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-300">
        <h4 className="font-bold text-green-900 mb-2">Accantonamento Giornaliero Totale</h4>
        <p className="text-3xl font-bold text-green-700">€{accTot.toFixed(2)}/giorno</p>
      </div>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShow(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-6">Nuova Spesa</h3>
            <div className="space-y-4">
              <input placeholder="Nome Spesa" value={n.nome} onChange={(e) => setN({...n, nome: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input placeholder="Importo €" type="number" value={n.importo} onChange={(e) => setN({...n, importo: e.target.value})} className="w-full p-3 border rounded-xl" />
              <input type="date" value={n.dataScadenza} onChange={(e) => setN({...n, dataScadenza: e.target.value})} className="w-full p-3 border rounded-xl" />
              <select value={n.tipo} onChange={(e) => setN({...n, tipo: e.target.value})} className="w-full p-3 border rounded-xl">
                <option value="fisso">Costo Fisso</option>
                <option value="flessibile">Costo Flessibile</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={add} className="flex-1 bg-blue-600 text-white py-3 rounded-xl">Aggiungi</button>
              <button onClick={() => setShow(false)} className="flex-1 bg-gray-200 py-3 rounded-xl">Annulla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
