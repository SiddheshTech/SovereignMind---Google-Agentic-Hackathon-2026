const fs = require('fs');
let lines = fs.readFileSync('src/components/OperatorDashboard.tsx', 'utf8').split('\n');

const startIdx = lines.findIndex(l => l.includes("activeItem === 'executive-briefing' ? ("));
const endIdx = lines.findIndex(l => l.includes("Module \"{activeItem}\" is currently offline or unlinked."));

if (startIdx !== -1 && endIdx !== -1) {
    // The `<div className="max-w-[1200px] mx-auto space-y-6">` starts right after `executive-briefing' ? (`
    // The fallback `( <div ... > Module ... </div> )` starts with `) : (`.
    // Let's find the closing parenthesis before `) : (`.

    const fallbackIdx = lines.findIndex((l, i) => i > startIdx && l.trim() === ') : (');
    
    if (fallbackIdx !== -1) {
        const newLines = [
            ...lines.slice(0, startIdx + 1),
            "          <ExecutiveBriefing />",
            ...lines.slice(fallbackIdx)
        ];
        fs.writeFileSync('src/components/OperatorDashboard.tsx', newLines.join('\n'));
        console.log('Successfully updated OperatorDashboard.tsx');
    } else {
        console.log('Could not find fallback block');
    }
} else {
    console.log('Could not find executive-briefing or fallback');
}
