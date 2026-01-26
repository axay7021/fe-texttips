import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Text Tips",
  description: "Terms of Service for Text Tips",
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#2a2a2a] mb-8 font-space-grotesk">
          Terms of Service
        </h1>

        <div className="prose prose-lg max-w-none text-[#7d7d7d]">
          <p className="mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            1. Agreement to Terms
          </h2>
          <p className="mb-4">
            By accessing or using Text Tips ("the Service"), you agree to be
            bound by these Terms of Service. If you disagree with any part of
            the terms, you may not access the Service.
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            2. Description of Service
          </h2>
          <p className="mb-4">
            Text Tips provides AI-powered text enhancement and writing
            assistance tools. We reserve the right to modify, suspend, or
            discontinue the Service at any time, with or without notice.
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            3. User Accounts
          </h2>
          <p className="mb-4">
            When you create an account with us, you guarantee that the
            information you provide is accurate, complete, and current. You are
            responsible for maintaining the confidentiality of your account and
            password. You agree to accept responsibility for all activities that
            occur under your account or password.
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            4. Intellectual Property
          </h2>
          <p className="mb-4">
            The Service and its original content (excluding Content provided by
            users), features, and functionality are and will remain the
            exclusive property of Text Tips and its licensors. The Service is
            protected by copyright, trademark, and other laws of both the United
            States and foreign countries.
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            5. Use License
          </h2>
          <p className="mb-4">
            Permission is granted to temporarily use the Service for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title, and under this license you may
            not:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>modify or copy the materials;</li>
            <li>
              use the materials for any commercial purpose, or for any public
              display (commercial or non-commercial);
            </li>
            <li>
              attempt to decompile or reverse engineer any software contained on
              the Text Tips website;
            </li>
            <li>
              remove any copyright or other proprietary notations from the
              materials; or
            </li>
            <li>
              transfer the materials to another person or "mirror" the materials
              on any other server.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            6. Disclaimer
          </h2>
          <p className="mb-4">
            The materials on Text Tips' website are provided on an 'as is'
            basis. Text Tips makes no warranties, expressed or implied, and
            hereby disclaims and negates all other warranties including, without
            limitation, implied warranties or conditions of merchantability,
            fitness for a particular purpose, or non-infringement of
            intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            7. Limitations
          </h2>
          <p className="mb-4">
            In no event shall Text Tips or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on Text Tips' website, even if Text
            Tips or a Text Tips authorized representative has been notified
            orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            8. Governing Law
          </h2>
          <p className="mb-4">
            These terms and conditions are governed by and construed in
            accordance with the laws of the jurisdiction in which Text Tips
            operates and you irrevocably submit to the exclusive jurisdiction of
            the courts in that State or location.
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            9. Changes
          </h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. What constitutes a material change will be
            determined at our sole discretion. By continuing to access or use
            our Service after those revisions become effective, you agree to be
            bound by the revised terms.
          </p>

          <h2 className="text-2xl font-bold text-[#2a2a2a] mt-8 mb-4">
            10. Contact Us
          </h2>
          <p className="mb-4">
            If you have any questions about these Terms, please contact us at:
            support@softcolon.com
          </p>
        </div>
      </div>
    </main>
  );
}
