import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Terms of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">These are the terms of service for SmartKit.tech. By using our site you agree to the following rules and limitations. This page should be reviewed carefully — it clarifies permitted uses, limitations of liability, and the basics of our dispute resolution process.</p>
              <p className="mb-4">Services are provided "as is" and we do our best to ensure tools work correctly. We are not liable for any loss that results from the use of the site. For full, legally binding terms, please consult the repository or contact us for a formal agreement.</p>
              <h3 className="mt-6 mb-2 font-semibold">Acceptable Use</h3>
              <p className="mb-4">You may not abuse the services or use them for illegal purposes. Automated scraping at high volume may be blocked; please contact us for bulk usage.</p>
              <h3 className="mt-6 mb-2 font-semibold">Changes</h3>
              <p className="mb-4">We may update these terms from time to time. Continued use of the site constitutes acceptance of the updated terms.</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
