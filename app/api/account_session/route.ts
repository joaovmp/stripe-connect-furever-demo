import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/lib/auth';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01; embedded_connect_beta=v2',
});

export async function POST() {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    const accountSession = await stripe.accountSessions.create({
      account: session?.user?.stripeAccount?.id,
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
        // apps: { enabled: true },
        payment_method_settings: {enabled: true},
        // InB
        issuing_cards_list: {enabled: true},
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
    return new Response(error.message, {status: 500});
  }
}
