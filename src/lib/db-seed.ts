import plansData from '@/models/plan/plan.json';
import Plan from '@/models/plan/plan.model';
import dbConnect from './mongodb';

export async function seedPlans() {
  try {
    await dbConnect();
    // biome-ignore lint/suspicious/noConsole: Script output
    console.log('🌱 Seeding plans...');
    const plansCount = await Plan.countDocuments();
    if (plansCount > 0) {
      // biome-ignore lint/suspicious/noConsole: Script output
      console.log('✅ Plans already seeded');
      return;
    }
    for (const plan of plansData) {
      await Plan.create(plan);
    }
    // biome-ignore lint/suspicious/noConsole: Script output
    console.log('✅ Plans seeded successfully');
  } catch (error) {
    // biome-ignore lint/suspicious/noConsole: Script error reporting
    console.error('❌ Error seeding plans:', error);
  }
}

seedPlans()
  .then(() => {
    // biome-ignore lint/suspicious/noConsole: Script output
    console.log('👋 Seeding process finished');
    process.exit(0);
  })
  .catch((err) => {
    // biome-ignore lint/suspicious/noConsole: Script error reporting
    console.error('💥 Seeding process failed:', err);
    process.exit(1);
  });
