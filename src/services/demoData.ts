import { Patient, RetentionStage, RetentionMetrics, ActionableInsight } from '../types/demo';

// Demo data constants
const DEMO_PATIENTS: Patient[] = [
  // Pre-First Visit Patients (80 total, 15 drop-offs)
  ...Array(80).fill(null).map((_, i) => ({
    id: `pre-${i}`,
    name: `Patient ${i}`,
    stage: RetentionStage.PRE_FIRST_VISIT,
    status: i < 15 ? 'dropped' as const : 'active' as const,
    appointmentDate: new Date(Date.now() + 86400000 * (i % 30)),
    provider: i % 2 === 0 ? 'Dr. Jane Smith' : 'Dr. John Doe',
    revenue: 150,
  })),
  
  // After First Visit Patients (100 total, 20 drop-offs)
  ...Array(100).fill(null).map((_, i) => ({
    id: `after-${i}`,
    name: `Patient ${i + 80}`,
    stage: RetentionStage.AFTER_FIRST_VISIT,
    status: i < 20 ? 'dropped' as const : 'active' as const,
    firstVisitDate: new Date(Date.now() - 86400000 * (i % 45)),
    nextVisit: new Date(Date.now() + 86400000 * (i % 30)),
    provider: i % 2 === 0 ? 'Dr. Jane Smith' : 'Dr. John Doe',
    revenue: 200,
    visitCount: 1,
  })),
  
  // During Treatment Patients (120 total, 15 drop-offs)
  ...Array(120).fill(null).map((_, i) => ({
    id: `during-${i}`,
    name: `Patient ${i + 180}`,
    stage: RetentionStage.DURING_TREATMENT,
    status: i < 15 ? 'dropped' as const : 'active' as const,
    firstVisitDate: new Date(Date.now() - 86400000 * 90),
    lastVisit: new Date(Date.now() - 86400000 * (i % 30)),
    nextVisit: new Date(Date.now() + 86400000 * (i % 30)),
    provider: i % 2 === 0 ? 'Dr. Jane Smith' : 'Dr. John Doe',
    revenue: 300,
    visitCount: 2 + Math.floor(i / 20),
  })),
  
  // Post-Treatment Patients (50 total)
  ...Array(50).fill(null).map((_, i) => ({
    id: `post-${i}`,
    name: `Patient ${i + 300}`,
    stage: RetentionStage.POST_TREATMENT,
    status: 'completed' as const,
    firstVisitDate: new Date(Date.now() - 86400000 * 180),
    lastVisit: new Date(Date.now() - 86400000 * (i % 90)),
    provider: i % 2 === 0 ? 'Dr. Jane Smith' : 'Dr. John Doe',
    revenue: 500,
    visitCount: 6 + Math.floor(i / 10),
  })),
];

export class DemoDataService {
  private calculateRetentionRate(patients: Patient[], stage?: RetentionStage): number {
    const filtered = stage 
      ? patients.filter(p => p.stage === stage)
      : patients.filter(p => p.stage !== RetentionStage.POST_TREATMENT);
    
    const total = filtered.length;
    const retained = filtered.filter(p => p.status === 'active').length;
    
    return total === 0 ? 0 : (retained / total) * 100;
  }

  private calculateRevenueLoss(patients: Patient[]): number {
    return patients
      .filter(p => p.status === 'dropped')
      .reduce((sum, p) => sum + p.revenue, 0);
  }

  async getMetrics(timeFrame: number = 30): Promise<RetentionMetrics> {
    const filtered = DEMO_PATIENTS.filter(p => {
      const date = p.appointmentDate || p.lastVisit;
      return date && (Date.now() - date.getTime()) <= timeFrame * 86400000;
    });

    return {
      overallRetentionRate: this.calculateRetentionRate(filtered),
      preFirstVisitRate: this.calculateRetentionRate(filtered, RetentionStage.PRE_FIRST_VISIT),
      afterFirstVisitRate: this.calculateRetentionRate(filtered, RetentionStage.AFTER_FIRST_VISIT),
      duringTreatmentRate: this.calculateRetentionRate(filtered, RetentionStage.DURING_TREATMENT),
      monthlyRevenueLoss: this.calculateRevenueLoss(filtered),
      dropOffsByStage: {
        [RetentionStage.PRE_FIRST_VISIT]: filtered.filter(
          p => p.stage === RetentionStage.PRE_FIRST_VISIT && p.status === 'dropped'
        ).length,
        [RetentionStage.AFTER_FIRST_VISIT]: filtered.filter(
          p => p.stage === RetentionStage.AFTER_FIRST_VISIT && p.status === 'dropped'
        ).length,
        [RetentionStage.DURING_TREATMENT]: filtered.filter(
          p => p.stage === RetentionStage.DURING_TREATMENT && p.status === 'dropped'
        ).length,
        [RetentionStage.POST_TREATMENT]: filtered.filter(
          p => p.stage === RetentionStage.POST_TREATMENT
        ).length,
      },
    };
  }

  async getActionableInsights(): Promise<ActionableInsight[]> {
    const preFirstVisitDropOffs = DEMO_PATIENTS.filter(
      p => p.stage === RetentionStage.PRE_FIRST_VISIT && p.status === 'dropped'
    ).length;

    const afterFirstVisitDropOffs = DEMO_PATIENTS.filter(
      p => p.stage === RetentionStage.AFTER_FIRST_VISIT && p.status === 'dropped'
    ).length;

    const duringTreatmentDropOffs = DEMO_PATIENTS.filter(
      p => p.stage === RetentionStage.DURING_TREATMENT && p.status === 'dropped'
    ).length;

    return [
      {
        id: 'high-1',
        priority: 'high',
        stage: RetentionStage.PRE_FIRST_VISIT,
        description: `Follow up with ${preFirstVisitDropOffs} no-shows before first visit`,
        impact: preFirstVisitDropOffs * 150,
        action: 'Send automated reminders',
      },
      {
        id: 'high-2',
        priority: 'high',
        stage: RetentionStage.AFTER_FIRST_VISIT,
        description: `Re-engage ${afterFirstVisitDropOffs} patients after their first visit`,
        impact: afterFirstVisitDropOffs * 200,
        action: 'Schedule follow-ups',
      },
      {
        id: 'medium-1',
        priority: 'medium',
        stage: RetentionStage.DURING_TREATMENT,
        description: `Prevent ${duringTreatmentDropOffs} treatment plan drop-offs`,
        impact: duringTreatmentDropOffs * 300,
        action: 'Review treatment plans',
      },
    ];
  }

  async getPatients(stage?: RetentionStage): Promise<Patient[]> {
    return stage 
      ? DEMO_PATIENTS.filter(p => p.stage === stage)
      : DEMO_PATIENTS;
  }
}

export const demoDataService = new DemoDataService();