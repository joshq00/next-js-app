import React, {useEffect} from 'react';
import Link from "next/link"

const ENABLE_STUDENT_DEBT_PROFILE = false;

function SupportEmail() {
  return (
    <a href="mailto:support@highwaybenefits.com">support@highwaybenefits.com</a>
  );
}


const webpageSvg = () => <></>;
const styles = {}

const PROFILE_QUERY = `
  query GetHomePage {
    plaidAccounts {
      id
      lender
      account_id_mask
      student_loans {
        balance
        interest_rate
      }
    }
    manualAccounts {
      merchant {
        name
      }
      student_loans {
        balance
        interest_rate
      }
      #       account_number_mask
    }
    manualAccountLinkRequests {
      merchant {
        name
      }
      account_number_mask
    }
    profile {
      first_name
      last_name
      #      phone_number
      #      birth_date
      #      address_one
      #      address_two
      #      city
      #      state
      #      zip
    }
    #     employment {
    # #      user_id: String!
    # #      employer_id: String!
    #       dba
    # #      start_date: Date!
    # #      end_date: Date
    # #      urls: [EmployerURL!]!
    #       benefit_policies {
    # #        id: ID!
    #         benefit_type_code
    # #        effective_date: Time!
    #         payout_amount_pennies
    # #        created_at: Time!
    # #        rules: [BenefitPolicyRule!]!
    #       }
    #     }
    payout_summaries(limit: 1) {
      year_benefit_date
      month_benefit_date
      total_payment_amount_pennies
    }
  }
`;

const Inlay = props => <div {...props}/>
const Row = Inlay
const Col = Inlay
const image = ""

function Banner({ variant, image, children }) {
  return (
    <Inlay variant={variant} className={styles.hero}>
      <Row className={styles.heroRow}>
        <Col xs={10} sm={3} md={2}>
          <img src={image} alt="" />
        </Col>
        <Col xs={1} />
        <Col>{children}</Col>
      </Row>
    </Inlay>
  );
}

function SetUpAccountBanner() {
  return (
    <Banner variant="warning" image={webpageSvg}>
      <h4>Your account needs to be configured.</h4>
      <p>
        To be eligible for contributions, you will need to complete your
        profile.
      </p>
      <div>
        <Link href="/account/setup">Create my profile</Link>
      </div>
    </Banner>
  );
}
function NoLoansBanner() {
  return (
    <Banner variant="warning" image={webpageSvg}>
      <h4>Start taking advantage of your benefits.</h4>
      <p>
        To be eligible for contributions, you need to connect your student
        loans.
      </p>
      <div>
        <Link href="/account/connected-accounts">Connect a student loan</Link>
      </div>
    </Banner>
  );
}

function NextBenefitsBanner() {
  return (
    <Banner variant="primary" image={buildingCoinSvg}>
      <h4>Your benefits are on their way.</h4>
      <p>
        You are officially enrolled! As long as you're eligible, you'll receive
        your contributions approximately a month after your benefit date.
      </p>
      <div>
        <Link href="/benefits/plans">See your benefit plan</Link>
      </div>
    </Banner>
  );
}

function PaidOffBanner() {
  return (
    <Banner variant="emerald-tint" image={buildingCoinSvg}>
      <h4>Your loans are paid off!</h4>
      <p>
        Congratulations, your loans are paid off! If you have more eligible
        loans, you can connect them to continue receiving benefits.
      </p>
      <div>
        <Link href="/account/connected-accounts">Connect a student loan</Link>
      </div>
    </Banner>
  );
}

function ReferralBanner() {
  return (
    <Banner variant="primary" image={referACompanySvg}>
      <h4>Refer a company to Highway and you could earn $100</h4>
      <p>
        Know of a company that could be a great fit for Highway? Refer them to
        us and after they launch with Highway, you’ll receive a $100 gift card.
      </p>
      <div>
        <a
        target="_blank"
        href="https://share.hsforms.com/1zrVHwBbMRXurY5afTT-DyQbuk8j"
      >
          Refer a company
      </a>
    </div>
  </Banner>
  );
}

function OverviewItem({ title, value, children }) {
  return (
    <Col md={6} className={styles.overviewItem}>
      <label>{title}</label>
      <div className={styles.value}>
        {value}
        {children}
      </div>
    </Col>
  );
}

const getNextBenefitDate = () => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
const getLastPayoutAmount = (payout_summaries) => {
  if (payout_summaries == null || payout_summaries.length === 0) return 'N/A';
  const po = payout_summaries[0];
  return `$${Math.round(
    po.total_payment_amount_pennies / 100,
  ).toLocaleString()}`;
};
const getLastBenefitDate = (payout_summaries) => {
  if (payout_summaries == null || payout_summaries.length === 0) return 'N/A';
  const po = payout_summaries[0];
  return `${months[po.month_benefit_date - 1]} ${po.year_benefit_date}`;
};

