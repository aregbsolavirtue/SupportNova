/**
 * mock/complaints.js — SupportNova Demo/Mock Data
 *
 * BACKEND INTEGRATION:
 * This file provides realistic mock data for UI development ONLY.
 * When the backend is connected, replace all references to
 * MOCK_DATA.complaints, MOCK_DATA.analytics, etc. with
 * real API responses.
 *
 * Do NOT import this file in production builds.
 * Keep all mock data isolated in this directory.
 */

const MOCK_DATA = (function () {

  // ── Complaint Status Enum ────────────────────────────────────
  const STATUS = {
    NEW: 'New',
    ANALYZED: 'Analyzed',
    ASSIGNED: 'Assigned',
    IN_PROGRESS: 'In Progress',
    AWAITING: 'Awaiting Customer',
    ESCALATED: 'Escalated',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
    REOPENED: 'Reopened',
  };

  // ── Priority Enum ────────────────────────────────────────────
  const PRIORITY = {
    CRITICAL: 'Critical',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
  };

  // ── Sentiment Enum ───────────────────────────────────────────
  const SENTIMENT = {
    POSITIVE: 'Positive',
    NEUTRAL: 'Neutral',
    NEGATIVE: 'Negative',
    FURIOUS: 'Furious',
  };

  // ── Categories ───────────────────────────────────────────────
  const CATEGORIES = [
    'Billing', 'Delivery', 'Product Quality', 'Return & Refund',
    'Account', 'Technical', 'Payment', 'Shipping', 'Wrong Item',
  ];

  // ── Departments ──────────────────────────────────────────────
  const DEPARTMENTS = [
    'Billing', 'Logistics', 'Quality Assurance', 'Returns',
    'Account Management', 'Technical Support', 'Payments',
  ];

  // ── Verification Statuses ────────────────────────────────────
  const VERIFICATION = {
    VERIFIED: 'Verified',
    MANUAL_REVIEW: 'Manual Review Required',
    PARTIAL: 'Partial Match',
    MISMATCH: 'Mismatch',
  };

  // ── Mock Complaints ──────────────────────────────────────────
  // BACKEND INTEGRATION: Replace with GET /api/complaints
  const complaints = [
    {
      id: 'SN-10482',
      customer: { name: 'Amara Okafor', email: 'amara.o@example.com', ref: 'CUST-4821' },
      title: 'Refund not processed after 14 days',
      description: 'I returned my order (VC-88821) on September 10th. I was told the refund would take 5-7 business days. It has now been 14 days and I have not received anything. I need this resolved urgently as it is a significant amount.',
      category: 'Return & Refund',
      department: 'Returns',
      priority: PRIORITY.HIGH,
      sentiment: SENTIMENT.NEGATIVE,
      status: STATUS.ESCALATED,
      orderRef: 'VC-88821',
      product: 'USB-C Fast Charger Pro 65W',
      submittedAt: '2026-09-10T09:23:00Z',
      updatedAt: '2026-09-24T14:05:00Z',
      aiRecommendation: {
        category: 'Return & Refund',
        department: 'Returns',
        priority: PRIORITY.HIGH,
        sentiment: SENTIMENT.NEGATIVE,
        urgency: 'High',
        resolution: 'Process immediate refund and apply goodwill compensation. Customer has exceeded stated refund timeline. Escalate to billing supervisor.',
        suggestedResponse: 'Dear Amara, we sincerely apologise for the delay with your refund for order VC-88821. We have escalated your case to our Returns team with high priority. Your refund of $89.99 has been approved and will be processed within 24-48 hours. As a gesture of goodwill, we will also apply a $15 credit to your account.',
        policyRefs: [
          { title: 'Return & Refund Policy §4.2', excerpt: 'Refunds shall be processed within 5-7 business days of receiving the returned item. If the refund is not received within 10 business days, the customer is entitled to escalation and priority processing.' },
          { title: 'Customer Escalation Protocol §2.1', excerpt: 'Any complaint older than 10 business days without resolution shall be automatically escalated to the department head.' },
        ],
        generatedAt: '2026-09-10T09:25:12Z',
      },
      validation: {
        status: 'FAIL',
        checks: [
          { label: 'Category matches rule engine', result: 'pass' },
          { label: 'Department correctly assigned', result: 'pass' },
          { label: 'Priority level appropriate', result: 'pass' },
          { label: 'Escalation rule satisfied (>10 days)', result: 'pass' },
          { label: 'Refund timeline policy adhered', result: 'fail', note: 'AI response omits mandatory refund confirmation reference number' },
          { label: 'Goodwill credit within policy limits', result: 'warning', note: 'Goodwill credit exceeds standard $10 threshold — requires supervisor approval' },
        ],
        verificationStatus: VERIFICATION.MANUAL_REVIEW,
        mismatchReason: 'AI suggested response missing mandatory refund confirmation reference. Goodwill credit amount ($15) exceeds standard policy threshold ($10) without supervisor override.',
      },
      timeline: [
        { status: STATUS.NEW,       label: 'Submitted',   date: '2026-09-10T09:23:00Z', done: true },
        { status: STATUS.ANALYZED,  label: 'Analyzed',    date: '2026-09-10T09:25:00Z', done: true },
        { status: STATUS.ASSIGNED,  label: 'Assigned',    date: '2026-09-10T09:30:00Z', done: true },
        { status: STATUS.IN_PROGRESS,label:'In Progress', date: '2026-09-11T10:00:00Z', done: true },
        { status: STATUS.ESCALATED, label: 'Escalated',   date: '2026-09-24T14:05:00Z', done: true },
        { status: STATUS.RESOLVED,  label: 'Resolved',    date: null,                    done: false },
      ],
      latestUpdate: 'Your case has been escalated to our Senior Returns Manager. You will receive a response within 4 business hours.',
      resolution: null,
      escalationFlag: true,
      assignedAgent: 'Kenji Watanabe',
    },
    {
      id: 'SN-10391',
      customer: { name: 'Lucas Mendes', email: 'l.mendes@example.com', ref: 'CUST-3301' },
      title: 'Received wrong charger model',
      description: 'I ordered the 65W USB-C charger but received the 45W model. The box is labeled correctly but the actual product inside is different. I need the correct item urgently.',
      category: 'Wrong Item',
      department: 'Logistics',
      priority: PRIORITY.MEDIUM,
      sentiment: SENTIMENT.NEGATIVE,
      status: STATUS.IN_PROGRESS,
      orderRef: 'VC-77410',
      product: 'USB-C Fast Charger 45W',
      submittedAt: '2026-09-20T14:15:00Z',
      updatedAt: '2026-09-22T09:00:00Z',
      aiRecommendation: {
        category: 'Wrong Item',
        department: 'Logistics',
        priority: PRIORITY.MEDIUM,
        sentiment: SENTIMENT.NEGATIVE,
        urgency: 'Medium',
        resolution: 'Arrange express re-delivery of correct item. Issue prepaid return label for incorrect item.',
        suggestedResponse: 'Dear Lucas, we apologise for sending you the wrong product. We will arrange express delivery of your USB-C 65W charger within 2 business days and send a prepaid return label for the incorrect item.',
        policyRefs: [
          { title: 'Wrong Item Policy §3.1', excerpt: 'If a customer receives an incorrect product, a replacement shall be dispatched within 3 business days at no additional cost.' },
        ],
        generatedAt: '2026-09-20T14:17:00Z',
      },
      validation: {
        status: 'PASS',
        checks: [
          { label: 'Category matches rule engine', result: 'pass' },
          { label: 'Department correctly assigned', result: 'pass' },
          { label: 'Priority level appropriate', result: 'pass' },
          { label: 'Resolution within policy', result: 'pass' },
          { label: 'Response template compliant', result: 'pass' },
        ],
        verificationStatus: VERIFICATION.VERIFIED,
        mismatchReason: null,
      },
      timeline: [
        { status: STATUS.NEW,        label: 'Submitted',   date: '2026-09-20T14:15:00Z', done: true },
        { status: STATUS.ANALYZED,   label: 'Analyzed',    date: '2026-09-20T14:17:00Z', done: true },
        { status: STATUS.ASSIGNED,   label: 'Assigned',    date: '2026-09-20T14:30:00Z', done: true },
        { status: STATUS.IN_PROGRESS,label: 'In Progress', date: '2026-09-21T09:00:00Z', done: true },
        { status: STATUS.RESOLVED,   label: 'Resolved',    date: null,                    done: false },
      ],
      latestUpdate: 'Your replacement order has been dispatched. Expected delivery: Sep 24.',
      resolution: null,
      escalationFlag: false,
      assignedAgent: 'Sofia Andrade',
    },
    {
      id: 'SN-10278',
      customer: { name: 'Priya Sharma', email: 'priya.s@example.com', ref: 'CUST-2890' },
      title: 'Double charge on credit card',
      description: 'I was charged twice for my order VC-65992. One charge went through yesterday and another one appeared today for the same amount. I need a refund for the duplicate immediately.',
      category: 'Billing',
      department: 'Billing',
      priority: PRIORITY.HIGH,
      sentiment: SENTIMENT.FURIOUS,
      status: STATUS.ASSIGNED,
      orderRef: 'VC-65992',
      product: 'Wireless Earbuds Pro X',
      submittedAt: '2026-09-25T08:00:00Z',
      updatedAt: '2026-09-25T08:45:00Z',
      aiRecommendation: {
        category: 'Billing',
        department: 'Billing',
        priority: PRIORITY.HIGH,
        sentiment: SENTIMENT.FURIOUS,
        urgency: 'Urgent',
        resolution: 'Verify duplicate charge, issue immediate reversal, send confirmation email.',
        suggestedResponse: 'Dear Priya, we sincerely apologise for the duplicate charge. We have identified the error and the duplicate amount will be reversed within 3-5 business days depending on your bank\'s processing time.',
        policyRefs: [
          { title: 'Billing Error Policy §1.3', excerpt: 'Duplicate charges must be investigated and reversed within 2 business days of confirmation.' },
        ],
        generatedAt: '2026-09-25T08:03:00Z',
      },
      validation: {
        status: 'WARNING',
        checks: [
          { label: 'Category matches rule engine', result: 'pass' },
          { label: 'Department correctly assigned', result: 'pass' },
          { label: 'Priority: Furious sentiment → Critical required', result: 'warning', note: 'Sentiment "Furious" should trigger Critical priority per escalation rules' },
          { label: 'Billing error reversal timeline correct', result: 'pass' },
          { label: 'Response tone appropriate', result: 'pass' },
        ],
        verificationStatus: VERIFICATION.MANUAL_REVIEW,
        mismatchReason: 'Priority set as High but customer sentiment is Furious — escalation rules require Critical priority for furious sentiment on billing issues.',
      },
      timeline: [
        { status: STATUS.NEW,       label: 'Submitted', date: '2026-09-25T08:00:00Z', done: true },
        { status: STATUS.ANALYZED,  label: 'Analyzed',  date: '2026-09-25T08:03:00Z', done: true },
        { status: STATUS.ASSIGNED,  label: 'Assigned',  date: '2026-09-25T08:45:00Z', done: true, active: true },
        { status: STATUS.IN_PROGRESS,label:'In Progress',date: null,                   done: false },
        { status: STATUS.RESOLVED,  label: 'Resolved',  date: null,                    done: false },
      ],
      latestUpdate: 'Your case has been assigned to our Billing team and is under active review.',
      resolution: null,
      escalationFlag: false,
      assignedAgent: 'Kenji Watanabe',
    },
    {
      id: 'SN-10155',
      customer: { name: 'Omar Hassan', email: 'o.hassan@example.com', ref: 'CUST-1550' },
      title: 'Power bank stopped charging after 2 weeks',
      description: 'I purchased the PowerVolt 20000mAh power bank three weeks ago. After two weeks of normal use it completely stopped charging. It doesn\'t respond to any cable. This is clearly a product defect.',
      category: 'Product Quality',
      department: 'Quality Assurance',
      priority: PRIORITY.MEDIUM,
      sentiment: SENTIMENT.NEGATIVE,
      status: STATUS.RESOLVED,
      orderRef: 'VC-51100',
      product: 'PowerVolt 20000mAh Power Bank',
      submittedAt: '2026-09-05T16:30:00Z',
      updatedAt: '2026-09-15T11:00:00Z',
      aiRecommendation: {
        category: 'Product Quality',
        department: 'Quality Assurance',
        priority: PRIORITY.MEDIUM,
        sentiment: SENTIMENT.NEGATIVE,
        urgency: 'Medium',
        resolution: 'Issue warranty replacement. Flag product for quality review.',
        suggestedResponse: 'Dear Omar, we apologise for this experience. Your warranty replacement will be dispatched within 3 business days. We have also flagged your unit for a quality review.',
        policyRefs: [
          { title: 'Product Warranty Policy §2.1', excerpt: 'Products exhibiting defects within 12 months of purchase are covered under the manufacturer warranty.' },
        ],
        generatedAt: '2026-09-05T16:32:00Z',
      },
      validation: {
        status: 'PASS',
        checks: [
          { label: 'Category matches rule engine', result: 'pass' },
          { label: 'Warranty claim validated', result: 'pass' },
          { label: 'Department correctly assigned', result: 'pass' },
          { label: 'Resolution within policy', result: 'pass' },
        ],
        verificationStatus: VERIFICATION.VERIFIED,
        mismatchReason: null,
      },
      timeline: [
        { status: STATUS.NEW,        label: 'Submitted',   date: '2026-09-05T16:30:00Z', done: true },
        { status: STATUS.ANALYZED,   label: 'Analyzed',    date: '2026-09-05T16:32:00Z', done: true },
        { status: STATUS.ASSIGNED,   label: 'Assigned',    date: '2026-09-05T17:00:00Z', done: true },
        { status: STATUS.IN_PROGRESS,label: 'In Progress', date: '2026-09-06T09:00:00Z', done: true },
        { status: STATUS.RESOLVED,   label: 'Resolved',    date: '2026-09-15T11:00:00Z', done: true },
      ],
      latestUpdate: 'Your warranty replacement has been delivered. Case closed.',
      resolution: 'Warranty replacement dispatched and confirmed delivered. Quality team notified for product review.',
      escalationFlag: false,
      assignedAgent: 'Sofia Andrade',
    },
  ];

  // ── Manual Review Cases ──────────────────────────────────────
  // BACKEND INTEGRATION: Replace with GET /api/manual-review
  const reviewCases = [
    {
      id: 'SN-10482',
      reason: 'Response missing mandatory reference; goodwill credit exceeds policy limit',
      priority: PRIORITY.HIGH,
      category: 'Return & Refund',
      aiDecision: 'Approve refund + $15 goodwill',
      validationResult: 'FAIL',
      createdAt: '2026-09-24T14:05:00Z',
      reviewStatus: 'Pending',
    },
    {
      id: 'SN-10278',
      reason: 'Priority mismatch: Furious sentiment requires Critical, AI set High',
      priority: PRIORITY.HIGH,
      category: 'Billing',
      aiDecision: 'High priority — billing team assignment',
      validationResult: 'WARNING',
      createdAt: '2026-09-25T08:45:00Z',
      reviewStatus: 'Pending',
    },
    {
      id: 'SN-10399',
      reason: 'Department conflict: AI says Billing, rules say Technical Support',
      priority: PRIORITY.MEDIUM,
      category: 'Payment',
      aiDecision: 'Billing department — refund',
      validationResult: 'FAIL',
      createdAt: '2026-09-23T12:30:00Z',
      reviewStatus: 'In Review',
    },
    {
      id: 'SN-10204',
      reason: 'Escalation rule not applied despite complaint age > 7 days',
      priority: PRIORITY.HIGH,
      category: 'Delivery',
      aiDecision: 'Medium priority — Logistics',
      validationResult: 'WARNING',
      createdAt: '2026-09-22T09:15:00Z',
      reviewStatus: 'Pending',
    },
    {
      id: 'SN-10089',
      reason: 'Sentiment: Furious — AI classified Negative, missing escalation flag',
      priority: PRIORITY.CRITICAL,
      category: 'Billing',
      aiDecision: 'Standard billing resolution',
      validationResult: 'FAIL',
      createdAt: '2026-09-21T16:00:00Z',
      reviewStatus: 'Escalated',
    },
  ];

  // ── Analytics ────────────────────────────────────────────────
  // BACKEND INTEGRATION: Replace with GET /api/analytics/summary
  // A few queue examples focus on mismatch scenarios and omit full customer
  // records. Lightweight demo payloads keep every review case navigable.
  reviewCases.forEach(function (review) {
    if (complaints.some(function (complaint) { return complaint.id === review.id; })) return;
    complaints.push({
      id: review.id,
      customer: { name: 'Demo customer', email: null, ref: 'DEMO-REF' },
      title: review.category + ' complaint requiring review',
      description: review.reason,
      category: review.category,
      department: 'Needs reviewer confirmation',
      priority: review.priority,
      sentiment: SENTIMENT.NEUTRAL,
      status: STATUS.ASSIGNED,
      submittedAt: review.createdAt,
      updatedAt: review.createdAt,
      aiRecommendation: {
        category: review.category,
        department: 'AI suggested routing',
        priority: review.priority,
        sentiment: SENTIMENT.NEUTRAL,
        urgency: review.priority,
        resolution: review.aiDecision,
        suggestedResponse: 'Demo response preview is not available for this sample case.',
        policyRefs: [],
      },
      validation: {
        status: review.validationResult,
        checks: [],
        verificationStatus: VERIFICATION.MANUAL_REVIEW,
        mismatchReason: review.reason,
      },
      escalationFlag: false,
      timeline: [],
      latestUpdate: 'Demo review record. Live complaint updates require backend data.',
    });
  });

  const analytics = {
    summary: {
      total: 1284,
      open: 387,
      resolved: 842,
      escalated: 55,
      manualReview: 18,
      slaRisk: 23,
      aiPythonMismatch: 42,
      avgResolutionHours: 18.4,
    },
    // BACKEND INTEGRATION: Replace with GET /api/analytics/trends
    trends: [
      { period: 'Sep 21', total: 178, escalated: 8, resolved: 142 },
      { period: 'Sep 22', total: 195, escalated: 12, resolved: 159 },
      { period: 'Sep 23', total: 210, escalated: 9,  resolved: 178 },
      { period: 'Sep 24', total: 189, escalated: 15, resolved: 161 },
      { period: 'Sep 25', total: 223, escalated: 11, resolved: 192 },
      { period: 'Sep 26', total: 244, escalated: 14, resolved: 210 },
      { period: 'Sep 27', total: 201, escalated: 10, resolved: 170 },
    ],
    // BACKEND INTEGRATION: Replace with GET /api/analytics/categories
    byCategory: [
      { label: 'Billing',           count: 312, pct: 24 },
      { label: 'Delivery',          count: 247, pct: 19 },
      { label: 'Product Quality',   count: 198, pct: 15 },
      { label: 'Return & Refund',   count: 182, pct: 14 },
      { label: 'Wrong Item',        count: 142, pct: 11 },
      { label: 'Technical',         count: 121, pct: 9  },
      { label: 'Payment',           count:  82, pct: 6  },
    ],
    // BACKEND INTEGRATION: Replace with GET /api/analytics/departments
    byDepartment: [
      { label: 'Billing',            count: 395 },
      { label: 'Logistics',          count: 389 },
      { label: 'Quality Assurance',  count: 198 },
      { label: 'Returns',            count: 182 },
      { label: 'Technical Support',  count: 120 },
    ],
    byPriority: [
      { label: 'Critical', count: 45,  color: '#DC2626' },
      { label: 'High',     count: 189, color: '#EF4444' },
      { label: 'Medium',   count: 621, color: '#F59E0B' },
      { label: 'Low',      count: 429, color: '#10B981' },
    ],
    bySentiment: [
      { label: 'Furious',  count: 89,  color: '#DC2626' },
      { label: 'Negative', count: 512, color: '#EF4444' },
      { label: 'Neutral',  count: 421, color: '#64748B' },
      { label: 'Positive', count: 262, color: '#10B981' },
    ],
    // BACKEND INTEGRATION: Replace with GET /api/analytics/sla
    slaStatus: {
      onTrack: 1068,
      atRisk: 23,
      breached: 14,
      breachedPct: 1.1,
    },
    // BACKEND INTEGRATION: Replace with GET /api/analytics/ai-comparison
    aiComparison: {
      totalAnalyzed: 1240,
      fullyVerified: 1082,
      partialMatch: 116,
      manualReview: 42,
      verificationRate: 87.3,
    },
    // BACKEND INTEGRATION: Replace with GET /api/analytics/trends/detected
    detectedTrends: [
      {
        title: 'Billing Complaints Rising',
        description: 'Billing complaints increased 28% in the last 7 days, particularly around double-charge issues.',
        severity: 'high',
        change: '+28%',
        period: '7 days',
        category: 'Billing',
      },
      {
        title: 'Delivery Delays — Recurring Issue',
        description: 'Delivery delay complaints above normal threshold. Possible logistics partner disruption.',
        severity: 'high',
        change: '+19%',
        period: '5 days',
        category: 'Delivery',
      },
      {
        title: 'Escalation Rate Stabilising',
        description: 'Escalation rate dropped from 6.2% to 4.3% compared to the previous week.',
        severity: 'low',
        change: '-1.9pp',
        period: '7 days',
        category: 'All',
      },
      {
        title: 'Manual Review Rate Increasing',
        description: 'AI/Python mismatch rate increased slightly (3.2% → 3.4%). Monitoring closely.',
        severity: 'medium',
        change: '+0.2pp',
        period: '7 days',
        category: 'AI System',
      },
    ],
  };

  // ── Reports ──────────────────────────────────────────────────
  // BACKEND INTEGRATION: Replace with GET /api/reports
  const reports = [
    { id: 'RPT-001', title: 'Complaint Analysis Report', category: 'Complaints', lastGenerated: '2026-09-27', status: 'Ready', icon: 'fa-chart-bar', color: '#4F7FFF' },
    { id: 'RPT-002', title: 'Department Performance Report', category: 'Performance', lastGenerated: '2026-09-26', status: 'Ready', icon: 'fa-building', color: '#10B981' },
    { id: 'RPT-003', title: 'Escalation Summary Report', category: 'Escalations', lastGenerated: '2026-09-27', status: 'Ready', icon: 'fa-arrow-up', color: '#EF4444' },
    { id: 'RPT-004', title: 'SLA Status Report', category: 'SLA', lastGenerated: '2026-09-26', status: 'Ready', icon: 'fa-clock', color: '#F59E0B' },
    { id: 'RPT-005', title: 'Policy Usage Report', category: 'Policy', lastGenerated: '2026-09-25', status: 'Ready', icon: 'fa-book', color: '#7C3AED' },
    { id: 'RPT-006', title: 'Resolution Compliance Report', category: 'Compliance', lastGenerated: '2026-09-24', status: 'Ready', icon: 'fa-check-circle', color: '#0891B2' },
    { id: 'RPT-007', title: 'AI vs Python Comparison Report', category: 'AI System', lastGenerated: '2026-09-27', status: 'Ready', icon: 'fa-code-branch', color: '#7C3AED' },
    { id: 'RPT-008', title: 'Manual Review Audit Report', category: 'Reviews', lastGenerated: '2026-09-26', status: 'Ready', icon: 'fa-user-check', color: '#0F766E' },
  ];

  // ── Agent Stats ──────────────────────────────────────────────
  // BACKEND INTEGRATION: Replace with GET /api/agent/stats
  const agentStats = {
    assigned: 24,
    highPriority: 7,
    escalated: 3,
    awaitingCustomer: 5,
    manualReview: 2,
    resolvedToday: 6,
  };

  return {
    STATUS, PRIORITY, SENTIMENT, CATEGORIES, DEPARTMENTS, VERIFICATION,
    complaints,
    reviewCases,
    analytics,
    reports,
    agentStats,
  };
})();

// Expose globally for templates
window.MOCK_DATA = MOCK_DATA;
