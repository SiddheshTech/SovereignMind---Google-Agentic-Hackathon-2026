const GQL_URL = 'http://localhost:4000/graphql';

async function fetchGraphQL(query: string, variables: any = {}) {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

export async function fetchCommandCenterData() {
  const query = `
    query {
      getCommandCenterData {
        stabilityScore
        stabilityLabel
        trend30d
        activeThreats
        criticalNations
        emergingRisks
        aiBriefing
        threats { title trend color time }
        futureRisks { year risk prob }
        rankings { category nation }
        recommendations { text impact icon }
        timelineEvents { year name type }
        metrics { id label score status details color }
        mapPoints { id x y color pulse stability resilience activeRisk }
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getCommandCenterData;
}

export async function fetchExecutiveBriefingData() {
  const query = `
    query {
      getExecutiveBriefingData {
        tasks { id title desc status statusColor date priority owner dep }
        meetings { id color title time participants priority }
        totalDirectives
        resolvedLoops
        recalibrationRate
        interruptVectors
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getExecutiveBriefingData;
}

export async function fetchMetricDetail(metricId: string) {
  const query = `
    query GetMetricDetail($metricId: String!) {
      getMetricDetail(metricId: $metricId) {
        id label score trend description color
        leadingIndicators { label value trend }
        riskFactors { label percent color }
        aiNarrative
      }
    }
  `;
  const data = await fetchGraphQL(query, { metricId });
  return data.getMetricDetail;
}

export async function fetchOperatorDashboardData() {
  const query = `
    query {
      getOperatorDashboardData {
        notifications { id text time read }
        timeline { time event type }
      }
    }
  `;
  const data = await fetchGraphQL(query);
  return data.getOperatorDashboardData;
}

export async function simulateEmergencyPowers(scenario: string) {
  const query = `
    mutation SimulateEmergencyPowers($scenario: String!) {
      simulateEmergencyPowers(scenario: $scenario) {
        scenario
        allowedActions
        restrictedActions
        judicialRisk { level description }
        politicalRisk { level description }
        treatyImpact
      }
    }
  `;
  const data = await fetchGraphQL(query, { scenario });
  return data.simulateEmergencyPowers;
}

export async function analyzeTreatyConstraints(proposal: string) {
  const query = `
    mutation AnalyzeTreatyConstraints($proposal: String!) {
      analyzeTreatyConstraints(proposal: $proposal) {
        proposal
        agreements { category status impact }
      }
    }
  `;
  const data = await fetchGraphQL(query, { proposal });
  return data.analyzeTreatyConstraints;
}
