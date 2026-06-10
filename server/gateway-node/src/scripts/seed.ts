import connectDB from '../config/db';
import { CivilizationGenome } from '../models/CivilizationGenome';
import mongoose from 'mongoose';

const seedData = [
  {
    countryCode: 'IN',
    nationName: 'India',
    overallResilienceIndex: 0.78,
    governanceGenes: {
      LeadershipContinuity: 75,
      InstitutionalStrength: 68,
      PolicyStability: 72,
      BureaucraticEfficiency: 65,
    },
    economicGenes: {
      FiscalResilience: 70,
      TradeDiversity: 85,
      InflationResistance: 60,
      LaborAdaptability: 90,
    },
    socialGenes: {
      SocialTrust: 65,
      CommunityResilience: 88,
      EducationQuality: 60,
      CulturalCohesion: 80,
    },
    infrastructureGenes: {
      EnergySecurity: 68,
      TransportReliability: 70,
      DigitalConnectivity: 85,
      HealthcareCapacity: 60,
    }
  },
  {
    countryCode: 'JP',
    nationName: 'Japan',
    overallResilienceIndex: 0.85,
    governanceGenes: {
      LeadershipContinuity: 85,
      InstitutionalStrength: 90,
      PolicyStability: 88,
      BureaucraticEfficiency: 82,
    },
    economicGenes: {
      FiscalResilience: 75,
      TradeDiversity: 80,
      InflationResistance: 85,
      LaborAdaptability: 70,
    },
    socialGenes: {
      SocialTrust: 90,
      CommunityResilience: 95,
      EducationQuality: 92,
      CulturalCohesion: 95,
    },
    infrastructureGenes: {
      EnergySecurity: 70,
      TransportReliability: 95,
      DigitalConnectivity: 90,
      HealthcareCapacity: 88,
    }
  },
  {
    countryCode: 'KR',
    nationName: 'South Korea',
    overallResilienceIndex: 0.82,
    governanceGenes: {
      LeadershipContinuity: 78,
      InstitutionalStrength: 85,
      PolicyStability: 80,
      BureaucraticEfficiency: 88,
    },
    economicGenes: {
      FiscalResilience: 80,
      TradeDiversity: 85,
      InflationResistance: 82,
      LaborAdaptability: 85,
    },
    socialGenes: {
      SocialTrust: 75,
      CommunityResilience: 80,
      EducationQuality: 90,
      CulturalCohesion: 85,
    },
    infrastructureGenes: {
      EnergySecurity: 75,
      TransportReliability: 92,
      DigitalConnectivity: 95,
      HealthcareCapacity: 85,
    }
  },
  {
    countryCode: 'SG',
    nationName: 'Singapore',
    overallResilienceIndex: 0.91,
    governanceGenes: {
      LeadershipContinuity: 95,
      InstitutionalStrength: 95,
      PolicyStability: 98,
      BureaucraticEfficiency: 96,
    },
    economicGenes: {
      FiscalResilience: 98,
      TradeDiversity: 90,
      InflationResistance: 90,
      LaborAdaptability: 85,
    },
    socialGenes: {
      SocialTrust: 92,
      CommunityResilience: 85,
      EducationQuality: 95,
      CulturalCohesion: 90,
    },
    infrastructureGenes: {
      EnergySecurity: 85,
      TransportReliability: 98,
      DigitalConnectivity: 95,
      HealthcareCapacity: 92,
    }
  }
];

const runSeed = async () => {
  await connectDB();

  console.log('Clearing old genomes...');
  await CivilizationGenome.deleteMany({});

  console.log('Inserting seed data...');
  await CivilizationGenome.insertMany(seedData);

  console.log('Database seeded successfully!');
  await mongoose.disconnect();
};

runSeed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