export function AvailableBenefits({ employment }) {
  const availableBenefits = Array.from(
    new Set(employment.benefit_policies.map((bp) => bp.benefit_type_code)),
  );

  const benefits = Object.entries(benefitTypes)
    .map(([k, v]) => v)
    .filter((b) => availableBenefits.find((c) => c === b.benefit_type_code));

  return (
    <>
    {employment.dba} offers
    <ul>
    {benefits.map((b) => (
      <li key={b.benefit_type_code}>
        {b.benefit_type_title}
        <div>
          Tiers pay up to:
          {employment.benefit_policies
              .filter((bp) => bp.benefit_type_code === b.benefit_type_code)
              .map((bp) => (bp.payout_amount_pennies / 100).toFixed(2))
              .join(', ')}
        </div>
      </li>
    ))}
    </ul>
    </>
  );
}

function BenefitOverview({ data, accounts = [] }) {
  // const { employment } = useBenefits();
  const employment = []

  return (
    <section className={styles.overview}>
      <header>
        <h3>Benefit overview</h3>
      </header>

      <h4>Enrollment</h4>
      <Row>
        <Col>
          {(employment?.length || 0) === 0 &&
              'No eligible employment or benefits found.'}
          {employment?.map((e, i) => (
            <div key={i}>
              <AvailableBenefits employment={e} />
            </div>
          ))}
          </Col>
        </Row>

        <h4>Student loan repayments</h4>
        <Row>
          <OverviewItem title="Next benefit date" value={getNextBenefitDate()} />
          <OverviewItem title="Connected loans" value={accounts.length} />
          <OverviewItem
          title="Last contribution date"
          value={getLastBenefitDate(data?.payout_summaries)}
        />
            <OverviewItem
            title="Last contribution amount"
            value={getLastPayoutAmount(data?.payout_summaries)}
          />
            </Row>
          </section>
  );
}

function HomePage() {
  const loading = false
  const data = {}
  const hasStudentLoanRepayment = true;
  const accounts = []
  const loanTotal = 0
  const profile = {}
  const hasTuitionReimbursement = true;
  const banners = [
    {
      // loading
      condition: loading,
      banner: <Banner variant="primary" />,
    },
    {
      // needs profile
      condition: data?.profile == null,
      banner: <SetUpAccountBanner />,
    },
    {
      // no loans connected
      condition: hasStudentLoanRepayment && (accounts?.length || 0) === 0,
      banner: <NoLoansBanner />,
    },
    {
      // has a loan balance
      condition: hasStudentLoanRepayment && loanTotal > 0,
      banner: <NextBenefitsBanner />,
    },
    // {
    //   condition: hasStudentLoanRepayment && loanTotal <= 0,
    //   banner: <PaidOffBanner />,
    // },
    {
      condition: true,
      banner: <ReferralBanner />,
    },
  ]
    .filter((b) => b.condition)
    .map((b) => b.banner)
    .slice(0, 1); // only the first one

  return (
    <section className={styles.homepage}>
      <header className={styles.welcome}>
        <h2>
          Welcome
          {profile?.first_name && ` back, ${profile.first_name}`}.
        </h2>
      </header>
      {banners}

      <Row>
        <Col lg={8}>
          <BenefitOverview data={data} accounts={accounts} />
        </Col>
        <Col>
          <section className={styles.quickLinks}>
            <header>
              <h3>Quick links</h3>
            </header>
            <ul>
              {hasStudentLoanRepayment && (
                <li>
                  <Link href="/account/connected-accounts">
                    Manage your loan accounts
                  </Link>
                </li>
              )}
              {hasStudentLoanRepayment && ENABLE_STUDENT_DEBT_PROFILE && (
                <li>
                  <Link href="/account/student-loans">Student debt profile</Link>
                </li>
              )}
              {hasTuitionReimbursement && (
                <li>
                  <Link href="/benefits/tuition-reimbursement">
                    Apply for tuition reimbursement
                  </Link>
                </li>
              )}
              {hasStudentLoanRepayment && (
                <li>
                  <a
                    target="blank"
                    href="https://drive.google.com/file/d/1auU-v0Ep3xuxkLmxaWmiaIjafi_FpNzz/view"
                  >
                    Student loan benefit FAQs
                  </a>
                </li>
              )}
              <li>
                <Link href="/benefits/plans">See your benefit plan</Link>
              </li>
              <li>
                <a href="mailto:support@highwaybenefits.com">Contact support</a>
              </li>
            </ul>
          </section>
        </Col>
      </Row>
    </section>
  );
}
export default HomePage;
