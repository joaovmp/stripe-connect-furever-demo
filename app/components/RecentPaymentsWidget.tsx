import React from 'react';
import Link from 'next/link';
import Container from './Container';
import {ChevronRight} from 'lucide-react';

const BalanceWidget = () => {
  return (
    <Container>
      <div className="space-y-1">
        <div className="flex flex-row justify-between">
          <div>
            <h1 className="font-bold text-subdued">Recent payments</h1>
          </div>
          <div>
            <Link href="/payments" className="flex flex-row items-center">
              <div className="text-sm font-bold text-primary">View all</div>
              <ChevronRight color="#221b35" size={18} className="mt-[1px]" />
            </Link>
          </div>
        </div>
        <div>
          <ul>
            <li className="flex flex-row justify-between text-subdued">
              <div>michael@stripe.com</div>
              <div>$250.00</div>
            </li>
            <li className="flex flex-row justify-between text-subdued">
              <div>jessica@stripe.com</div>
              <div>$250.00</div>
            </li>
            <li className="flex flex-row justify-between text-subdued">
              <div>david@stripe.com</div>
              <div>$54.32</div>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default BalanceWidget;
