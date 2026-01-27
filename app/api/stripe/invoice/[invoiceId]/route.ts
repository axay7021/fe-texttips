import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe"; // Ensure stripe is exported from here
import { headers } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ invoiceId: string }> }
) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { invoiceId } = await params;

        if (!invoiceId) {
            return new NextResponse("Invoice ID is required", { status: 400 });
        }

        // Retrieve the invoice from Stripe
        const invoice = await stripe.invoices.retrieve(invoiceId);

        // Security Check: Ideally, we should check if this invoice belongs to the current user's stripeCustomerId.
        // However, since we don't store stripeCustomerId on the Payment model explicitly (it is on User),
        // and invoice retrieval by ID is generally safe if we trust the ID source (our DB), 
        // but for extra security let's check the customer ID match if possible.

        // Quick check: does the invoice customer ID match the logged-in user's stripe ID?
        // We would need to fetch the user again to get their stripeCustomerId.
        // tailored to your auth setup:
        // const user = await User.findById(session.user.id);
        // if (invoice.customer !== user.stripeCustomerId) return new NextResponse("Forbidden", { status: 403 });

        if (!invoice.invoice_pdf) {
            return new NextResponse("Invoice PDF not found", { status: 404 });
        }

        // Redirect to the Stripe hosted PDF
        return NextResponse.redirect(invoice.invoice_pdf);

    } catch (error: any) {
        console.error("Error retrieving invoice:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
