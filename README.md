# 📊 Dashboard Metodo Luvaro

Dashboard finanziaria professionale per nutrizionisti che seguono il Metodo Luvaro.

## 🎯 Caratteristiche Principali

- **Situazione Finanziaria Real-Time**: Visualizza entrate lorde, salvadanaio accantonamenti e netto disponibile
- **Gestione Pazienti**: Aggiungi e gestisci i profili dei tuoi pazienti
- **Registrazione Incassi**: Traccia ogni incasso con calcolo automatico di INPS, commissioni e accantonamenti
- **Gestione Spese**: Configura costi fissi e flessibili con accantonamento giornaliero automatico
- **Calcolo Giorni Lavorativi**: Sistema intelligente che tiene conto di ferie, malattia, festività

## 🚀 Come Iniziare

### Prerequisiti
- Node.js (versione 16 o superiore)
- npm o yarn

### Installazione

```bash
# Clona il repository
git clone https://github.com/licabattaglia1-dot/metodo-luvaro-cloud.git

# Entra nella cartella
cd metodo-luvaro-cloud

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:5173`

### Build per Produzione

```bash
npm run build
```

## 📁 Struttura del Progetto

```
metodo-luvaro-cloud/
├── Dashboard.jsx          # Componente principale
├── package.json          # Dipendenze del progetto
├── vite.config.js        # Configurazione Vite
├── tailwind.config.js    # Configurazione Tailwind CSS
├── index.html            # Entry point HTML
└── README.md            # Questo file
```

## 💡 Funzionalità Dettagliate

### Home Dashboard
- **Entrate Lorde**: Totale incassato nella giornata
- **Salvadanaio**: Somma di accantonamenti + INPS + commissioni (NON TOCCARE!)
- **Netto Reale**: Quanto puoi effettivamente spendere
- **Configurazione Giorni**: Personalizza i giorni lavorativi annuali

### Gestione Pazienti
- Aggiungi nuovi pazienti con nome, età, email e telefono
- Visualizza tutti i pazienti in card eleganti
- Accesso rapido al dettaglio di ogni paziente

### Registrazione Incassi
- Seleziona il paziente
- Inserisci importo e metodo di pagamento (Stripe, PayPal, Bonifico, Contanti)
- Calcolo automatico di:
  - INPS 4% (se fatturato)
  - Commissioni (Stripe: 1.5% + €0.25, PayPal: 3.4% + €0.35)
  - Quota giornaliera spese
- Visualizza subito il netto effettivo

### Gestione Spese
- Aggiungi spese fisse o flessibili
- Imposta data di scadenza
- Calcolo automatico dell'accantonamento giornaliero
- Visualizza il totale da accantonare ogni giorno

### Gestione Finanziaria
- Tabella completa di tutte le transazioni
- Visualizza lordo, tasse, commissioni, spese e netto per ogni incasso
- Statistiche aggregate (totale transazioni, lordo totale, netto reale)

## 🛠 Tecnologie Utilizzate

- **React 18**: Framework UI
- **Vite**: Build tool velocissimo
- **Tailwind CSS**: Styling utility-first
- **Lucide React**: Icone moderne

## 📝 Prossimi Sviluppi

- [ ] Persistenza dati con database
- [ ] Export PDF/Excel dei report
- [ ] Grafici e analytics avanzati
- [ ] Sistema di backup automatico
- [ ] Integrazione con software di fatturazione
- [ ] App mobile nativa

## 👥 Autore

Dashboard sviluppata per **Dott.ssa Alexandra Luvaro**  
P.IVA: IT01700830852

## 📄 Licenza

Questo progetto è di proprietà privata. Tutti i diritti riservati.

## 🤝 Contribuire

Per suggerimenti o miglioramenti, contatta direttamente la Dott.ssa Luvaro.

---

**Metodo Luvaro** - Gestione finanziaria professionale per nutrizionisti 💪
