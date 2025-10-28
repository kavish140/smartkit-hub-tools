import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const submit = () => {
    // No backend in this project; instruct user to email instead. Keep local UX friendly.
    alert("Thanks — please email us at hello@smartkit.tech with your message:\n\n" + message);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">We welcome feedback, bug reports, and requests for new tools. If you'd like to get in touch, send us a message below or email hello@smartkit.tech.</p>

              <Input placeholder="Your email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
              <textarea placeholder="Your message" className="w-full p-3 rounded border" rows={6} value={message} onChange={(e) => setMessage(e.target.value)} />
              <div className="mt-4">
                <Button onClick={submit}>Send Message</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
