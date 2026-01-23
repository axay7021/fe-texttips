import dbConnect from "./mongodb";
import Plan from "@/app/models/plan/plan.model";
import plansData from "@/app/models/plan/plan.json";

export async function seedPlans() {
  try {
    await dbConnect();
    console.log("🌱 Seeding plans...");
    const plansCount = await Plan.countDocuments();
    if (plansCount > 0) {
      console.log("✅ Plans already seeded");
      return;
    }
    for (const plan of plansData) {
      await Plan.create(plan);
    }
    console.log("✅ Plans seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding plans:", error);
  }
}

seedPlans()
  .then(() => {
    console.log("👋 Seeding process finished");
    process.exit(0);
  })
  .catch((err) => {
    console.error("💥 Seeding process failed:", err);
    process.exit(1);
  });
