import {getServerSession} from 'next-auth/next';
import {authOptions} from '@/lib/auth';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01; embedded_connect_beta=v2',
});

export async function POST() {
  try {
    // @ts-ignore
    const session = await getServerSession(authOptions);

    const issuingCards = await stripe.issuing.cards.list(
      {
        limit: 1,
        status: 'active',
      },
      {
        stripeAccount: session?.user?.stripeAccount?.id,
      }
    );

    console.log(issuingCards.data);

    if (issuingCards.data.length === 0) {
      console.error('No active issuing cards found for user');
      return new Response('No issuing cards found for user', {
        status: 400,
      });
    }

    const authorization =
      await stripe.testHelpers.issuing.authorizations.create(
        {
          amount: 1000,
          card: issuingCards.data[0].id,
        },
        {
          stripeAccount: session?.user?.stripeAccount?.id,
        }
      );

    console.log(authorization);

    return new Response(
      JSON.stringify({
        received_credit: authorization.id,
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}}
    );
  } catch (error: any) {
    console.error(
      'An error occurred when calling the Stripe API to create an issuing authorization',
      error
    );
    return new Response(error.message, {status: 500});
  }
}
