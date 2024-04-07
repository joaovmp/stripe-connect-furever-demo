import {type NextRequest} from 'next/server';
import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/lib/auth';
import {stripe} from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const json = await req.json();

    const useDemoOnboardingAccountId = json.demoOnboarding !== undefined;

    let stripeAccountId = session?.user?.stripeAccount?.id;

    if (
      useDemoOnboardingAccountId &&
      process.env.EXAMPLE_DEMO_ONBOARDING_ACCOUNT
    ) {
      console.log(
        `Looking for the demo onboarding account ${process.env.EXAMPLE_DEMO_ONBOARDING_ACCOUNT}`
      );
      // Look for the demo onboarding account
      const demoOnboardingAccount = await stripe.accounts.retrieve(
        process.env.EXAMPLE_DEMO_ONBOARDING_ACCOUNT
      );
      if (demoOnboardingAccount) {
        console.log(
          `Using demo onboarding account: ${demoOnboardingAccount.id}`
        );
        stripeAccountId = demoOnboardingAccount.id;
      } else {
        console.log('No demo onboarding account found');
      }
    }

    if (!stripeAccountId) {
      return new Response(
        JSON.stringify({
          error: 'No Stripe account found for this user',
        }),
        {status: 400}
      );
    }

    const accountSession = await stripe.accountSessions.create({
      account: stripeAccountId,
      components: {
        // Payments
        payments: {
          enabled: true,
        },
        payouts: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
            edit_payout_schedule: true,
          },
        },
        // Connect
        account_management: {enabled: true},
        account_onboarding: {enabled: true},
        payment_method_settings: {enabled: true},
        // InB
        issuing_cards_list: {
          enabled: true,
          features: {card_management: true, cardholder_management: true},
        },
        financial_account: {
          enabled: true,
          features: {
            money_movement: true,
          },
        },
        financial_account_transactions: {
          enabled: true,
          features: {
            card_spend_dispute_management: true,
          },
        },
        capital_overview: {
          enabled: true,
        },
      },
    });

    return new Response(
      JSON.stringify({
        client_secret: accountSession.client_secret,
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}}
    );
  } catch (error: any) {
    console.error(
      'An error occurred when calling the Stripe API to create an account session',
      error
    );
    return new Response(JSON.stringify({error: error.message}), {status: 500});
  }
}
