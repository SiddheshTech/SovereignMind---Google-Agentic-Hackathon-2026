import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure ESM imports work correctly
const __dirname = path.resolve();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini Client with standard headers & safety checks
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey !== "") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini AI client successfully initialized server-side.');
    } catch (e) {
      console.log('Failed to initialize Gemini Client. Running in simulated fallback mode.');
    }
  } else {
    console.log('No GEMINI_API_KEY found or using placeholder. Running in Simulation/Fallback mode.');
  }

  // Pre-configured simulation metrics and briefs for fast loading or offline usage
  const SIMULATED_BRIEFS: { [key: string]: string } = {
    baseline: "Global intelligence systems indicate stabilized cargo velocities. European corridors report 94.2% operational efficiency. India's national resilience index increased by 3.8% due to localized solar infrastructure investments; however, water table stress vectors in Northern provinces remain pre-cleared for priority reserve distribution by 2032. Sub-Saharan micro-grids show steady battery capacities.",
    geomagnetic_storm: "URGENT: Celestial forecast designates Class G5 geomagnetic storm sequence active from solar region 3664. Sovereign backup solar grids in Alpine Sector-12 and Tokyo-NE have successfully isolated main transformers. Satellite navigation interference stands at 72% across maritime supply lines. High-frequency communication networks are on dynamic packet-diversion routing.",
    mekong_drought: "ALERT: Drought levels in the Mekong Basin have reached a 45-year critical peak. Lower basin river cooperatives have triggered Emergency Water Allocation Treaty Article 14. Food export projections indicate a 14.2% deficit across trade pipelines. Agricultural reserves in Zurich and Singapore have activated contingency rice storage locks for secondary distribution.",
    suez_blockade: "CRITICAL: Sovereign dispute at Suez bottlenecks has led to a complete canal blockade. Container rerouting autopilot is actively guiding 182 vessels around Cape Route, introducing an average transit latency of +11.4 days. Global supply chain friction ratings spiked by 18%. Singapore logistics centers have deployed automated corridor cargo sorting."
  };

  const SIMULATED_METRICS: { [key: string]: any } = {
    baseline: {
      stabilityScore: 92.4,
      resilienceIndex: 88.7,
      crisisProbability: 18.2,
      governanceEffectiveness: 85.1,
      economicFragility: 28.3,
      institutionalTrust: 79.4,
      socialCohesion: 81.2,
      emergencyReadiness: 90.5
    },
    geomagnetic_storm: {
      stabilityScore: 68.2,
      resilienceIndex: 84.1,
      crisisProbability: 88.5,
      governanceEffectiveness: 72.8,
      economicFragility: 48.9,
      institutionalTrust: 66.2,
      socialCohesion: 70.4,
      emergencyReadiness: 94.8
    },
    mekong_drought: {
      stabilityScore: 78.4,
      resilienceIndex: 79.2,
      crisisProbability: 64.1,
      governanceEffectiveness: 80.5,
      economicFragility: 42.1,
      institutionalTrust: 74.8,
      socialCohesion: 71.9,
      emergencyReadiness: 85.2
    },
    suez_blockade: {
      stabilityScore: 81.9,
      resilienceIndex: 82.5,
      crisisProbability: 71.3,
      governanceEffectiveness: 82.4,
      economicFragility: 57.6,
      institutionalTrust: 76.1,
      socialCohesion: 78.5,
      emergencyReadiness: 88.0
    }
  };

  const SIMULATED_NATION_PROFILES: { [countryCode: string]: { [scenario: string]: any } } = {
    IN: {
      baseline: {
        stabilityScore: 88,
        resilienceIndex: 85,
        securityOverview: "India key stability nodes are strong. Urban corridor investments in renewable mini-grids successfully cushion power grids. However, water tables represent long-term regional vulnerability under high heat stress.",
        waterScarcityRisk: "Stressed",
        foodSupplyStatus: "Optimal (Reserve buffer: 240 days)",
        energyGridBuffer: "Stable (+12.5% solar buffer)",
        geopoliticalTension: "Medium (Border status: Guarded)",
        criticalActions: [
          "Deploy regional canal drip irrigation monitors",
          "Extend central grain silos with automated humidity lockers",
          "Pre-approve municipal micro-hybrid network sharing"
        ]
      },
      geomagnetic_storm: {
        stabilityScore: 78,
        resilienceIndex: 81,
        securityOverview: "Space weather induces high induction currents along the Indo-Gangetic power corridor. AI grid balancing acts continuously to shed non-essential industrial loads, maintaining healthcare and transportation networks during peaks.",
        waterScarcityRisk: "Stable (Pumping backup diesel offline)",
        foodSupplyStatus: "Optimal",
        energyGridBuffer: "Disrupted (Inverter protection active)",
        geopoliticalTension: "Medium",
        criticalActions: [
          "Isolate high-voltage central sub-grid transformers",
          "Initialize optical fiber backup packet-switching lines",
          "Activate decentralized local solar enclaves"
        ]
      },
      mekong_drought: {
        stabilityScore: 80,
        resilienceIndex: 82,
        securityOverview: "Mekong drought triggers trade-pipeline shifts. India acts as secondary agricultural corridor exporter. Rice export storage locks are opened, which reduces domestic consumer cushion but stabilizes neighboring nations.",
        waterScarcityRisk: "Severe (Lower basin allocations active)",
        foodSupplyStatus: "Caution (Domestic export bans applied)",
        energyGridBuffer: "Stable",
        geopoliticalTension: "High (Friction with downstream transits)",
        criticalActions: [
          "Enforce national water conservation guidelines across agricultural hubs",
          "Accelerate water recycling pipeline construction",
          "Initiate hyper-accurate crop monitoring satellites"
        ]
      },
      suez_blockade: {
        stabilityScore: 84,
        resilienceIndex: 83,
        securityOverview: "Suez bypass routes increase maritime export latency on Indian Ocean channels by 8 days. Fuel supply reserves are adequate to cover temporary shipping latency. Inland trade terminals handle diverted containers efficiently.",
        waterScarcityRisk: "Normal",
        foodSupplyStatus: "Optimal",
        energyGridBuffer: "Stable (Strategic oil/coal reserve enabled)",
        geopoliticalTension: "Medium (Indian Ocean naval patrols increased)",
        criticalActions: [
          "Coordinate dry-port container storage reallocation",
          "Pre-authorize maritime fuel credit buffers",
          "Provide priority shipping lanes for life-saving therapeutics"
        ]
      }
    },
    US: {
      baseline: {
        stabilityScore: 94,
        resilienceIndex: 91,
        securityOverview: "North American infrastructure commands robust strategic depth. Agricultural yield forecasts show peak surpluses. Microgrid penetration stands at 16.5%, insulating main nodes from systemic shock wave cascades.",
        waterScarcityRisk: "Low (Colorado River reservoirs stabilized)",
        foodSupplyStatus: "Abundant (Buffer: 400+ days)",
        energyGridBuffer: "Optimal (+18% grid buffer)",
        geopoliticalTension: "Low",
        criticalActions: [
          "Accelerate municipal hydrogen storage projects",
          "Conduct sovereign cybersecurity pentests on digital water loops",
          "Approve federal micro-grid emergency interconnection rules"
        ]
      },
      geomagnetic_storm: {
        stabilityScore: 71,
        resilienceIndex: 86,
        securityOverview: "Major geomagnetic interference detected along Northern border grid lines. Automatic grid shut-offs protected 95% of transformers. Space command has successfully routed telemetry through optical arrays.",
        waterScarcityRisk: "Low",
        foodSupplyStatus: "Optimal",
        energyGridBuffer: "Stressed (Dynamic battery load isolation online)",
        geopoliticalTension: "Low",
        criticalActions: [
          "Deploy static magnetic ground absorbers",
          "Transition main pipeline pumping to manual-backup actuators",
          "Deploy emergency local transceiver stations"
        ]
      },
      mekong_drought: {
        stabilityScore: 92,
        resilienceIndex: 93,
        securityOverview: "Pacific grain export queues swell as global demand shifts away from distressed Southeast Asian providers. US agricultural logistics networks operate at 105% capacity. Domestic consumer prices remain stable.",
        waterScarcityRisk: "Moderate (Great Plains aquifer drawing active)",
        foodSupplyStatus: "Optimal (Export shipping prioritizations enforced)",
        energyGridBuffer: "Optimal",
        geopoliticalTension: "Medium (Pacific trade alignments stressed)",
        criticalActions: [
          "Authorize strategic grain logistics expedited corridors",
          "Temporarily waive transport weight limits for grain trucks",
          "Issue global trade credits to vulnerable importers"
        ]
      },
      suez_blockade: {
        stabilityScore: 91,
        resilienceIndex: 90,
        securityOverview: "East Coast port queues register minor backlogs due to delayed European cargo arrivals. Energy grids remain stable. Transcontinental rail buffers absorb a 12% domestic distribution load shift.",
        waterScarcityRisk: "Low",
        foodSupplyStatus: "Optimal",
        energyGridBuffer: "Optimal (Domestic hydrocarbon production buffer)",
        geopoliticalTension: "Medium (Atlantic trade naval coordination active)",
        criticalActions: [
          "Re-route cargo flows to West Coast ports using overland intermodal rail",
          "Deploy container tracking drones for sensitive food-items",
          "Activate strategic shipping vessel reserve fleets"
        ]
      }
    },
    CH: {
      baseline: {
        stabilityScore: 96,
        resilienceIndex: 95,
        securityOverview: "Switzerland (Sovereign Core Enclave Sector-12) acts as the premium global redundant node. Alpine deep-aquifer reservoirs hold 500+ days of emergency drinking water. Strategic solar canopies guard mountain corridors.",
        waterScarcityRisk: "Zero (Glacial melt collection system optimal)",
        foodSupplyStatus: "Optimal (Tactical Alpine silos: 360 days)",
        energyGridBuffer: "Solid (+25% Alpine hydro & solar reserve)",
        geopoliticalTension: "Low",
        criticalActions: [
          "Extend underground crypto-vault data mirroring channels",
          "Pre-clear municipal hydrogen backup loops",
          "Validate Alpine transit corridor protection bunkers"
        ]
      },
      geomagnetic_storm: {
        stabilityScore: 90,
        resilienceIndex: 94,
        securityOverview: "The deep mountain bedrock shields the central Sovereign Mind databases from terrestrial radiation loops. Smart grid isolators in Swiss solar farms successfully decoupled from European grid grids within 140ms.",
        waterScarcityRisk: "Zero",
        foodSupplyStatus: "Optimal",
        energyGridBuffer: "Optimal (Isolated Alpine battery loops active)",
        geopoliticalTension: "Low",
        criticalActions: [
          "Confirm deep bunker air filtration is on local kinetic power",
          "Establish laser-line backup telemetry to neighboring valleys",
          "Activate underground decentralized rail networks"
        ]
      },
      mekong_drought: {
        stabilityScore: 95,
        resilienceIndex: 94,
        securityOverview: "Switzerland reports high regional stability. European grain supply transfers are routed via Alpine freight corridors with zero friction. National reserve inventories show excellent resilient index levels.",
        waterScarcityRisk: "Zero",
        foodSupplyStatus: "Optimal (Allocating Alpine logistics corridors)",
        energyGridBuffer: "Optimal",
        geopoliticalTension: "Low",
        criticalActions: [
          "Facilitate secure regional logistics swaps in Geneva",
          "Establish carbon-neutral agricultural transit pathways",
          "Provide financial stabilization assets to crisis agricultural zones"
        ]
      },
      suez_blockade: {
        stabilityScore: 94,
        resilienceIndex: 93,
        securityOverview: "Alpine supply tunnels bypass critical ocean trade disruption lanes beautifully. High-value precision manufacturing items are shipped via dynamic air corridors instead, experiencing zero operational lag. Switzerland food reserves remain untouched.",
        waterScarcityRisk: "Zero",
        foodSupplyStatus: "Optimal (Local reserves 100% full)",
        energyGridBuffer: "Optimal",
        geopoliticalTension: "Low (Hosting diplomatic corridor resolutions)",
        criticalActions: [
          "Host automated landlocked cargo swaps for landlocked transit partners",
          "Establish high-capacity dry-terminal transfer grids",
          "Deploy rail transport guards for chemical ingredient imports"
        ]
      }
    }
  };

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // 2. GET API: Civilization Command Brief
  app.get('/api/civilization/brief', async (req, res) => {
    const scenario = (req.query.scenario as string) || 'baseline';
    
    if (!ai) {
      console.log(`[AI-Fallback] Serving simulated brief for scenario: ${scenario}`);
      const text = SIMULATED_BRIEFS[scenario] || SIMULATED_BRIEFS.baseline;
      return res.json({ brief: text, isSimulated: true });
    }

    try {
      console.log(`[AI-API] Requesting real Gemini Brief for scenario: ${scenario}`);
      let prompt = `You are a strategic intelligence system at Sovereign Mind Command Center (NASA Control style). 
Generate a concise, highly analytical intelligence briefing (3-4 sentences maximum) on Global Civilization stability and logistics coordination under the following scenario: "${scenario}". 
Write in a professional, objective, high-stakes tone focusing on global metrics, water safeguards, food pipelines, and regional solar grid capacities. Do not mention that you are an AI. Make it look like a highly polished intelligence brief for a head-of-state. Ensure there are specific statistics and action points included.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      const briefText = response.text?.trim() || SIMULATED_BRIEFS[scenario];
      res.json({ brief: briefText, isSimulated: false });
    } catch (e: any) {
      
      res.json({ brief: SIMULATED_BRIEFS[scenario], isSimulated: true, error: e.message });
    }
  });

  // 3. GET API: Civilization Current Scores (Updates based on global triggers)
  app.get('/api/civilization/metrics', async (req, res) => {
    const scenario = (req.query.scenario as string) || 'baseline';
    const metricsBase = SIMULATED_METRICS[scenario] || SIMULATED_METRICS.baseline;

    if (!ai) {
      // Add slight random perturbation to show "continuously updated" real-time feel
      const perturbed = { ...metricsBase };
      const keys = Object.keys(perturbed);
      keys.forEach(k => {
        const delta = (Math.random() - 0.5) * 1.5; // +/- 0.75%
        perturbed[k] = Math.max(0, Math.min(100, parseFloat((perturbed[k] + delta).toFixed(1))));
      });
      return res.json({ metrics: perturbed, isSimulated: true });
    }

    try {
      const prompt = `Based on the geopolitical scenario: "${scenario}", analyze current global stabilization levels.
Evaluate and output 8 core index metrics as a JSON object:
- stabilityScore (Civilization Stability Score, 0-100)
- resilienceIndex (National Resilience Index, 0-100)
- crisisProbability (Crisis Probability Score, 0-100)
- governanceEffectiveness (Governance Effectiveness Index, 0-100)
- economicFragility (Economic Fragility Score, 0-100)
- institutionalTrust (Institutional Trust Score, 0-100)
- socialCohesion (Social Cohesion Score, 0-100)
- emergencyReadiness (Emergency Readiness Score, 0-100)

Your response must be a strict JSON object conforming to this schema. Add minor variations matching the live scenario.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stabilityScore: { type: Type.NUMBER },
              resilienceIndex: { type: Type.NUMBER },
              crisisProbability: { type: Type.NUMBER },
              governanceEffectiveness: { type: Type.NUMBER },
              economicFragility: { type: Type.NUMBER },
              institutionalTrust: { type: Type.NUMBER },
              socialCohesion: { type: Type.NUMBER },
              emergencyReadiness: { type: Type.NUMBER },
            },
            required: [
              'stabilityScore', 'resilienceIndex', 'crisisProbability', 'governanceEffectiveness',
              'economicFragility', 'institutionalTrust', 'socialCohesion', 'emergencyReadiness'
            ]
          }
        }
      });

      let json = JSON.parse(response.text || '{}');
      res.json({ metrics: json, isSimulated: false });
    } catch (e: any) {
      
      // Give perturbed simulated metrics as fail-safe
      const perturbed = { ...metricsBase };
      res.json({ metrics: perturbed, isSimulated: true, error: e.message });
    }
  });

  // 4. POST API: Generate Nation Deep Intelligence Profile 
  app.post('/api/civilization/nation-profile', async (req, res) => {
    const { countryName, code, scenario } = req.body;
    const fallbackScenario = scenario || 'baseline';
    const fallbackNation = SIMULATED_NATION_PROFILES[code]?.[fallbackScenario] || {
      stabilityScore: 85,
      resilienceIndex: 80,
      securityOverview: `Operational safeguards are active for country: ${countryName}. Logistics and grain reserves are currently stable. Local coordinators are monitoring water tables and power grids.`,
      waterScarcityRisk: 'Moderate',
      foodSupplyStatus: 'Optimal (Buffer: 180 days)',
      energyGridBuffer: 'Stable (+10% solar buffer)',
      geopoliticalTension: 'Medium',
      criticalActions: [
        'Deploy smart water meter grids across farms',
        'Verify emergency battery reserve integrity',
        'Update mutual-aid treaty guidelines'
      ]
    };

    if (!ai) {
      console.log(`[AI-Fallback] Serving simulated nation profile for ${countryName} [${code}] under scenario: ${fallbackScenario}`);
      return res.json({ profile: fallbackNation, isSimulated: true });
    }

    try {
      console.log(`[AI-API] Requesting real Gemini Nation Profile for: ${countryName} under scenario: ${fallbackScenario}`);
      const prompt = `Perform a high-level, bespoke national security & resilience profiling audit for the nation: "${countryName}" (ISO Code: ${code}) under the current simulated scenario: "${fallbackScenario}".
You must output a highly analytical response in strict JSON format containing:
- stabilityScore: a number from 0 to 100
- resilienceIndex: a number from 0 to 100
- securityOverview: a detailed 3-sentence summary of the nation's specific state, logistics bottlenecks, water vulnerability, or energy grid adaptive maneuvers under this scenario.
- waterScarcityRisk: a single word indicating risk like "Low", "Stressed", "Severe", or "Volatile"
- foodSupplyStatus: a short status describing food days-buffer and condition, e.g. "Optimal (220 days reserve)", "Stressed"
- energyGridBuffer: a short description of backup energy capacity, e.g. "Stressed (20% isolated solar)", "Optimal"
- geopoliticalTension: a description of localized tension, e.g. "Elevated (Friction with neighbors)", "Negligible"
- criticalActions: an array of EXACTLY 3 high-priority, highly realistic tactical interventions/policy recommendations the Command Center can execute adjacent to the scenario.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stabilityScore: { type: Type.NUMBER },
              resilienceIndex: { type: Type.NUMBER },
              securityOverview: { type: Type.STRING },
              waterScarcityRisk: { type: Type.STRING },
              foodSupplyStatus: { type: Type.STRING },
              energyGridBuffer: { type: Type.STRING },
              geopoliticalTension: { type: Type.STRING },
              criticalActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: [
              'stabilityScore', 'resilienceIndex', 'securityOverview', 'waterScarcityRisk',
              'foodSupplyStatus', 'energyGridBuffer', 'geopoliticalTension', 'criticalActions'
            ]
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      res.json({ profile: json, isSimulated: false });
    } catch (e: any) {
      
      res.json({ profile: fallbackNation, isSimulated: true, error: e.message });
    }
  });

  // SIMULATED CIVILIZATION GENOME DATA
  const SIMULATED_GENOMES: { [code: string]: any } = {
    IN: {
      countryCode: "IN",
      countryName: "India",
      genes: {
        governance: { leadershipContinuity: 82, institutionalStrength: 76, policyStability: 80, bureaucraticEfficiency: 70 },
        economic: { fiscalResilience: 84, tradeDiversity: 88, inflationResistance: 75, laborAdaptability: 82 },
        social: { socialTrust: 78, communityResilience: 86, educationQuality: 74, culturalCohesion: 80 },
        infrastructure: { energySecurity: 78, transportReliability: 75, digitalConnectivity: 85, healthcareCapacity: 72 }
      },
      similarNations: [
        { countryName: "Japan", countryCode: "JP", overallMatch: 78, reason: "India shares 78% governance resilience traits and macro infrastructure development patterns with Japan." },
        { countryName: "South Korea", countryCode: "KR", overallMatch: 75, reason: "Shares strong social cohesive structures and high-speed digital infrastructure integration." },
        { countryName: "Singapore", countryCode: "SG", overallMatch: 72, reason: "High strategic alignment on policy stability, maritime corridors, and bureaucratic digitization." }
      ]
    },
    CH: {
      countryCode: "CH",
      countryName: "Switzerland",
      genes: {
        governance: { leadershipContinuity: 95, institutionalStrength: 98, policyStability: 96, bureaucraticEfficiency: 92 },
        economic: { fiscalResilience: 96, tradeDiversity: 92, inflationResistance: 94, laborAdaptability: 88 },
        social: { socialTrust: 94, communityResilience: 92, educationQuality: 92, culturalCohesion: 88 },
        infrastructure: { energySecurity: 92, transportReliability: 96, digitalConnectivity: 94, healthcareCapacity: 95 }
      },
      similarNations: [
        { countryName: "Singapore", countryCode: "SG", overallMatch: 86, reason: "Extremely high fiscal resilience, robust banking systems, and strict governance discipline." },
        { countryName: "Norway", countryCode: "NO", overallMatch: 84, reason: "High institutional trust, massive emergency reserves, and localized strategic energy autonomy." },
        { countryName: "Japan", countryCode: "JP", overallMatch: 81, reason: "High transport system reliability, long-term policy outlooks, and social stability." }
      ]
    },
    US: {
      countryCode: "US",
      countryName: "United States",
      genes: {
        governance: { leadershipContinuity: 85, institutionalStrength: 88, policyStability: 82, bureaucraticEfficiency: 78 },
        economic: { fiscalResilience: 90, tradeDiversity: 95, inflationResistance: 80, laborAdaptability: 92 },
        social: { socialTrust: 68, communityResilience: 82, educationQuality: 88, culturalCohesion: 72 },
        infrastructure: { energySecurity: 92, transportReliability: 85, digitalConnectivity: 96, healthcareCapacity: 90 }
      },
      similarNations: [
        { countryName: "United Kingdom", countryCode: "GB", overallMatch: 84, reason: "Shares structural governance principles, institutional legal frameworks, and linguistic cultural links." },
        { countryName: "Germany", countryCode: "DE", overallMatch: 80, reason: "Advanced industrial capabilities, strong trade diversify portfolios, and comparable logistics complexity." },
        { countryName: "Japan", countryCode: "JP", overallMatch: 75, reason: "High digital communication density, high healthcare capacity, and strategic defense grids." }
      ]
    },
    JP: {
      countryCode: "JP",
      countryName: "Japan",
      genes: {
        governance: { leadershipContinuity: 88, institutionalStrength: 90, policyStability: 92, bureaucraticEfficiency: 86 },
        economic: { fiscalResilience: 85, tradeDiversity: 90, inflationResistance: 88, laborAdaptability: 80 },
        social: { socialTrust: 92, communityResilience: 94, educationQuality: 90, culturalCohesion: 95 },
        infrastructure: { energySecurity: 76, transportReliability: 98, digitalConnectivity: 94, healthcareCapacity: 92 }
      },
      similarNations: [
        { countryName: "Singapore", countryCode: "SG", overallMatch: 82, reason: "Matches on incredible transport reliability, low corruption indexes, and social trust." },
        { countryName: "South Korea", countryCode: "KR", overallMatch: 80, reason: "Overlapping geographic risks, advanced digital connectivity, and high institutional strength." },
        { countryName: "Switzerland", countryCode: "CH", overallMatch: 78, reason: "Elite focus on precise physical transport systems, structural high consensus, and long-term policies." }
      ]
    },
    SG: {
      countryCode: "SG",
      countryName: "Singapore",
      genes: {
        governance: { leadershipContinuity: 96, institutionalStrength: 94, policyStability: 95, bureaucraticEfficiency: 98 },
        economic: { fiscalResilience: 92, tradeDiversity: 82, inflationResistance: 86, laborAdaptability: 90 },
        social: { socialTrust: 90, communityResilience: 85, educationQuality: 96, culturalCohesion: 86 },
        infrastructure: { energySecurity: 80, transportReliability: 96, digitalConnectivity: 98, healthcareCapacity: 94 }
      },
      similarNations: [
        { countryName: "Switzerland", countryCode: "CH", overallMatch: 85, reason: "Comparable wealth index, micro sovereign defense strategies, and elite planning focus." },
        { countryName: "Japan", countryCode: "JP", overallMatch: 81, reason: "Stellar city logistics, high citizen social trust, and highly efficient public safety networks." },
        { countryName: "South Korea", countryCode: "KR", overallMatch: 78, reason: "Advanced manufacturing core, strong education quality, and universal high-stakes technology adoption." }
      ]
    }
  };

  // SIMULATED COLLAPSE PATTERNS ATLAS DATA
  const SIMULATED_COLLAPSES: { [name: string]: any } = {
    roman_empire: {
      name: "Roman Empire (Western)",
      period: "27 BC – 476 AD",
      similarityScore: 45,
      collapseIndicators: [
        "Over-expansion and extreme military overhead costs",
        "Severe currency debasement (95% drop in silver content in denarius)",
        "Institutional instability and civil wars (e.g. Year of the Six Emperors)",
        "Barbarian incursions combined with worsening agricultural temperatures"
      ],
      recoveryIndicators: [
        "Byzantine Empire Eastern consolidation (survived another 1000 years)",
        "Devolution into smaller regional agrarian units",
        "Localized self-sustaining administrative bishoprics",
        "Alternative Silk Road supply lane creations"
      ],
      relevanceToCurrent: "The Roman collapse highlights the extreme vulnerability of highly centralized logistics chains when trade corridors are disrupted by synchronous environmental shocks."
    },
    soviet_union: {
      name: "Soviet Union",
      period: "1922 – 1991 AD",
      similarityScore: 32,
      collapseIndicators: [
        "Chronic central-planner economic stagnation",
        "Unsustainable military-industrial expenditure overload",
        "Sudden decentralization of command rules (Glasnost & Perestroika)",
        "Widespread citizen trust decay in official state media"
      ],
      recoveryIndicators: [
        "Rapid localization of municipal services",
        "Emergency transition to regional barter and cooperative agricultural systems",
        "Integration of high-value local state resource assets (e.g., natural gas, oil)",
        "Cooperative mutual support agreements between fragmented post-Soviet states"
      ],
      relevanceToCurrent: "Shows that top-down, rigid central planning without real-time feedback loops is extremely brittle against multi-dimensional economic shortages."
    },
    weimar_germany: {
      name: "Weimar Germany",
      period: "1918 – 1933 AD",
      similarityScore: 58,
      collapseIndicators: [
        "Hyperinflation caused by excessive sovereign debt and money printing",
        "Extreme polarization and street-level political violence",
        "Erosion of democratic institutions using emergency judicial powers",
        "Severe dependency on volatile external lines of credit (e.g. Dawes Plan)"
      ],
      recoveryIndicators: [
        "Introduction of the Rentenmark secured by real-estate assets",
        "Subsequent post-WWII Allied Marshal reconstruction plan",
        "Stabilization of manufacturing hubs with unified federal labor unions",
        "Enacting strong central constitutional protections for judicial separation"
      ],
      relevanceToCurrent: "Weimar Germany represents a warning of how monetary fragility can trigger severe social trust breakdowns, paving the way for authoritarian state takeovers."
    },
    yugoslavia: {
      name: "SFR Yugoslavia",
      period: "1945 – 1992 AD",
      similarityScore: 28,
      collapseIndicators: [
        "Ethno-nationalist factionalism active under economic stress",
        "Severe foreign debt crisis and sudden IMF-prescribed austerity",
        "Complete collapse of the federal coordination engine",
        "Hyper-regionalized blockades of domestic industrial energy corridors"
      ],
      recoveryIndicators: [
        "Localized state stabilization paths",
        "Targeted bilateral trading pacts",
        "Integration with European Union commercial trade protocols",
        "Localized community-based agricultural self-reliance"
      ],
      relevanceToCurrent: "A key case study on how external financial shocks can easily escalate existing societal divisions into physical logistics balkanization."
    }
  };

  // 4a. POST API: Civilization Genome PROFILE
  app.post('/api/civilization/genome-dna', async (req, res) => {
    const { countryCode } = req.body;
    const code = (countryCode || 'IN').toUpperCase();
    const fallbackProfile = SIMULATED_GENOMES[code] || SIMULATED_GENOMES['IN'];

    if (!ai) {
      console.log(`[AI-Fallback] Serving simulated genome profile for ${code}`);
      return res.json({ profile: fallbackProfile, isSimulated: true });
    }

    try {
      console.log(`[AI-API] Requesting real Gemini genome profile for: ${code}`);
      const prompt = `Perform a civilization genome profile audit for country with ISO code: "${code}"
You must return a response in strict JSON format containing detailed evaluations of 16 genes categorized under 4 categories (scores 0-100 indicating stability and resilience depth), plus 3 similar nations for comparative intelligence.

Expected JSON schema:
{
  "countryCode": "${code}",
  "countryName": "string name",
  "genes": {
    "governance": {
      "leadershipContinuity": number (0-100),
      "institutionalStrength": number (0-100),
      "policyStability": number (0-100),
      "bureaucraticEfficiency": number (0-100)
    },
    "economic": {
      "fiscalResilience": number (0-100),
      "tradeDiversity": number (0-100),
      "inflationResistance": number (0-100),
      "laborAdaptability": number (0-100)
    },
    "social": {
      "socialTrust": number (0-100),
      "communityResilience": number (0-100),
      "educationQuality": number (0-100),
      "culturalCohesion": number (0-100)
    },
    "infrastructure": {
      "energySecurity": number (0-100),
      "transportReliability": number (0-100),
      "digitalConnectivity": number (0-100),
      "healthcareCapacity": number (0-100)
    }
  },
  "similarNations": [
    {
      "countryName": "string name",
      "countryCode": "string ISO",
      "overallMatch": number (0-100),
      "reason": "precise 1-sentence comparative reason why their stability/governance matches"
    }
  ]
}
Make the values highly realistic to geopolitical truths. For example, India should score high on community resilience, moderate-high on digital connectivity and trade diversity, but reflect targets for bureaucratic efficiency and infrastructure. Switzerland should score high on almost everything, with peak scores on fiscal resilience and policy stability. Output ONLY the JSON object.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              countryCode: { type: Type.STRING },
              countryName: { type: Type.STRING },
              genes: {
                type: Type.OBJECT,
                properties: {
                  governance: {
                    type: Type.OBJECT,
                    properties: {
                      leadershipContinuity: { type: Type.NUMBER },
                      institutionalStrength: { type: Type.NUMBER },
                      policyStability: { type: Type.NUMBER },
                      bureaucraticEfficiency: { type: Type.NUMBER }
                    },
                    required: ['leadershipContinuity', 'institutionalStrength', 'policyStability', 'bureaucraticEfficiency']
                  },
                  economic: {
                    type: Type.OBJECT,
                    properties: {
                      fiscalResilience: { type: Type.NUMBER },
                      tradeDiversity: { type: Type.NUMBER },
                      inflationResistance: { type: Type.NUMBER },
                      laborAdaptability: { type: Type.NUMBER }
                    },
                    required: ['fiscalResilience', 'tradeDiversity', 'inflationResistance', 'laborAdaptability']
                  },
                  social: {
                    type: Type.OBJECT,
                    properties: {
                      socialTrust: { type: Type.NUMBER },
                      communityResilience: { type: Type.NUMBER },
                      educationQuality: { type: Type.NUMBER },
                      culturalCohesion: { type: Type.NUMBER }
                    },
                    required: ['socialTrust', 'communityResilience', 'educationQuality', 'culturalCohesion']
                  },
                  infrastructure: {
                    type: Type.OBJECT,
                    properties: {
                      energySecurity: { type: Type.NUMBER },
                      transportReliability: { type: Type.NUMBER },
                      digitalConnectivity: { type: Type.NUMBER },
                      healthcareCapacity: { type: Type.NUMBER }
                    },
                    required: ['energySecurity', 'transportReliability', 'digitalConnectivity', 'healthcareCapacity']
                  }
                },
                required: ['governance', 'economic', 'social', 'infrastructure']
              },
              similarNations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    countryName: { type: Type.STRING },
                    countryCode: { type: Type.STRING },
                    overallMatch: { type: Type.NUMBER },
                    reason: { type: Type.STRING }
                  },
                  required: ['countryName', 'countryCode', 'overallMatch', 'reason']
                }
              }
            },
            required: ['countryCode', 'countryName', 'genes', 'similarNations']
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      res.json({ profile: json, isSimulated: false });
    } catch (e: any) {
      
      res.json({ profile: fallbackProfile, isSimulated: true, error: e.message });
    }
  });

  // 4b. POST API: Collapse patterns exploration
  app.post('/api/civilization/collapse-search', async (req, res) => {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const key = query.toLowerCase().replace(/[^a-z0-9]/g, '_');
    let fallbackCollapse = SIMULATED_COLLAPSES[key] || Object.values(SIMULATED_COLLAPSES).find((v: any) => v.name.toLowerCase().includes(query.toLowerCase()));
    
    if (!fallbackCollapse) {
      fallbackCollapse = {
        name: query,
        period: "Historic Chronology (Preserved)",
        similarityScore: Math.floor(Math.random() * 30) + 20,
        collapseIndicators: [
          "Severe debasement of native exchange currencies or active market inflation",
          "Decentralization or fracturing of federal central command rules",
          "Synchronous drought or water shortages breaking food trade pipelines",
          "Vulnerability of cross-border logistics to regional defense triggers"
        ],
        recoveryIndicators: [
          "Consolidation of local municipal survival cooperatives",
          "Localized dry-terminal agricultural reserves with dynamic allocations",
          "Rerouting of transport paths with backup localized energy grids",
          "Transition of core resources to asset-backed emergency currencies"
        ],
        relevanceToCurrent: "Shows the vulnerability of highly centralized systems. Local asset buffers (drinking water, mini-grids) are mathematically the only proven shield."
      };
    }

    if (!ai) {
      console.log(`[AI-Fallback] Serving simulated search response for collapse: ${query}`);
      return res.json({ result: fallbackCollapse, isSimulated: true });
    }

    try {
      console.log(`[AI-API] Requesting search analysis from Gemini for: ${query}`);
      const prompt = `Analyze historical civilization collapse patterns matching: "${query}".
You must return a response in strict JSON format. Research indicators of its collapse, indicators of recovery/survival strategies, and its relevance to modern global systemic vulnerabilities.

JSON schema:
{
  "name": "Exact Name of Historical State/Empire",
  "period": "Start Year – End Year (e.g., 27 BC – 476 AD)",
  "similarityScore": number (indicating systemic risk similarity to modern multi-stressed nations, 0-100),
  "collapseIndicators": [
    "precise, historic-fact indicator 1",
    "precise, historic-fact indicator 2",
    "precise, historic-fact indicator 3",
    "precise, historic-fact indicator 4"
  ],
  "recoveryIndicators": [
    "precise, historic-fact recovery path 1",
    "precise, historic-fact recovery path 2",
    "precise, historic-fact recovery path 3",
    "precise, historic-fact recovery path 4"
  ],
  "relevanceToCurrent": "A 2-sentence highly professional, objective geopolitical warning comparing the historic indicators directly to modern challenges (inflation, energy transitions, climate volatility)."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              period: { type: Type.STRING },
              similarityScore: { type: Type.NUMBER },
              collapseIndicators: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recoveryIndicators: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              relevanceToCurrent: { type: Type.STRING }
            },
            required: ['name', 'period', 'similarityScore', 'collapseIndicators', 'recoveryIndicators', 'relevanceToCurrent']
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      res.json({ result: json, isSimulated: false });
    } catch (e: any) {
      
      res.json({ result: fallbackCollapse, isSimulated: true, error: e.message });
    }
  });

  // ==========================================
  // CONSTITUTIONAL INTELLIGENCE ENDPOINTS
  // ==========================================

  // 1. Constitutional Validation of Policy Proposal
  app.post('/api/civilization/constitutional-validate', async (req, res) => {
    const { proposal } = req.body;
    const query = (proposal || '').toLowerCase().trim();

    const validationFallbacks: { [key: string]: any } = {
      "national internet shutdown": {
        safetyScore: 14,
        riskScore: 86,
        civilLibertyImpact: "High",
        recommendation: "Rejected",
        zone: "Red",
        constitutionalPoints: [
          "Secures electronic communication systems temporarily during a state-sponsored active cyber engagement.",
          "Requires explicit, certified authorization from a multi-chamber judicial review panel."
        ],
        violations: [
          "Directly breaches Article 19 regarding freedom of text and basic communication transmission.",
          "Imposes systematic non-targeted civilian containment, violating constitutional proportional action tests.",
          "Collapses crucial local municipal medical and coordinate support routing indices."
        ],
        explanation: "Dynamic state-wide network shuts are constitutionally disproportionate under standard emergency criteria. Localized, defense-screen filter loops must cover compromised nodes instead."
      },
      "water exception declaration": {
        safetyScore: 68,
        riskScore: 32,
        civilLibertyImpact: "Medium",
        recommendation: "Approved with Amendments",
        zone: "Yellow",
        constitutionalPoints: [
          "Constitutional obligation to preserve citizen biological baseline gives power to manage scarce survival goods.",
          "Authorizes dynamic, priority-based rationing of public fresh-water reserves."
        ],
        violations: [
          "Risk of exceeding state executive parameters if extended past 45 cycles without federal legislative confirmation.",
          "Potential legal risk regarding rural aquifers and private-well expropriation vectors."
        ],
        explanation: "Approved as valid under state existence doctrine but requires continuous public auditing and an explicit, non-extendential sunset parameter."
      },
      "automated drone defense deployment": {
        safetyScore: 45,
        riskScore: 55,
        civilLibertyImpact: "High",
        recommendation: "Rejected",
        zone: "Red",
        constitutionalPoints: [
          "Protects territorial aerospace buffer zones under Article 51 self-preservation clauses.",
          "Reduces direct human losses for national sovereign intelligence forces."
        ],
        violations: [
          "Constitutional allocation bounds prohibit the state from delegating kinetic force decision-making to non-human algorithmic models.",
          "Absence of a definitive legal chain of responsibility violates international self-defense covenants."
        ],
        explanation: "Kinetic decisions cannot be delegated to an AI autonomous loop. For legal validity, drone arrays must operate as simple passive shields with human-in-the-loop target authentication."
      }
    };

    // Simple matching
    let matchedFallback = validationFallbacks[query];
    if (!matchedFallback) {
      // Find a partial match if possible
      const key = Object.keys(validationFallbacks).find(k => query.includes(k) || k.includes(query));
      if (key) {
        matchedFallback = validationFallbacks[key];
      } else {
        // Generic dynamic fallback
        const length = query.length || 10;
        const safety = Math.abs((length * 7) % 71) + 20; // Pseudo random score 20-90
        const risk = 100 - safety;
        let pImpact = "Medium";
        let rec = "Approved with Amendments";
        let zone = "Yellow";
        if (safety < 40) {
          pImpact = "High";
          rec = "Rejected";
          zone = "Red";
        } else if (safety > 75) {
          pImpact = "Low";
          rec = "Approved";
          zone = "Green";
        }
        matchedFallback = {
          safetyScore: safety,
          riskScore: risk,
          civilLibertyImpact: pImpact,
          recommendation: rec,
          zone: zone,
          constitutionalPoints: [
            "Aligns with default state directives to secure citizens under emergency situations.",
            "Can be enacted as a transient, non-permanent procedural adjustment."
          ],
          violations: [
            "Requires careful judicial oversight to prevent potential excess of authority.",
            "Potential civil liberty restriction vectors under prolonged conditions."
          ],
          explanation: `Analyzed "${proposal || 'Custom Directive'}" under standard sovereignty principles. Centered structural indices put legal security buffer at ${safety}%, recommending a ${zone} zone protocol.`
        };
      }
    }

    if (!ai) {
      console.log(`[AI-Fallback] Serving simulated constitutional validation for: ${proposal}`);
      return res.json({ result: matchedFallback, isSimulated: true });
    }

    try {
      console.log(`[AI-API] Assisting with AI Constitutional Validation for: ${proposal}`);
      const prompt = `Assess the constitutional validity and safety scoring of the following governance proposal: "${proposal}".
You must return a response in strict JSON format mapping to the exact schema:
{
  "safetyScore": number (indicating constitutional alignment and legality, from 0 to 100),
  "riskScore": number (constitutional risk rating, from 0 to 100, where riskScore + safetyScore equals 100),
  "civilLibertyImpact": "High" | "Medium" | "Low",
  "recommendation": "Approved" | "Approved with Amendments" | "Rejected",
  "zone": "Green" | "Yellow" | "Red",
  "constitutionalPoints": [
    "specific constitutional valid support point 1",
    "specific constitutional valid support point 2",
    "specific constitutional valid support point 3"
  ],
  "violations": [
    "specific violation, threat, or constitutional challenge indicator 1",
    "specific violation, threat, or constitutional challenge indicator 2",
    "specific violation, threat, or constitutional challenge indicator 3"
  ],
  "explanation": "A concise 2-sentence formal constitutional analysis citing systemic legal guidelines or parameters."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              safetyScore: { type: Type.NUMBER },
              riskScore: { type: Type.NUMBER },
              civilLibertyImpact: { type: Type.STRING },
              recommendation: { type: Type.STRING },
              zone: { type: Type.STRING },
              constitutionalPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              violations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              explanation: { type: Type.STRING }
            },
            required: ['safetyScore', 'riskScore', 'civilLibertyImpact', 'recommendation', 'zone', 'constitutionalPoints', 'violations', 'explanation']
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      res.json({ result: json, isSimulated: false });
    } catch (e: any) {
      
      res.json({ result: matchedFallback, isSimulated: true, error: e.message });
    }
  });

  // 2. Emergency Powers Simulator
  app.post('/api/civilization/simulate-emergency', async (req, res) => {
    const { scenario } = req.body;
    const key = (scenario || '').toLowerCase().trim();

    const emergencyFallbacks: { [key: string]: any } = {
      "pandemic": {
        scenario: "Pandemic Exception Mode",
        allowedActions: [
          "Establish targeted quarantine zones in high-infection regional vectors.",
          "Enforce vaccine distribution schedules to critical service workers.",
          "Mandate tele-work structures across civil governance units."
        ],
        restrictedActions: [
          "Indefinite closure of primary regional courts or civilian dispute tribunals.",
          "Arbitrary freeze on digital asset distribution or financial accounts.",
          "Restriction of basic medical access to non-registered or unverified citizens."
        ],
        judicialRisk: { level: "Medium", description: "Courts will scrutinize length of lockdowns, requiring continuous bi-weekly scientific re-evaluations." },
        politicalRisk: { level: "Low", description: "Public support is generally high if restrictions are distributed fairly and public support packages are sustained." },
        treatyImpact: "Suspends standard cross-border tourist entry codes, causing friction with neighboring transit pact partners."
      },
      "war": {
        scenario: "War and Territorial Invasion Defense State",
        allowedActions: [
          "Requisition private manufacturing lines to compile military logistics and electronics.",
          "Impose dynamic regional blackout and communication protocols.",
          "Enlist reserve intelligence officers code-named for national coordinate defense."
        ],
        restrictedActions: [
          "Suspension of fundamental human rights (Article 4 covenants, including torture rules).",
          "Summary field military tribunals without judicial representation codes.",
          "Indefinite postponement of basic legislative elections past treaty boundaries."
        ],
        judicialRisk: { level: "Low", description: "Judicial structures grant maximum executive authority under defense crisis provisions." },
        politicalRisk: { level: "Low", description: "High citizen cohesion around federal authority, although draft requirements strain labor metrics." },
        treatyImpact: "Triggers regional collective defense treaties, drawing friendly tactical cohorts into common aerospace defense boundaries."
      },
      "natural disaster": {
        scenario: "Natural Disaster State of Emergency",
        allowedActions: [
          "Expropriate heavy machinery and water systems for instant survival distribution.",
          "Establish emergency civilian relocation camps in public arenas.",
          "Exempt relief transport logistics from standard customs and toll boundaries."
        ],
        restrictedActions: [
          "Forced permanent resettlement of citizens without legal compensation and review.",
          "Disabling of secondary communication relays or news networks near the disaster zone.",
          "Unrestricted search and entry into private properties without immediate life-saving justification."
        ],
        judicialRisk: { level: "Low", description: "Minimal judicial risk if actions directly address immediate safety, humanitarian, and shelter tasks." },
        politicalRisk: { level: "Low", description: "Generally seen as an index of high executive leadership, boosting cohesion if response is fast." },
        treatyImpact: "Enables immediate treaty access parameters, permitting entry of search-and-rescue teams under UN guidelines."
      },
      "economic collapse": {
        scenario: "Economic and Currency Collapse Emergency Mode",
        allowedActions: [
          "Enact temporary capital controls and withdrawals ceilings on central banks.",
          "Distribute basic survival resource rations (food baskets, medicine) via electronic ledger vouchers.",
          "Intervene dynamically in price settings of essential utility commodities (power, grain)."
        ],
        restrictedActions: [
          "Unilateral nullification of structural foreign sovereign public debt covenants.",
          "Expropriation of deposits held by foreign diplomatic missions or accredited agencies.",
          "Banning of physical barter networks or decentralized local community trade circles."
        ],
        judicialRisk: { level: "High", description: "Extreme risk of private asset challenges, international arbitration, and property rights lawsuits." },
        politicalRisk: { level: "High", description: "Severe risk of civil unrest, general strikes, and systemic collapse of faith in state currency stability." },
        treatyImpact: "Breaches core bilateral trade treaties and IMF credit agreements, triggering automatic standard credit rating degradation and asset freezes."
      }
    };

    let matchedFallback = emergencyFallbacks[key];
    if (!matchedFallback) {
      // Pick dynamic default if mismatched
      matchedFallback = emergencyFallbacks["economic collapse"];
    }

    if (!ai) {
      console.log(`[AI-Fallback] Serving simulated emergency response for scenario: ${scenario}`);
      return res.json({ result: matchedFallback, isSimulated: true });
    }

    try {
      console.log(`[AI-API] Requesting emergency power simulation from Gemini: ${scenario}`);
      const prompt = `Simulate constitutional actions, limits, and risks during a state of exception caused by: "${scenario}".
You must return a response in strict JSON format mapping to the exact schema:
{
  "scenario": "Exact Capitalized Name of Scenario",
  "allowedActions": [
    "Allowed dynamic executive action 1 (e.g. temporary movement restrictions with caveats)",
    "Allowed dynamic executive action 2",
    "Allowed dynamic executive action 3"
  ],
  "restrictedActions": [
    "Strictly restricted / forbidden action 1 (e.g. suspension of habeas corpus or torture)",
    "Strictly restricted / forbidden action 2",
    "Strictly restricted / forbidden action 3"
  ],
  "judicialRisk": { "level": "High" | "Medium" | "Low", "description": "precise brief explanation of courts' intervention potential" },
  "politicalRisk": { "level": "High" | "Medium" | "Low", "description": "precise brief explanation of opposition and public trust degradation potential" },
  "treatyImpact": "A 2-sentence description of how emergency actions affect regional defense, human rights, or international trade commitments."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenario: { type: Type.STRING },
              allowedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              restrictedActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              judicialRisk: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['level', 'description']
              },
              politicalRisk: {
                type: Type.OBJECT,
                properties: {
                  level: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['level', 'description']
              },
              treatyImpact: { type: Type.STRING }
            },
            required: ['scenario', 'allowedActions', 'restrictedActions', 'judicialRisk', 'politicalRisk', 'treatyImpact']
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      res.json({ result: json, isSimulated: false });
    } catch (e: any) {
      
      res.json({ result: matchedFallback, isSimulated: true, error: e.message });
    }
  });

  // 3. Treaty Constraint Analyzer
  app.post('/api/civilization/treaty-constraints', async (req, res) => {
    const { proposal } = req.body;
    const query = (proposal || 'General Emergency Actions').trim();

    const treatyFallback = {
      proposal: query,
      agreements: [
        {
          category: "International Agreements",
          status: query.toLowerCase().includes("internet") ? "Strained" : "Stable",
          impact: "Sovereign communications remain subject to UN Human Rights charters protecting access to information. Direct shut down triggers formal UN warnings."
        },
        {
          category: "Defense Treaties",
          status: query.toLowerCase().includes("drone") ? "Strained" : "Stable",
          impact: "Automated kinetic operations conflict with cooperative NATO/regional rules demanding human accountability and clear command chain integration."
        },
        {
          category: "Trade Agreements",
          status: query.toLowerCase().includes("water") || query.toLowerCase().includes("exception") ? "Strained" : "Stable",
          impact: "Resource requisition rules may infringe on bilateral trade dispute treaties unless classified strictly as essential life security preservation."
        },
        {
          category: "Climate Commitments",
          status: "Stable",
          impact: "Environmental covenants contain express bypass triggers during crisis situations, preventing legal claims from impeding immediate local survival programs."
        }
      ]
    };

    if (!ai) {
      console.log(`[AI-Fallback] Serving simulated treaty constraints for: ${proposal}`);
      return res.json({ result: treatyFallback, isSimulated: true });
    }

    try {
      console.log(`[AI-API] Requesting treaty constraint analysis from Gemini for: ${proposal}`);
      const prompt = `Analyze the treaty compliance and obligation constraints for the following proposal or state decision: "${proposal}".
You must return a response in strict JSON format mapping to the exact schema:
{
  "proposal": "Exact name of proposal analysed",
  "agreements": [
    { "category": "International Agreements", "status": "Stable" | "Strained" | "Violated", "impact": "precise impact details" },
    { "category": "Defense Treaties", "status": "Stable" | "Strained" | "Violated", "impact": "precise impact details" },
    { "category": "Trade Agreements", "status": "Stable" | "Strained" | "Violated", "impact": "precise impact details" },
    { "category": "Climate Commitments", "status": "Stable" | "Strained" | "Violated", "impact": "precise impact details" }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              proposal: { type: Type.STRING },
              agreements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    status: { type: Type.STRING },
                    impact: { type: Type.STRING }
                  },
                  required: ['category', 'status', 'impact']
                }
              }
            },
            required: ['proposal', 'agreements']
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      res.json({ result: json, isSimulated: false });
    } catch (e: any) {
      
      res.json({ result: treatyFallback, isSimulated: true, error: e.message });
    }
  });

  // ==========================================
  // SYNTHETIC CIVILIZATION SANDBOX ENDPOINTS
  // ==========================================
  app.post('/api/sandbox/simulate-crises', async (req, res) => {
    const { crises } = req.body; // array of strings (e.g. ['Cyberattack', 'Major earthquake'])
    const activeCrises: string[] = Array.isArray(crises) ? crises : ['Cyberattack'];
    
    // Core intelligent algorithmic fallback values based on selected crises
    const hasCyber = activeCrises.includes('Cyberattack');
    const hasEarthquake = activeCrises.includes('Major earthquake');
    const hasBanking = activeCrises.includes('Banking collapse');
    const hasBorder = activeCrises.includes('Border conflict');
    const hasPandemic = activeCrises.includes('Pandemic resurgence');

    const intensity = activeCrises.length || 1;

    // Build intelligent, cohesive fallback variables
    const calculatedGdpImpact = -(hasBanking ? 8.5 : 2.0) - (hasEarthquake ? 5.0 : 1.0) - (hasCyber ? 3.0 : 0.5) - (hasBorder ? 4.0 : 0.8) - (hasPandemic ? 3.5 : 1.0);
    const calculatedUnemployment = 4.2 + (hasBanking ? 7.8 : 1.2) + (hasEarthquake ? 3.5 : 0.5) + (hasCyber ? 2.0 : 0.2) + (hasBorder ? 2.5 : 0.5) + (hasPandemic ? 4.0 : 1.0);
    const calculatedFear = Math.min(98, 25 + (hasCyber ? 25 : 5) + (hasEarthquake ? 35 : 5) + (hasBanking ? 20 : 5) + (hasBorder ? 30 : 5) + (hasPandemic ? 25 : 5));
    const calculatedProtest = Math.min(95, 10 + (hasBanking ? 45 : 5) + (hasCyber ? 15 : 2) + (hasBorder ? 20 : 2) + (hasPandemic ? 25 : 5));
    const calculatedInflation = 1.8 + (hasBanking ? 12.5 : 1.5) + (hasCyber ? 4.0 : 0.5) + (hasEarthquake ? 3.0 : 0.2) + (hasBorder ? 6.0 : 1.0) + (hasPandemic ? 5.5 : 0.5);
    const calculatedSupplyChain = Math.min(100, (hasEarthquake ? 65 : 10) + (hasCyber ? 45 : 10) + (hasBorder ? 40 : 5) + (hasPandemic ? 50 : 10) + (hasBanking ? 20 : 5));

    const recoveryTimeText = intensity > 3 ? "36 - 48 Months (Deep Systemic Structural Reset)" : intensity > 1 ? "18 - 24 Months" : "8 - 12 Months";

    const titleCombo = activeCrises.join(' x ');
    
    // Structured mock payload matching the requested details
    const fallbackResult = {
      scenarioTitle: `Cascade Event: ${titleCombo || 'Baseline Scenario'}`,
      simulatedPopulation: {
        totalAgents: 10000000 + (intensity * 1250000),
        ageGroups: [
          { group: "Youth (0-18)", percentage: 22, reaction: hasPandemic ? "Educational freezes, high digital strain, localized containment." : "Anxious, highly dependent on parental baseline index." },
          { group: "Young Adults (19-35)", percentage: 31, reaction: hasBanking ? "Severe gig-economy collapse, high digital protest coordinating trends." : "Highly mobilised, leading online narrative counters." },
          { group: "Middle Aged (36-60)", percentage: 33, reaction: hasBanking ? "Asset depletion, protectionist saving behaviors, job-seeking spikes." : "Sustaining local municipal community response buffers." },
          { group: "Seniors (60+)", percentage: 14, reaction: hasEarthquake || hasPandemic ? "Critical healthcare access bottlenecking, isolation patterns." : "Low mobility, maximum reliance on institutional distribution." }
        ],
        incomeClasses: [
          { class: "Low Income", percentage: 40, vulnerability: hasBanking || hasPandemic ? "Extreme. Immediate supply-chain ration reliance. Liquidity constraints." : "High. Highly exposed to transportation and food price spikes." },
          { class: "Middle Income", percentage: 45, vulnerability: hasBanking ? "Severe mortgage and retirement fund value erosion." : "Moderate. Susceptible to job security strain." },
          { class: "High Income", percentage: 15, vulnerability: "Low. Sovereign bond flight, asset diversification protection mechanisms." }
        ],
        politicalPreferences: [
          { faction: "Institutionalists", percentage: Math.max(15, 52 - (intensity * 8)), sentiment: "Urge consolidation of central powers, defensive compliance." },
          { faction: "Alternative Path Proponents", percentage: Math.min(60, 28 + (intensity * 9)), sentiment: "Demand structural migration to decentralized resource ledgers." },
          { faction: "Isolationists", percentage: Math.min(45, 20 + (intensity * 5)), sentiment: "Advocate complete border lockdown and local micro-grid decoupling." }
        ],
        migrationTendencies: {
          rate: intensity > 2 ? "Extreme Outward Surge" : "Moderate Regional Relocation",
          hotspots: [hasEarthquake ? "Disaster epicenter border zones" : "Metro logistical hubs", "Suburban green buffers"],
          description: hasBorder || hasEarthquake ? "Active physical flight from damaged infrastructure and border tactical containment lines." : "Economic flight to rural zones offering lower living-cost index."
        },
        consumptionPatterns: {
          hoardingRisk: intensity > 2 ? "Critical Panic Buying" : "Localized Stress Procurement",
          essentialGoodDemand: "+148% Surge across water, battery cells, dry grain",
          description: "Digital ledgers show heavy capital diversion from discretionary services into physical sovereignty storage vectors."
        }
      },
      economicShock: {
        inflationSpike: Math.round(calculatedInflation * 10) / 10,
        currencyCollapseRisk: hasBanking ? 78 : hasBorder ? 42 : 12,
        supplyChainDisruption: Math.round(calculatedSupplyChain),
        oilCrisisPremium: hasBorder ? 65 : hasCyber ? 25 : 5,
        foodShortagesIndex: hasEarthquake ? 85 : hasPandemic ? 60 : 25,
        outputs: {
          gdpImpact: Math.round(calculatedGdpImpact * 10) / 10,
          unemploymentRate: Math.round(calculatedUnemployment * 10) / 10,
          recoveryTimeline: recoveryTimeText
        }
      },
      panicSentiment: {
        fearIndex: Math.round(calculatedFear),
        socialMediaPanic: Math.round(Math.min(99, calculatedFear + 12)),
        protestPropensity: Math.round(calculatedProtest),
        misinformationStrength: hasCyber ? 92 : 48,
        realtimeNarratives: [
          hasCyber ? "ALERT: Key digital routing protocols disrupted. Citizens urged to switch to localized emergency mesh routers." : "REPORT: High transport volume bottleneck at regional terminals.",
          hasBanking ? "PANIC: Commercial ledger withdrawals capped. Decentralized alternative coins spiking on black terminal boards." : "UPDATE: Resource distribution quotas updated on national ledger portal.",
          hasBorder ? "SITUATION: Localized curfew active. Drone defense systems showing active warning circles." : "INFO: Climate adaptation filters reporting optimal clean air metrics."
        ]
      },
      recoveryPath: {
        bestCase: {
          trajectory: "Dynamic Adaptability Loop",
          probability: Math.max(10, 55 - (intensity * 12)),
          description: "Rapid activation of Sovereign OS backup microgrids, digital food voucher indexing, and local community-led mutual aid. Minimizes institutional friction."
        },
        expected: {
          trajectory: "Managed Containment Curve",
          probability: Math.min(65, 35 + (intensity * 5)),
          description: "Gradual infrastructure rebuild over the target months with medium-scale inflation peaks and strictly controlled rationing of high-vulnerable goods."
        },
        worstCase: {
          trajectory: "Cascading Sovereign Failure",
          probability: Math.min(85, 10 + (intensity * 10)),
          description: "Complete loss of institutional trust, wide-scale bank runs, currency devaluation, and uncontrolled population displacement across district boundaries."
        }
      }
    };

    if (!ai) {
      console.log(`[AI-Fallback] Serving simulated civilization lab simulation for: ${activeCrises.join(', ')}`);
      return res.json({ result: fallbackResult, isSimulated: true });
    }

    try {
      console.log(`[AI-API] Requesting Synthetic Civilization Sandbox simulation from Gemini: ${activeCrises.join(', ')}`);
      const prompt = `Formulate a synthetic civilization sandbox simulation analysis based on the simultaneous active crises: [${activeCrises.map(c => `"${c}"`).join(', ')}].
You must return a response in strict JSON format mapping to the exact schema:
{
  "scenarioTitle": "cohesive name for this crisis combinatorics scenario",
  "simulatedPopulation": {
    "totalAgents": number (simulated citizen count in millions or tens of millions),
    "ageGroups": [
      { "group": "Youth (0-18)", "percentage": number, "reaction": "description of behaviors" },
      { "group": "Young Adults (19-35)", "percentage": number, "reaction": "description of behaviors" },
      { "group": "Middle Aged (36-60)", "percentage": number, "reaction": "description of behaviors" },
      { "group": "Seniors (60+)", "percentage": number, "reaction": "description of behaviors" }
    ],
    "incomeClasses": [
      { "class": "Low Income", "percentage": number, "vulnerability": "detailed vulnerability description" },
      { "class": "Middle Income", "percentage": number, "vulnerability": "detailed vulnerability description" },
      { "class": "High Income", "percentage": number, "vulnerability": "detailed vulnerability description" }
    ],
    "politicalPreferences": [
      { "faction": "Institutionalists", "percentage": number, "sentiment": "governance view" },
      { "faction": "Alternative Path Proponents", "percentage": number, "sentiment": "decentralization view" },
      { "faction": "Isolationists", "percentage": number, "sentiment": "isolationist view" }
    ],
    "migrationTendencies": { "rate": "Low" | "Moderate" | "Extreme Surge", "hotspots": ["hotspot location 1", "hotspot location 2"], "description": "detailed migration tendencies overview" },
    "consumptionPatterns": { "hoardingRisk": "Low" | "Moderate" | "Critical Danger", "essentialGoodDemand": "status details", "description": "buying or consumption details" }
  },
  "economicShock": {
    "inflationSpike": number (estimated percentage point increase, 0 to 500%),
    "currencyCollapseRisk": number (probability percentage, 0 to 100),
    "supplyChainDisruption": number (percentage degradation, 0 to 100),
    "oilCrisisPremium": number (premium dollar value or percentage),
    "foodShortagesIndex": number (shortage warning index, 0 to 100),
    "outputs": {
      "gdpImpact": number (negative contraction percentage, e.g. -14.5),
      "unemploymentRate": number (resulting unemployment rate percentage, e.g. 18.2),
      "recoveryTimeline": "exact estimated range, e.g. 18-24 months"
    }
  },
  "panicSentiment": {
    "fearIndex": number (overall metric, 0 to 100),
    "socialMediaPanic": number (overall metric, 0 to 100),
    "protestPropensity": number (overall metric, 0 to 100),
    "misinformationStrength": number (overall metric, 0 to 100),
    "realtimeNarratives": [
      "simulated social media post/headline 1",
      "simulated social media post/headline 2",
      "simulated social media post/headline 3"
    ]
  },
  "recoveryPath": {
    "bestCase": { "trajectory": "Name of best case path", "probability": number, "description": "strict brief details" },
    "expected": { "trajectory": "Name of expected path", "probability": number, "description": "strict brief details" },
    "worstCase": { "trajectory": "Name of worst case path", "probability": number, "description": "strict brief details" }
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scenarioTitle: { type: Type.STRING },
              simulatedPopulation: {
                type: Type.OBJECT,
                properties: {
                  totalAgents: { type: Type.NUMBER },
                  ageGroups: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        group: { type: Type.STRING },
                        percentage: { type: Type.NUMBER },
                        reaction: { type: Type.STRING }
                      },
                      required: ['group', 'percentage', 'reaction']
                    }
                  },
                  incomeClasses: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        class: { type: Type.STRING },
                        percentage: { type: Type.NUMBER },
                        vulnerability: { type: Type.STRING }
                      },
                      required: ['class', 'percentage', 'vulnerability']
                    }
                  },
                  politicalPreferences: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        faction: { type: Type.STRING },
                        percentage: { type: Type.NUMBER },
                        sentiment: { type: Type.STRING }
                      },
                      required: ['faction', 'percentage', 'sentiment']
                    }
                  },
                  migrationTendencies: {
                    type: Type.OBJECT,
                    properties: {
                      rate: { type: Type.STRING },
                      hotspots: { type: Type.ARRAY, items: { type: Type.STRING } },
                      description: { type: Type.STRING }
                    },
                    required: ['rate', 'hotspots', 'description']
                  },
                  consumptionPatterns: {
                    type: Type.OBJECT,
                    properties: {
                      hoardingRisk: { type: Type.STRING },
                      essentialGoodDemand: { type: Type.STRING },
                      description: { type: Type.STRING }
                    },
                    required: ['hoardingRisk', 'essentialGoodDemand', 'description']
                  }
                },
                required: ['totalAgents', 'ageGroups', 'incomeClasses', 'politicalPreferences', 'migrationTendencies', 'consumptionPatterns']
              },
              economicShock: {
                type: Type.OBJECT,
                properties: {
                  inflationSpike: { type: Type.NUMBER },
                  currencyCollapseRisk: { type: Type.NUMBER },
                  supplyChainDisruption: { type: Type.NUMBER },
                  oilCrisisPremium: { type: Type.NUMBER },
                  foodShortagesIndex: { type: Type.NUMBER },
                  outputs: {
                    type: Type.OBJECT,
                    properties: {
                      gdpImpact: { type: Type.NUMBER },
                      unemploymentRate: { type: Type.NUMBER },
                      recoveryTimeline: { type: Type.STRING }
                    },
                    required: ['gdpImpact', 'unemploymentRate', 'recoveryTimeline']
                  }
                },
                required: ['inflationSpike', 'currencyCollapseRisk', 'supplyChainDisruption', 'oilCrisisPremium', 'foodShortagesIndex', 'outputs']
              },
              panicSentiment: {
                type: Type.OBJECT,
                properties: {
                  fearIndex: { type: Type.NUMBER },
                  socialMediaPanic: { type: Type.NUMBER },
                  protestPropensity: { type: Type.NUMBER },
                  misinformationStrength: { type: Type.NUMBER },
                  realtimeNarratives: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['fearIndex', 'socialMediaPanic', 'protestPropensity', 'misinformationStrength', 'realtimeNarratives']
              },
              recoveryPath: {
                type: Type.OBJECT,
                properties: {
                  bestCase: {
                    type: Type.OBJECT,
                    properties: { trajectory: { type: Type.STRING }, probability: { type: Type.NUMBER }, description: { type: Type.STRING } },
                    required: ['trajectory', 'probability', 'description']
                  },
                  expected: {
                    type: Type.OBJECT,
                    properties: { trajectory: { type: Type.STRING }, probability: { type: Type.NUMBER }, description: { type: Type.STRING } },
                    required: ['trajectory', 'probability', 'description']
                  },
                  worstCase: {
                    type: Type.OBJECT,
                    properties: { trajectory: { type: Type.STRING }, probability: { type: Type.NUMBER }, description: { type: Type.STRING } },
                    required: ['trajectory', 'probability', 'description']
                  }
                },
                required: ['bestCase', 'expected', 'worstCase']
              }
            },
            required: ['scenarioTitle', 'simulatedPopulation', 'economicShock', 'panicSentiment', 'recoveryPath']
          }
        }
      });

      const json = JSON.parse(response.text || '{}');
      res.json({ result: json, isSimulated: false });
    } catch (e: any) {
      
      res.json({ result: fallbackResult, isSimulated: true, error: e.message });
    }
  });

  // ==========================================
  // NEW ENDPOINTS
  // ==========================================
  app.get('/api/settings', (req, res) => res.json({ notificationLevel: 'alert', autoSaveEnabled: true, theme: 'dark' }));
  app.put('/api/settings', (req, res) => res.json({ success: true }));

  app.get('/api/clearances', (req, res) => res.json([]));
  app.put('/api/clearances', (req, res) => res.json({ success: true }));

  app.get('/api/tokens', (req, res) => res.json([]));
  app.post('/api/tokens', (req, res) => res.json({ success: true }));
  app.delete('/api/tokens/:id', (req, res) => res.json({ success: true }));

  app.get('/api/telemetry', (req, res) => res.json({ stability: 100, cpuUsage: 0, networkLatency: 0 }));
  app.put('/api/telemetry', (req, res) => res.json({ success: true }));

  app.get('/api/protocols', (req, res) => res.json([]));
  app.put('/api/protocols', (req, res) => res.json({ success: true }));

  app.post('/api/connectivity-test', (req, res) => res.json({ success: true }));
  app.post('/api/audit-log', (req, res) => res.json({ success: true }));

  // 5. Connect Vite middleware in development or serve static build files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware mounted successfully on Express.');
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static asset distribution mounted from ./dist.');
  }

  // Bind exclusively to all hosts on port 3000 (Required for ingress routing)
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sovereign Mind full-stack server running live on: http://localhost:${PORT}`);
  });
}

startServer();
