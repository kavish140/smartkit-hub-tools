import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">About SmartKit.tech</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                SmartKit.tech is an all-in-one toolkit focused on providing small, fast, and
                practical web utilities that help users complete daily tasks quickly. Our goal
                is to offer accessible tools — from unit converters to weather lookups — that
                work without friction and respect user privacy. Each utility is designed to be
                useful on its own while fitting into a larger toolbox experience for power
                users and casual visitors alike.
              </p>

              <h3 className="mt-6 mb-2 font-semibold">Mission</h3>
              <p className="mb-4">
                We believe in building small web utilities that solve real problems without
                forcing heavy sign-ups, intrusive tracking, or complex configuration. Our
                mission is to make simple tools delightful and fast. We focus on performance,
                clarity, and minimal UI so that users can get things done immediately.
              </p>

              <h3 className="mt-6 mb-2 font-semibold">Privacy & Data</h3>
              <p className="mb-4">
                Many tools on SmartKit.tech work entirely in the browser and do not send any
                data to our servers. For tools that require third-party APIs (such as weather
                lookups), we surface the provider name and documentation, and we try to
                minimize data shared for each query. See our Privacy Policy for details on
                specific data handling practices and your rights.
              </p>

              <h3 className="mt-6 mb-2 font-semibold">Contact</h3>
              <p className="mb-4">
                If you have suggestions, bug reports, or want to request a new tool, please
                visit the Contact page or open an issue via our GitHub repository. We welcome
                contributions and community feedback.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
