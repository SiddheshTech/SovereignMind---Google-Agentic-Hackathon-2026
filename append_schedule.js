//
const fs = require('fs');

const content = `

function ScheduleModule({ onAction }: { onAction: (id: string, customMessage?: string) => void }) {
  const [tab, setTab] = React.useState<'calendar' | 'timeline' | 'agenda'>('calendar');
  const [search, setSearch] = React.useState('');
  
  const events = [
    { id: 1, title: 'Ops Coordination Brief 1', room: 'Zeta-Core', time: '14:00Z - 15:00Z', date: '2026-06-15' },
    { id: 2, title: 'Network Security Audit', room: 'Alpha-Hub', time: '09:00Z - 11:00Z', date: '2026-06-16' },
  ];

  const handleExport = (format: string) => {
    let content = '';
    let mimeType = 'text/plain';
    
    if (format === 'CSV') {
        content = 'Title,Room,Time,Date\\n' + events.map(e => \`\${e.title},\${e.room},\${e.time},\${e.date}\`).join('\\n');
        mimeType = 'text/csv';
    } else if (format === 'JSON') {
        content = JSON.stringify(events, null, 2);
        mimeType = 'application/json';
    } else if (format === 'ICS') {
        content = \`BEGIN:VCALENDAR\\nVERSION:2.0\\nPRODID:-//Global Platform//EN\\n\`;
        events.forEach(e => {
            content += \`BEGIN:VEVENT\\nSUMMARY:\${e.title}\\nLOCATION:\${e.room}\\nDTSTART:\${e.date.replace(/-/g, '')}T000000Z\\nEND:VEVENT\\n\`;
        });
        content += \`END:VCALENDAR\`;
        mimeType = 'text/calendar';
    } else {
        content = \`Report: \${format}\\n\\n\` + events.map(e => \`\${e.title} - \${e.room} - \${e.time} - \${e.date}\`).join('\\n');
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`schedule-export.\${format.toLowerCase()}\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onAction('schedule-exported', \`Exported to \${format}\`);
  };

  return (
    <div className="h-[500px] flex flex-col pt-0">
       <div className="flex justify-between items-center bg-slate-900 border-b border-slate-800 p-4 -mx-6 -mt-6 mb-6">
          <div className="flex gap-2">
            <button onClick={() => setTab('calendar')} className={\`px-3 py-1 text-xs font-bold rounded \${tab === 'calendar' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-gray-400'}\`}>Calendar</button>
            <button onClick={() => setTab('timeline')} className={\`px-3 py-1 text-xs font-bold rounded \${tab === 'timeline' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-gray-400'}\`}>Timeline</button>
            <button onClick={() => setTab('agenda')} className={\`px-3 py-1 text-xs font-bold rounded \${tab === 'agenda' ? 'bg-sky-500 text-white' : 'bg-slate-800 text-gray-400'}\`}>Agenda</button>
          </div>
          <div className="flex gap-2">
            {['CSV', 'JSON', 'ICS'].map(f => (
              <button key={f} onClick={() => handleExport(f)} className="px-3 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white text-xs font-bold rounded flex items-center gap-2 cursor-pointer">
                {f}
              </button>
            ))}
          </div>
       </div>
       <div className="flex-1 overflow-y-auto space-y-3 p-2 text-sm text-gray-300">
          {tab === 'calendar' && (
              <div className="grid grid-cols-7 gap-1">
                  {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center font-bold text-xs text-gray-500 py-2">{d}</div>)}
                  {Array.from({length: 30}).map((_, i) => (
                      <div key={i} className="aspect-square border border-slate-800 bg-slate-900/30 rounded p-1 hover:bg-slate-800 transition-colors">
                          <div className="text-[10px] text-gray-500">{i+1}</div>
                          {events.filter(e => parseInt(e.date.split('-')[2]) === i+1).map(e => (
                              <div key={e.id} className="text-[8px] bg-sky-500/20 text-sky-400 rounded px-1 truncate mb-1">{e.title}</div>
                          ))}
                      </div>
                  ))}
              </div>
          )}
          {tab === 'timeline' && (
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-6 my-4">
               {events.map((e, index) => (
                 <div key={e.id} className="relative">
                   <div className="absolute -left-[29px] top-1.5 w-3 h-3 bg-sky-500 rounded-full ring-4 ring-slate-950"></div>
                   <div className="text-xs text-sky-400 mb-1">{e.date} • {e.time}</div>
                   <div className="bg-slate-900/50 border border-slate-800 p-3 rounded-lg">
                     <div className="font-bold text-white">{e.title}</div>
                     <div className="text-xs text-gray-500">Location: {e.room}</div>
                   </div>
                 </div>
               ))}
            </div>
          )}
          {tab === 'agenda' && (
            <div>
               <div className="mb-4">
                  <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs focus:outline-none" />
               </div>
               {events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.room.toLowerCase().includes(search.toLowerCase())).map(e => (
                  <div key={e.id} className="p-4 border border-slate-800 bg-slate-900/50 rounded-xl flex justify-between items-center hover:bg-slate-800 transition-colors cursor-pointer mb-2">
                     <div>
                       <div className="font-bold text-white">{e.title}</div>
                       <div className="text-xs text-gray-500 mt-1">Date: {e.date} • Room: {e.room}</div>
                     </div>
                     <div className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-sky-400">{e.time}</div>
                  </div>
               ))}
            </div>
          )}
       </div>
    </div>
  );
}
`;

fs.appendFileSync('src/components/ExecutiveBriefing.tsx', content);

