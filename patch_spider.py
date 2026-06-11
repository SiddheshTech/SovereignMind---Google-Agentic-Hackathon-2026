import re

with open("client/src/components/AnalyticsDashboard.tsx", "r") as f:
    content = f.read()

# Replace ScoringView spider chart with dynamic math calculation
spider_logic_old = """          {/* Polygon representation */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
             <polygon 
               points="50,15 80,35 70,80 20,70 15,40" 
               fill="rgba(59, 130, 246, 0.2)" 
               stroke={PALETTE.blue} 
               strokeWidth="1.5" 
             />
             <polygon 
               points="50,25 70,45 60,70 30,60 25,45" 
               fill="none" 
               stroke="rgba(255,255,255,0.2)" 
               strokeWidth="1" 
               strokeDasharray="2 2"
             />
          </svg>

          {/* Labels */}
          <span className="absolute -top-6 text-[10px] font-mono text-gray-400">INSTITUTIONAL</span>
          <span className="absolute -bottom-6 text-[10px] font-mono text-gray-400">LOGISTICS</span>
          <span className="absolute -left-10 text-[10px] font-mono text-gray-400">CYBER</span>
          <span className="absolute -right-8 text-[10px] font-mono text-gray-400">ENERGY</span>"""

spider_logic_new = """          {/* Polygon representation */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
             <polygon 
               points={scoring.map((s: any, i: number) => {
                 const angle = (Math.PI * 2 * i) / scoring.length - Math.PI / 2;
                 const radius = (s.score / 100) * 45; // Max radius 45 to fit in viewBox
                 const x = 50 + radius * Math.cos(angle);
                 const y = 50 + radius * Math.sin(angle);
                 return `${x},${y}`;
               }).join(' ')} 
               fill="rgba(59, 130, 246, 0.2)" 
               stroke={PALETTE.blue} 
               strokeWidth="1.5" 
             />
             <polygon 
               points={scoring.map((s: any, i: number) => {
                 const angle = (Math.PI * 2 * i) / scoring.length - Math.PI / 2;
                 const radius = (s.baseline / 100) * 45; // Max radius 45
                 const x = 50 + radius * Math.cos(angle);
                 const y = 50 + radius * Math.sin(angle);
                 return `${x},${y}`;
               }).join(' ')} 
               fill="none" 
               stroke="rgba(255,255,255,0.2)" 
               strokeWidth="1" 
               strokeDasharray="2 2"
             />
          </svg>

          {/* Labels */}
          {scoring.map((s: any, i: number) => {
             const angle = (Math.PI * 2 * i) / scoring.length - Math.PI / 2;
             const radius = 55; // Labels outside the polygon
             const x = 50 + radius * Math.cos(angle);
             const y = 50 + radius * Math.sin(angle);
             return (
               <div key={i} className="absolute text-[10px] font-mono text-gray-400 text-center whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
                 {s.label.split(' ')[0].toUpperCase()}
               </div>
             );
          })}"""

content = content.replace(spider_logic_old, spider_logic_new)

with open("client/src/components/AnalyticsDashboard.tsx", "w") as f:
    f.write(content)
