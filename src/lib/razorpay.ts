import Razorpay from 'razorpay';
import config from '@/config';

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: config.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

export default razorpay;
