/**
 * Settings API — Typed GraphQL wrappers for all Settings operations.
 * Communicates with the Node.js GraphQL Gateway (localhost:4000/graphql).
 */

const GQL_URL = 'http://localhost:4000/graphql';

async function gql(query: string, variables?: Record<string, any>) {
  const res = await fetch(GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data;
}

// ── System Settings ──────────────────────────────────────────────────────────

export async function fetchSystemSettings() {
  const data = await gql(`
    query GetSystemSettings {
      getSystemSettings {
        operatorName operatorId operatorInstitution operatorRole
        operatorTogglesJson modelProcessingBound clearanceMatrixJson
        activeRegion storagePoliciesJson processingBoundary theme
        telemetryTogglesJson notificationChannelsJson
        networkProtocolsJson networkPoliciesJson
      }
    }
  `);
  return data.getSystemSettings;
}

export async function saveSystemSettings(input: Record<string, any>) {
  const data = await gql(
    `mutation SaveSystemSettings($input: SystemSettingsInput!) {
      saveSystemSettings(input: $input) {
        operatorName operatorId operatorInstitution operatorRole
        operatorTogglesJson modelProcessingBound clearanceMatrixJson
        activeRegion storagePoliciesJson processingBoundary theme
        telemetryTogglesJson notificationChannelsJson
        networkProtocolsJson networkPoliciesJson
      }
    }`,
    { input }
  );
  return data.saveSystemSettings;
}

// ── Security Clearances ──────────────────────────────────────────────────────

export async function fetchSecurityClearances() {
  const data = await gql(`
    query GetSecurityClearances {
      getSecurityClearances { id name serviceId level status expiry }
    }
  `);
  return data.getSecurityClearances;
}

export async function updateSecurityClearance(id: string, level?: string, status?: string) {
  const data = await gql(
    `mutation UpdateSecurityClearance($id: ID!, $level: String, $status: String) {
      updateSecurityClearance(id: $id, level: $level, status: $status) {
        id name serviceId level status expiry
      }
    }`,
    { id, level, status }
  );
  return data.updateSecurityClearance;
}

// ── Access Tokens ────────────────────────────────────────────────────────────

export async function fetchAccessTokens() {
  const data = await gql(`
    query GetAccessTokens {
      getAccessTokens { id owner tokenType created lastUsed status }
    }
  `);
  return data.getAccessTokens;
}

export async function generateAccessToken(tokenType: string, environment: string, permissions: string, owner?: string) {
  const data = await gql(
    `mutation GenerateAccessToken($tokenType: String!, $environment: String!, $permissions: String!, $owner: String) {
      generateAccessToken(tokenType: $tokenType, environment: $environment, permissions: $permissions, owner: $owner) {
        id owner tokenType created lastUsed status
      }
    }`,
    { tokenType, environment, permissions, owner }
  );
  return data.generateAccessToken;
}

export async function updateAccessToken(id: string, action: string) {
  const data = await gql(
    `mutation UpdateAccessToken($id: ID!, $action: String!) {
      updateAccessToken(id: $id, action: $action) {
        id owner tokenType created lastUsed status
      }
    }`,
    { id, action }
  );
  return data.updateAccessToken;
}

// ── Alert Rules ──────────────────────────────────────────────────────────────

export async function fetchAlertRules() {
  const data = await gql(`
    query GetAlertRules {
      getAlertRules { id name severity trigger destination active }
    }
  `);
  return data.getAlertRules;
}

export async function saveAlertRule(rule: {
  id?: string;
  name: string;
  severity: string;
  trigger: string;
  destination: string;
  active: boolean;
}) {
  const data = await gql(
    `mutation SaveAlertRule($id: ID, $name: String!, $severity: String!, $trigger: String!, $destination: String!, $active: Boolean!) {
      saveAlertRule(id: $id, name: $name, severity: $severity, trigger: $trigger, destination: $destination, active: $active) {
        id name severity trigger destination active
      }
    }`,
    rule
  );
  return data.saveAlertRule;
}

export async function deleteAlertRule(id: string) {
  const data = await gql(
    `mutation DeleteAlertRule($id: ID!) {
      deleteAlertRule(id: $id) { success }
    }`,
    { id }
  );
  return data.deleteAlertRule;
}

// ── COMPLIANCE RECORDS ──────────────────────────────────────────────────

export async function fetchComplianceRecords() {
  const data = await gql(`
    query {
      getComplianceRecords {
        id
        name
        score
        risk
        lastAudit
      }
    }
  `);
  return data.getComplianceRecords;
}

export async function saveComplianceRecord(input: {
  id?: string;
  name: string;
  score: string;
  risk: string;
  lastAudit: string;
}) {
  const data = await gql(
    `mutation SaveComplianceRecord($input: ComplianceRecordInput!) {
      saveComplianceRecord(input: $input) {
        id
        name
        score
        risk
        lastAudit
      }
    }`,
    { input }
  );
  return data.saveComplianceRecord;
}

export async function deleteComplianceRecord(id: string) {
  const data = await gql(
    `mutation DeleteComplianceRecord($id: ID!) {
      deleteComplianceRecord(id: $id) {
        success
      }
    }`,
    { id }
  );
  return data.deleteComplianceRecord;
}
